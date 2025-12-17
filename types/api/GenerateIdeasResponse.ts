import { BusinessIdea } from '../models/BusinessIdea';

/**
 * Response from the generate ideas API endpoint
 */
export interface GenerateIdeasResponse {
  /**
   * Array of generated business ideas
   */
  ideas: BusinessIdea[];
  
  /**
   * Generation metadata
   */
  metadata: GenerationMetadata;
  
  /**
   * Request ID for tracking/debugging
   */
  requestId: string;
  
  /**
   * Generation timestamp
   */
  generatedAt: Date;
}

/**
 * Metadata about the generation process
 */
export interface GenerationMetadata {
  /**
   * Total number of ideas generated
   */
  count: number;
  
  /**
   * Time taken to generate (in milliseconds)
   */
  generationTimeMs: number;
  
  /**
   * AI model used for generation
   */
  model?: string;
  
  /**
   * Tokens used (if applicable)
   */
  tokensUsed?: number;
  
  /**
   * Quality scores or confidence metrics
   */
  qualityMetrics?: QualityMetrics;
}

/**
 * Quality and confidence metrics for generated ideas
 */
export interface QualityMetrics {
  averageScore: number;
  minScore: number;
  maxScore: number;
  confidence: number; // 0-1 scale
}

