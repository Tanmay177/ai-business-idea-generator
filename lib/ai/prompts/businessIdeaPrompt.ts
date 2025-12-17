import type { GenerateIdeasRequest } from '@/types/api';

/**
 * Prompt for generating business ideas based on user input
 * 
 * This prompt takes user requirements and constructs a detailed instruction
 * for the AI to generate innovative business ideas.
 * 
 * Intent: Transform user's request (prompt, preferences, constraints) into
 * a comprehensive prompt that guides the AI to generate relevant, detailed
 * business ideas matching the user's criteria.
 * 
 * @param request - User's request containing prompt, preferences, and constraints
 * @returns Formatted prompt string for AI generation
 */
export function businessIdeaPrompt(request: GenerateIdeasRequest): string {
  const {
    prompt,
    count = 3,
    industries,
    ideaTypes,
    businessModels,
    targetMarket,
    budgetRange,
    experienceLevel,
    geographicFocus,
    additionalContext,
  } = request;

  let promptText = `Generate ${count} innovative business ideas based on the following request:

USER REQUEST: "${prompt}"`;

  // Add industry focus if specified
  if (industries && industries.length > 0) {
    promptText += `\n\nINDUSTRIES TO FOCUS ON: ${industries.join(', ')}`;
  }

  // Add idea types if specified
  if (ideaTypes && ideaTypes.length > 0) {
    promptText += `\n\nPREFERRED IDEA TYPES: ${ideaTypes.join(', ')}`;
  }

  // Add business models if specified
  if (businessModels && businessModels.length > 0) {
    promptText += `\n\nPREFERRED BUSINESS MODELS: ${businessModels.join(', ')}`;
  }

  // Add target market if specified
  if (targetMarket) {
    promptText += `\n\nTARGET MARKET: ${targetMarket}`;
  }

  // Add budget constraints if specified
  if (budgetRange) {
    const currency = budgetRange.currency || 'USD';
    if (budgetRange.min && budgetRange.max) {
      promptText += `\n\nBUDGET CONSTRAINT: ${budgetRange.min.toLocaleString()} - ${budgetRange.max.toLocaleString()} ${currency}`;
    } else if (budgetRange.min) {
      promptText += `\n\nMINIMUM BUDGET: ${budgetRange.min.toLocaleString()} ${currency}`;
    } else if (budgetRange.max) {
      promptText += `\n\nMAXIMUM BUDGET: ${budgetRange.max.toLocaleString()} ${currency}`;
    }
  }

  // Add experience level if specified
  if (experienceLevel) {
    promptText += `\n\nUSER EXPERIENCE LEVEL: ${experienceLevel}`;
    
    // Add context based on experience level
    if (experienceLevel === 'beginner') {
      promptText += `\nNote: Focus on ideas that are accessible to entrepreneurs with limited experience. Prioritize lower-risk, simpler concepts.`;
    } else if (experienceLevel === 'advanced') {
      promptText += `\nNote: User has advanced business experience - consider more complex, scalable opportunities.`;
    }
  }

  // Add geographic focus if specified
  if (geographicFocus) {
    promptText += `\n\nGEOGRAPHIC FOCUS: ${geographicFocus}`;
  }

  // Add additional context if provided
  if (additionalContext) {
    promptText += `\n\nADDITIONAL CONTEXT: ${additionalContext}`;
  }

  // Add output format requirements
  promptText += `\n\nFor each business idea, provide:
1. A compelling, clear title
2. A comprehensive description (2-3 paragraphs)
3. A specific problem statement that this idea addresses
4. A detailed solution explanation
5. Target market segmentation (be specific about demographics, psychographics, etc.)
6. Recommended business model with rationale
7. Primary revenue streams with estimated projections
8. Competitive advantage and differentiation strategy
9. Realistic initial investment range (specify currency and timeframe)
10. Revenue projections for years 1, 2, 3, and 5
11. Relevant industry tags
12. An assessment score (0-100) indicating the idea's potential

Ensure each idea is:
- Unique and differentiated from the others
- Actionable and feasible
- Well-researched and market-aware
- Aligned with the user's specified preferences and constraints

Make the ideas practical, innovative, and tailored to the user's request.`;

  return promptText;
}

