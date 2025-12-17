import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessIdeas } from '@/lib/ai/services/generateBusinessIdeas';
import type { GenerateIdeasRequest } from '@/types/api';

/**
 * POST /api/generate-ideas
 * Generate business ideas based on user request
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate JSON body
    let body: GenerateIdeasRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Basic validation - check required fields
    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: prompt' },
        { status: 400 }
      );
    }

    // Validate count if provided
    if (body.count !== undefined) {
      if (typeof body.count !== 'number' || body.count < 1 || body.count > 10) {
        return NextResponse.json(
          { error: 'count must be a number between 1 and 10' },
          { status: 400 }
        );
      }
    }

    // Validate industries if provided
    if (body.industries !== undefined) {
      if (!Array.isArray(body.industries) || body.industries.some(ind => typeof ind !== 'string')) {
        return NextResponse.json(
          { error: 'industries must be an array of strings' },
          { status: 400 }
        );
      }
    }

    // Generate business ideas
    const response = await generateBusinessIdeas(body);

    // Return successful response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error('Error generating business ideas:', error);

    // Return generic error response
    return NextResponse.json(
      { error: 'Internal server error while generating ideas' },
      { status: 500 }
    );
  }
}

