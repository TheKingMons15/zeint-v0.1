import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  FileText, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Crown,
  UtensilsCrossed,
  ChefHat,
  Wine,
  Receipt,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const BottomNav = ({ onOpenMovementModal }) => {
  const { user } = useAuth();
  const [showQuickActions, setShowQuickActions] = useState(false);

  const role = (user?.role || '').toUpperCase();
  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';

  // 1. Barra inferior para Bar (Marlon)
  if (role === 'BAR') {
    return (
      <nav className="fixed bottom-3 left-4 right-4 z-40 apple-glass-sheet rounded-3xl border border-white/15 lg:hidden px-4 py-2.5 shadow-apple-lg">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <NavLink
            to="/bar"
            className="flex items-center gap-2 py-2 px-6 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-xs shadow-apple-glow-purple active:scale-95 transition-all"
          >
            <Wine className="w-4 h-4 text-purple-400" />
            <span>Pantalla KDS de Bar</span>
          </NavLink>
        </div>
      </nav>
    );
  }

  // 2. Barra inferior para Cocina & Inventario (Hernán y Diana)
  if (role === 'COCINA') {
    return (
      <>
        {/* Mobile Quick Action Overlay */}
        {showQuickActions && (
          <div 
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden animate-apple-fade"
            onClick={() => setShowQuickActions(false)}
          >
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 animate-apple-slide">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickActions(false);
                  onOpenMovementModal('ENTRY');
                }}
                className="flex flex-col items-center gap-1.5 p-3.5 rounded-3xl bg-emerald-600 text-white font-bold text-xs shadow-apple-lg active:scale-95 transition-all border border-emerald-400/40 shadow-emerald-950/80"
              >
                <div className="p-3 bg-white/20 rounded-2xl">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <span>+ ENTRADA</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickActions(false);
                  onOpenMovementModal('EXIT');
                }}
                className="flex flex-col items-center gap-1.5 p-3.5 rounded-3xl bg-rose-600 text-white font-bold text-xs shadow-apple-lg active:scale-95 transition-all border border-rose-400/40 shadow-rose-950/80"
              >
                <div className="p-3 bg-white/20 rounded-2xl">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <span>- SALIDA</span>
              </button>
            </div>
          </div>
        )}

        <nav className="fixed bottom-3 left-3 right-3 z-40 apple-glass-sheet rounded-3xl border border-white/15 lg:hidden px-2 py-1.5 shadow-apple-lg">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <NavLink
              to="/cocina"
              className={({ isActive }) =>
                `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                  isActive ? 'text-amber-400 font-bold bg-amber-500/15 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <ChefHat className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">Cocina</span>
            </NavLink>

            <NavLink
              to="/movimientos"
              className={({ isActive }) =>
                `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                  isActive ? 'text-sky-400 font-bold bg-sky-500/15 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">Stock</span>
            </NavLink>

            {/* Floating Action Button */}
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-3 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 rounded-2xl shadow-apple-glow-amber active:scale-90 transition-all border border-amber-300/40"
              aria-label="Registrar Movimiento"
            >
              <Plus className={`w-5 h-5 stroke-[2.5] transition-transform duration-200 ${showQuickActions ? 'rotate-45' : ''}`} />
            </button>

            <NavLink
              to="/inventario"
              className={({ isActive }) =>
                `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                  isActive ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Package className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">Insumos</span>
            </NavLink>

            <NavLink
              to="/recetas"
              className={({ isActive }) =>
                `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                  isActive ? 'text-indigo-400 font-bold bg-indigo-500/15 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">Recetas</span>
            </NavLink>
          </div>
        </nav>
      </>
    );
  }

  // 3. Barra inferior para Meseros (Sala)
  if (role === 'MESERO') {
    return (
      <nav className="fixed bottom-3 left-4 right-4 z-40 apple-glass-sheet rounded-3xl border border-white/15 lg:hidden px-4 py-2.5 shadow-apple-lg">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <NavLink
            to="/mesero"
            className="flex items-center gap-2 py-2 px-6 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs shadow-apple-glow-emerald active:scale-95 transition-all"
          >
            <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
            <span>Toma de Pedidos (Sala)</span>
          </NavLink>
        </div>
      </nav>
    );
  }

  // 4. Barra inferior estilo iOS Dock para Administración
  return (
    <>
      {/* Mobile Quick Action Overlay */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden animate-apple-fade"
          onClick={() => setShowQuickActions(false)}
        >
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 animate-apple-slide">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickActions(false);
                onOpenMovementModal('ENTRY');
              }}
              className="flex flex-col items-center gap-1.5 p-3.5 rounded-3xl bg-emerald-600 text-white font-bold text-xs shadow-apple-lg active:scale-95 transition-all border border-emerald-400/40 shadow-emerald-950/80"
            >
              <div className="p-3 bg-white/20 rounded-2xl">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <span>+ ENTRADA</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickActions(false);
                onOpenMovementModal('EXIT');
              }}
              className="flex flex-col items-center gap-1.5 p-3.5 rounded-3xl bg-rose-600 text-white font-bold text-xs shadow-apple-lg active:scale-95 transition-all border border-rose-400/40 shadow-rose-950/80"
            >
              <div className="p-3 bg-white/20 rounded-2xl">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <span>- SALIDA</span>
            </button>
          </div>
        </div>
      )}

      {/* iOS Floating Dock Navigation */}
      <nav className="fixed bottom-3 left-3 right-3 z-40 apple-glass-sheet rounded-3xl border border-white/15 lg:hidden px-2 py-1.5 shadow-apple-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium">Inicio</span>
          </NavLink>

          <NavLink
            to="/cocina"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive ? 'text-amber-400 font-bold bg-amber-500/15 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <ChefHat className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium">Cocina</span>
          </NavLink>

          {/* Floating Central Action Button */}
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 rounded-2xl shadow-apple-glow-emerald active:scale-90 transition-all border border-emerald-300/40"
            aria-label="Registrar Movimiento"
          >
            <Plus className={`w-5 h-5 stroke-[2.5] transition-transform duration-200 ${showQuickActions ? 'rotate-45' : ''}`} />
          </button>

          <NavLink
            to="/bar"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive ? 'text-purple-400 font-bold bg-purple-500/15 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Wine className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium">Bar</span>
          </NavLink>

          <NavLink
            to="/inventario"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Boxes className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium">Stock</span>
          </NavLink>

        </div>
      </nav>
    </>
  );
};
