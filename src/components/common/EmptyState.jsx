import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No hay datos disponibles',
  description = 'Comienza registrando tu primer producto o movimiento en el inventario.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 border-dashed ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-emerald-400/80" />
      </div>
      <h4 className="text-base sm:text-lg font-bold text-slate-200">{title}</h4>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
