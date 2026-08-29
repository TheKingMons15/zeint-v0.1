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
  BookOpen,
  FileSpreadsheet,
  Receipt
} from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useAuth } from '../../hooks/useAuth';
import { FOOD_CATEGORIES, isAuthorizedBillingUser } from '../../utils/constants';

export const Sidebar = () => {
  const { stats, selectedCategory, setSelectedCategory } = useInventory();
  const { user } = useAuth();

  const role = (user?.role || '').toUpperCase();
  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';

  // 1. Delimitación Estricta: Módulo Exclusivo de Bar (Marlon)
  if (role === 'BAR') {
    return (
      <aside className="hidden lg:flex flex-col w-64 apple-glass border-r border-white/10 p-4 shrink-0 min-h-[calc(100vh-65px)]">
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-purple-400 mb-2">
            Área de Bar & Coctelería
          </p>
          <NavLink
            to="/bar"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-apple-glow-purple'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Wine className="w-4 h-4" />
              </div>
              <span>Pantalla KDS de Bar</span>
            </div>
          </NavLink>
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white font-bold tracking-tight">Zénit Bar & Coctelería</p>
          <p className="text-[10px] text-purple-400 font-medium mt-0.5">Encargado • Marlon</p>
        </div>
      </aside>
    );
  }

  // 2. Módulo de Cocina e Inventario (Hernán & Diana)
  if (role === 'COCINA') {
    return (
      <aside className="hidden lg:flex flex-col w-64 apple-glass border-r border-white/10 p-4 shrink-0 min-h-[calc(100vh-65px)]">
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 mb-2">
            Área de Cocina & Inventario
          </p>

          <NavLink
            to="/cocina"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-apple-glow-amber'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ChefHat className="w-4 h-4" />
              </div>
              <span>Pantalla Cocina KDS</span>
            </div>
          </NavLink>

          <NavLink
            to="/inventario"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-apple-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Package className="w-4 h-4" />
              </div>
              <span>Inventario de Insumos</span>
            </div>
            {stats.criticalCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                {stats.criticalCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/movimientos"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-apple-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <span>Movimientos (Stock)</span>
            </div>
          </NavLink>

          <NavLink
            to="/recetas"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-apple-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>Recetario & Fichas</span>
            </div>
          </NavLink>

          <NavLink
            to="/reporte-consumo"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-apple-glow-amber'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span>Reporte Consumo</span>
            </div>
          </NavLink>
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white font-bold tracking-tight">Zénit Cocina & Inventario</p>
          <p className="text-[10px] text-amber-400 font-medium mt-0.5">{user?.displayName || 'Equipo de Cocina'}</p>
        </div>
      </aside>
    );
  }

  // 3. Delimitación Estricta: Módulo Exclusivo de Meseros (Sala)
  if (role === 'MESERO') {
    return (
      <aside className="hidden lg:flex flex-col w-64 apple-glass border-r border-white/10 p-4 shrink-0 min-h-[calc(100vh-65px)]">
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 mb-2">
            Área de Sala & Meseros
          </p>
          <NavLink
            to="/mesero"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-apple-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span>Toma de Pedidos (Sala)</span>
            </div>
          </NavLink>
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white font-bold tracking-tight">Zénit Sala</p>
          <p className="text-[10px] text-emerald-400 font-medium mt-0.5">Turno de Sala • Meseros</p>
        </div>
      </aside>
    );
  }

  const isBillingUser = isAuthorizedBillingUser(user);

  // 4. Menú Completo para Administradores, Supervisores y Dirección
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true, color: 'emerald' },
    ...(isBillingUser ? [{ 
      to: '/historico-facturas', 
      label: 'Historial Facturas', 
      icon: Receipt,
      isSpecial: true,
      color: 'purple',
      badge: 'Exclusivo'
    }] : []),
    { to: '/mesero', label: 'Toma de Pedidos (Sala)', icon: UtensilsCrossed, color: 'emerald' },
    { to: '/cocina', label: 'Pantalla Cocina KDS', icon: ChefHat, color: 'amber' },
    { to: '/bar', label: 'Pantalla Bar KDS', icon: Wine, color: 'purple' },
    { to: '/recetas', label: 'Recetario Maestro', icon: BookOpen, color: 'indigo' },
    { to: '/reporte-consumo', label: 'Consumo por Recetas', icon: FileSpreadsheet, color: 'amber' },
    { to: '/productos', label: 'Gestión Productos', icon: Package, color: 'emerald' },
    { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight, color: 'sky' },
    { to: '/inventario', label: 'Vista Inventario', icon: Boxes, color: 'emerald' },
    { to: '/reportes', label: 'Reporte Diario PDF', icon: FileText, color: 'sky' },
    { to: '/auditoria', label: 'Auditoría y Cambios', icon: ShieldCheck, color: 'emerald' },
    { to: '/configuracion', label: 'Configuración', icon: Settings, color: 'slate' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 apple-glass border-r border-white/10 p-4 shrink-0 min-h-[calc(100vh-65px)]">
      
      {/* Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
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
                `flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-apple-glow-purple'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-apple-glow-emerald'
                    : item.isSpecial
                    ? 'text-purple-300/80 hover:text-white hover:bg-purple-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-xl ${
                  item.isSpecial ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-300'
                } border border-white/10 shadow-inner`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Categorías de Filtro Rápido */}
      <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Filtrar Categorías
          </p>
          <Layers className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
            selectedCategory === 'ALL'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>Todos los Alimentos</span>
          <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded-full text-slate-300">
            {stats.totalProducts}
          </span>
        </button>

        {FOOD_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-[0.98] ${
              selectedCategory === category
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="truncate pr-2">{category}</span>
          </button>
        ))}
      </div>

      {/* Alerta Stock Crítico */}
      {stats.criticalCount > 0 && (
        <div className="mt-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 shadow-apple-glow-amber animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="text-xs font-bold">
              {stats.criticalCount} Alimentos Bajos en Stock
            </span>
          </div>
        </div>
      )}

      {/* Acceso Director SuperAdmin */}
      {isSuperAdmin && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <NavLink
            to="/super-admin"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-apple-glow-amber'
                  : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-500/10'
              }`
            }
          >
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Crown className="w-3.5 h-3.5" />
            </div>
            <span>Consola del Director</span>
          </NavLink>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-white font-bold tracking-tight">Zénit Cocina y Bar</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Desarrollado por Wladimir Almeida</p>
      </div>

    </aside>
  );
};
