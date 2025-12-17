/**
 * Environment Configuration
 * 
 * Central configuration file for reading environment variables safely.
 * Provides type-safe access to environment variables with validation
 * and helpful error messages.
 * 
 * Usage:
 * ```typescript
 * import { env } from '@/lib/config/env';
 * const apiKey = env.OPENAI_API_KEY;
 * ```
 */

/**
 * Environment variable configuration interface
 */
interface EnvConfig {
  // OpenAI Configuration
  OPENAI_API_KEY: string;
  OPENAI_ORG_ID?: string;
  OPENAI_MODEL: string;
  OPENAI_BASE_URL?: string;

  // Application Configuration
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL?: string;
}

/**
 * Get environment variable with optional default value
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value && defaultValue === undefined) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please set it in your .env.local file. See .env.example for reference.`
    );
  }
  
  return value || defaultValue || '';
}

/**
 * Get optional environment variable
 */
function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}

/**
 * Validate OpenAI API key format (basic validation)
 */
function validateOpenAIApiKey(apiKey: string): void {
  if (!apiKey.startsWith('sk-')) {
    console.warn(
      'Warning: OPENAI_API_KEY does not start with "sk-". ' +
      'Please verify your API key is correct.'
    );
  }
}

/**
 * Environment configuration object
 * 
 * Access environment variables through this object for type safety
 * and validation.
 */
export const env: EnvConfig = {
  // OpenAI API Key (Required)
  // Get your API key from: https://platform.openai.com/api-keys
  OPENAI_API_KEY: (() => {
    const apiKey = getEnvVar('OPENAI_API_KEY');
    validateOpenAIApiKey(apiKey);
    return apiKey;
  })(),

  // OpenAI Organization ID (Optional)
  // Set if you're part of an organization
  OPENAI_ORG_ID: getOptionalEnvVar('OPENAI_ORG_ID'),

  // OpenAI Model (Optional, defaults to 'gpt-4')
  // Options: gpt-4, gpt-4-turbo-preview, gpt-3.5-turbo, etc.
  OPENAI_MODEL: getOptionalEnvVar('OPENAI_MODEL') || 'gpt-4',

  // OpenAI Base URL (Optional)
  // Use for custom endpoints or proxy
  OPENAI_BASE_URL: getOptionalEnvVar('OPENAI_BASE_URL'),

  // Node Environment (Optional, defaults to 'development')
  NODE_ENV: (getOptionalEnvVar('NODE_ENV') || 'development') as 'development' | 'production' | 'test',

  // Application URL (Optional)
  // Used for generating absolute URLs in API responses
  NEXT_PUBLIC_APP_URL: getOptionalEnvVar('NEXT_PUBLIC_APP_URL'),
};

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'your_openai_api_key_here';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

/**
 * Validate all required environment variables are set
 * Call this at application startup to fail fast if configuration is missing
 */
export function validateEnvConfig(): void {
  try {
    // Access required env vars to trigger validation
    const _ = env.OPENAI_API_KEY;
    // Add other required validations here as needed
  } catch (error) {
    if (error instanceof Error) {
      console.error('Environment configuration error:', error.message);
      console.error('\nPlease create a .env.local file with the required variables.');
      console.error('See .env.example for reference.\n');
    }
    throw error;
  }
}

/**
 * Get environment configuration summary (for debugging)
 * Excludes sensitive values like API keys
 */
export function getEnvSummary(): Record<string, string | boolean | undefined> {
  return {
    OPENAI_API_KEY_SET: !!env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'your_openai_api_key_here',
    OPENAI_ORG_ID_SET: !!env.OPENAI_ORG_ID,
    OPENAI_MODEL: env.OPENAI_MODEL,
    OPENAI_BASE_URL_SET: !!env.OPENAI_BASE_URL,
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  };
}

