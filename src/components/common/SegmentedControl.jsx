import React from 'react';

/**
 * Componente Apple Segmented Control nativo.
 * Ofrece selector estilo pastilla deslizante con bordes redondeados y respuesta háptica.
 */
export const SegmentedControl = ({
  options = [],
  value,
  onChange,
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'p-0.5 text-xs h-8',
    md: 'p-1 text-xs sm:text-sm h-10',
    lg: 'p-1.5 text-sm h-12'
  };

  const itemPadding = {
    sm: 'px-2.5 py-1',
    md: 'px-3.5 py-1.5',
    lg: 'px-4 py-2'
  };

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-slate-900/90 p-1 rounded-2xl border border-white/10 shadow-inner backdrop-blur-xl ${
        sizeClasses[size] || sizeClasses.md
      } ${fullWidth ? 'w-full flex' : ''} ${className}`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={`${fullWidth ? 'flex-1' : ''} ${itemPadding[size] || itemPadding.md} flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all duration-200 ease-out select-none active:scale-[0.96] ${
              isSelected
                ? 'bg-gradient-to-b from-slate-800 to-slate-850 text-white shadow-md border border-white/15'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{option.label}</span>
            {option.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isSelected
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
