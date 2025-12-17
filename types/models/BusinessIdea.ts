import { IdeaType } from './UserProfile';

/**
 * Core business idea model
 */
export interface BusinessIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: BusinessModel;
  revenueStreams: RevenueStream[];
  competitiveAdvantage: string;
  initialInvestment?: InvestmentRange;
  estimatedRevenue?: RevenueProjection;
  industry: string;
  tags: string[];
  ideaType: IdeaType;
  status: IdeaStatus;
  createdAt: Date;
  updatedAt: Date;
  refinementHistory?: IdeaRefinement[];
  aiScore?: number; // Confidence/quality score from AI (0-100)
}

/**
 * Business model types
 */
export enum BusinessModel {
  B2C = 'b2c',
  B2B = 'b2b',
  B2B2C = 'b2b2c',
  FREEMIUM = 'freemium',
  SUBSCRIPTION = 'subscription',
  MARKETPLACE = 'marketplace',
  COMMISSION = 'commission',
  ADVERTISING = 'advertising',
  LICENSING = 'licensing',
  HYBRID = 'hybrid',
}

/**
 * Revenue stream details
 */
export interface RevenueStream {
  type: RevenueType;
  description: string;
  estimatedMonthlyRevenue?: number;
  estimatedAnnualRevenue?: number;
}

/**
 * Revenue stream types
 */
export enum RevenueType {
  ONE_TIME_PAYMENT = 'one_time_payment',
  RECURRING_SUBSCRIPTION = 'recurring_subscription',
  USAGE_BASED = 'usage_based',
  COMMISSION = 'commission',
  ADVERTISING = 'advertising',
  LICENSING = 'licensing',
  DATA_MONETIZATION = 'data_monetization',
  FRANCHISE = 'franchise',
}

/**
 * Investment range estimate
 */
export interface InvestmentRange {
  min: number;
  max: number;
  currency: string; // ISO 4217 currency code
  timeframe: string; // e.g., "3-6 months", "First year"
}

/**
 * Revenue projection estimates
 */
export interface RevenueProjection {
  year1?: number;
  year2?: number;
  year3?: number;
  year5?: number;
  currency: string;
  notes?: string;
}

/**
 * Idea status lifecycle
 */
export enum IdeaStatus {
  DRAFT = 'draft',
  GENERATED = 'generated',
  REFINING = 'refining',
  VALIDATED = 'validated',
  PLANNING = 'planning',
  ARCHIVED = 'archived',
}

/**
 * Refinement history entry
 */
export interface IdeaRefinement {
  id: string;
  timestamp: Date;
  changes: RefinementChange[];
  userPrompt?: string;
  aiReasoning?: string;
}

/**
 * Specific change made during refinement
 */
export interface RefinementChange {
  field: keyof BusinessIdea;
  oldValue: unknown;
  newValue: unknown;
  reason?: string;
}

