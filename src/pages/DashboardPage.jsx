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
  Trash2,
  DollarSign,
  UtensilsCrossed,
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
      case 'DELETE_ORDERS':
        return { label: 'Limpieza de Pedidos', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
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
                {user?.role?.toUpperCase() || 'Administración'}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hola, <span className="text-slate-200 font-bold">{user?.displayName || 'Usuario'}</span>. Control operativo, inventario y facturación de Zénit.
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
              variant="primary"
              icon={Receipt}
              onClick={() => navigate('/historico-facturas')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg shadow-purple-950/40"
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
              className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
            >
              Depurar Pedidos
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

      {/* 1. FACTURACIÓN TOTAL DIARIA (EXCLUSIVO KAREN, WLADIMIR Y ADMINISTRACIÓN) */}
      {isAdminOrSupervisor && (
        <DailyBillingSummaryCard
          orders={liveOrders}
          onOpenCleanOrders={() => setIsCleanModalOpen(true)}
        />
      )}

      {/* 2. Métricas de Inventario Central */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          value={stats.lowStockCount}
          icon={AlertTriangle}
          color="amber"
          subtitle={stats.lowStockCount > 0 ? "Requiere reposición" : "Nivel óptimo"}
          alert={stats.lowStockCount > 0}
        />
      </div>

      {/* 3. Alertas de Productos con Bajo Stock */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>¡Atención!</strong> Hay {lowStockProducts.length} insumo(s) por debajo del stock mínimo ({lowStockProducts.slice(0, 3).map(p => p.name).join(', ')}...).
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/inventario')}
            className="text-xs whitespace-nowrap"
          >
            Ver Inventario
          </Button>
        </div>
      )}

      {/* 4. Columnas: Últimos Movimientos y Reporte Diario PDF */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Movimientos de Hoy */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Movimientos Recientes de Inventario
            </h3>
            <button
              onClick={() => navigate('/movimientos')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              Ver todos ({todayMovements.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayMovements.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500">
              No hay movimientos de inventario registrados el día de hoy.
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
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/30 shadow-lg">
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
              className="mt-4 text-xs font-black"
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
              Cada acción realizada por Karen, Wladimir, Hernán o Marlon queda guardada con fecha, hora exacta y usuario responsable.
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

      {/* Modal de Depuración y Eliminación de Pedidos de Prueba */}
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
