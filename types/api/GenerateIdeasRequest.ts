import { IdeaType } from '../models/UserProfile';
import { BusinessModel } from '../models/BusinessIdea';

/**
 * Request payload for generating business ideas
 */
export interface GenerateIdeasRequest {
  /**
   * User's interests, industry, or domain they want ideas for
   */
  prompt: string;
  
  /**
   * Number of ideas to generate (default: 3, max: 10)
   */
  count?: number;
  
  /**
   * Specific industries or sectors to focus on
   */
  industries?: string[];
  
  /**
   * Preferred types of business ideas
   */
  ideaTypes?: IdeaType[];
  
  /**
   * Preferred business models
   */
  businessModels?: BusinessModel[];
  
  /**
   * Target audience or market segment
   */
  targetMarket?: string;
  
  /**
   * Budget range for initial investment
   */
  budgetRange?: BudgetRange;
  
  /**
   * Experience level (beginner, intermediate, advanced)
   */
  experienceLevel?: ExperienceLevel;
  
  /**
   * Geographic focus (if applicable)
   */
  geographicFocus?: string;
  
  /**
   * Additional context or constraints
   */
  additionalContext?: string;
}

/**
 * Budget range for filtering ideas
 */
export interface BudgetRange {
  min?: number;
  max?: number;
  currency?: string; // ISO 4217 currency code
}

/**
 * User experience level
 */
export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

