'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Brain, MessageCircle, Sparkles, Briefcase, BookOpen, Target, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Career Copilot. I can help you with job analysis, interview prep, skill development, and career planning. What would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend?.trim() || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Optimistically add user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        let errMsg = 'Rate limit exceeded or server offline. Please try again.';
        try {
          const body = await response.json();
          if (body.error) errMsg = body.error;
        } catch (_) {}

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Error: ${errMsg}`,
            timestamp: new Date(),
          },
        ]);
        return;
      }

      // Prepare placeholder assistant message
      const assistantMessageId = (Date.now() + 2).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response stream reader');

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('Failed to parse chat stream:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 3).toString(),
          role: 'assistant',
          content: 'Oops, something went wrong during transmission. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { icon: Target, text: 'Analyze my next job', prompt: 'Help me analyze if I\'m a good fit for the Senior Frontend Engineer role at Stripe' },
    { icon: BookOpen, text: 'Learning path', prompt: 'What should I learn to become a Staff Engineer?' },
    { icon: Briefcase, text: 'Salary negotiation', prompt: 'How can I negotiate my salary better?' },
    { icon: Brain, text: 'Interview tips', prompt: 'Give me tips for system design interviews' },
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Career Copilot</h1>
            <p className="text-xs text-muted-foreground">AI-powered career guidance</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {messages.length === 1 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 font-bold">How can I help you today?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPrompts.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.text}
                      onClick={() => handleSendMessage(prompt.prompt)}
                      className="p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{prompt.text}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{prompt.prompt}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 animate-fade-in">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card border border-border rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1.5 ${
                    message.role === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
                <div className="bg-card border border-border rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ask me anything about your career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:cursor-not-allowed"
              />
              <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI Copilot provides guidance based on your profile and career goals
          </p>
        </div>
      </div>
    </div>
  );
}
