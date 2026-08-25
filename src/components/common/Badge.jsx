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
  let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (category && CATEGORY_META[category]) {
    badgeStyle = CATEGORY_META[category].bgClass;
    dotColor = CATEGORY_META[category].dotClass;
  } else {
    switch (variant) {
      case 'success':
        badgeStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
        dotColor = 'bg-emerald-400';
        break;
      case 'danger':
        badgeStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
        dotColor = 'bg-rose-400';
        break;
      case 'warning':
        badgeStyle = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        dotColor = 'bg-amber-400';
        break;
      case 'info':
        badgeStyle = 'bg-sky-500/15 text-sky-400 border-sky-500/30';
        dotColor = 'bg-sky-400';
        break;
      case 'purple':
        badgeStyle = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
        dotColor = 'bg-purple-400';
        break;
      default:
        badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
        dotColor = 'bg-slate-400';
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${badgeStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children || category}
    </span>
  );
};
