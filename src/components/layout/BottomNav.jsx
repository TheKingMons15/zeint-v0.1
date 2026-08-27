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
  Wine
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const BottomNav = ({ onOpenMovementModal }) => {
  const { user } = useAuth();
  const [showQuickActions, setShowQuickActions] = useState(false);

  const role = (user?.role || '').toUpperCase();
  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';

  // 1. Barra inferior exclusiva para Bar (Marlon)
  if (role === 'BAR') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-purple-500/30 lg:hidden px-4 py-2.5 shadow-2xl">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <NavLink
            to="/bar"
            className="flex items-center gap-2 py-2 px-6 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-xs shadow-lg shadow-purple-950/50"
          >
            <Wine className="w-5 h-5 text-purple-400" />
            <span>Pantalla KDS de Bar</span>
          </NavLink>
        </div>
      </nav>
    );
  }

  // 2. Barra inferior exclusiva para Cocina (Hernán)
  if (role === 'COCINA') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-amber-500/30 lg:hidden px-4 py-2.5 shadow-2xl">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <NavLink
            to="/cocina"
            className="flex items-center gap-2 py-2 px-6 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs shadow-lg shadow-amber-950/50"
          >
            <ChefHat className="w-5 h-5 text-amber-400" />
            <span>Pantalla KDS de Cocina</span>
          </NavLink>
        </div>
      </nav>
    );
  }

  // 3. Barra inferior exclusiva para Meseros (Sala)
  if (role === 'MESERO') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-emerald-500/30 lg:hidden px-4 py-2.5 shadow-2xl">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <NavLink
            to="/mesero"
            className="flex items-center gap-2 py-2 px-6 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-xs shadow-lg shadow-emerald-950/50"
          >
            <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
            <span>Toma de Pedidos (Sala)</span>
          </NavLink>
        </div>
      </nav>
    );
  }

  // 4. Barra inferior para Administración y Dirección
  return (
    <>
      {/* Mobile Quick Action Overlay */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setShowQuickActions(false)}
        >
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4 animate-slide-up">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickActions(false);
                onOpenMovementModal('ENTRY');
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-950/80 active:scale-95 transition-all border border-emerald-400/40"
            >
              <div className="p-3 bg-white/20 rounded-xl">
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
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-2xl shadow-rose-950/80 active:scale-95 transition-all border border-rose-400/40"
            >
              <div className="p-3 bg-white/20 rounded-xl">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <span>- SALIDA</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 lg:hidden px-3 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Inicio</span>
          </NavLink>

          <NavLink
            to="/cocina"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <ChefHat className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Cocina</span>
          </NavLink>

          {/* Floating Action Button for Quick Stock Movement */}
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="relative -top-3 p-3.5 bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 rounded-2xl shadow-xl shadow-emerald-950/60 active:scale-95 transition-all border-2 border-slate-950"
            aria-label="Registrar Movimiento"
          >
            <Plus className={`w-6 h-6 stroke-[2.5] transition-transform duration-200 ${showQuickActions ? 'rotate-45' : ''}`} />
          </button>

          <NavLink
            to="/bar"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Wine className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Bar</span>
          </NavLink>

          <NavLink
            to="/inventario"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Boxes className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Stock</span>
          </NavLink>

        </div>
      </nav>
    </>
  );
};
