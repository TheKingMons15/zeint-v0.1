import React from 'react';

const variants = {
  primary: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-apple-md shadow-emerald-950/50 border border-emerald-400/30 active:scale-[0.96]',
  secondary: 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-white/10 shadow-apple-sm backdrop-blur-md active:scale-[0.96]',
  glass: 'apple-glass hover:bg-white/10 text-white border border-white/15 shadow-apple-glass active:scale-[0.96]',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-apple-md shadow-rose-950/50 border border-rose-400/30 active:scale-[0.96]',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-apple-md shadow-emerald-950/50 border border-emerald-400/30 active:scale-[0.96]',
  amber: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-apple-md shadow-amber-950/50 border border-amber-300/40 active:scale-[0.96]',
  purple: 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-apple-md shadow-purple-950/50 border border-purple-400/30 active:scale-[0.96]',
  outline: 'bg-transparent border border-white/15 hover:bg-white/5 text-slate-200 hover:text-white active:scale-[0.96]',
  ghost: 'bg-transparent hover:bg-white/10 text-slate-400 hover:text-slate-100 active:scale-[0.96]'
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-xl gap-1 min-h-[32px]',
  sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5 min-h-[36px]',
  md: 'px-4 py-2.5 text-sm rounded-2xl gap-2 min-h-[44px]', // iOS touch target recommendation (44px)
  lg: 'px-5 py-3.5 text-base rounded-2xl gap-2.5 min-h-[48px]',
  icon: 'p-2.5 rounded-2xl justify-center items-center min-w-[44px] min-h-[44px]'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-bold tracking-tight transition-all duration-150 ease-out select-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' || size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
};
