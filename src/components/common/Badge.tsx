import React from 'react';
import { CheckCircle2, Clock, Wrench, ShieldCheck } from 'lucide-react';
import type { ToolStatus, ToolCondition } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'available' | 'borrowed' | 'maintenance' | 'condition' | 'verified' | 'category' | 'outline';
  condition?: ToolCondition;
  status?: ToolStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'available',
  condition,
  status,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (status || variant === 'available' || variant === 'borrowed' || variant === 'maintenance') {
    const s = status || variant;
    if (s === 'available') {
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#5f7d66]/15 text-[#496350] border border-[#5f7d66]/30 ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Available to Borrow</span>
        </span>
      );
    }
    if (s === 'borrowed') {
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 ${sizeClasses} ${className}`}
        >
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Currently On Loan</span>
        </span>
      );
    }
    if (s === 'maintenance') {
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 ${sizeClasses} ${className}`}
        >
          <Wrench className="w-3 h-3 text-red-500" />
          <span>In Maintenance</span>
        </span>
      );
    }
  }

  if (condition || variant === 'condition') {
    const cond = condition || (children as ToolCondition);
    let colorClasses = 'bg-stone-100 text-stone-700 border-stone-200';
    if (cond === 'Like New') {
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    } else if (cond === 'Good Condition') {
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
    } else if (cond === 'Fair / Workhorse') {
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    }

    return (
      <span
        className={`inline-flex items-center font-medium rounded-lg border ${colorClasses} ${sizeClasses} ${className}`}
      >
        {cond || children}
      </span>
    );
  }

  if (variant === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#5f7d66]/15 text-[#496350] ${sizeClasses} ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
        <span>{children || 'Verified Neighbor'}</span>
      </span>
    );
  }

  if (variant === 'category') {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-full bg-[#f4efe6] text-[#4e4a43] border border-[#ded7c8] ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border border-[#ded7c8] text-[#4e4a43] bg-white ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
