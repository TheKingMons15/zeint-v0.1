import React from 'react';
import { CATEGORY_META } from '../../utils/constants';

export const Badge = ({
  children,
  variant = 'default',
  category,
  size = 'md',
  dot = false,
  className = ''
}) => {
  let badgeStyle = 'bg-white/10 text-slate-300 border-white/15';
  let dotColor = 'bg-slate-400';

  if (category && CATEGORY_META[category]) {
    badgeStyle = CATEGORY_META[category].bgClass;
    dotColor = CATEGORY_META[category].dotClass;
  } else {
    switch (variant) {
      case 'success':
        badgeStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        dotColor = 'bg-emerald-400';
        break;
      case 'danger':
        badgeStyle = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        dotColor = 'bg-rose-400';
        break;
      case 'warning':
        badgeStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        dotColor = 'bg-amber-400';
        break;
      case 'info':
        badgeStyle = 'bg-sky-500/15 text-sky-300 border-sky-500/30';
        dotColor = 'bg-sky-400';
        break;
      case 'purple':
        badgeStyle = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
        dotColor = 'bg-purple-400';
        break;
      default:
        badgeStyle = 'bg-white/10 text-slate-300 border-white/15';
        dotColor = 'bg-slate-400';
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold tracking-wide rounded-full border shadow-sm ${sizeClasses} ${badgeStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />}
      {children || category}
    </span>
  );
};
