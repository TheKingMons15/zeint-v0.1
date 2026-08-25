import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  LogOut, 
  User, 
  Download, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../common/Button';

export const Navbar = ({ onOpenMovementModal, onOpenProductModal }) => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, stats } = useInventory();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand Logo & Title (Mobile & Desktop) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Boxes className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              INVENTARIO
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                V1.0 PWA
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Control Diario de Alimentos</p>
          </div>
        </div>

        {/* Search Bar (Responsive Desktop / Tablet) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos por nombre, categoría o unidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/70 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Movement Buttons (Hidden on small mobile to favor bottom bar) */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => onOpenMovementModal && onOpenMovementModal('ENTRY')}
              icon={ArrowDownLeft}
              className="text-xs bg-emerald-600/90 hover:bg-emerald-600"
            >
              + Entrada
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onOpenMovementModal && onOpenMovementModal('EXIT')}
              icon={ArrowUpRight}
              className="text-xs bg-rose-600/90 hover:bg-rose-600"
            >
              - Salida
            </Button>
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                {user?.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden lg:block pr-1">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {user?.displayName || 'Usuario'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {user?.role || 'Operador'}
                </p>
              </div>
            </button>

            {/* Dropdown popup */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-200">{user?.displayName || 'Usuario'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@inventario.com'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                    Rol: {user?.role || 'operador'}
                  </span>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
