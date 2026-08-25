import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText 
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatNumber, formatDate, formatTime } from '../../utils/formatters';
import { FOOD_CATEGORIES } from '../../utils/constants';

export const MovementHistoryTable = ({ movements = [], loading = false }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchType = filterType === 'ALL' || m.type === filterType;
      const matchCat = filterCategory === 'ALL' || m.category === filterCategory;
      const query = search.toLowerCase().trim();
      const matchSearch = !query || 
        (m.productName && m.productName.toLowerCase().includes(query)) ||
        (m.reason && m.reason.toLowerCase().includes(query)) ||
        (m.userName && m.userName.toLowerCase().includes(query));

      return matchType && matchCat && matchSearch;
    });
  }, [movements, filterType, filterCategory, search]);

  return (
    <div className="space-y-4">
      
      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por producto, motivo o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filtros Tipo y Categoría */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Tipo Selector */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 py-2 px-3 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Todos los tipos</option>
            <option value="ENTRY">Solo Entradas</option>
            <option value="EXIT">Solo Salidas</option>
          </select>

          {/* Categoría Selector */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 py-2 px-3 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Todas las categorías</option>
            {FOOD_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Lista / Tabla de Movimientos */}
      {filteredMovements.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          No se encontraron movimientos registrados con los filtros aplicados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-right">Cantidad</th>
                <th className="py-3 px-4 text-center">Stock (Ant. - Nuevo)</th>
                <th className="py-3 px-4">Motivo / Notas</th>
                <th className="py-3 px-4">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMovements.map((m) => {
                const isEntry = m.type === 'ENTRY';
                return (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      <div>{formatDate(m.date || m.createdAt)}</div>
                      <div className="text-[10px] text-slate-500">{formatTime(m.createdAt)}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                        isEntry 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {isEntry ? (
                          <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-rose-400" />
                        )}
                        {isEntry ? 'Entrada' : 'Salida'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-100 whitespace-nowrap">
                      {m.productName}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge category={m.category} size="sm" />
                    </td>

                    <td className={`py-3 px-4 text-right font-extrabold text-sm whitespace-nowrap ${
                      isEntry ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isEntry ? '+' : '-'}{formatNumber(m.quantity)} <span className="text-[10px] text-slate-400 font-normal">{m.unit}</span>
                    </td>

                    <td className="py-3 px-4 text-center text-slate-400 whitespace-nowrap">
                      <span className="text-slate-300">{formatNumber(m.previousStock)}</span>
                      <span className="mx-1 text-slate-600">→</span>
                      <span className="font-semibold text-slate-100">{formatNumber(m.newStock)}</span>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-300">
                      <span className="font-semibold text-slate-200">{m.reason}</span>
                      {m.notes && <span className="text-slate-400 block text-[11px] truncate">{m.notes}</span>}
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {m.userName || 'Usuario'}
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
