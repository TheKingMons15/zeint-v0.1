import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Search, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  LogOut, 
  ShieldCheck, 
  Crown,
  Receipt,
  FileText,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../common/Button';
import { isAuthorizedBillingUser } from '../../utils/constants';

export const Navbar = ({ onOpenMovementModal, onOpenProductModal }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useInventory();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';
  const isBillingUser = isAuthorizedBillingUser(user);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 apple-glass border-b border-white/10 px-4 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-0.5 shadow-apple-md shadow-emerald-950/60 transition-transform duration-200 group-hover:scale-105 active:scale-95 flex items-center justify-center">
            <div className="w-full h-full bg-[#090b10] rounded-[14px] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              Zénit Cocina & Bar
              <span className="hidden sm:inline-block px-2 py-0.2 text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                Pro
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
              Desarrollado por <span className="text-slate-300 font-semibold">Wladimir Almeida</span>
            </p>
          </div>
        </div>

        {/* Spotlight-Style Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-emerald-400" />
            <input
              type="text"
              placeholder="Buscar insumos, productos o recetas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-900/80 border border-white/10 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all duration-150 shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all"
                title="Limpiar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Movement Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              size="xs"
              variant="success"
              onClick={() => onOpenMovementModal && onOpenMovementModal('ENTRY')}
              icon={ArrowDownLeft}
              className="text-xs px-3 py-1.5"
            >
              + Entrada
            </Button>
            <Button
              size="xs"
              variant="danger"
              onClick={() => onOpenMovementModal && onOpenMovementModal('EXIT')}
              icon={ArrowUpRight}
              className="text-xs px-3 py-1.5"
            >
              - Salida
            </Button>
          </div>

          {/* Botón Consola Director */}
          {isSuperAdmin && (
            <button
              onClick={() => navigate('/super-admin')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/25 transition-all active:scale-95 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Consola Director</span>
            </button>
          )}

          {/* Botón Historial Facturas */}
          {isBillingUser && (
            <button
              onClick={() => navigate('/historico-facturas')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold hover:bg-purple-500/25 transition-all active:scale-95 shadow-sm"
              title="Historial de Facturas y Movimientos Anteriores"
            >
              <Receipt className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Historial Facturas</span>
            </button>
          )}

          {/* Apple Style User Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-white/10 text-slate-300 transition-all border border-white/10 active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/15 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase shadow-inner">
                {isSuperAdmin ? <Crown className="w-4 h-4 text-amber-400" /> : (user?.displayName ? user.displayName.charAt(0) : 'U')}
              </div>
              <div className="text-left hidden lg:block pr-1">
                <p className="text-xs font-bold text-slate-100 leading-tight">
                  {user?.displayName || 'Usuario'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {isSuperAdmin ? 'Director General' : (user?.role || 'Operador')}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block mr-1" />
            </button>

            {/* Apple Context Menu Popover */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 apple-glass-sheet rounded-3xl shadow-apple-lg py-2.5 z-50 animate-apple-fade border border-white/15">
                <div className="px-4 py-2.5 border-b border-white/10">
                  <p className="text-xs font-bold text-white tracking-tight">{user?.displayName || 'Usuario'}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'usuario@zenit.com'}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[9px] font-black uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                    {isSuperAdmin ? '👑 Director General' : `Rol: ${user?.role || 'operador'}`}
                  </span>
                </div>

                <div className="p-1.5 space-y-1">
                  {isBillingUser && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/historico-facturas');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-purple-300 hover:bg-purple-500/15 rounded-2xl transition-colors font-bold text-left border border-purple-500/20"
                    >
                      <Receipt className="w-4 h-4 text-purple-400" />
                      Historial Facturas
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/super-admin');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/15 rounded-2xl transition-colors font-bold text-left border border-amber-500/20"
                    >
                      <Crown className="w-4 h-4 text-amber-400" />
                      Consola del Director
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/auditoria');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 rounded-2xl transition-colors font-medium text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Bitácora de Auditoría
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/reportes');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 rounded-2xl transition-colors font-medium text-left"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    Reportes Diarios en PDF
                  </button>

                  <div className="border-t border-white/10 my-1" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout(user);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/15 rounded-2xl transition-colors font-bold text-left"
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
