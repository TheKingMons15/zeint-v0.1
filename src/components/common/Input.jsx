import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`block w-full rounded-xl bg-slate-900/90 border text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-colors text-sm py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-rose-500/80 focus:border-rose-500'
              : 'border-slate-700/80 focus:border-emerald-500 hover:border-slate-600'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
