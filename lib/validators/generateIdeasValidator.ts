import type { GenerateIdeasRequest } from '@/types/api';

/**
 * Generate Ideas Validator
 * 
 * Validates user input for business idea generation requests.
 * Validates age, capital (budget), interests, risk appetite, and other fields.
 * 
 * Usage:
 * ```typescript
 * import { validateGenerateIdeasRequest } from '@/lib/validators/generateIdeasValidator';
 * const result = validateGenerateIdeasRequest(request);
 * if (!result.isValid) {
 *   return { error: result.errors };
 * }
 * ```
 */

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Extended validation options
 * These fields may be provided separately or extracted from the request
 */
export interface GenerateIdeasValidationOptions {
  age?: number;
  capital?: number;
  interests?: string[];
  riskAppetite?: RiskAppetite;
}

/**
 * Risk appetite levels
 */
export enum RiskAppetite {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
}

/**
 * Validate GenerateIdeasRequest with extended validation options
 * 
 * Validates all aspects of the request including:
 * - Required fields (prompt)
 * - Age (if provided)
 * - Capital/budget (budgetRange)
 * - Interests/industries
 * - Risk appetite (if provided)
 * - Optional fields (count, experience level, etc.)
 * 
 * @param request - The GenerateIdeasRequest to validate
 * @param options - Additional validation options (age, capital, risk appetite)
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateGenerateIdeasRequest(
  request: GenerateIdeasRequest,
  options: GenerateIdeasValidationOptions = {}
): ValidationResult {
  const errors: string[] = [];

  // Validate required fields
  validatePrompt(request.prompt, errors);
  
  // Validate optional count
  validateCount(request.count, errors);
  
  // Validate age if provided
  if (options.age !== undefined) {
    validateAge(options.age, errors);
  }
  
  // Validate capital/budget
  validateCapital(request.budgetRange, options.capital, errors);
  
  // Validate interests/industries
  validateInterests(request.industries, options.interests, errors);
  
  // Validate risk appetite if provided
  if (options.riskAppetite !== undefined) {
    validateRiskAppetite(options.riskAppetite, errors);
  }
  
  // Validate other optional fields
  validateIdeaTypes(request.ideaTypes, errors);
  validateBusinessModels(request.businessModels, errors);
  validateTargetMarket(request.targetMarket, errors);
  validateExperienceLevel(request.experienceLevel, errors);
  validateGeographicFocus(request.geographicFocus, errors);
  validateAdditionalContext(request.additionalContext, errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate prompt field
 */
function validatePrompt(prompt: string | undefined, errors: string[]): void {
  if (!prompt) {
    errors.push('Prompt is required. Please describe what kind of business ideas you are looking for.');
    return;
  }

  if (typeof prompt !== 'string') {
    errors.push('Prompt must be a text string.');
    return;
  }

  const trimmedPrompt = prompt.trim();
  
  if (trimmedPrompt.length === 0) {
    errors.push('Prompt cannot be empty. Please provide a description of the business ideas you want.');
    return;
  }

  if (trimmedPrompt.length < 3) {
    errors.push('Prompt is too short. Please provide at least 3 characters.');
    return;
  }

  if (trimmedPrompt.length > 1000) {
    errors.push('Prompt is too long. Please limit your description to 1000 characters.');
    return;
  }
}

/**
 * Validate count field
 */
function validateCount(count: number | undefined, errors: string[]): void {
  if (count === undefined) {
    return; // Optional field
  }

  if (typeof count !== 'number') {
    errors.push('Count must be a number.');
    return;
  }

  if (!Number.isInteger(count)) {
    errors.push('Count must be a whole number.');
    return;
  }

  if (count < 1) {
    errors.push('Count must be at least 1.');
    return;
  }

  if (count > 10) {
    errors.push('Count cannot exceed 10 ideas per request.');
    return;
  }
}

/**
 * Validate age
 * 
 * Age validation for filtering ideas suitable for the user's life stage
 */
function validateAge(age: number, errors: string[]): void {
  if (typeof age !== 'number') {
    errors.push('Age must be a number.');
    return;
  }

  if (!Number.isInteger(age)) {
    errors.push('Age must be a whole number.');
    return;
  }

  if (age < 13) {
    errors.push('Age must be at least 13 years old.');
    return;
  }

  if (age > 120) {
    errors.push('Please enter a valid age.');
    return;
  }

  // Warn about age ranges that might affect idea recommendations
  if (age < 18) {
    // Could warn about legal restrictions for business ownership
    // But not blocking - just informational
  }
}

