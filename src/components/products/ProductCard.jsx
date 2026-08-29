import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatNumber } from '../../utils/formatters';

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onQuickEntry,
  onQuickExit
}) => {
  const current = Number(product.currentStock || 0);
  const min = Number(product.minStock || 0);
  const isLowStock = current <= min;

  // Percentage for visual bar
  const progressPercent = min > 0 ? Math.min(100, Math.round((current / (min * 2)) * 100)) : 100;

  return (
    <div className={`relative overflow-hidden rounded-3xl transition-all duration-200 p-5 flex flex-col justify-between border ${
      isLowStock 
        ? 'apple-glass-card border-rose-500/40 shadow-apple-md' 
        : 'apple-glass-card border-white/10 hover:border-white/20 shadow-apple-sm'
    }`}>
      
      {/* Top Header: Category & Actions */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <Badge category={product.category} dot size="sm" />
          
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                title="Editar Insumo"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95"
                title="Eliminar Insumo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Name & ID */}
        <div className="mt-2.5">
          <h4 className="text-base font-extrabold text-white tracking-tight line-clamp-1">
            {product.name}
          </h4>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
            <span>ID: {product.id_producto || product.id}</span>
            {product.supplier && <span>• {product.supplier}</span>}
          </div>
        </div>

        {product.notes && (
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-medium">
            {product.notes}
          </p>
        )}
      </div>

      {/* Center: Stock Display & Progress */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold tracking-tight font-sans ${
              isLowStock ? 'text-rose-400' : 'text-white'
            }`}>
              {formatNumber(current)}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {product.unit}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Mín: {formatNumber(min)} {product.unit}
            </span>
            <span className={`text-[11px] font-bold inline-flex items-center gap-1 ${
              isLowStock ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {isLowStock ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Crítico</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Óptimo</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Apple HIG Smooth Progress Bar */}
        <div className="w-full bg-black/40 h-1.5 rounded-full mt-2.5 overflow-hidden border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isLowStock 
                ? 'bg-rose-500 shadow-apple-glow-amber' 
                : progressPercent > 60 
                ? 'bg-emerald-500 shadow-apple-glow-emerald' 
                : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
        <button
          onClick={() => onQuickEntry && onQuickEntry(product)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all duration-150 active:scale-95 shadow-sm"
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>+ Entrada</span>
        </button>

        <button
          onClick={() => onQuickExit && onQuickExit(product)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500 hover:text-white text-rose-300 border border-rose-500/30 text-xs font-bold transition-all duration-150 active:scale-95 shadow-sm"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>- Salida</span>
        </button>
      </div>

    </div>
  );
};
