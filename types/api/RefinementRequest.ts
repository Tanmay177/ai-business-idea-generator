import { BusinessIdea, RefinementChange } from '../models/BusinessIdea';

/**
 * Request payload for refining/improving an existing business idea
 */
export interface RefinementRequest {
  /**
   * ID of the business idea to refine
   */
  ideaId: string;
  
  /**
   * User's instructions for what to refine or improve
   */
  refinementPrompt: string;
  
  /**
   * Specific aspects to refine (optional - if not specified, AI determines based on prompt)
   */
  focusAreas?: RefinementFocusArea[];
  
  /**
   * Whether to keep the original idea intact and create a new version
   */
  createNewVersion?: boolean;
  
  /**
   * Additional context for the refinement
   */
  additionalContext?: string;
}

/**
 * Specific areas of a business idea that can be refined
 */
export enum RefinementFocusArea {
  TITLE = 'title',
  DESCRIPTION = 'description',
  PROBLEM_STATEMENT = 'problem',
  SOLUTION = 'solution',
  TARGET_MARKET = 'target_market',
  BUSINESS_MODEL = 'business_model',
  REVENUE_STREAMS = 'revenue_streams',
  COMPETITIVE_ADVANTAGE = 'competitive_advantage',
  MARKETING_STRATEGY = 'marketing_strategy',
  PRICING = 'pricing',
  FULL_REDESIGN = 'full_redesign',
}

/**
 * Response from the refinement API endpoint
 */
export interface RefinementResponse {
  /**
   * Refined business idea (or new version if createNewVersion was true)
   */
  idea: BusinessIdea;
  
  /**
   * Summary of changes made
   */
  changesSummary: string;
  
  /**
   * Detailed list of changes
   */
  changes: RefinementChange[];
  
  /**
   * Refinement metadata
   */
  metadata: RefinementMetadata;
  
  /**
   * Request ID for tracking/debugging
   */
  requestId: string;
  
  /**
   * Refinement timestamp
   */
  refinedAt: Date;
}


/**
 * Metadata about the refinement process
 */
export interface RefinementMetadata {
  /**
   * Time taken to refine (in milliseconds)
   */
  refinementTimeMs: number;
  
  /**
   * AI model used for refinement
   */
  model?: string;
  
  /**
   * Tokens used (if applicable)
   */
  tokensUsed?: number;
  
  /**
   * Number of changes made
   */
  changeCount: number;
  
  /**
   * Quality improvement score (if measurable)
   */
  improvementScore?: number;
}

