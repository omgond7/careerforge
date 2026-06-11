import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// ============================================================================
// TYPES
// ============================================================================

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' | 'text' };
  stream?: boolean;
}

export interface AICompletionResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: 'gemini' | 'openrouter';
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  name: string;
  complete(messages: AIMessage[], options?: AICompletionOptions): Promise<AICompletionResponse>;
  stream(messages: AIMessage[], options?: AICompletionOptions): AsyncIterable<AIStreamChunk>;
  isAvailable(): Promise<boolean>;
}

// ============================================================================
// GEMINI PROVIDER
// ============================================================================

class GeminiProvider implements AIProvider {
  name = 'gemini';
  private client: GoogleGenerativeAI | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  private ensureClient() {
    if (!this.client) {
      throw new Error('GEMINI_API_KEY is not set');
    }
  }

  async complete(messages: AIMessage[], options?: AICompletionOptions): Promise<AICompletionResponse> {
    this.ensureClient();
    const model = this.client!.getGenerativeModel({ 
      model: options?.model || this.model,
    });

    // Convert messages to Gemini format
    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const userMessages = messages.filter(m => m.role !== 'system');

    const prompt = userMessages.map(m => m.content).join('\n\n');

    const generationConfig = {
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxTokens || 2048,
      responseMimeType: options?.responseFormat?.type === 'json_object' ? 'application/json' : 'text/plain',
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
      generationConfig,
    });

    const response = result.response;
    const content = response.text();

    // Estimate token usage (Gemini doesn't provide exact counts)
    const estimatedTokens = Math.ceil((prompt.length + content.length) / 4);

    return {
      content,
      usage: {
        promptTokens: Math.ceil(prompt.length / 4),
        completionTokens: Math.ceil(content.length / 4),
        totalTokens: estimatedTokens,
      },
      model: options?.model || this.model,
      provider: 'gemini',
    };
  }

  async *stream(messages: AIMessage[], options?: AICompletionOptions): AsyncIterable<AIStreamChunk> {
    this.ensureClient();
    const model = this.client!.getGenerativeModel({ 
      model: options?.model || this.model,
    });

    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const userMessages = messages.filter(m => m.role !== 'system');
    const prompt = userMessages.map(m => m.content).join('\n\n');

    const generationConfig = {
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxTokens || 2048,
    };

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
      generationConfig,
    });

    let fullContent = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullContent += chunkText;
      yield {
        content: chunkText,
        done: false,
      };
    }

    yield {
      content: '',
      done: true,
      usage: {
        promptTokens: Math.ceil(prompt.length / 4),
        completionTokens: Math.ceil(fullContent.length / 4),
        totalTokens: Math.ceil((prompt.length + fullContent.length) / 4),
      },
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      await model.generateContent('test');
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// OPENROUTER PROVIDER (Fallback)
// ============================================================================

class OpenRouterProvider implements AIProvider {
  name = 'openrouter';
  private client: OpenAI | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    this.model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
      });
    }
  }

  private ensureClient() {
    if (!this.client) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }
  }

  async complete(messages: AIMessage[], options?: AICompletionOptions): Promise<AICompletionResponse> {
    this.ensureClient();
    const response = await this.client!.chat.completions.create({
      model: options?.model || this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2048,
      response_format: options?.responseFormat,
    });

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      throw new Error('No content in OpenRouter response');
    }

    return {
      content: choice.message.content,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      model: response.model,
      provider: 'openrouter',
    };
  }

  async *stream(messages: AIMessage[], options?: AICompletionOptions): AsyncIterable<AIStreamChunk> {
    this.ensureClient();
    const stream = await this.client!.chat.completions.create({
      model: options?.model || this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2048,
      stream: true,
      stream_options: { include_usage: true },
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullContent += content;
        yield {
          content,
          done: false,
        };
      }
      if (chunk.usage) {
        yield {
          content: '',
          done: true,
          usage: {
            promptTokens: chunk.usage.prompt_tokens || 0,
            completionTokens: chunk.usage.completion_tokens || 0,
            totalTokens: chunk.usage.total_tokens || 0,
          },
        };
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      });
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// AI MANAGER (With Fallback)
// ============================================================================

class AIManager {
  private primary: AIProvider;
  private fallback: AIProvider;
  private primaryFailureCount = 0;
  private maxFailures = 3;
  private useFallback = false;

  constructor() {
    this.primary = new GeminiProvider();
    this.fallback = new OpenRouterProvider();
  }

  private async executeWithFallback<T>(
    operation: (provider: AIProvider) => Promise<T>
  ): Promise<{ result: T; provider: string }> {
    const providerToUse = this.useFallback ? this.fallback : this.primary;

    try {
      const result = await operation(providerToUse);
      
      // Reset failure count on success
      if (!this.useFallback) {
        this.primaryFailureCount = 0;
      }
      
      return { result, provider: providerToUse.name };
    } catch (error) {
      if (!this.useFallback) {
        this.primaryFailureCount++;
        
        if (this.primaryFailureCount >= this.maxFailures) {
          console.warn(`Primary provider failed ${this.primaryFailureCount} times, switching to fallback`);
          this.useFallback = true;
          
          // Retry with fallback
          try {
            const result = await operation(this.fallback);
            return { result, provider: this.fallback.name };
          } catch (fallbackError) {
            console.error('Fallback provider also failed:', fallbackError);
            throw fallbackError;
          }
        }
      }
      
      throw error;
    }
  }

  async complete(messages: AIMessage[], options?: AICompletionOptions): Promise<AICompletionResponse> {
    return this.executeWithFallback(provider => provider.complete(messages, options))
      .then(({ result, provider }) => ({ ...result, provider: provider as any }));
  }

  async *stream(messages: AIMessage[], options?: AICompletionOptions): AsyncIterable<AIStreamChunk> {
    const providerToUse = this.useFallback ? this.fallback : this.primary;
    
    try {
      for await (const chunk of providerToUse.stream(messages, options)) {
        yield chunk;
      }
      
      if (!this.useFallback) {
        this.primaryFailureCount = 0;
      }
    } catch (error) {
      if (!this.useFallback) {
        this.primaryFailureCount++;
        
        if (this.primaryFailureCount >= this.maxFailures) {
          console.warn(`Primary provider failed ${this.primaryFailureCount} times, switching to fallback`);
          this.useFallback = true;
          
          // Retry with fallback
          for await (const chunk of this.fallback.stream(messages, options)) {
            yield chunk;
          }
          return;
        }
      }
      
      throw error;
    }
  }

  async isAvailable(): Promise<{ primary: boolean; fallback: boolean }> {
    const [primary, fallback] = await Promise.all([
      this.primary.isAvailable().catch(() => false),
      this.fallback.isAvailable().catch(() => false),
    ]);
    return { primary, fallback };
  }

  getCurrentProvider(): string {
    return this.useFallback ? this.fallback.name : this.primary.name;
  }

  resetFallback(): void {
    this.useFallback = false;
    this.primaryFailureCount = 0;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

const aiManager = new AIManager();

export const ai = {
  complete: (messages: AIMessage[], options?: AICompletionOptions) => 
    aiManager.complete(messages, options),
  stream: (messages: AIMessage[], options?: AICompletionOptions) => 
    aiManager.stream(messages, options),
  isAvailable: () => aiManager.isAvailable(),
  getCurrentProvider: () => aiManager.getCurrentProvider(),
  resetFallback: () => aiManager.resetFallback(),
};

export const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
