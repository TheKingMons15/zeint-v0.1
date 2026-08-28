import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ChefHat, 
  Wine, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Users, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';
import { orderService, ORDER_STATUS } from '../../services/orderService';
import { getTodayDateString, formatTime, formatDate } from '../../utils/formatters';

export const DailyBillingSummaryCard = ({ orders = [], onOpenCleanOrders }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [showDetails, setShowDetails] = useState(false);

  const isToday = selectedDate === getTodayDateString();

  // Calcular estadísticas de facturación exclusivamente con pedidos entregados/completados
  const billingStats = useMemo(() => {
    return orderService.calculateBillingStats(orders, selectedDate);
  }, [orders, selectedDate]);

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 relative overflow-hidden space-y-6">
      
      {/* Fondo decorativo con resplandor esmeralda */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera: Título, Selector de Fecha y Atajo 'Hoy' */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Facturación Total Diaria
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">
                Calculada únicamente con comandas reales entregadas y pagadas en mesa
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Fecha */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black shadow-md hover:bg-emerald-400 transition-all flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ver Hoy</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-slate-100 font-bold focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Facturado */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 shadow-lg relative overflow-hidden space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
              Total Facturado ({isToday ? 'Hoy' : formatDate(selectedDate)})
            </span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${billingStats.totalFacturado.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-400">
            Ingreso bruto por ventas completadas
          </p>
        </div>

        {/* Comandas Pagadas / Completadas */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Comandas Completadas
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {billingStats.completedOrdersCount} <span className="text-sm font-normal text-slate-400">pedidos</span>
          </p>
          <p className="text-[11px] text-slate-400">
            {billingStats.pendingCount > 0 ? `${billingStats.pendingCount} en proceso en sala` : 'Sin pedidos pendientes'}
          </p>
        </div>

        {/* Ticket Promedio */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Ticket Promedio
            </span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-teal-300 font-mono">
            ${billingStats.averageTicket.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-400">
            Promedio de consumo por mesa
          </p>
        </div>

      </div>

      {/* Desglose por Estaciones: Cocina vs Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-6 w-full sm:w-auto">
          {/* Cocina */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Cocina & Parrilla:</span>
              <span className="text-sm font-black text-amber-300 font-mono">
                ${billingStats.kitchenRevenue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-800 hidden sm:block" />

          {/* Bar */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Bar & Coctelería:</span>
              <span className="text-sm font-black text-purple-300 font-mono">
                ${billingStats.barRevenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Botón para abrir la limpieza de pedidos de prueba */}
        {onOpenCleanOrders && (
          <button
            onClick={onOpenCleanOrders}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span>🗑️ Limpiar / Eliminar Pedidos de Prueba</span>
          </button>
        )}

      </div>

      {/* Botón para desplegar lista detallada de pedidos del día */}
      {billingStats.completedOrdersCount > 0 && (
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-bold text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>{showDetails ? 'Ocultar desglose de comandas' : `Ver detalle de las ${billingStats.completedOrdersCount} comandas facturadas`}</span>
          </button>

          {showDetails && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-slide-down max-h-72 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 text-[10px] font-black uppercase text-slate-500 pb-2 border-b border-slate-800">
                <span>Mesa</span>
                <span className="col-span-2">Platos y Bebidas</span>
                <span>Mesero</span>
                <span className="text-right">Total ($)</span>
              </div>

              {billingStats.completedOrders.map((order, idx) => (
                <div key={order.id || idx} className="grid grid-cols-5 text-xs py-2 border-b border-slate-900 last:border-0 items-center">
                  <span className="font-bold text-white">{order.table}</span>
                  <span className="col-span-2 text-slate-300 text-[11px] truncate pr-2">
                    {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </span>
                  <span className="text-slate-400 text-[11px]">{order.waiterName || 'Sala'}</span>
                  <span className="text-right font-black text-emerald-400 font-mono">
                    ${Number(order.total || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pie con hora de actualización en vivo */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Actualización reactiva en tiempo real con Firestore</span>
        <span className="font-mono">Fecha activa: {selectedDate}</span>
      </div>

    </div>
  );
};
