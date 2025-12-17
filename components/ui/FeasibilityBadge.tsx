/**
 * FeasibilityBadge Component
 * 
 * Displays a score/feasibility rating with color coding.
 * Typically used to show AI confidence scores or idea quality ratings.
 */
interface FeasibilityBadgeProps {
  score: number;
  label?: string;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function FeasibilityBadge({
  score,
  label,
  maxScore = 100,
  size = 'md',
}: FeasibilityBadgeProps) {
  // Normalize score to 0-100 range if different maxScore
  const normalizedScore = Math.min(Math.max((score / maxScore) * 100, 0), 100);
  
  // Determine color based on score
  const getColorClasses = (score: number) => {
    if (score >= 80) {
      return 'bg-green-100 text-green-800 border-green-300';
    } else if (score >= 60) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    } else if (score >= 40) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    } else {
      return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 border rounded-full font-medium ${getColorClasses(
        normalizedScore
      )} ${sizeClasses[size]}`}
      title={label || `Feasibility Score: ${normalizedScore.toFixed(0)}/100`}
    >
      {label && <span>{label}</span>}
      <span className="font-semibold">{normalizedScore.toFixed(0)}</span>
      {maxScore !== 100 && <span className="text-xs opacity-75">/{maxScore}</span>}
    </div>
  );
}

