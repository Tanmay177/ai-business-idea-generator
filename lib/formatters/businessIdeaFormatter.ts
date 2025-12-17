import type { BusinessIdea } from '@/types/models';
import { IdeaStatus, BusinessModel, RevenueType } from '@/types/models';
import { IdeaType } from '@/types/models';

/**
 * Business Idea Response Formatter
 * 
 * This module handles parsing raw AI text responses into structured BusinessIdea objects.
 * It provides robust error handling and graceful fallbacks for malformed AI responses.
 * 
 * Usage:
 * ```typescript
 * import { formatBusinessIdeasFromAI } from '@/lib/formatters/businessIdeaFormatter';
 * const ideas = await formatBusinessIdeasFromAI(aiResponseText, request, userId);
 * ```
 */

/**
 * Options for formatting business ideas
 */
export interface FormatOptions {
  userId?: string;
  defaultIndustry?: string;
  defaultIdeaType?: IdeaType;
  defaultBusinessModel?: BusinessModel;
  defaultCurrency?: string;
}

/**
 * Format raw AI text response into structured BusinessIdea objects
 * 
 * This function attempts to parse the AI response in multiple ways:
 * 1. Try to parse as JSON (if AI returns structured JSON)
 * 2. Try to parse as structured text (markdown, numbered lists, etc.)
 * 3. Fall back to extracting key information with pattern matching
 * 
 * @param rawText - Raw text response from AI
 * @param expectedCount - Number of ideas expected (from original request)
 * @param options - Formatting options (userId, defaults, etc.)
 * @returns Array of structured BusinessIdea objects
 * @throws Error if parsing completely fails
 */
export async function formatBusinessIdeasFromAI(
  rawText: string,
  expectedCount: number = 3,
  options: FormatOptions = {}
): Promise<BusinessIdea[]> {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Empty AI response received');
  }

  try {
    // Strategy 1: Try parsing as JSON first
    // TODO: When AI integration is added, configure AI to return JSON format
    // Example: Add response_format: { type: "json_object" } to OpenAI API call
    const jsonIdeas = tryParseAsJSON(rawText, expectedCount, options);
    if (jsonIdeas.length > 0) {
      return jsonIdeas;
    }
  } catch (error) {
    // JSON parsing failed, continue to next strategy
    console.warn('JSON parsing failed, trying structured text parsing:', error);
  }

  try {
    // Strategy 2: Try parsing structured text format
    // TODO: Enhance this based on actual AI response format
    // The prompt should instruct AI to return ideas in a specific format
    const textIdeas = parseStructuredText(rawText, expectedCount, options);
    if (textIdeas.length > 0) {
      return textIdeas;
    }
  } catch (error) {
    console.warn('Structured text parsing failed, trying pattern matching:', error);
  }

  try {
    // Strategy 3: Fallback to pattern matching and extraction
    const extractedIdeas = extractIdeasWithPatterns(rawText, expectedCount, options);
    if (extractedIdeas.length > 0) {
      return extractedIdeas;
    }
  } catch (error) {
    console.error('All parsing strategies failed:', error);
  }

  // If all parsing strategies fail, throw error
  throw new Error(
    'Failed to parse AI response into business ideas. ' +
    'The response format may not match expected structure.'
  );
}

/**
 * Try to parse AI response as JSON
 * 
 * TODO: When AI is configured to return JSON, this will be the primary parsing method
 * Expected JSON format:
 * {
 *   "ideas": [
 *     {
 *       "title": "...",
 *       "description": "...",
 *       "problem": "...",
 *       ...
 *     }
 *   ]
 * }
 */
function tryParseAsJSON(
  text: string,
  expectedCount: number,
  options: FormatOptions
): BusinessIdea[] {
  // Clean text - remove markdown code blocks if present
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleanText);
  
  // Handle different JSON structures
  const ideasArray = parsed.ideas || parsed.data || (Array.isArray(parsed) ? parsed : [parsed]);
  
  if (!Array.isArray(ideasArray)) {
    return [];
  }

  return ideasArray
    .slice(0, expectedCount)
    .map((ideaData, index) => parseIdeaFromData(ideaData, index, options))
    .filter((idea): idea is BusinessIdea => idea !== null);
}

