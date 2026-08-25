import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2,
  Package
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
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900/90 border transition-all duration-200 p-4 flex flex-col justify-between ${
      isLowStock 
        ? 'border-rose-500/40 shadow-lg shadow-rose-950/20' 
        : 'border-slate-800 hover:border-slate-700 shadow-md'
    }`}>
      
      {/* Top Header: Category & Actions */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <Badge category={product.category} dot size="sm" />
          
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Editar Producto"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Eliminar Producto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Name */}
        <h4 className="text-base font-bold text-slate-100 mt-2 tracking-tight line-clamp-1">
          {product.name}
        </h4>

        {product.notes && (
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {product.notes}
          </p>
        )}
      </div>

      {/* Center: Stock Display & Progress */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold tracking-tight ${
              isLowStock ? 'text-rose-400' : 'text-slate-100'
            }`}>
              {formatNumber(current)}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {product.unit}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Mín: {formatNumber(min)} {product.unit}
            </span>
            <span className={`text-[11px] font-bold inline-flex items-center gap-1 ${
              isLowStock ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {isLowStock ? (
                <>
                  <AlertTriangle className="w-3 h-3 animate-pulse" />
                  Bajo Stock
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Óptimo
                </>
              )}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isLowStock ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Bottom: Quick Entry / Quick Exit Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
        <button
          onClick={() => onQuickEntry(product)}
          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
          + Entrada
        </button>

        <button
          onClick={() => onQuickExit(product)}
          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          - Salida
        </button>
      </div>

    </div>
  );
};
