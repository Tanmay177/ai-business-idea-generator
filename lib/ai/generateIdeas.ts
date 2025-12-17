import type { GenerateIdeasRequest, GenerateIdeasResponse } from '@/types/api';
import type { UserProfile } from '@/types/models';
import type { BusinessIdea } from '@/types/models';
import { IdeaStatus, BusinessModel, RevenueType } from '@/types/models';
import { IdeaType } from '@/types/models';
import { businessIdeaPrompt } from './prompts/businessIdeaPrompt';
import { baseSystemPrompt } from './prompts/baseSystemPrompt';
import { openaiClient, getDefaultModel } from './openaiClient';

/**
 * Generate Business Ideas Service
 * 
 * This service orchestrates the business idea generation process:
 * 1. Constructs prompts using the prompt engine
 * 2. Calls the AI service (currently mock, ready for OpenAI integration)
 * 3. Parses and structures the response
 * 4. Returns formatted business ideas
 * 
 * @param request - User's request for generating ideas
 * @param userProfile - Optional user profile to personalize suggestions
 * @returns Promise resolving to GenerateIdeasResponse with structured ideas
 */
export async function generateIdeas(
  request: GenerateIdeasRequest,
  userProfile?: UserProfile
): Promise<GenerateIdeasResponse> {
  const startTime = Date.now();

  // Enhance request with user profile preferences if available
  const enhancedRequest = enhanceRequestWithUserProfile(request, userProfile);

  // Generate prompts using the prompt engine
  const systemPrompt = baseSystemPrompt();
  const userPrompt = businessIdeaPrompt(enhancedRequest);

  // Prepare messages for AI API
  const messages = [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
    {
      role: 'user' as const,
      content: userPrompt,
    },
  ];

  // TODO: REAL OPENAI INTEGRATION - Uncomment and configure when OpenAI API key is set up
  // Step 1: Call OpenAI API
  // const completion = await openaiClient.chat.completions.create({
  //   model: getDefaultModel(),
  //   messages,
  //   temperature: 0.7,
  //   max_tokens: 4000,
  //   response_format: { type: 'json_object' }, // Request JSON format for easier parsing
  // });
  // 
  // const aiResponse = completion.choices[0]?.message?.content;
  // if (!aiResponse) {
  //   throw new Error('No response from AI service');
  // }
  // 
  // // Step 2: Format AI response using formatter
  // // This will parse the raw AI text into structured BusinessIdea objects
  // const { formatBusinessIdeasFromAI } = await import('@/lib/formatters/businessIdeaFormatter');
  // const ideas = await formatBusinessIdeasFromAI(
  //   aiResponse,
  //   enhancedRequest.count || 3,
  //   {
  //     userId: userProfile?.id,
  //     defaultIndustry: enhancedRequest.industries?.[0],
  //     defaultIdeaType: enhancedRequest.ideaTypes?.[0],
  //     defaultBusinessModel: enhancedRequest.businessModels?.[0],
  //     defaultCurrency: enhancedRequest.budgetRange?.currency || 'USD',
  //   }
  // );
  // 
  // const tokensUsed = completion.usage?.total_tokens;

  // TEMPORARY: Mock data generation until OpenAI integration is complete
  // This maintains the same interface and can be swapped with real AI parsing above
  const ideas = generateMockIdeas(enhancedRequest, userProfile?.id);

  const generationTimeMs = Date.now() - startTime;
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Calculate quality metrics
  const scores = ideas.map((idea) => idea.aiScore || 0);
  const qualityMetrics = {
    averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    minScore: Math.min(...scores),
    maxScore: Math.max(...scores),
    confidence: 0.85, // Will be derived from AI response when integrated
  };

  return {
    ideas,
    metadata: {
      count: ideas.length,
      generationTimeMs,
      model: getDefaultModel(),
      tokensUsed: undefined, // TODO: Set from completion.usage?.total_tokens when OpenAI is integrated
      qualityMetrics,
    },
    requestId,
    generatedAt: new Date(),
  };
}

/**
 * Enhance request with user profile preferences
 * Merges user preferences from profile into the request
 */
