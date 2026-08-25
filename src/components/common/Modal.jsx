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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Container adaptativo: En móvil tipo bottom-sheet, en tablet/desktop centrado */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        <div 
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-700/80 p-6 text-left shadow-2xl transition-all animate-slide-up max-h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
            <div>
              {title && (
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body with independent scroll */}
          <div className="mt-4 overflow-y-auto flex-1 pr-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
