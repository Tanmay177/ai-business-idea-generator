/**
 * OpenAI Client Configuration
 * 
 * Provides a configured OpenAI client instance using environment variables.
 * 
 * Environment Variables Required:
 * - OPENAI_API_KEY: Your OpenAI API key
 * - OPENAI_MODEL: (Optional) Model to use, defaults to 'gpt-4' or 'gpt-3.5-turbo'
 * - OPENAI_ORG_ID: (Optional) OpenAI organization ID
 * 
 * Usage:
 * ```typescript
 * import { openaiClient } from '@/lib/ai/openaiClient';
 * const completion = await openaiClient.chat.completions.create({ ... });
 * ```
 */

/**
 * OpenAI client configuration interface
 * This matches the structure of the OpenAI SDK client
 */
export interface OpenAIClientConfig {
  apiKey: string;
  organization?: string;
  baseURL?: string;
  defaultModel?: string;
}

/**
 * Get OpenAI client configuration from environment variables
 */
function getOpenAIConfig(): OpenAIClientConfig {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY environment variable is required. ' +
      'Please set it in your .env.local file.'
    );
  }

  return {
    apiKey,
    organization: process.env.OPENAI_ORG_ID,
    baseURL: process.env.OPENAI_BASE_URL, // For custom endpoints or proxy
    defaultModel: process.env.OPENAI_MODEL || 'gpt-4',
  };
}

/**
 * OpenAI Client abstraction
 * 
 * TODO: Install and import OpenAI SDK:
 * ```bash
 * npm install openai
 * ```
 * 
 * Then uncomment the actual client implementation below.
 */
export interface OpenAIClient {
  chat: {
    completions: {
      create: (params: ChatCompletionParams) => Promise<ChatCompletionResponse>;
    };
  };
}

/**
 * Chat completion parameters
 */
export interface ChatCompletionParams {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

/**
 * Chat message interface
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Chat completion response interface
 */
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Mock OpenAI client implementation (for development without API key)
 * Replace with actual OpenAI SDK client when ready
 */
class MockOpenAIClient implements OpenAIClient {
  private config: OpenAIClientConfig;

  constructor(config: OpenAIClientConfig) {
    this.config = config;
  }

  chat = {
    completions: {
      create: async (params: ChatCompletionParams): Promise<ChatCompletionResponse> => {
        // Mock implementation - returns placeholder response
        // TODO: Replace with actual OpenAI API call
        console.warn('Using mock OpenAI client. Set OPENAI_API_KEY to use real API.');
        
        return {
          id: `chatcmpl-mock-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: params.model || this.config.defaultModel || 'gpt-4',
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Mock response - OpenAI integration pending',
              },
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
          },
        };
      },
    },
  };
}

/**
 * Actual OpenAI client implementation (uncomment when OpenAI SDK is installed)
 * 
 * ```typescript
 * import OpenAI from 'openai';
 * 
 * const config = getOpenAIConfig();
 * export const openaiClient = new OpenAI({
 *   apiKey: config.apiKey,
 *   organization: config.organization,
 *   baseURL: config.baseURL,
 * });
 * ```
 */

// Placeholder implementation - replace with actual OpenAI client
let clientConfig: OpenAIClientConfig;

try {
  clientConfig = getOpenAIConfig();
} catch (error) {
  // Allow client to be created even without API key for development
  // The mock will warn when used
  clientConfig = {
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
    organization: process.env.OPENAI_ORG_ID,
    baseURL: process.env.OPENAI_BASE_URL,
    defaultModel: process.env.OPENAI_MODEL || 'gpt-4',
  };
}

/**
 * Exported OpenAI client instance
 * 
 * Currently returns a mock client. When OpenAI SDK is installed,
 * replace this with the actual OpenAI client.
 */
export const openaiClient: OpenAIClient = new MockOpenAIClient(clientConfig);

/**
 * Get the default model from configuration
 */
export function getDefaultModel(): string {
  return clientConfig.defaultModel || 'gpt-4';
}

/**
 * Check if OpenAI API key is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key';
}

