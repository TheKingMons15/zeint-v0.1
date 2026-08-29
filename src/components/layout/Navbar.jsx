import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Search, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  LogOut, 
  User, 
  ShieldCheck, 
  Crown,
  Boxes,
  FileText,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../common/Button';
import { isAuthorizedBillingUser } from '../../utils/constants';

export const Navbar = ({ onOpenMovementModal, onOpenProductModal }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, stats } = useInventory();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';
  const isBillingUser = isAuthorizedBillingUser(user);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand Logo & Title (Mobile & Desktop) */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Inventario Zenit, Cocina
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                V1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Desarrollado por <span className="text-slate-300 font-semibold">Wladimir Almeida</span>
            </p>
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
          
          {/* Quick Movement Buttons */}
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

          {/* Botón Consola Director para Master */}
          {isSuperAdmin && (
            <button
              onClick={() => navigate('/super-admin')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-all shadow-md shadow-amber-950/40"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Consola Director</span>
            </button>
          )}

          {/* Botón Histórico Facturación para Karen & Wladimir */}
          {isBillingUser && (
            <button
              onClick={() => navigate('/historico-facturas')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black hover:bg-purple-600 hover:text-white transition-all shadow-md shadow-purple-950/40"
              title="Histórico de Facturación y Movimientos Anteriores"
            >
              <Receipt className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Histórico Facturas</span>
            </button>
          )}

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                {isSuperAdmin ? <Crown className="w-4 h-4 text-amber-400" /> : (user?.displayName ? user.displayName.charAt(0) : 'U')}
              </div>
              <div className="text-left hidden lg:block pr-1">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {user?.displayName || 'Usuario'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {isSuperAdmin ? 'Super Admin / Director' : (user?.role || 'Operador')}
                </p>
              </div>
            </button>

            {/* Dropdown popup */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-200">{user?.displayName || 'Usuario'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'usuario@zenit.com'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded capitalize">
                    {isSuperAdmin ? '👑 Super Admin (Director)' : `Rol: ${user?.role || 'operador'}`}
                  </span>
                </div>

                <div className="p-1 space-y-0.5">
                  {isBillingUser && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/historico-facturas');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-purple-300 hover:bg-purple-950/40 rounded-xl transition-colors font-bold text-left border border-purple-500/30 mb-1"
                    >
                      <Receipt className="w-4 h-4 text-purple-400" />
                      Histórico de Facturación
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/super-admin');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors font-bold text-left"
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl transition-colors font-medium text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Bitácora de Auditoría
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/reportes');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl transition-colors font-medium text-left"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    Reportes Diarios en PDF
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout(user);
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
