import React from 'react';
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
  Boxes
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatNumber, formatTime, formatDate } from '../utils/formatters';

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

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando panel de control..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header de Bienvenida & Acciones Principales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Panel de Control Diario
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Resumen en tiempo real de entradas, salidas y existencias de alimentos
          </p>
        </div>

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

          <Button
            size="sm"
            variant="secondary"
            icon={Plus}
            onClick={() => setProductModalOpen(true)}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Grid de KPIs Principales (Total productos, Ingresos, Salidas, Bajo stock) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        
        {/* 1. Total Productos */}
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          subtitle="En catálogo activo"
          icon={Package}
          color="slate"
          onClick={() => navigate('/inventario')}
        />

        {/* 2. Ingresos del Día */}
        <StatCard
          title="Ingresos del Día"
          value={`+${formatNumber(stats.todayEntriesQty)}`}
          subtitle={`${stats.todayEntriesCount} movimiento(s)`}
          icon={ArrowDownLeft}
          color="emerald"
          trend="+ Entrada"
          onClick={() => navigate('/movimientos')}
        />

        {/* 3. Salidas del Día */}
        <StatCard
          title="Salidas del Día"
          value={`-${formatNumber(stats.todayExitsQty)}`}
          subtitle={`${stats.todayExitsCount} movimiento(s)`}
          icon={ArrowUpRight}
          color="rose"
          trend="- Salida"
          onClick={() => navigate('/movimientos')}
        />

        {/* 4. Bajo Stock */}
        <StatCard
          title="Bajo Stock Crítico"
          value={stats.criticalCount}
          subtitle={stats.criticalCount > 0 ? 'Requiere reposición' : 'Todo en orden'}
          icon={AlertTriangle}
          color={stats.criticalCount > 0 ? 'rose' : 'emerald'}
          trend={stats.criticalCount > 0 ? 'Alerta' : 'OK'}
          onClick={() => navigate('/inventario')}
        />

      </div>

      {/* Sección de Alerta de Productos con Bajo Stock */}
      {lowStockProducts.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-200">
                  Alerta: {lowStockProducts.length} Producto(s) con Stock Crítico
                </h3>
                <p className="text-xs text-rose-300/70">
                  Estos alimentos se encuentran en o por debajo de su stock mínimo de seguridad
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/inventario')}
              className="hidden sm:flex text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
            >
              Ver Todos
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/40 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge category={item.category} size="sm" />
                    <span className="font-bold text-xs text-slate-100">{item.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Actual: <span className="font-bold text-rose-400">{formatNumber(item.currentStock)} {item.unit}</span> / Mín: {formatNumber(item.minStock)} {item.unit}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleOpenMovementModal('ENTRY', item.id)}
                  className="text-[11px] py-1 px-2.5"
                >
                  + Reabastecer
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Inferior: Movimientos Recientes del Día y Accesos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Movimientos Recientes (2 Columnas en desktop) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Movimientos del Día ({todayMovements.length})
            </h3>
            <button
              onClick={() => navigate('/movimientos')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Ver historial completo
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

          {/* Card PWA / Mobile First info */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Aplicación PWA Instalable
            </p>
            <p className="text-[11px] leading-relaxed">
              Puedes instalar esta app en tu pantalla de inicio en Android, iOS o Computadora para registrar movimientos en bodega con mayor velocidad.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
