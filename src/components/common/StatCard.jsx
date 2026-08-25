import React from 'react';

const colorThemes = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300'
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-300'
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300'
  },
  sky: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 text-sky-300'
  },
  slate: {
    bg: 'bg-slate-800/40',
    border: 'border-slate-700/60',
    iconBg: 'bg-slate-800',
    iconColor: 'text-slate-300',
    badgeBg: 'bg-slate-800 text-slate-400'
  }
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'slate',
  trend,
  onClick
}) => {
  const theme = colorThemes[color] || colorThemes.slate;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 border ${theme.bg} ${theme.border} backdrop-blur-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:scale-[1.02] shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${theme.iconBg} ${theme.iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
