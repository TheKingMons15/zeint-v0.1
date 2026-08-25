import React from 'react';

const variants = {
  primary: 'bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-950/40 active:scale-[0.98] border border-emerald-500/30',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-[0.98]',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-950/40 active:scale-[0.98] border border-rose-500/30',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]',
  outline: 'bg-transparent border border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white',
  ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
  icon: 'p-2.5 rounded-xl justify-center items-center'
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
      className={`inline-flex items-center justify-center transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
};
