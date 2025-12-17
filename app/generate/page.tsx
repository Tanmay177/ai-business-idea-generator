'use client';

import { useState, FormEvent } from 'react';

/**
 * Generate Business Ideas Page
 * 
 * Form for collecting user preferences and generating business ideas.
 */

interface FormData {
  age: string;
  location: string;
  job: string;
  interests: string;
  capital: string;
  riskAppetite: string;
  timeCommitment: string;
  prompt: string;
}

interface ApiError {
  error: string;
  details?: string[];
}

export default function GeneratePage() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    location: '',
    job: '',
    interests: '',
    capital: '',
    riskAppetite: '',
    timeCommitment: '',
    prompt: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Build request payload
      const requestBody = {
        prompt: formData.prompt || buildPromptFromFormData(),
        // Map form fields to request structure
        industries: formData.interests
          ? formData.interests.split(',').map((i) => i.trim()).filter(Boolean)
          : undefined,
        budgetRange: formData.capital
          ? {
              min: parseInt(formData.capital) * 0.8, // Allow some flexibility
              max: parseInt(formData.capital) * 1.2,
              currency: 'USD',
            }
          : undefined,
        experienceLevel: mapTimeCommitmentToExperienceLevel(formData.timeCommitment),
        geographicFocus: formData.location || undefined,
        additionalContext: buildAdditionalContext(),
      };

      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating ideas');
      console.error('Error generating ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const buildPromptFromFormData = (): string => {
    const parts: string[] = [];

    if (formData.job) {
      parts.push(`I'm a ${formData.job}`);
    }

    if (formData.interests) {
      parts.push(`interested in ${formData.interests}`);
    }

    if (formData.capital) {
      parts.push(`with a budget of $${parseInt(formData.capital).toLocaleString()}`);
    }

    if (formData.location) {
      parts.push(`based in ${formData.location}`);
    }

    return parts.length > 0
      ? `Business ideas for ${parts.join(', ')}`
      : 'Innovative business ideas';
  };

  const buildAdditionalContext = (): string => {
    const parts: string[] = [];

    if (formData.age) {
      parts.push(`Age: ${formData.age}`);
    }

    if (formData.riskAppetite) {
      parts.push(`Risk appetite: ${formData.riskAppetite}`);
    }

    if (formData.timeCommitment) {
      parts.push(`Time commitment: ${formData.timeCommitment}`);
    }

    return parts.join('. ');
  };

  const mapTimeCommitmentToExperienceLevel = (
    timeCommitment: string
  ): 'beginner' | 'intermediate' | 'advanced' | undefined => {
    const normalized = timeCommitment.toLowerCase();
    if (normalized.includes('full') || normalized.includes('40+')) {
      return 'advanced';
    }
    if (normalized.includes('part') || normalized.includes('side')) {
      return 'beginner';
    }
    return 'intermediate';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Generate Business Ideas</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Field */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            What kind of business ideas are you looking for? (Optional - will be generated from other fields if empty)
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AI-powered solutions for small businesses"
          />
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="13"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 28"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., San Francisco, CA or Remote"
          />
        </div>

        {/* Job */}
        <div>
          <label htmlFor="job" className="block text-sm font-medium mb-2">
            Current Job / Profession
          </label>
          <input
            type="text"
            id="job"
            name="job"
            value={formData.job}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Engineer, Entrepreneur, Student"
          />
        </div>

        {/* Interests */}
        <div>
          <label htmlFor="interests" className="block text-sm font-medium mb-2">
            Interests / Industries (comma-separated)
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Technology, Health & Fitness, E-commerce"
          />
        </div>

        {/* Capital */}
        <div>
          <label htmlFor="capital" className="block text-sm font-medium mb-2">
            Available Capital / Budget (USD)
          </label>
          <input
            type="number"
            id="capital"
            name="capital"
            value={formData.capital}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 50000"
          />
        </div>

        {/* Risk Appetite */}
        <div>
          <label htmlFor="riskAppetite" className="block text-sm font-medium mb-2">
            Risk Appetite
          </label>
          <select
            id="riskAppetite"
            name="riskAppetite"
            value={formData.riskAppetite}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select risk appetite</option>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        {/* Time Commitment */}
        <div>
          <label htmlFor="timeCommitment" className="block text-sm font-medium mb-2">
            Time Commitment
          </label>
          <select
            id="timeCommitment"
            name="timeCommitment"
            value={formData.timeCommitment}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select time commitment</option>
            <option value="part-time">Part-time / Side project</option>
            <option value="full-time">Full-time</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results Placeholder */}
      {results && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Ideas</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-600 mb-2">
                Request ID: {results.requestId}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Generated: {new Date(results.generatedAt).toLocaleString()}
              </p>
              <p className="font-medium mb-2">
                {results.metadata?.count || 0} ideas generated
              </p>
              <pre className="bg-white p-4 rounded border overflow-auto text-xs">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

