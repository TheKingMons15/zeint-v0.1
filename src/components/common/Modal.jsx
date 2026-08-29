import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Apple Dimmed Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-apple-fade"
        onClick={onClose}
      />

      {/* Container adaptativo: En móvil tipo iOS Bottom Sheet, en tablet/desktop centrado estilo Popover */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        <div 
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-t-[28px] sm:rounded-3xl apple-glass-sheet p-5 sm:p-7 text-left shadow-2xl transition-all animate-apple-slide max-h-[92vh] flex flex-col border-t sm:border border-white/15`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* iOS Sheet Drag Indicator on Mobile */}
          <div className="w-10 h-1 rounded-full bg-white/25 mx-auto mb-3 sm:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
            <div>
              {title && (
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all active:scale-95 shrink-0"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body with smooth custom scroll */}
          <div className="mt-4 overflow-y-auto flex-1 pr-1.5 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
