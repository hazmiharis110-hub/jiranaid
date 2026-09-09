import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading local tools...',
  size = 'md',
  fullPage = false,
}) => {
  const sizeClasses =
    size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <Loader2 className={`${sizeClasses} text-black animate-spin`} />
      {message && <p className="text-xs sm:text-sm font-bold text-black">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
