import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  Boxes, 
  ShieldCheck, 
  Crown, 
  Trash2,
  Receipt
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import { auditService } from '../services/auditService';
import { orderService } from '../services/orderService';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DailyBillingSummaryCard } from '../components/admin/DailyBillingSummaryCard';
import { AdminOrdersCleanModal } from '../components/admin/AdminOrdersCleanModal';
import { formatNumber, formatTime } from '../utils/formatters';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    todayMovements, 
    lowStockProducts, 
    stats, 
    loading 
  } = useInventory();

  const { handleOpenMovementModal } = useOutletContext();
  const [recentLogs, setRecentLogs] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);

  const isSuperAdmin = user?.role === 'superadmin' || user?.isSuperAdmin || user?.email === 'master@zenit.com';
  const role = (user?.role || '').toUpperCase();
  const isAdminOrSupervisor = isSuperAdmin || role === 'ADMIN' || role === 'SUPERVISOR' || user?.email === 'karenadmin@zenit.com' || user?.email === 'wladimir@zenit.com';

  const companyId = user?.companyId || 'default_company';

  // Suscripción a bitácora de auditoría
  useEffect(() => {
    const unsub = auditService.subscribe(companyId, (logs) => {
      setRecentLogs(logs.slice(0, 6));
    });
    return () => unsub();
  }, [companyId]);

  // Suscripción a pedidos en vivo para facturación diaria
  useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (orders) => {
      setLiveOrders(orders);
    });
    return () => unsub();
  }, [companyId]);

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando panel de control..." />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-apple-fade pb-16">
      
      {/* Banner de Bienvenida y Atajos Rápidos Apple Glass */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 apple-glass-sheet p-6 rounded-3xl border border-white/10 shadow-apple-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Panel de Control
            </h2>
            {isSuperAdmin ? (
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> Director
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                {user?.role?.toUpperCase() || 'Administración'}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Hola, <span className="text-white font-bold">{user?.displayName || 'Usuario'}</span>. Control operativo, inventario y facturación de Zénit.
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

          {isAdminOrSupervisor && (
            <Button
              size="sm"
              variant="purple"
              icon={Receipt}
              onClick={() => navigate('/historico-facturas')}
            >
              Historial Facturas
            </Button>
          )}

          {isAdminOrSupervisor && (
            <Button
              size="sm"
              variant="outline"
              icon={Trash2}
              onClick={() => setIsCleanModalOpen(true)}
              className="border-rose-500/30 text-rose-300 hover:bg-rose-500/15"
            >
              Depurar
            </Button>
          )}

          {isSuperAdmin && (
            <Button
              size="sm"
              variant="outline"
              icon={ShieldCheck}
              onClick={() => navigate('/super-admin')}
            >
              Consola
            </Button>
          )}
        </div>
      </div>

      {/* 1. FACTURACIÓN TOTAL DIARIA (ADMINISTRACIÓN) */}
      {isAdminOrSupervisor && (
        <DailyBillingSummaryCard
          orders={liveOrders}
          onOpenCleanOrders={() => setIsCleanModalOpen(true)}
        />
      )}

      {/* 2. Métricas de Inventario Central estilo Apple Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <StatCard
          title="Total Alimentos"
          value={stats.totalProducts}
          icon={Package}
          color="emerald"
          subtitle="Insumos activos en catálogo"
        />

        <StatCard
          title="Entradas de Hoy"
          value={`+${formatNumber(stats.totalEntriesToday)}`}
          icon={TrendingUp}
          color="emerald"
          subtitle="Abastecimiento registrado"
        />

        <StatCard
          title="Salidas / Consumo"
          value={`-${formatNumber(stats.totalExitsToday)}`}
          icon={TrendingDown}
          color="rose"
          subtitle="Consumo del restaurante"
        />

        <StatCard
          title="Bajo Stock (Alerta)"
          value={stats.criticalCount}
          icon={AlertTriangle}
          color="amber"
          subtitle={stats.criticalCount > 0 ? "Requiere reposición" : "Nivel óptimo"}
        />
      </div>

      {/* 3. Alertas de Insumos Críticos */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-apple-glow-amber">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-medium">
              <strong className="text-white font-bold">¡Atención!</strong> Hay {lowStockProducts.length} insumo(s) por debajo del stock mínimo ({lowStockProducts.slice(0, 3).map(p => p.name).join(', ')}...).
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/inventario')}
            className="text-xs whitespace-nowrap bg-black/30"
          >
            Ver Insumos
          </Button>
        </div>
      )}

      {/* 4. Columnas: Últimos Movimientos y Reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Movimientos de Hoy */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Movimientos Recientes de Inventario
            </h3>
            <button
              onClick={() => navigate('/movimientos')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
            >
              Ver todos ({todayMovements.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayMovements.length === 0 ? (
            <div className="p-8 text-center rounded-3xl apple-glass border border-white/10 text-xs text-slate-400 font-medium">
              No hay movimientos de inventario registrados el día de hoy.
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayMovements.slice(0, 5).map((mov) => {
                const isEntry = mov.type === 'ENTRY';
                return (
                  <div
                    key={mov.id}
                    className="p-4 rounded-2xl apple-glass-card hover:border-white/20 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${
                        isEntry ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {isEntry ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white">{mov.productName}</span>
                          <Badge category={mov.category} size="sm" />
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          {mov.reason || (isEntry ? 'Ingreso' : 'Salida')} • {formatTime(mov.createdAt)} • {mov.userName || 'Usuario'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-black text-xs sm:text-sm font-sans ${
                        isEntry ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isEntry ? '+' : '-'}{formatNumber(mov.quantity)} {mov.unit}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {formatNumber(mov.previousStock)} → {formatNumber(mov.newStock)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tarjeta Lateral: Reporte Diario y Auditoría */}
        <div className="space-y-4">
          
          {/* Card Generador de Reporte PDF */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-950 border border-emerald-500/30 shadow-apple-glow-emerald">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-emerald-300 tracking-tight">Reporte Diario en PDF</h4>
            <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
              Genera el balance completo del día con desglose de entradas, salidas e inventario final listo para imprimir.
            </p>
            <Button
              size="sm"
              variant="primary"
              fullWidth
              onClick={() => navigate('/reportes')}
              className="mt-4 text-xs font-bold py-2.5"
              icon={FileText}
            >
              Generar Reporte del Día
            </Button>
          </div>

          {/* Card Acceso Auditoría */}
          <div className="p-5 rounded-3xl apple-glass border border-white/10 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-white flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Bitácora de Auditoría Zenit
            </p>
            <p className="text-[11px] leading-relaxed font-medium">
              Cada acción realizada por el personal queda guardada con fecha, hora exacta y usuario responsable.
            </p>
            <button
              onClick={() => navigate('/auditoria')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold block pt-1 transition-colors"
            >
              Abrir registro completo ➔
            </button>
          </div>

        </div>

      </div>

      {/* Modal de Depuración y Eliminación de Pedidos */}
      {isCleanModalOpen && (
        <AdminOrdersCleanModal
          isOpen={isCleanModalOpen}
          onClose={() => setIsCleanModalOpen(false)}
          orders={liveOrders}
          user={user}
        />
      )}

    </div>
  );
};
