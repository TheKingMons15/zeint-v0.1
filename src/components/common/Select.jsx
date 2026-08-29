import React from 'react';

export const Select = ({
  label,
  options = [],
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  placeholder = 'Seleccione una opción...',
  ...props
}) => {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <div className="relative rounded-2xl shadow-inner">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <select
          id={selectId}
          className={`block w-full rounded-2xl bg-slate-900/90 border text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 focus:outline-none transition-all duration-150 text-sm py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-9 ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/40'
              : 'border-white/10 hover:border-white/20'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value} className="bg-slate-900 text-slate-100 py-1.5">
                {label}
              </option>
            );
          })}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
