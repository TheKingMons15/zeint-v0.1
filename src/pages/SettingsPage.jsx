import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Smartphone, 
  Flame, 
  Layers, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  DownloadCloud,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';
import { isDemoMode } from '../firebase/config';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState(import.meta.env.VITE_COMPANY_NAME || 'Control Diario de Inventario');
  const [phone, setPhone] = useState('+57 300 123 4567');
  const [saved, setSaved] = useState(false);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    setSaved(true);
    showToast('Configuración de la empresa guardada', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          Configuración y Preparación V2
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Ajustes generales, estado de conexión PWA/Firebase y roadmap de escalabilidad
        </p>
      </div>

      {/* 1. Datos de la Empresa / Negocio */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Datos de la Empresa</h3>
            <p className="text-xs text-slate-400">Información que aparece en los reportes PDF y tickets</p>
          </div>
        </div>

        <form onSubmit={handleSaveCompany} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Comercial</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono / WhatsApp de Contacto</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" size="sm" variant="primary">
              {saved ? '¡Guardado!' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Estado de Firebase y PWA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Firebase Box */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Flame className="w-4 h-4" />
            <span>Estado de Firebase</span>
          </div>
          <div className="pt-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isDemoMode 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              {isDemoMode ? 'Modo Demostración / Offline Activo' : 'Conectado a Firebase Cloud'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            {isDemoMode 
              ? 'Los datos se guardan en el almacenamiento local de tu navegador. Configura tus variables .env para sincronizar con la nube de Google Firebase.'
              : 'Autenticación y Firestore operando en la nube con transacciones seguras.'}
          </p>
        </div>

        {/* PWA Box */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Smartphone className="w-4 h-4" />
            <span>Aplicación Móvil PWA</span>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Service Worker & Manifest Listo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Instalable en Android (Chrome: "Agregar a la pantalla principal"), iOS (Safari: "Compartir → Añadir a pantalla de inicio") y Escritorio.
          </p>
        </div>
      </div>

      {/* 3. Base Preparada para Futuras Versiones (V2 Roadmap) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">Arquitectura Lista para Versión 2</h3>
        </div>
        <p className="text-xs text-slate-400">
          La base de datos y la estructura del código ya incorporan las propiedades y hooks necesarios para activar en cualquier momento:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp API</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Alertas automáticas de stock crítico enviadas directamente al WhatsApp del encargado o proveedor.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <Building2 className="w-4 h-4" />
              <span>Múltiples Empresas (Multi-Tenant)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Aislamiento de datos con <code>companyId</code> en cada registro para soportar sucursales y franquicias.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Roles de Usuario</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Permisos diferenciados para Administrador, Supervisor de Bodega y Operario de Cocina.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Automatizaciones y Pedidos</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Generación de órdenes de compra sugeridas cuando el stock llega al punto de reorden.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
