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
  ShieldCheck, 
  Crown,
  UtensilsCrossed,
  ChefHat,
  Wine,
  FileSpreadsheet
} from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useAuth } from '../../hooks/useAuth';
import { FOOD_CATEGORIES } from '../../utils/constants';

export const Sidebar = () => {
  const { stats, selectedCategory, setSelectedCategory } = useInventory();
  const { user } = useAuth();

  const role = (user?.role || '').toUpperCase();
  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';

  // 1. Delimitación Estricta: Módulo Exclusivo de Bar (Marlon)
  if (role === 'BAR') {
    return (
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-65px)]">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2">
            Área de Bar & Coctelería
          </p>
          <NavLink
            to="/bar"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Wine className="w-5 h-5 text-purple-400" />
              <span>Pantalla KDS de Bar</span>
            </div>
          </NavLink>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-300 font-bold">Inventario Zenit, Bar</p>
          <p className="text-[9px] text-purple-400/90 font-medium">Encargado de Bar • Marlon</p>
        </div>
      </aside>
    );
  }

  // 2. Delimitación Estricta: Módulo Exclusivo de Cocina (Hernán)
  if (role === 'COCINA') {
    return (
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-65px)]">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">
            Área de Cocina & Parrilla
          </p>
          <NavLink
            to="/cocina"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <ChefHat className="w-5 h-5 text-amber-400" />
              <span>Pantalla KDS de Cocina</span>
            </div>
          </NavLink>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-300 font-bold">Inventario Zenit, Cocina</p>
          <p className="text-[9px] text-amber-400/90 font-medium">Operador de Cocina • Hernán</p>
        </div>
      </aside>
    );
  }

  // 3. Delimitación Estricta: Módulo Exclusivo de Meseros (Sala)
  if (role === 'MESERO') {
    return (
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-65px)]">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
            Área de Sala & Meseros
          </p>
          <NavLink
            to="/mesero"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
              <span>Toma de Pedidos (Sala)</span>
            </div>
          </NavLink>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-300 font-bold">Inventario Zenit, Sala</p>
          <p className="text-[9px] text-emerald-400/90 font-medium">Turno de Sala • Meseros</p>
        </div>
      </aside>
    );
  }

  // 4. Menú Completo para Administradores, Supervisores y Dirección
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/mesero', label: 'Toma de Pedidos (Sala)', icon: UtensilsCrossed },
    { to: '/cocina', label: 'Pantalla Cocina KDS', icon: ChefHat },
    { to: '/bar', label: 'Pantalla Bar KDS', icon: Wine },
    { to: '/reporte-consumo', label: 'Consumo por Recetas', icon: FileSpreadsheet },
    { to: '/productos', label: 'Gestión Productos', icon: Package },
    { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
    { to: '/inventario', label: 'Vista Inventario', icon: Boxes },
    { to: '/reportes', label: 'Reporte Diario PDF', icon: FileText },
    { to: '/auditoria', label: 'Auditoría y Cambios', icon: ShieldCheck },
    { to: '/configuracion', label: 'Configuración', icon: Settings },
  ];

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
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Categorías de Filtro Rápido */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-1">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Filtrar Categorías
          </p>
          <Layers className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-slate-800 text-white font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <span>Todos los Alimentos</span>
          <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400">
            {stats.totalProducts}
          </span>
        </button>

        {FOOD_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
              selectedCategory === category
                ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span className="truncate pr-2">{category}</span>
          </button>
        ))}
      </div>

      {/* Alerta Stock Crítico */}
      {stats.lowStockProducts > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold">
              {stats.lowStockProducts} Alimentos Bajos
            </span>
          </div>
        </div>
      )}

      {/* Acceso Director SuperAdmin */}
      {isSuperAdmin && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <NavLink
            to="/superadmin"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-purple-400/80 hover:text-purple-300 hover:bg-purple-950/40'
              }`
            }
          >
            <Crown className="w-4 h-4 text-purple-400" />
            <span>Módulo Director Master</span>
          </NavLink>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-slate-800/60 text-center">
        <p className="text-[11px] text-slate-300 font-bold">Inventario Zenit, Cocina y Bar</p>
        <p className="text-[9px] text-slate-500 font-medium">Desarrollado por Wladimir Almeida</p>
      </div>

    </aside>
  );
};
