import React, { useState, useEffect, useMemo } from 'react';
import { 
  Crown, 
  ShieldAlert, 
  Users, 
  Database, 
  Activity, 
  Download, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { auditService } from '../services/auditService';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatNumber, formatDate, formatDateTime, formatTime } from '../utils/formatters';

export const SuperAdminPage = () => {
  const { user } = useAuth();
  const { products, movements, stats } = useInventory();
  const { showToast } = useToast();

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar si es super admin
  const isSuperAdmin = user?.role === 'superadmin' || user?.email === 'master@zenit.com';

  useEffect(() => {
    const unsub = auditService.subscribe('default_company', (logs) => {
      setAuditLogs(logs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Estadísticas del personal
  const staffStats = useMemo(() => {
    const staff = [
      { name: 'Karen (Administrador)', email: 'karenadmin@zenit.com', role: 'admin' },
      { name: 'Wladimir (Supervisor)', email: 'wladimir@zenit.com', role: 'supervisor' },
      { name: 'Hernán (Operador)', email: 'hernan@zenit.com', role: 'operator' }
    ];

    return staff.map(s => {
      const userLogs = auditLogs.filter(l => l.userEmail === s.email);
      const userMovements = movements.filter(m => m.userEmail === s.email || m.userName?.includes(s.name.split(' ')[0]));
      const lastLogin = userLogs.find(l => l.actionType === 'LOGIN')?.timestamp;

      return {
        ...s,
        totalMovements: userMovements.length,
        lastLogin: lastLogin || 'Sin registro reciente',
        isActive: Boolean(lastLogin)
      };
    });
  }, [auditLogs, movements]);

  // Exportar backup completo JSON
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      company: 'Zenit Alimentos',
      totalProducts: products.length,
      totalMovements: movements.length,
      totalLogs: auditLogs.length,
      products,
      movements,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Zenit_Inventario_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup general descargado exitosamente', 'success');
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 bg-slate-900 border border-rose-500/30 rounded-3xl">
        <Lock className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-100">Acceso Restringido</h3>
        <p className="text-xs text-slate-400 mt-2">
          Este módulo está reservado exclusivamente para la cuenta de Dirección y Super Administración.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in pb-12">
      
      {/* Header Director Master */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-950/50">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Consola Maestra del Director (Super Admin)
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                MODO OCULTO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervisión global de usuarios, consistencia de inventario y auditoría completa de Zenit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportBackup}
            icon={Download}
            className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
          >
            Descargar Backup JSON
          </Button>
        </div>
      </div>

      {/* KPIs de Control Maestro */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Alimentos Online"
          value={products.length}
          subtitle="En Cloud Firestore"
          icon={Database}
          color="emerald"
        />

        <StatCard
          title="Movimientos Auditados"
          value={movements.length}
          subtitle="Entradas y salidas registradas"
          icon={Activity}
          color="sky"
        />

        <StatCard
          title="Personal Monitoreado"
          value="3 Usuarios"
          subtitle="Karen, Wladimir, Hernán"
          icon={Users}
          color="amber"
        />

        <StatCard
          title="Eventos en Bitácora"
          value={auditLogs.length}
          subtitle="Inicios de sesión y cambios"
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* 1. Monitoreo de Personal (Karen, Wladimir, Hernán) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Actividad del Personal en el Sistema</h3>
          </div>
          <span className="text-xs text-slate-400">Rastreo de última conexión</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {staffStats.map((st) => (
            <div
              key={st.email}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{st.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{st.email}</p>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                  st.role === 'admin' 
                    ? 'bg-rose-500/20 text-rose-300' 
                    : st.role === 'supervisor' 
                    ? 'bg-sky-500/20 text-sky-300' 
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {st.role}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px]">Movimientos creados:</span>
                  <span className="font-bold text-slate-200">{st.totalMovements}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px]">Último ingreso:</span>
                  <span className="font-semibold text-emerald-400 text-[10px]">
                    {st.lastLogin === 'Sin registro reciente' ? st.lastLogin : formatDateTime(st.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Bitácora de Auditoría en Vivo para el Director */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-100">Bitácora Global de Acciones y Modificaciones</h3>
          </div>
          <span className="text-xs text-slate-400">Últimos {auditLogs.length} eventos</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Fecha y Hora</th>
                <th className="py-2.5 px-4">Usuario</th>
                <th className="py-2.5 px-4">Acción</th>
                <th className="py-2.5 px-4">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 text-slate-300 font-mono whitespace-nowrap">
                    {formatDateTime(log.timestamp || log.createdAt)}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-200">{log.userName}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{log.userEmail}</span>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-300">
                    {log.details?.product && <span className="font-bold text-emerald-400 mr-2">{log.details.product}</span>}
                    {log.details?.quantity && <span className="font-semibold text-slate-100 mr-2">{log.details.quantity}</span>}
                    {log.details?.reason && <span className="text-slate-400 mr-2">• {log.details.reason}</span>}
                    {log.details?.message && <span className="text-slate-400">{log.details.message}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
