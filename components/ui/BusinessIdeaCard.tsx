import type { BusinessIdea } from '@/types/models';
import { IdeaStatus } from '@/types/models';
import { FeasibilityBadge } from './FeasibilityBadge';

/**
 * BusinessIdeaCard Component
 * 
 * Displays a business idea in a card format with key information.
 */
interface BusinessIdeaCardProps {
  idea: BusinessIdea;
  onClick?: () => void;
  showDetails?: boolean;
}

export function BusinessIdeaCard({ idea, onClick, showDetails = false }: BusinessIdeaCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {idea.ideaType}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {idea.industry}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                idea.status === IdeaStatus.GENERATED
                  ? 'bg-blue-100 text-blue-800'
                  : idea.status === IdeaStatus.VALIDATED
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {idea.status}
            </span>
          </div>
        </div>
        {idea.aiScore !== undefined && (
          <FeasibilityBadge score={idea.aiScore} />
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">{idea.description}</p>

      {/* Key Details */}
      {showDetails && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {/* Problem & Solution */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Problem</h4>
            <p className="text-sm text-gray-600">{idea.problem}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Solution</h4>
            <p className="text-sm text-gray-600">{idea.solution}</p>
          </div>

          {/* Target Market */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Target Market</h4>
            <p className="text-sm text-gray-600">{idea.targetMarket}</p>
          </div>

          {/* Business Model */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Business Model</h4>
            <p className="text-sm text-gray-600 capitalize">{idea.businessModel.replace('_', ' ')}</p>
          </div>

          {/* Revenue Streams */}
          {idea.revenueStreams.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Revenue Streams</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {idea.revenueStreams.map((stream, index) => (
                  <li key={index}>{stream.description}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Investment Range */}
          {idea.initialInvestment && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Initial Investment</h4>
              <p className="text-sm text-gray-600">
                {idea.initialInvestment.min.toLocaleString()} - {idea.initialInvestment.max.toLocaleString()}{' '}
                {idea.initialInvestment.currency} ({idea.initialInvestment.timeframe})
              </p>
            </div>
          )}

          {/* Competitive Advantage */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Competitive Advantage</h4>
            <p className="text-sm text-gray-600">{idea.competitiveAdvantage}</p>
          </div>

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <span>Created {new Date(idea.createdAt).toLocaleDateString()}</span>
        {idea.updatedAt && (
          <span>Updated {new Date(idea.updatedAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}