/**
 * Validate capital/budget
 * 
 * Validates both budgetRange from request and direct capital amount
 */
function validateCapital(
  budgetRange: GenerateIdeasRequest['budgetRange'] | undefined,
  capital: number | undefined,
  errors: string[]
): void {
  // If both are provided, prefer budgetRange
  if (budgetRange) {
    validateBudgetRange(budgetRange, errors);
    return;
  }

  // Validate direct capital amount
  if (capital !== undefined) {
    if (typeof capital !== 'number') {
      errors.push('Capital amount must be a number.');
      return;
    }

    if (capital < 0) {
      errors.push('Capital amount cannot be negative.');
      return;
    }

    // Reasonable upper limit check (could be adjusted)
    if (capital > 100000000) {
      errors.push('Capital amount exceeds maximum allowed value. Please enter a realistic amount.');
      return;
    }
  }
}

/**
 * Validate budget range
 */
function validateBudgetRange(
  budgetRange: NonNullable<GenerateIdeasRequest['budgetRange']>,
  errors: string[]
): void {
  const { min, max, currency } = budgetRange;

  // Validate currency if provided
  if (currency !== undefined) {
    if (typeof currency !== 'string') {
      errors.push('Currency must be a string (e.g., USD, EUR, GBP).');
    } else if (currency.length !== 3) {
      errors.push('Currency must be a 3-letter ISO code (e.g., USD, EUR, GBP).');
    }
  }

  // Validate min
  if (min !== undefined) {
    if (typeof min !== 'number') {
      errors.push('Budget minimum must be a number.');
    } else if (min < 0) {
      errors.push('Budget minimum cannot be negative.');
    } else if (min > 100000000) {
      errors.push('Budget minimum exceeds maximum allowed value.');
    }
  }

  // Validate max
  if (max !== undefined) {
    if (typeof max !== 'number') {
      errors.push('Budget maximum must be a number.');
    } else if (max < 0) {
      errors.push('Budget maximum cannot be negative.');
    } else if (max > 100000000) {
      errors.push('Budget maximum exceeds maximum allowed value.');
    }
  }

  // Validate range logic
  if (min !== undefined && max !== undefined) {
    if (min > max) {
      errors.push('Budget minimum cannot be greater than budget maximum.');
    }
  }
}

/**
 * Validate interests/industries
 * 
 * Validates both industries from request and direct interests array
 */
function validateInterests(
  industries: string[] | undefined,
  interests: string[] | undefined,
  errors: string[]
): void {
  // Use industries from request if available, otherwise use interests
  const interestsToValidate = industries || interests;

  if (interestsToValidate === undefined) {
    return; // Optional field
  }

  if (!Array.isArray(interestsToValidate)) {
    errors.push('Interests/industries must be an array.');
    return;
  }

  if (interestsToValidate.length === 0) {
    errors.push('Interests/industries array cannot be empty. If provided, it must contain at least one item.');
    return;
  }

  if (interestsToValidate.length > 20) {
    errors.push('Too many interests/industries specified. Please limit to 20 items.');
    return;
  }

  // Validate each interest/industry
  interestsToValidate.forEach((interest, index) => {
    if (typeof interest !== 'string') {
      errors.push(`Interest/industry at index ${index} must be a string.`);
      return;
    }

    const trimmed = interest.trim();
    
    if (trimmed.length === 0) {
      errors.push(`Interest/industry at index ${index} cannot be empty.`);
      return;
    }

    if (trimmed.length > 100) {
      errors.push(`Interest/industry at index ${index} is too long. Please limit to 100 characters.`);
      return;
    }
  });
}

/**
 * Validate risk appetite
 * 
 * Validates the user's risk tolerance level
 */
function validateRiskAppetite(riskAppetite: RiskAppetite | string, errors: string[]): void {
  if (typeof riskAppetite !== 'string') {
    errors.push('Risk appetite must be a string.');
    return;
  }

  const validValues = Object.values(RiskAppetite);
  const normalized = riskAppetite.toLowerCase();

  if (!validValues.includes(normalized as RiskAppetite)) {
    errors.push(
      `Risk appetite must be one of: ${validValues.join(', ')}. ` +
      `Received: ${riskAppetite}`
    );
    return;
  }
}

