import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit2, 
  Trash2, 
  ArrowUpDown, 
  AlertTriangle, 
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CategoryFilterBar } from '../products/CategoryFilterBar';
import { EmptyState } from '../common/EmptyState';
import { formatNumber } from '../../utils/formatters';

export const DesktopInventoryView = ({
  products = [],
  selectedCategory,
  onSelectCategory,
  categories,
  areaFilter,
  onEditProduct,
  onDeleteProduct,
  onQuickEntry,
  onQuickExit,
  onAddProduct
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      aVal = Number(aVal || 0);
      bVal = Number(bVal || 0);
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [products, sortField, sortAsc]);

  return (
    <div className="space-y-4">
      {/* Category selector slider */}
      <div className="flex items-center justify-between gap-4">
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          categories={categories}
        />
        <Button size="sm" onClick={onAddProduct} icon={Plus} className="whitespace-nowrap font-bold shrink-0">
          {areaFilter === 'BAR' ? '+ Nueva Botella' : '+ Nuevo Insumo'}
        </Button>
      </div>

      {/* Administrative Data Table */}
      {sortedProducts.length === 0 ? (
        <EmptyState
          title="No hay productos disponibles"
          description="Selecciona otra categoría o agrega un nuevo producto."
          actionLabel="+ Crear Producto"
          onAction={onAddProduct}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold">
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Producto</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </th>
                
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 select-none"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Categoría</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </th>

                <th className="py-3.5 px-4 text-center">Unidad</th>

                <th 
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-200 select-none"
                  onClick={() => handleSort('initialStock')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Stock Inicial</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </th>

                <th 
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-200 select-none"
                  onClick={() => handleSort('minStock')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Stock Mínimo</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </th>

                <th 
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-200 select-none"
                  onClick={() => handleSort('currentStock')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Stock Actual</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </th>

                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-center">Movimiento Rápido</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800/60">
              {sortedProducts.map((p) => {
                const current = Number(p.currentStock || 0);
                const min = Number(p.minStock || 0);
                const isLowStock = current <= min;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Producto */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-100">{p.name}</div>
                      {p.notes && <div className="text-[11px] text-slate-500 truncate max-w-xs">{p.notes}</div>}
                    </td>

                    {/* Categoría */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge category={p.category} dot size="sm" />
                    </td>

                    {/* Unidad */}
                    <td className="py-3.5 px-4 text-center text-slate-300 whitespace-nowrap font-medium">
                      {p.unit}
                    </td>

                    {/* Stock Inicial */}
                    <td className="py-3.5 px-4 text-right text-slate-400 whitespace-nowrap">
                      {formatNumber(p.initialStock)}
                    </td>

                    {/* Stock Mínimo */}
                    <td className="py-3.5 px-4 text-right text-slate-400 whitespace-nowrap">
                      {formatNumber(p.minStock)}
                    </td>

                    {/* Stock Actual */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`font-extrabold text-sm ${
                        isLowStock ? 'text-rose-400' : 'text-slate-100'
                      }`}>
                        {formatNumber(current)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3 animate-pulse" />
                          Bajo Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Óptimo
                        </span>
                      )}
                    </td>

                    {/* Movimiento Rápido */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onQuickEntry(p)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1"
                          title="Registrar Entrada"
                        >
                          <ArrowDownLeft className="w-3 h-3" />
                          Entrada
                        </button>
                        <button
                          onClick={() => onQuickExit(p)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1"
                          title="Registrar Salida"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          Salida
                        </button>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
