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
          className={`inline-flex items-center gap-1.5 font-black uppercase tracking-wider rounded-lg bg-[#bbf7d0] text-black border-2 border-black shadow-[2px_2px_0px_#000] ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Available to Borrow</span>
        </span>
      );
    }
    if (s === 'borrowed') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-black uppercase tracking-wider rounded-lg bg-[#ffd33d] text-black border-2 border-black shadow-[2px_2px_0px_#000] ${sizeClasses} ${className}`}
        >
          <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Currently On Loan</span>
        </span>
      );
    }
    if (s === 'maintenance') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-black uppercase tracking-wider rounded-lg bg-[#ff90e8] text-black border-2 border-black shadow-[2px_2px_0px_#000] ${sizeClasses} ${className}`}
        >
          <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>In Maintenance</span>
        </span>
      );
    }
  }

  if (condition || variant === 'condition') {
    const cond = condition || (children as ToolCondition);
    let colorClasses = 'bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]';
    if (cond === 'Like New') {
      colorClasses = 'bg-[#bbf7d0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]';
    } else if (cond === 'Good Condition') {
      colorClasses = 'bg-[#bae6fd] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]';
    } else if (cond === 'Fair / Workhorse') {
      colorClasses = 'bg-[#fed7aa] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]';
    }

    return (
      <span
        className={`inline-flex items-center font-black rounded-lg ${colorClasses} ${sizeClasses} ${className}`}
      >
        {cond || children}
      </span>
    );
  }

  if (variant === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-black rounded-full bg-[#bbf7d0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${sizeClasses} ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{children || 'Verified Neighbor'}</span>
      </span>
    );
  }

  if (variant === 'category') {
    return (
      <span
        className={`inline-flex items-center font-black rounded-lg bg-[#ffc900] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg border-2 border-black text-black bg-white shadow-[1.5px_1.5px_0px_#000] ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
