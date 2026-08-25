import React from 'react';

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'p-5'
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/80 border border-slate-800 rounded-2xl ${padding} backdrop-blur-sm transition-all duration-200 ${
        hoverable ? 'hover:border-slate-700 hover:bg-slate-900/95 cursor-pointer shadow-lg hover:shadow-emerald-950/20' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
