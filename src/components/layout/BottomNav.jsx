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

  const isWaiter = user?.role === 'MESERO' || user?.role === 'mesero';
  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';

  // Barra inferior para Meseros
  if (isWaiter) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 lg:hidden px-3 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <NavLink
            to="/mesero"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-bold">Sala / Menú</span>
          </NavLink>

          <NavLink
            to="/cocina"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-amber-300 font-bold bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <ChefHat className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-bold">Cocina</span>
          </NavLink>

          <NavLink
            to="/bar"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-purple-300 font-bold bg-purple-500/10' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Wine className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-bold">Bar</span>
          </NavLink>
        </div>
      </nav>
    );
  }

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

      {/* Bottom Navigation Bar para Admin / Super Admin */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 lg:hidden px-2 py-1.5 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          {/* Dashboard */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-1.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Inicio</span>
          </NavLink>

          {/* Sala / Mesero */}
          <NavLink
            to="/mesero"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-1.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Sala</span>
          </NavLink>

          {/* Botón Central Flotante de Movimientos Rápidos */}
          <div className="relative -top-3">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl transition-transform active:scale-90 ${
                showQuickActions
                  ? 'bg-slate-700 text-slate-200 rotate-45'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              }`}
              title="Registrar Movimiento"
            >
              <Plus className="w-6 h-6 font-black" />
            </button>
          </div>

          {/* Cocina KDS */}
          <NavLink
            to="/cocina"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-1.5 rounded-xl transition-all ${
                isActive ? 'text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <ChefHat className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Cocina</span>
          </NavLink>

          {/* Bar KDS */}
          <NavLink
            to="/bar"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-1.5 rounded-xl transition-all ${
                isActive ? 'text-purple-300 font-bold' : 'text-purple-400/80 hover:text-purple-300'
              }`
            }
          >
            <Wine className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-bold">Bar</span>
          </NavLink>

        </div>
      </nav>
    </>
  );
};
