# Integration Flow Documentation

This document explains how all components are wired together in the business idea generation pipeline.

## Complete Pipeline Flow

```
Frontend (page.tsx)
    ↓
API Route (/api/generate-ideas)
    ↓
Validator (validateGenerateIdeasRequest)
    ↓
AI Service (generateIdeas)
    ├─→ Prompt Engine (baseSystemPrompt, businessIdeaPrompt)
    ├─→ OpenAI Client (openaiClient) [TODO: Real integration]
    └─→ Formatter (formatBusinessIdeasFromAI) [TODO: Real integration]
    ↓
Response (GenerateIdeasResponse)
    ↓
Frontend Components (BusinessIdeaCard, LoadingState, FeasibilityBadge)
```

## Step-by-Step Flow

### 1. Frontend Form Submission (`/app/generate/page.tsx`)

- User fills out form with: age, location, job, interests, capital, risk appetite, time commitment
- Form data is converted to `GenerateIdeasRequest` format
- POST request sent to `/api/generate-ideas`

**Key Components:**
- `LoadingState` - Shows loading indicator during request
- `BusinessIdeaCard` - Displays generated ideas
- `FeasibilityBadge` - Shows AI score on each idea

### 2. API Route Validation (`/app/api/generate-ideas/route.ts`)

- Parses JSON request body
- Validates using `validateGenerateIdeasRequest()` from `/lib/validators/generateIdeasValidator.ts`
- Returns 400 error if validation fails
- Calls `generateIdeas()` service on success

### 3. AI Service Orchestration (`/lib/ai/generateIdeas.ts`)

The main service that orchestrates the entire AI pipeline:

**Current Flow (Mock):**
1. Enhances request with user profile preferences
2. Generates prompts using prompt engine
3. Generates mock ideas (temporary)

**TODO: Real OpenAI Integration**
```typescript
// Uncomment this section in generateIdeas.ts when OpenAI API key is configured:

// Step 1: Call OpenAI API
const completion = await openaiClient.chat.completions.create({
  model: getDefaultModel(),
  messages, // Contains system + user prompts
  temperature: 0.7,
  max_tokens: 4000,
  response_format: { type: 'json_object' },
});

// Step 2: Format AI response using formatter
const { formatBusinessIdeasFromAI } = await import('@/lib/formatters/businessIdeaFormatter');
const ideas = await formatBusinessIdeasFromAI(
  completion.choices[0]?.message?.content,
  enhancedRequest.count || 3,
  { userId, defaultIndustry, ... }
);
```

### 4. Prompt Engine (`/lib/ai/prompts/`)

**Files:**
- `baseSystemPrompt.ts` - Defines AI role and expertise
- `businessIdeaPrompt.ts` - Constructs detailed user prompt from request

**Purpose:** Transforms user request into comprehensive prompts for the AI

### 5. Formatter (`/lib/formatters/businessIdeaFormatter.ts`)

**Purpose:** Parses raw AI text response into structured `BusinessIdea[]` objects

**Parsing Strategies (in order):**
1. JSON parsing (primary - when AI returns JSON)
2. Structured text parsing (markdown, lists)
3. Pattern matching (fallback)

**TODO:** Enhance parsing based on actual AI response format

### 6. Response Flow

**Type Flow:**
```
GenerateIdeasRequest (API Input)
    ↓
GenerateIdeasResponse (API Output)
    └─→ BusinessIdea[] (Array of ideas)
        └─→ Used by BusinessIdeaCard component
```

### 7. Frontend Display

**Components Used:**
- `BusinessIdeaCard` - Displays each idea with full details
- `FeasibilityBadge` - Shows AI score (0-100)
- `LoadingState` - Shows during API call

## Type Safety

All types flow end-to-end:

1. **Frontend → API:** `GenerateIdeasRequest`
2. **API → Service:** `GenerateIdeasRequest` (validated)
3. **Service → Formatter:** Raw string → `BusinessIdea[]`
4. **Service → API Response:** `GenerateIdeasResponse`
5. **API Response → Frontend:** `GenerateIdeasResponse`
6. **Frontend Display:** `BusinessIdea` → `BusinessIdeaCard`

## Configuration

**Environment Variables** (`.env.local`):
- `OPENAI_API_KEY` - Required for real AI integration
- `OPENAI_MODEL` - Optional (defaults to 'gpt-4')
- Other optional vars - See `.env.example`

**Central Config** (`/lib/config/env.ts`):
- Type-safe access to environment variables
- Validation and error handling
- Helper functions: `isOpenAIConfigured()`, etc.

## TODOs for OpenAI Integration

### 1. Enable OpenAI Client (`/lib/ai/openaiClient.ts`)
- Install OpenAI SDK: `npm install openai`
- Uncomment actual client implementation
- Replace mock client

### 2. Enable AI Generation (`/lib/ai/generateIdeas.ts`)
- Uncomment OpenAI API call section (lines 48-78)
- Comment out mock data generation
- Set `tokensUsed` from `completion.usage?.total_tokens`

### 3. Configure Formatter (`/lib/formatters/businessIdeaFormatter.ts`)
- Adjust parsing strategies based on actual AI response format
- Test with real AI responses
- Enhance field extraction logic

### 4. Test End-to-End
- Verify prompt quality
- Check response parsing
- Validate business idea structure
- Test error handling

## Error Handling

**Validation Errors (400):**
- Invalid request format
- Missing required fields
- Invalid field values

**AI Service Errors (500):**
- OpenAI API failures
- Parsing failures
- Internal server errors

**Frontend Errors:**
- Displayed in red error box
- Includes detailed error messages from API

## Current Status

✅ **Complete:**
- Frontend form with all fields
- API route with validation
- Prompt engine
- Formatter (structure ready)
- Type safety end-to-end
- UI components
- Configuration setup

⏳ **Pending:**
- Real OpenAI API integration (TODOs marked in code)
- Formatter tuning based on actual AI responses
- Error handling for OpenAI-specific errors

