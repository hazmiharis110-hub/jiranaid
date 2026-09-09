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
    <div className="bg-white rounded-2xl border-2 border-black p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-[5px_5px_0px_#000]">
      <div className="w-16 h-16 rounded-2xl bg-[#ff90e8] text-black flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[3px_3px_0px_#000]">
        {icon || <PackageOpen className="w-8 h-8 stroke-[2.2]" />}
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-black mb-2">{title}</h3>
      <p className="text-sm text-[#444] font-medium leading-relaxed mb-6">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-[#ffc900] text-black border-2 border-black text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 rounded-xl border-2 border-black bg-white hover:bg-[#faf9f6] text-black text-sm font-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
