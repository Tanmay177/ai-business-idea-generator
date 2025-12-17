# Folder Structure Documentation

This document explains the organization and responsibility of each folder in the AI-powered SaaS application.

## Overview

```
ai-business-idea-generator/
├── app/                    # Next.js App Router pages and routes
├── components/             # React components organized by purpose
├── lib/                    # Utility functions and business logic
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

---

## `/app` - UI Pages & Routes

Next.js App Router directory containing pages, layouts, and API routes.

### `app/(dashboard)/`
**Purpose**: Route group for authenticated dashboard pages. The parentheses `()` prevent it from appearing in the URL path.

- `layout.tsx` - Shared layout wrapper for all dashboard pages
- `page.tsx` - Dashboard home/overview page
- `ideas/` - Ideas management pages
  - `page.tsx` - List and manage generated business ideas
- `settings/` - User settings pages
  - `page.tsx` - User account and application settings

### `app/api/`
**Purpose**: API route handlers (Next.js API routes).

- `ideas/route.ts` - CRUD operations for ideas (GET, POST, PUT, DELETE)
- `generate/route.ts` - AI generation endpoint for creating new business ideas

### Root App Files
- `layout.tsx` - Root layout (metadata, fonts, global providers)
- `page.tsx` - Landing/home page
- `globals.css` - Global styles

---

## `/components` - React Components

Reusable React components organized by their role and level of abstraction.

### `components/ui/`
**Purpose**: Presentational UI components - buttons, inputs, cards, modals, etc.
- Stateless, reusable components
- Focused on styling and presentation
- Can be used across different features
- Examples: `Button.tsx`, `Input.tsx`, `Card.tsx`, `Modal.tsx`

### `components/layout/`
**Purpose**: Structural layout components - header, footer, sidebar, navigation, etc.
- Define page structure and navigation
- Shared across multiple pages
- Examples: `Header.tsx`, `Footer.tsx`, `Sidebar.tsx`, `Navbar.tsx`

### `components/features/`
**Purpose**: Feature-specific components with business logic.
- Tied to specific features (ideas, settings, etc.)
- May contain state management and API calls
- Examples: `IdeaCard.tsx`, `IdeaForm.tsx`, `IdeaList.tsx`

### `components/index.ts`
**Purpose**: Central export point - re-export all components for cleaner imports.
```typescript
import { Button, IdeaCard, Header } from '@/components';
```

---

## `/lib` - Utility Functions & Business Logic

Reusable utility functions, constants, and business logic organized by domain.

### `lib/utils/`
**Purpose**: General utility functions and helpers.
- Formatting functions (dates, currency, strings)
- Common helpers (debounce, throttle, classNames)
- Data transformation utilities
- Examples: `formatDate.ts`, `cn.ts` (className utility), `debounce.ts`

### `lib/constants/`
**Purpose**: Application constants and configuration values.
- API endpoints
- Configuration values
- Enums and constants
- Examples: `apiEndpoints.ts`, `config.ts`, `routes.ts`

### `lib/validations/`
**Purpose**: Validation schemas and functions.
- Form validation schemas (e.g., Zod schemas)
- Data validation functions
- Type-safe validation utilities
- Examples: `ideaSchema.ts`, `userSchema.ts`

### `lib/ai/`
**Purpose**: AI-specific functionality and integrations.

#### `lib/ai/prompts/`
**Purpose**: Prompt engineering logic.
- Prompt templates and builders
- Prompt utilities and helpers
- All logic for constructing AI prompts
- Examples: `ideaGenerationPrompt.ts`, `promptBuilder.ts`, `promptTemplates.ts`

#### `lib/ai/services/`
**Purpose**: AI service integrations.
- API clients for AI providers (OpenAI, Anthropic, etc.)
- Functions to interact with AI APIs
- Service abstraction layer
- Examples: `openaiClient.ts`, `anthropicClient.ts`, `aiService.ts`

### `lib/index.ts`
**Purpose**: Central export point - re-export all utilities.
```typescript
import { formatDate, API_ENDPOINTS, IdeaSchema } from '@/lib';
```

---

## `/types` - TypeScript Definitions

TypeScript type definitions organized by domain.

### `types/models/`
**Purpose**: Domain model types and interfaces.
- Core business entity types
- Data model definitions
- Examples: `User.ts`, `Idea.ts`, `Business.ts`

### `types/api/`
**Purpose**: API-related types.
- Request/response types
- API error types
- Endpoint type definitions
- Examples: `apiResponses.ts`, `apiErrors.ts`

### `types/ai/`
**Purpose**: AI-related types.
- Prompt types and interfaces
- AI response types
- Model configuration types
- Examples: `promptTypes.ts`, `aiResponse.ts`, `modelConfig.ts`

### `types/index.ts`
**Purpose**: Central export point - re-export all types.
```typescript
import { User, Idea, ApiResponse, PromptConfig } from '@/types';
```

---

## Design Principles

1. **Separation of Concerns**: Each folder has a single, well-defined responsibility
2. **Scalability**: Structure supports growth without reorganization
3. **Clean Imports**: Index files enable clean, organized imports
4. **Type Safety**: Centralized types ensure consistency across the application
5. **Reusability**: Components and utilities are organized for maximum reuse

---

## Import Patterns

### Recommended Import Style

```typescript
// Types
import { Idea, ApiResponse } from '@/types';
import { PromptConfig } from '@/types/ai';

// Utilities
import { formatDate, debounce } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/constants';
import { IdeaSchema } from '@/lib/validations';

// AI Logic
import { buildIdeaPrompt } from '@/lib/ai/prompts';
import { generateIdea } from '@/lib/ai/services';

// Components
import { Button, Input } from '@/components/ui';
import { Header, Sidebar } from '@/components/layout';
import { IdeaCard } from '@/components/features';
```

---

## Next Steps

When implementing features:

1. **UI Pages**: Add pages in `app/` directory
2. **API Routes**: Add route handlers in `app/api/`
3. **Components**: Create components in appropriate subdirectories
4. **Prompts**: Add prompt logic in `lib/ai/prompts/`
5. **AI Services**: Add AI integrations in `lib/ai/services/`
6. **Types**: Define types in appropriate `types/` subdirectories
7. **Utilities**: Add helper functions to `lib/utils/`

