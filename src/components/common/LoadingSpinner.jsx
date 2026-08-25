import React from 'react';

export const LoadingSpinner = ({ label = 'Cargando datos...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400/30 border-b-emerald-400 animate-spin absolute top-2 left-2 animate-reverse" />
      </div>
      {label && <p className="mt-4 text-sm text-slate-400 font-medium animate-pulse">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
