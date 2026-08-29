import React from 'react';

const colorThemes = {
  emerald: {
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    glow: 'hover:shadow-apple-glow-emerald',
    accentBorder: 'hover:border-emerald-500/40'
  },
  rose: {
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    glow: 'hover:shadow-apple-md',
    accentBorder: 'hover:border-rose-500/40'
  },
  amber: {
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    glow: 'hover:shadow-apple-glow-amber',
    accentBorder: 'hover:border-amber-500/40'
  },
  purple: {
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    glow: 'hover:shadow-apple-glow-purple',
    accentBorder: 'hover:border-purple-500/40'
  },
  sky: {
    badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-400',
    glow: 'hover:shadow-apple-glow-blue',
    accentBorder: 'hover:border-sky-500/40'
  },
  slate: {
    badgeBg: 'bg-white/10 text-slate-300 border-white/15',
    iconBg: 'bg-white/10',
    iconColor: 'text-slate-200',
    glow: 'hover:shadow-apple-md',
    accentBorder: 'hover:border-white/25'
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
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 apple-glass-card transition-all duration-200 ease-out border border-white/10 ${
        theme.glow
      } ${theme.accentBorder} ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl ${theme.iconBg} ${theme.iconColor} border border-white/10 shadow-inner`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          {value}
        </span>
        {trend && (
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}>
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
