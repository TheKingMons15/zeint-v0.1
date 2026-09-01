import React from 'react';
import { FOOD_CATEGORIES, CATEGORY_META } from '../../utils/constants';

export const CategoryFilterBar = ({ selectedCategory, onSelectCategory, categories = FOOD_CATEGORIES }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      <button
        onClick={() => onSelectCategory('ALL')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
          selectedCategory === 'ALL'
            ? 'bg-emerald-500 text-slate-950 shadow-apple-glow-emerald font-black'
            : 'apple-glass text-slate-400 hover:text-white hover:border-white/20'
        }`}
      >
        Todas
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        const meta = CATEGORY_META[category];

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 active:scale-95 ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-apple-glow-emerald font-black'
                : 'apple-glass text-slate-400 hover:text-white hover:border-white/20'
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
