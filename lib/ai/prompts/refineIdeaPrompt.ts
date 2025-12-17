import type { RefinementRequest } from '@/types/api';
import type { BusinessIdea } from '@/types/models';
import { RefinementFocusArea } from '@/types/api';

/**
 * Prompt for refining/improving an existing business idea
 * 
 * This prompt takes an existing business idea and user's refinement instructions,
 * then constructs a detailed prompt to guide the AI in improving specific aspects
 * of the idea while maintaining consistency with the original concept.
 * 
 * Intent: Enable iterative improvement of business ideas by allowing users to
 * request specific enhancements, clarifications, or modifications to existing ideas.
 * 
 * @param originalIdea - The current business idea to be refined
 * @param refinementRequest - User's refinement instructions and focus areas
 * @returns Formatted prompt string for AI refinement
 */
export function refineIdeaPrompt(
  originalIdea: BusinessIdea,
  refinementRequest: RefinementRequest
): string {
  const { refinementPrompt, focusAreas, additionalContext } = refinementRequest;

  let promptText = `Refine and improve the following business idea based on the user's feedback:

ORIGINAL BUSINESS IDEA:
Title: ${originalIdea.title}
Description: ${originalIdea.description}
Problem Statement: ${originalIdea.problem}
Solution: ${originalIdea.solution}
Target Market: ${originalIdea.targetMarket}
Business Model: ${originalIdea.businessModel}
Revenue Streams: ${originalIdea.revenueStreams.map(rs => `${rs.type}: ${rs.description}`).join('; ')}
Competitive Advantage: ${originalIdea.competitiveAdvantage}
Industry: ${originalIdea.industry}
Idea Type: ${originalIdea.ideaType}`;

  // Add investment info if available
  if (originalIdea.initialInvestment) {
    promptText += `\nInitial Investment: ${originalIdea.initialInvestment.min.toLocaleString()} - ${originalIdea.initialInvestment.max.toLocaleString()} ${originalIdea.initialInvestment.currency} (${originalIdea.initialInvestment.timeframe})`;
  }

  // Add revenue projections if available
  if (originalIdea.estimatedRevenue) {
    promptText += `\nRevenue Projections: Year 1: ${originalIdea.estimatedRevenue.year1?.toLocaleString() || 'N/A'}, Year 2: ${originalIdea.estimatedRevenue.year2?.toLocaleString() || 'N/A'}`;
  }

  // Add user's refinement request
  promptText += `\n\nUSER REFINEMENT REQUEST: "${refinementPrompt}"`;

  // Add focus areas if specified
  if (focusAreas && focusAreas.length > 0) {
    const focusAreaNames = focusAreas.map(area => {
      switch (area) {
        case RefinementFocusArea.TITLE:
          return 'Title';
        case RefinementFocusArea.DESCRIPTION:
          return 'Description';
        case RefinementFocusArea.PROBLEM_STATEMENT:
          return 'Problem Statement';
        case RefinementFocusArea.SOLUTION:
          return 'Solution';
        case RefinementFocusArea.TARGET_MARKET:
          return 'Target Market';
        case RefinementFocusArea.BUSINESS_MODEL:
          return 'Business Model';
        case RefinementFocusArea.REVENUE_STREAMS:
          return 'Revenue Streams';
        case RefinementFocusArea.COMPETITIVE_ADVANTAGE:
          return 'Competitive Advantage';
        case RefinementFocusArea.MARKETING_STRATEGY:
          return 'Marketing Strategy';
        case RefinementFocusArea.PRICING:
          return 'Pricing';
        case RefinementFocusArea.FULL_REDESIGN:
          return 'Complete Redesign';
        default:
          return area;
      }
    });

    promptText += `\n\nAREAS TO FOCUS ON: ${focusAreaNames.join(', ')}`;
    
    if (focusAreas.includes(RefinementFocusArea.FULL_REDESIGN)) {
      promptText += `\nNote: User requested a complete redesign - you may significantly alter the idea while maintaining core market focus.`;
    } else {
      promptText += `\nNote: Focus improvements primarily on these areas, but ensure all aspects remain coherent.`;
    }
  }

  // Add additional context if provided
  if (additionalContext) {
    promptText += `\n\nADDITIONAL CONTEXT: ${additionalContext}`;
  }

  // Add refinement instructions
  promptText += `\n\nREFINEMENT GUIDELINES:
1. Maintain the core essence and market focus of the original idea
2. Address the user's specific concerns and requests
3. Enhance clarity, specificity, and market viability
4. Improve any weak points while preserving strengths
5. Ensure all refined aspects work cohesively together
6. Keep the idea practical and actionable
7. Provide clear rationale for significant changes

For each area you modify, explain:
- What was changed and why
- How the change improves the idea
- How it maintains or enhances market viability

If the refinement significantly changes key aspects, provide an updated assessment score (0-100) for the refined idea.`;

  return promptText;
}

