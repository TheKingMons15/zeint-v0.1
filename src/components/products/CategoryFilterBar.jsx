import React from 'react';
import { FOOD_CATEGORIES, CATEGORY_META } from '../../utils/constants';

export const CategoryFilterBar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      <button
        onClick={() => onSelectCategory('ALL')}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedCategory === 'ALL'
            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
        }`}
      >
        Todas
      </button>

      {FOOD_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        const meta = CATEGORY_META[category];

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {meta?.dotClass && !isSelected && (
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
            )}
            {category}
          </button>
        );
      })}
    </div>
  );
};
