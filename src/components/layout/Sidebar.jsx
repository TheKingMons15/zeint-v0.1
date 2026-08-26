import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Boxes, 
  FileText, 
  Settings, 
  AlertTriangle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { FOOD_CATEGORIES } from '../../utils/constants';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/productos', label: 'Gestión Productos', icon: Package },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/inventario', label: 'Vista Inventario', icon: Boxes },
  { to: '/reportes', label: 'Reporte Diario PDF', icon: FileText },
  { to: '/auditoria', label: 'Auditoría y Cambios', icon: AlertTriangle },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
];

export const Sidebar = () => {
  const { stats, selectedCategory, setSelectedCategory } = useInventory();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-65px)]">
      
      {/* Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Módulos Principales
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.to === '/inventario' && stats.criticalCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full animate-pulse">
                      {stats.criticalCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Categorías de Alimentos */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Categorías Alimentos
          </p>
          <Layers className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
            }`}
          >
            <span>Todas las categorías</span>
            {selectedCategory === 'ALL' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta de Stock Bajo en Barra Lateral */}
      {stats.criticalCount > 0 && (
        <div className="mt-auto pt-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
              <span>{stats.criticalCount} Producto(s) Crítico(s)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Hay productos que alcanzaron su nivel mínimo de stock.
            </p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-4 mt-2 border-t border-slate-800/60 text-center">
        <p className="text-[10px] text-slate-500 font-medium">Control de Inventario V1</p>
        <p className="text-[9px] text-slate-600">Alimentos • React + Firebase</p>
      </div>

    </aside>
  );
};
