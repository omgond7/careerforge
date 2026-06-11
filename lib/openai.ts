import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-api-key-for-build',
});

// Default to 'gpt-4o-mini' to leverage a highly generous, cost-efficient model (approx $0.15 / 1M tokens)
export const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