/**
 * Validate idea types
 */
function validateIdeaTypes(
  ideaTypes: GenerateIdeasRequest['ideaTypes'],
  errors: string[]
): void {
  if (ideaTypes === undefined) {
    return; // Optional field
  }

  if (!Array.isArray(ideaTypes)) {
    errors.push('Idea types must be an array.');
    return;
  }

  if (ideaTypes.length === 0) {
    errors.push('Idea types array cannot be empty. If provided, it must contain at least one item.');
    return;
  }

  if (ideaTypes.length > 10) {
    errors.push('Too many idea types specified. Please limit to 10 types.');
    return;
  }

  // TODO: Validate against actual IdeaType enum values
  // This would require importing IdeaType enum
  ideaTypes.forEach((type, index) => {
    if (typeof type !== 'string') {
      errors.push(`Idea type at index ${index} must be a string.`);
    }
  });
}

/**
 * Validate business models
 */
function validateBusinessModels(
  businessModels: GenerateIdeasRequest['businessModels'],
  errors: string[]
): void {
  if (businessModels === undefined) {
    return; // Optional field
  }

  if (!Array.isArray(businessModels)) {
    errors.push('Business models must be an array.');
    return;
  }

  if (businessModels.length === 0) {
    errors.push('Business models array cannot be empty. If provided, it must contain at least one item.');
    return;
  }

  if (businessModels.length > 10) {
    errors.push('Too many business models specified. Please limit to 10 models.');
    return;
  }

  // TODO: Validate against actual BusinessModel enum values
  businessModels.forEach((model, index) => {
    if (typeof model !== 'string') {
      errors.push(`Business model at index ${index} must be a string.`);
    }
  });
}

/**
 * Validate target market
 */
function validateTargetMarket(targetMarket: string | undefined, errors: string[]): void {
  if (targetMarket === undefined) {
    return; // Optional field
  }

  if (typeof targetMarket !== 'string') {
    errors.push('Target market must be a string.');
    return;
  }

  const trimmed = targetMarket.trim();
  
  if (trimmed.length === 0) {
    errors.push('Target market cannot be empty if provided.');
    return;
  }

  if (trimmed.length > 500) {
    errors.push('Target market description is too long. Please limit to 500 characters.');
    return;
  }
}

/**
 * Validate experience level
 */
function validateExperienceLevel(
  experienceLevel: GenerateIdeasRequest['experienceLevel'],
  errors: string[]
): void {
  if (experienceLevel === undefined) {
    return; // Optional field
  }

  if (typeof experienceLevel !== 'string') {
    errors.push('Experience level must be a string.');
    return;
  }

  const validLevels = ['beginner', 'intermediate', 'advanced'];
  const normalized = experienceLevel.toLowerCase();

  if (!validLevels.includes(normalized)) {
    errors.push(
      `Experience level must be one of: ${validLevels.join(', ')}. ` +
      `Received: ${experienceLevel}`
    );
  }
}

/**
 * Validate geographic focus
 */
function validateGeographicFocus(
  geographicFocus: string | undefined,
  errors: string[]
): void {
  if (geographicFocus === undefined) {
    return; // Optional field
  }

  if (typeof geographicFocus !== 'string') {
    errors.push('Geographic focus must be a string.');
    return;
  }

  const trimmed = geographicFocus.trim();
  
  if (trimmed.length === 0) {
    errors.push('Geographic focus cannot be empty if provided.');
    return;
  }

  if (trimmed.length > 200) {
    errors.push('Geographic focus is too long. Please limit to 200 characters.');
    return;
  }
}

/**
 * Validate additional context
 */
function validateAdditionalContext(
  additionalContext: string | undefined,
  errors: string[]
): void {
  if (additionalContext === undefined) {
    return; // Optional field
  }

  if (typeof additionalContext !== 'string') {
    errors.push('Additional context must be a string.');
    return;
  }

  const trimmed = additionalContext.trim();
  
  if (trimmed.length === 0) {
    errors.push('Additional context cannot be empty if provided.');
    return;
  }

  if (trimmed.length > 2000) {
    errors.push('Additional context is too long. Please limit to 2000 characters.');
    return;
  }
}

/**
 * Quick validation helper for common use case
 * Validates just the required fields
 */
export function validateGenerateIdeasRequestBasic(
  request: GenerateIdeasRequest
): ValidationResult {
  return validateGenerateIdeasRequest(request, {});
}