function enhanceRequestWithUserProfile(
  request: GenerateIdeasRequest,
  userProfile?: UserProfile
): GenerateIdeasRequest {
  if (!userProfile?.preferences) {
    return request;
  }

  const { preferences } = userProfile;

  return {
    ...request,
    // Merge user's industry interests if not already specified
    industries: request.industries || preferences.industryInterests,
    // Merge user's preferred idea types if not already specified
    ideaTypes: request.ideaTypes || preferences.preferredIdeaTypes,
  };
}

/**
 * Generate mock business ideas (temporary until AI integration)
 * Returns structured ideas matching the BusinessIdea interface
 * 
 * TODO: Replace with parseAIResponseToIdeas() when AI integration is ready
 */
function generateMockIdeas(
  request: GenerateIdeasRequest,
  userId?: string
): BusinessIdea[] {
  const count = Math.min(Math.max(request.count || 3, 1), 10);
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const ideaNumber = index + 1;
    const industry = request.industries?.[0] || 'Technology';
    const ideaType = request.ideaTypes?.[0] || IdeaType.SAAS;
    const businessModel = request.businessModels?.[0] || BusinessModel.SUBSCRIPTION;

    // Generate more realistic mock data based on the user's prompt
    const baseTitle = request.prompt
      .split(' ')
      .slice(0, 3)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: `idea-${Date.now()}-${ideaNumber}`,
      userId: userId || 'anonymous-user',
      title: `${baseTitle} - ${ideaType.toUpperCase()} Solution ${ideaNumber}`,
      description: `A comprehensive ${ideaType} business idea that addresses the market need for "${request.prompt}". This solution leverages modern technology and best practices in the ${industry} industry to create value for customers.`,
      problem: `Current solutions in the ${industry} space fail to adequately address the need for ${request.prompt}. Users struggle with fragmented tools, high costs, or lack of specialized features that meet their specific requirements.`,
      solution: `Our ${ideaType} platform provides an integrated solution specifically designed for ${request.prompt}. By combining innovative technology with deep industry expertise, we deliver a streamlined experience that addresses the core pain points.`,
      targetMarket: request.targetMarket || `Businesses and individuals in the ${industry} sector seeking ${request.prompt}`,
      businessModel: businessModel,
      revenueStreams: [
        {
          type: RevenueType.RECURRING_SUBSCRIPTION,
          description: `Primary ${businessModel} revenue model with tiered pricing`,
          estimatedMonthlyRevenue: 5000 + ideaNumber * 1000,
          estimatedAnnualRevenue: 60000 + ideaNumber * 12000,
        },
      ],
      competitiveAdvantage: `Unique positioning in the ${industry} space with specialized focus on ${request.prompt}. Our approach combines domain expertise, technology innovation, and customer-centric design to create a differentiated offering.`,
      initialInvestment: {
        min: request.budgetRange?.min || 10000,
        max: request.budgetRange?.max || 50000,
        currency: request.budgetRange?.currency || 'USD',
        timeframe: '3-6 months',
      },
      estimatedRevenue: {
        year1: 50000 + ideaNumber * 10000,
        year2: 100000 + ideaNumber * 20000,
        year3: 200000 + ideaNumber * 40000,
        currency: request.budgetRange?.currency || 'USD',
      },
      industry: industry,
      tags: request.industries || [industry, ideaType, businessModel],
      ideaType: ideaType,
      status: IdeaStatus.GENERATED,
      createdAt: now,
      updatedAt: now,
      aiScore: 75 + ideaNumber * 2, // Mock scores between 75-95
    };
  });
}

/**
 * Parse AI response into structured BusinessIdea objects
 * 
 * TODO: Implement when AI integration is ready
 * This function should parse the raw AI text response and extract structured data
 * 
 * @param aiResponse - Raw text response from AI
 * @param originalRequest - Original request for context
 * @param userId - User ID for the ideas
 * @returns Array of structured BusinessIdea objects
 */
function parseAIResponseToIdeas(
  aiResponse: string,
  originalRequest: GenerateIdeasRequest,
  userId?: string
): BusinessIdea[] {
  // TODO: Implement AI response parsing
  // This will need to:
  // 1. Parse the structured response from AI (JSON or structured text)
  // 2. Map AI response fields to BusinessIdea interface
  // 3. Handle errors and edge cases
  // 4. Extract quality scores if provided by AI
  
  throw new Error('AI response parsing not yet implemented');
}

