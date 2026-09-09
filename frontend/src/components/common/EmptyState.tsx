import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-[#f4efe6] text-[#c86d51] flex items-center justify-center mx-auto mb-4 border border-[#ded7c8]">
        {icon || <PackageOpen className="w-8 h-8 stroke-[1.8]" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#24211d] mb-2">{title}</h3>
      <p className="text-sm text-[#67635c] leading-relaxed mb-6">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200"
          >
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white hover:bg-[#f4efe6] text-[#24211d] text-sm font-semibold transition-all duration-200"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
