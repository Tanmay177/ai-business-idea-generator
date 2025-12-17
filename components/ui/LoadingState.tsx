/**
 * LoadingState Component
 * 
 * Displays a loading indicator with optional message.
 * Can be used as a full-page loader or inline loading state.
 */
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
  className = '',
}: LoadingStateProps) {
  // Size classes for spinner
  const spinnerSizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex items-center justify-center py-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className={`${spinnerSizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        />
        
        {/* Message */}
        {message && (
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