/**
 * Parse structured text format (markdown, numbered lists, etc.)
 * 
 * TODO: Enhance this based on actual AI response format
 * This should match the output format specified in businessIdeaPrompt.ts
 * Expected format:
 * ## Idea 1: [Title]
 * Description: ...
 * Problem: ...
 * etc.
 */
function parseStructuredText(
  text: string,
  expectedCount: number,
  options: FormatOptions
): BusinessIdea[] {
  const ideas: BusinessIdea[] = [];
  
  // Split text into sections (by idea number or headers)
  // TODO: Refine regex patterns based on actual AI output format
  const ideaSections = splitIntoIdeaSections(text, expectedCount);
  
  for (let i = 0; i < ideaSections.length && i < expectedCount; i++) {
    try {
      const idea = parseIdeaFromSection(ideaSections[i], i, options);
      if (idea) {
        ideas.push(idea);
      }
    } catch (error) {
      console.warn(`Failed to parse idea ${i + 1} from structured text:`, error);
      // Continue with next idea instead of failing completely
    }
  }
  
  return ideas;
}

/**
 * Split text into individual idea sections
 */
function splitIntoIdeaSections(text: string, expectedCount: number): string[] {
  // TODO: Adjust patterns based on actual AI output format
  // Try different patterns:
  // 1. Markdown headers: ## Idea 1, ## 1., etc.
  // 2. Numbered sections: 1. Title, 2. Title, etc.
  // 3. Separator lines: ---, ===, etc.
  
  const patterns = [
    /##\s*Idea\s+\d+/gi,
    /##\s*\d+\./g,
    /\n\n(?=\d+\.\s+[A-Z])/g,
    /\n---+\n/g,
  ];
  
  for (const pattern of patterns) {
    const sections = text.split(pattern);
    if (sections.length >= expectedCount) {
      return sections.slice(1); // Skip first section (usually intro text)
    }
  }
  
  // Fallback: split by double newlines
  return text.split(/\n\n+/);
}

/**
 * Parse a single idea from a text section
 */
function parseIdeaFromSection(
  section: string,
  index: number,
  options: FormatOptions
): BusinessIdea | null {
  // TODO: Enhance extraction logic based on actual AI output format
  // Extract fields using regex patterns or NLP techniques
  
  const title = extractField(section, ['title', 'name']);
  const description = extractField(section, ['description', 'overview']);
  const problem = extractField(section, ['problem', 'problem statement']);
  const solution = extractField(section, ['solution']);
  const targetMarket = extractField(section, ['target market', 'target audience']);
  
  if (!title || !description) {
    return null; // Minimum required fields
  }
  
  return createIdeaFromExtractedData(
    {
      title,
      description,
      problem: problem || 'To be specified',
      solution: solution || 'To be specified',
      targetMarket: targetMarket || 'General market',
    },
    index,
    options
  );
}

/**
 * Extract a field value from text using keywords
 */
