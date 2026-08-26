import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  Plus, 
  FileText, 
  Clock, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Boxes,
  ShieldCheck,
  Crown,
  LogIn,
  Edit3,
  Trash2
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import { auditService } from '../services/auditService';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatNumber, formatTime, formatDate, formatDateTime } from '../utils/formatters';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    products, 
    todayMovements, 
    lowStockProducts, 
    stats, 
    loading 
  } = useInventory();

  const { handleOpenMovementModal, setProductModalOpen } = useOutletContext();
  const [recentLogs, setRecentLogs] = useState([]);

  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';

  useEffect(() => {
    const unsub = auditService.subscribe(user?.companyId || 'default_company', (logs) => {
      setRecentLogs(logs.slice(0, 6));
    });
    return () => unsub();
  }, [user]);

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando panel de control..." />;
  }

  const getLogBadge = (type) => {
    switch (type) {
      case 'LOGIN':
        return { label: 'Ingreso al Sistema', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'ENTRY_MOVEMENT':
        return { label: 'Entrada Alimento', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'EXIT_MOVEMENT':
        return { label: 'Salida Alimento', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'CREATE_PRODUCT':
        return { label: 'Producto Creado', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'UPDATE_PRODUCT':
        return { label: 'Stock Editado', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { label: type, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      
      {/* Banner de Bienvenida y Atajos Rápidos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Panel de Control
            </h2>
            {isSuperAdmin ? (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> Director
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                En Línea
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hola, <span className="text-slate-200 font-bold">{user?.displayName || 'Usuario'}</span>. Control diario de existencias y movimientos.
          </p>
        </div>

        {/* Botones de Acción Inmediata */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="success"
            icon={ArrowDownLeft}
            onClick={() => handleOpenMovementModal('ENTRY')}
          >
            + Entrada
          </Button>

          <Button
            size="sm"
            variant="danger"
            icon={ArrowUpRight}
            onClick={() => handleOpenMovementModal('EXIT')}
          >
            - Salida
          </Button>

          {isSuperAdmin && (
            <Button
              size="sm"
              variant="outline"
              icon={Crown}
              onClick={() => navigate('/super-admin')}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
            >
              Consola Director
            </Button>
          )}
        </div>
      </div>

      {/* Grid de KPIs Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          subtitle="En catálogo activo"
          icon={Package}
          color="slate"
          onClick={() => navigate('/inventario')}
        />

        <StatCard
          title="Ingresos del Día"
          value={`+${formatNumber(stats.todayEntriesQty)}`}
          subtitle={`${stats.todayEntriesCount} movimiento(s)`}
          icon={ArrowDownLeft}
          color="emerald"
          trend="+ Entrada"
          onClick={() => navigate('/movimientos')}
        />

        <StatCard
          title="Salidas del Día"
          value={`-${formatNumber(stats.todayExitsQty)}`}
          subtitle={`${stats.todayExitsCount} movimiento(s)`}
          icon={ArrowUpRight}
          color="rose"
          trend="- Salida"
          onClick={() => navigate('/movimientos')}
        />

        <StatCard
          title="Stock Mínimo"
          value={stats.criticalCount}
          subtitle="Productos a reponer"
          icon={AlertTriangle}
          color={stats.criticalCount > 0 ? "rose" : "slate"}
          onClick={() => navigate('/inventario')}
        />
      </div>

      {/* SECCIÓN DE AUDITORÍA Y MONITOREO DEL PERSONAL (QUIÉN ENTRÓ, A QUÉ HORA Y QUÉ HIZO) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Monitoreo del Personal y Bitácora de Accesos
              </h3>
              <p className="text-xs text-slate-400">
                Rastreo en tiempo real de quién ingresó al sistema y qué cambios realizó
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/auditoria')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              Ver Auditoría Completa
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => navigate('/super-admin')}
                className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500/20 transition-all"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Consola Director
              </button>
            )}
          </div>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            Aún no hay registros de accesos o movimientos recientes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentLogs.map((log) => {
              const badge = getLogBadge(log.actionType);
              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-slate-200 block">
                        {log.userName || 'Usuario'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.userEmail}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Detalles del cambio */}
                  <div className="text-[11px] text-slate-300 font-medium">
                    {log.details?.product && (
                      <span className="text-emerald-400 font-bold mr-1">
                        {log.details.product}
                      </span>
                    )}
                    {log.details?.quantity && (
                      <span className="text-slate-100 font-bold mr-1">
                        ({log.details.quantity})
                      </span>
                    )}
                    {log.details?.message && (
                      <span>{log.details.message}</span>
                    )}
                    {log.details?.reason && (
                      <span className="text-slate-400 block text-[10px]">
                        Motivo: {log.details.reason}
                      </span>
                    )}
                  </div>

                  {/* Hora exacta */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{formatDate(log.timestamp || log.createdAt)}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(log.timestamp || log.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Principal: Movimientos del Día y Accesos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Movimientos Recientes */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Movimientos del Día ({todayMovements.length})
            </h3>
            <button
              onClick={() => navigate('/movimientos')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Ver todos los movimientos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayMovements.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              Aún no se han registrado movimientos el día de hoy.
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayMovements.slice(0, 5).map((mov) => {
                const isEntry = mov.type === 'ENTRY';
                return (
                  <div
                    key={mov.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isEntry ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {isEntry ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-100">{mov.productName}</span>
                          <Badge category={mov.category} size="sm" />
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {mov.reason || (isEntry ? 'Ingreso' : 'Salida')} • {formatTime(mov.createdAt)} • {mov.userName || 'Usuario'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-black text-xs sm:text-sm ${
                        isEntry ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isEntry ? '+' : '-'}{formatNumber(mov.quantity)} {mov.unit}
                      </span>
                      <div className="text-[10px] text-slate-500">
                        {formatNumber(mov.previousStock)} → {formatNumber(mov.newStock)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tarjeta Lateral: Reporte Diario y Atajos Rápidos */}
        <div className="space-y-4">
          
          {/* Card Generador de Reporte PDF */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/30">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-emerald-300">Reporte Diario en PDF</h4>
            <p className="text-xs text-slate-400 mt-1">
              Genera el balance completo del día con desglose de entradas, salidas e inventario final listo para imprimir o enviar.
            </p>
            <Button
              size="sm"
              variant="primary"
              fullWidth
              onClick={() => navigate('/reportes')}
              className="mt-4 text-xs"
              icon={FileText}
            >
              Generar Reporte del Día
            </Button>
          </div>

          {/* Card Acceso Auditoría */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Bitácora de Auditoría Zenit
            </p>
            <p className="text-[11px] leading-relaxed">
              Cada acción realizada por Karen, Wladimir o Hernán queda guardada con fecha, hora exacta y usuario responsable.
            </p>
            <button
              onClick={() => navigate('/auditoria')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold block pt-1"
            >
              Abrir registro completo ➔
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
