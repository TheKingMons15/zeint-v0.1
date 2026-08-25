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
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <select
          id={selectId}
          className={`block w-full rounded-xl bg-slate-900/90 border text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-colors text-sm py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-9 ${
            error
              ? 'border-rose-500/80 focus:border-rose-500'
              : 'border-slate-700/80 focus:border-emerald-500 hover:border-slate-600'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value} className="bg-slate-900 text-slate-100 py-1">
                {label}
              </option>
            );
          })}
        </select>
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