function extractField(text: string, keywords: string[]): string | null {
  // TODO: Use more sophisticated NLP or pattern matching
  // This is a basic implementation
  
  for (const keyword of keywords) {
    const pattern = new RegExp(`${keyword}:\\s*(.+?)(?=\\n|$)`, 'i');
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Fallback: Extract ideas using pattern matching
 * This is a last resort when structured parsing fails
 */
function extractIdeasWithPatterns(
  text: string,
  expectedCount: number,
  options: FormatOptions
): BusinessIdea[] {
  const ideas: BusinessIdea[] = [];
  
  // TODO: Implement basic pattern matching as fallback
  // Extract sentences that look like titles (short, capitalized, etc.)
  // For now, create placeholder ideas to prevent complete failure
  
  for (let i = 0; i < expectedCount; i++) {
    const idea = createFallbackIdea(i, options, text.substring(0, 200));
    ideas.push(idea);
  }
  
  return ideas;
}

/**
 * Parse idea data object into BusinessIdea
 * Handles different field name variations from AI
 */
function parseIdeaFromData(
  data: Record<string, unknown>,
  index: number,
  options: FormatOptions
): BusinessIdea | null {
  try {
    // Extract title (handle variations)
    const title = 
      (data.title as string) ||
      (data.name as string) ||
      (data.heading as string) ||
      `Business Idea ${index + 1}`;
    
    if (!title) {
      return null;
    }
    
    // Extract other fields with fallbacks
    const description = (data.description as string) || (data.overview as string) || '';
    const problem = (data.problem as string) || (data.problemStatement as string) || '';
    const solution = (data.solution as string) || '';
    const targetMarket = (data.targetMarket as string) || (data.targetAudience as string) || 'General market';
    const industry = (data.industry as string) || options.defaultIndustry || 'Technology';
    
    // Parse enums with validation
    const ideaType = parseEnum(
      data.ideaType || data.type,
      IdeaType,
      options.defaultIdeaType || IdeaType.SAAS
    );
    
    const businessModel = parseEnum(
      data.businessModel,
      BusinessModel,
      options.defaultBusinessModel || BusinessModel.SUBSCRIPTION
    );
    
    // Parse revenue streams
    const revenueStreams = parseRevenueStreams(data.revenueStreams, options.defaultCurrency || 'USD');
    
    // Parse investment range
    const initialInvestment = parseInvestmentRange(data.initialInvestment, options.defaultCurrency || 'USD');
    
    // Parse revenue projections
    const estimatedRevenue = parseRevenueProjection(data.estimatedRevenue, options.defaultCurrency || 'USD');
    
    // Extract tags
    const tags = parseTags(data.tags || data.categories || industry);
    
    // Extract AI score if provided
    const aiScore = parseScore(data.aiScore || data.score || data.qualityScore);
    
    return {
      id: `idea-${Date.now()}-${index}`,
      userId: options.userId || 'anonymous-user',
      title,
      description: description || 'Description not provided',
      problem: problem || 'Problem statement not provided',
      solution: solution || 'Solution not provided',
      targetMarket,
      businessModel,
      revenueStreams: revenueStreams.length > 0 ? revenueStreams : [createDefaultRevenueStream(businessModel)],
      competitiveAdvantage: (data.competitiveAdvantage as string) || (data.differentiation as string) || 'Unique value proposition',
      initialInvestment,
      estimatedRevenue,
      industry,
      tags,
      ideaType,
      status: IdeaStatus.GENERATED,
      createdAt: new Date(),
      updatedAt: new Date(),
      aiScore,
    };
  } catch (error) {
    console.error(`Error parsing idea data at index ${index}:`, error);
    return null;
  }
}

/**
 * Parse revenue streams from data
 */
function parseRevenueStreams(
  data: unknown,
  defaultCurrency: string
): Array<{ type: RevenueType; description: string; estimatedMonthlyRevenue?: number; estimatedAnnualRevenue?: number }> {
  if (!data) {
    return [];
  }
  
  if (Array.isArray(data)) {
    return data
      .map((stream) => {
        if (typeof stream === 'object' && stream !== null) {
          const type = parseEnum(stream.type, RevenueType, RevenueType.RECURRING_SUBSCRIPTION);
          return {
            type,
            description: (stream.description as string) || 'Revenue stream',
            estimatedMonthlyRevenue: stream.estimatedMonthlyRevenue as number | undefined,
            estimatedAnnualRevenue: stream.estimatedAnnualRevenue as number | undefined,
          };
        }
        return null;
      })
      .filter((stream): stream is NonNullable<typeof stream> => stream !== null);
  }
  
  return [];
}

/**
 * Parse investment range from data
 */
function parseInvestmentRange(
  data: unknown,
  defaultCurrency: string
): { min: number; max: number; currency: string; timeframe: string } | undefined {
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  
  const obj = data as Record<string, unknown>;
  return {
    min: (obj.min as number) || 10000,
    max: (obj.max as number) || 50000,
    currency: (obj.currency as string) || defaultCurrency,
    timeframe: (obj.timeframe as string) || '3-6 months',
  };
}

/**
 * Parse revenue projection from data
 */
function parseRevenueProjection(
  data: unknown,
  defaultCurrency: string
): { year1?: number; year2?: number; year3?: number; year5?: number; currency: string } | undefined {
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  
  const obj = data as Record<string, unknown>;
  return {
    year1: obj.year1 as number | undefined,
    year2: obj.year2 as number | undefined,
    year3: obj.year3 as number | undefined,
    year5: obj.year5 as number | undefined,
    currency: (obj.currency as string) || defaultCurrency,
  };
}

/**
 * Parse tags from data
 */
function parseTags(data: unknown): string[] {
  if (Array.isArray(data)) {
    return data.filter((tag): tag is string => typeof tag === 'string');
  }
  
  if (typeof data === 'string') {
    return [data];
  }
  
  return [];
}

/**
 * Parse score (AI quality score)
 */
function parseScore(data: unknown): number | undefined {
  if (typeof data === 'number') {
    return Math.max(0, Math.min(100, data)); // Clamp between 0-100
  }
  
  if (typeof data === 'string') {
    const parsed = parseInt(data, 10);
    if (!isNaN(parsed)) {
      return Math.max(0, Math.min(100, parsed));
    }
  }
  
  return undefined;
}

/**
 * Parse enum value with fallback
 */
function parseEnum<T extends string>(
  value: unknown,
  enumObject: Record<string, T>,
  fallback: T
): T {
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    const enumValue = Object.values(enumObject).find(
      (v) => v.toLowerCase() === normalized
    );
    if (enumValue) {
      return enumValue;
    }
  }
  
  return fallback;
}

/**
 * Create default revenue stream based on business model
 */
function createDefaultRevenueStream(
  businessModel: BusinessModel
): { type: RevenueType; description: string } {
  const revenueTypeMap: Record<BusinessModel, RevenueType> = {
    [BusinessModel.SUBSCRIPTION]: RevenueType.RECURRING_SUBSCRIPTION,
    [BusinessModel.MARKETPLACE]: RevenueType.COMMISSION,
    [BusinessModel.ADVERTISING]: RevenueType.ADVERTISING,
    [BusinessModel.LICENSING]: RevenueType.LICENSING,
    [BusinessModel.COMMISSION]: RevenueType.COMMISSION,
    [BusinessModel.FREEMIUM]: RevenueType.RECURRING_SUBSCRIPTION,
    [BusinessModel.B2C]: RevenueType.ONE_TIME_PAYMENT,
    [BusinessModel.B2B]: RevenueType.RECURRING_SUBSCRIPTION,
    [BusinessModel.B2B2C]: RevenueType.RECURRING_SUBSCRIPTION,
    [BusinessModel.HYBRID]: RevenueType.RECURRING_SUBSCRIPTION,
  };
  
  return {
    type: revenueTypeMap[businessModel] || RevenueType.RECURRING_SUBSCRIPTION,
    description: `Primary ${businessModel} revenue stream`,
  };
}

/**
 * Create idea from extracted data
 */
function createIdeaFromExtractedData(
  data: {
    title: string;
    description: string;
    problem: string;
    solution: string;
    targetMarket: string;
  },
  index: number,
  options: FormatOptions
): BusinessIdea {
  const now = new Date();
  const businessModel = options.defaultBusinessModel || BusinessModel.SUBSCRIPTION;
  
  return {
    id: `idea-${Date.now()}-${index}`,
    userId: options.userId || 'anonymous-user',
    title: data.title,
    description: data.description,
    problem: data.problem,
    solution: data.solution,
    targetMarket: data.targetMarket,
    businessModel,
    revenueStreams: [createDefaultRevenueStream(businessModel)],
    competitiveAdvantage: 'Unique value proposition to be refined',
    industry: options.defaultIndustry || 'Technology',
    tags: [options.defaultIndustry || 'Technology'],
    ideaType: options.defaultIdeaType || IdeaType.SAAS,
    status: IdeaStatus.GENERATED,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create fallback idea when parsing completely fails
 */
function createFallbackIdea(
  index: number,
  options: FormatOptions,
  textPreview: string
): BusinessIdea {
  const now = new Date();
  const businessModel = options.defaultBusinessModel || BusinessModel.SUBSCRIPTION;
  
  return {
    id: `idea-${Date.now()}-${index}`,
    userId: options.userId || 'anonymous-user',
    title: `Business Idea ${index + 1}`,
    description: `Business idea extracted from AI response. Preview: ${textPreview.substring(0, 100)}...`,
    problem: 'Problem statement requires refinement',
    solution: 'Solution details require refinement',
    targetMarket: 'Target market to be specified',
    businessModel,
    revenueStreams: [createDefaultRevenueStream(businessModel)],
    competitiveAdvantage: 'To be determined',
    industry: options.defaultIndustry || 'Technology',
    tags: [options.defaultIndustry || 'Technology'],
    ideaType: options.defaultIdeaType || IdeaType.SAAS,
    status: IdeaStatus.GENERATED,
    createdAt: now,
    updatedAt: now,
  };
}

