import { NextRequest, NextResponse } from 'next/server';
import { generateIdeas } from '@/lib/ai/generateIdeas';
import { validateGenerateIdeasRequest } from '@/lib/validators/generateIdeasValidator';
import type { GenerateIdeasRequest } from '@/types/api';

/**
 * POST /api/generate-ideas
 * Generate business ideas based on user request
 * 
 * Pipeline: Validator → Prompt Engine → AI Service → Formatter
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse JSON body
    let body: GenerateIdeasRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Step 2: Validate request using validator
    const validationResult = validateGenerateIdeasRequest(body);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.errors 
        },
        { status: 400 }
      );
    }

    // Step 3: Generate business ideas
    // This internally uses: Prompt Engine → AI Service → Formatter
    const response = await generateIdeas(body);

    // Step 4: Return successful response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error('Error generating business ideas:', error);

    // Return generic error response
    const errorMessage = error instanceof Error ? error.message : 'Internal server error while generating ideas';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

