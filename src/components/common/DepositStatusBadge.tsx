import React from 'react';
import { Clock, CheckCircle2, XCircle, Sparkles, AlertCircle } from 'lucide-react';

export type DepositStatus = 'pending' | 'completed' | 'verified' | 'approved' | 'rejected';

interface DepositStatusBadgeProps {
  status: DepositStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showSubtext?: boolean;
  className?: string;
}

export const DepositStatusBadge: React.FC<DepositStatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
  showSubtext = false,
  className = ''
}) => {
  const isCompleted = status === 'completed' || status === 'verified' || status === 'approved';
  const isPending = status === 'pending';
  const isRejected = status === 'rejected';

  // Size configurations
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <div className={`inline-flex flex-col items-end ${className}`}>
      <span
        className={`inline-flex items-center font-bold rounded-full border shadow-xs transition-all duration-500 ease-in-out backdrop-blur-md select-none group relative overflow-hidden ${
          sizeClasses[size]
        } ${
          isCompleted
            ? 'bg-emerald-500/10 dark:bg-emerald-950/50 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:shadow-emerald-500/20'
            : isPending
            ? 'bg-amber-500/10 dark:bg-amber-950/50 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-amber-500/20'
            : 'bg-rose-500/10 dark:bg-rose-950/50 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 hover:shadow-rose-500/20'
        }`}
      >
        {/* Animated Glow Halo Background */}
        <span
          className={`absolute inset-0 opacity-20 transition-opacity duration-500 pointer-events-none ${
            isCompleted
              ? 'bg-emerald-400/20 animate-pulse'
              : isPending
              ? 'bg-amber-400/30 animate-pulse'
              : 'bg-rose-400/20'
          }`}
        />

        {/* Status Indicator Icon & Pulsing Dot */}
        {isPending && (
          <span className="relative flex items-center justify-center shrink-0">
            <span className={`absolute rounded-full bg-amber-400 opacity-75 animate-ping ${dotSizes[size]}`} />
            <Clock className={`${iconSizes[size]} text-amber-500 dark:text-amber-400 animate-spin-slow shrink-0`} />
          </span>
        )}

        {isCompleted && (
          <span className="relative flex items-center justify-center shrink-0">
            <CheckCircle2 className={`${iconSizes[size]} text-emerald-500 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110 shrink-0`} />
          </span>
        )}

        {isRejected && (
          <span className="relative flex items-center justify-center shrink-0">
            <AlertCircle className={`${iconSizes[size]} text-rose-500 dark:text-rose-400 transition-transform duration-300 group-hover:scale-110 shrink-0`} />
          </span>
        )}

        {/* Text Label */}
        {showLabel && (
          <span className="font-extrabold uppercase tracking-wider relative z-10">
            {isCompleted && (status === 'approved' ? 'Tasdiqlandi (Approved) ✓' : 'Tasdiqlangan ✓')}
            {isPending && 'Kutilmoqda...'}
            {isRejected && 'Rad Etilgan'}
          </span>
        )}

        {/* Sparkle effect on verified */}
        {isCompleted && (
          <Sparkles className="w-3 h-3 text-emerald-400 animate-bounce-gentle shrink-0 ml-0.5" />
        )}
      </span>

      {/* Optional Subtext Description */}
      {showSubtext && (
        <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 mt-1 transition-colors duration-300">
          {isCompleted && 'To‘lov tasdiqlandi, balansga o‘tkazildi'}
          {isPending && 'Administrator tomonidan tekshirilmoqda'}
          {isRejected && 'Chek yoki ma’lumot xatosi sabab bekor qilindi'}
        </span>
      )}
    </div>
  );
};
