import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ChefHat, 
  Wine, 
  Receipt, 
  Users, 
  RefreshCw,
  Scale,
  UtensilsCrossed,
  Search,
  CreditCard
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { isAuthorizedBillingUser } from '../../utils/constants';
import { getTodayDateString } from '../../utils/formatters';
import { InvoiceDetailModal } from '../orders/InvoiceDetailModal';
import { TableCheckoutModal } from '../orders/TableCheckoutModal';
import { SegmentedControl } from '../common/SegmentedControl';
import { useAuth } from '../../hooks/useAuth';
import { useInventory } from '../../hooks/useInventory';

export const DailyBillingSummaryCard = ({ orders = [], onOpenCleanOrders }) => {
  const { user } = useAuth();
  const { products } = useInventory();
  
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [activeTab, setActiveTab] = useState('tables'); // 'tables' | 'overview' | 'orders'
  const [tableSearch, setTableSearch] = useState('');
  
  // Estado para el modal de factura
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedInvoiceTable, setSelectedInvoiceTable] = useState(null);
  const [checkoutTableData, setCheckoutTableData] = useState(null);

  const isToday = selectedDate === getTodayDateString();
  const isAuthorized = isAuthorizedBillingUser(user);

  // Calcular estadísticas globales de facturación y costos
  const billingStats = useMemo(() => {
    return orderService.calculateBillingStats(orders, selectedDate, products);
  }, [orders, selectedDate, products]);

  // Calcular desglose y costos individuales por cada mesa
  const tableStats = useMemo(() => {
    return orderService.calculateTableStats(orders, selectedDate, products);
  }, [orders, selectedDate, products]);

  // Mesas filtradas por buscador
  const filteredTableStats = useMemo(() => {
    if (!tableSearch.trim()) return tableStats;
    const q = tableSearch.toLowerCase().trim();
    return tableStats.filter(t => 
      t.tableName.toLowerCase().includes(q) ||
      t.waiters.some(w => w.toLowerCase().includes(q)) ||
      t.itemsConsolidated.some(i => i.name.toLowerCase().includes(q))
    );
  }, [tableStats, tableSearch]);

  // Total de mesas atendidas hoy
  const activeTablesCount = useMemo(() => {
    return tableStats.filter(t => t.ordersCount > 0).length;
  }, [tableStats]);

  if (!isAuthorized) {
    return null;
  }

  const tabOptions = [
    { value: 'tables', label: 'Costos por Mesa', icon: UtensilsCrossed, count: activeTablesCount },
    { value: 'overview', label: 'Resumen Global', icon: TrendingUp },
    { value: 'orders', label: 'Comandas Facturadas', icon: Receipt, count: billingStats.completedOrdersCount }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-3xl apple-glass-sheet border border-white/15 shadow-apple-lg relative overflow-hidden space-y-6">
      
      {/* Fondo decorativo con resplandor esmeralda */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera: Título, Selector de Fecha y Atajo 'Hoy' */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-apple-glow-emerald">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Facturación & Costos por Mesa
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Control individual de costos por mesa, comandas, margen bruto y detalle de factura
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Fecha y Atajos */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Link
            to="/historico-facturas"
            className="px-3.5 py-2 rounded-2xl bg-purple-500/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Historial Facturas</span>
          </Link>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="px-3.5 py-2 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-black shadow-apple-glow-emerald hover:bg-emerald-400 transition-all flex items-center gap-1 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ver Hoy</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-2xl border border-white/10 shadow-inner">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-slate-100 font-bold focus:outline-none cursor-pointer"
            />
          </div>

          {onOpenCleanOrders && (
            <button
              onClick={onOpenCleanOrders}
              className="px-3 py-2 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              title="Depurar pedidos de prueba"
            >
              <span>🗑️ Depurar</span>
            </button>
          )}
        </div>
      </div>

      {/* PESTAÑAS PRINCIPALES: Apple Segmented Control */}
      <div>
        <SegmentedControl
          options={tabOptions}
          value={activeTab}
          onChange={setActiveTab}
          size="md"
        />
      </div>

      {/* VISTA 1: COSTOS INDIVIDUALES Y FACTURACIÓN POR MESA */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          
          {/* Barra de búsqueda de mesas */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por mesa (ej: Mesa 1, Barra 1), mesero o plato..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-xs shadow-inner"
              />
            </div>
            
            <div className="text-xs text-slate-400 font-medium">
              Mostrando <strong className="text-white">{filteredTableStats.length}</strong> mesas con actividad
            </div>
          </div>

          {filteredTableStats.length === 0 ? (
            <div className="p-12 text-center rounded-3xl apple-glass border border-white/10 text-xs text-slate-400 font-medium">
              No se encontraron registros de consumo ni comandas para las mesas en esta fecha ({selectedDate}).
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTableStats.map((table) => {
                return (
                  <div
                    key={table.tableName}
                    className="p-5 rounded-3xl apple-glass-card hover:border-white/20 shadow-apple-md transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-3">
                      
                      {/* Cabecera de la Mesa */}
                      <div className="flex items-start justify-between border-b border-white/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                              {table.tableName}
                            </span>
                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full border ${
                              table.status === 'OCUPADA'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              {table.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            {table.ordersCount} comanda(s) • Atendido por: <strong className="text-slate-200">{table.waiters.join(', ') || 'Sala'}</strong>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xl font-extrabold text-emerald-400 font-mono block">
                            ${table.totalConsumoGeneral.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            Consumo Total
                          </span>
                        </div>
                      </div>

                      {/* Desglose de Ventas: Cocina vs Bar */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
                            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                            <span>Cocina:</span>
                          </div>
                          <span className="text-sm font-black text-amber-300 font-mono mt-0.5 block">
                            ${table.kitchenRevenue.toFixed(2)}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
                            <Wine className="w-3.5 h-3.5 text-purple-400" />
                            <span>Bar:</span>
                          </div>
                          <span className="text-sm font-black text-purple-300 font-mono mt-0.5 block">
                            ${table.barRevenue.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Análisis de Costos de Insumos y Margen */}
                      <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold uppercase text-purple-300 flex items-center gap-1">
                            <Scale className="w-3.5 h-3.5 text-purple-400" />
                            Costo Insumos:
                          </span>
                          <span className="font-mono font-bold text-purple-200">
                            ${table.costoGeneral.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold uppercase text-teal-300 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                            Margen Bruto:
                          </span>
                          <span className="font-mono font-bold text-teal-300">
                            +${(table.totalConsumoGeneral - table.costoGeneral).toFixed(2)} ({table.margenPercent}%)
                          </span>
                        </div>

                        {/* Barra de Rentabilidad */}
                        <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              table.margenPercent >= 60 ? 'bg-emerald-500' : table.margenPercent >= 45 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, table.margenPercent))}%` }}
                          />
                        </div>
                      </div>

                      {/* Lista de Platos Resumidos en la Mesa */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Platos y Bebidas consumidos:
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-1">
                          {table.itemsConsolidated.map((item, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 text-[10px] rounded-lg bg-black/40 text-slate-300 border border-white/10 font-medium"
                            >
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Botones de Acción: Ver Detalle Factura y Cobrar Mesa */}
                    <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedInvoiceTable(table);
                          setSelectedInvoiceOrder(null);
                        }}
                        className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Ver Factura</span>
                      </button>

                      <button
                        onClick={() => {
                          setCheckoutTableData(table);
                        }}
                        className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-apple-glow-emerald active:scale-95"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Cobrar Mesa</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* VISTA 2: RESUMEN GLOBAL & RENTABILIDAD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Métricas Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            {/* Total Facturado */}
            <div className="p-5 rounded-3xl apple-glass border border-emerald-500/30 shadow-apple-glow-emerald space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                  Total Facturado
                </span>
                <Receipt className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                ${billingStats.totalFacturado.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                Ventas cerradas y entregadas
              </p>
            </div>

            {/* Costo Total de Insumos */}
            <div className="p-5 rounded-3xl apple-glass border border-purple-500/30 shadow-apple-glow-purple space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-purple-400 tracking-wider">
                  Costo de Insumos
                </span>
                <Scale className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">
                ${billingStats.totalCostoInsumos.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                Materia prima consumida
              </p>
            </div>

            {/* Ganancia Bruta Real */}
            <div className="p-5 rounded-3xl apple-glass border border-teal-500/30 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-teal-400 tracking-wider">
                  Ganancia Bruta
                </span>
                <TrendingUp className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
                +${billingStats.margenBrutoTotal.toFixed(2)}
              </p>
              <p className="text-[11px] text-teal-400 font-bold">
                Margen global: {billingStats.margenPercentTotal}%
              </p>
            </div>

            {/* Ticket Promedio */}
            <div className="p-5 rounded-3xl apple-glass border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Ticket Promedio
                </span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
                ${billingStats.averageTicket.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {billingStats.completedOrdersCount} comandas finalizadas
              </p>
            </div>

          </div>

          {/* Desglose por Estaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl apple-glass-card border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Cocina & Parrilla:</span>
                  <span className="text-xl font-extrabold text-amber-300 font-mono">
                    ${billingStats.kitchenRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {billingStats.totalFacturado > 0 ? `${((billingStats.kitchenRevenue / billingStats.totalFacturado) * 100).toFixed(0)}% del total` : '0%'}
              </span>
            </div>

            <div className="p-5 rounded-3xl apple-glass-card border border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Wine className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Bar & Coctelería:</span>
                  <span className="text-xl font-extrabold text-purple-300 font-mono">
                    ${billingStats.barRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {billingStats.totalFacturado > 0 ? `${((billingStats.barRevenue / billingStats.totalFacturado) * 100).toFixed(0)}% del total` : '0%'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: LISTADO DE COMANDAS FACTURADAS */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {billingStats.completedOrdersCount === 0 ? (
            <div className="p-12 text-center rounded-3xl apple-glass border border-white/10 text-xs text-slate-400 font-medium">
              No hay comandas entregadas ni facturadas registradas en esta fecha.
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-3xl apple-glass border border-white/10 space-y-2 max-h-96 overflow-y-auto pr-1">
              <div className="grid grid-cols-6 text-[10px] font-extrabold uppercase text-slate-400 pb-2 border-b border-white/10">
                <span>Mesa</span>
                <span className="col-span-2">Platos y Bebidas</span>
                <span>Mesero</span>
                <span className="text-right">Total ($)</span>
                <span className="text-center">Factura</span>
              </div>

              {billingStats.completedOrders.map((order, idx) => (
                <div key={order.id || idx} className="grid grid-cols-6 text-xs py-3 border-b border-white/5 last:border-0 items-center hover:bg-white/5 rounded-2xl px-2 transition-colors">
                  <span className="font-bold text-white">{order.table}</span>
                  <span className="col-span-2 text-slate-300 text-[11px] truncate pr-2 font-medium">
                    {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">{order.waiterName || 'Sala'}</span>
                  <span className="text-right font-extrabold text-emerald-400 font-mono">
                    ${Number(order.total || 0).toFixed(2)}
                  </span>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setSelectedInvoiceOrder(order);
                        setSelectedInvoiceTable(null);
                      }}
                      className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-[10px] font-bold border border-emerald-500/40 transition-all active:scale-95"
                    >
                      📄 Ver Factura
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pie con hora de actualización en vivo */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10 font-medium">
        <span>Actualización reactiva en tiempo real con Firestore</span>
        <span className="font-mono text-slate-300">Fecha activa: {selectedDate}</span>
      </div>

      {/* MODAL DE DETALLE DE FACTURA / PRECUENTA */}
      {(selectedInvoiceOrder || selectedInvoiceTable) && (
        <InvoiceDetailModal
          isOpen={Boolean(selectedInvoiceOrder || selectedInvoiceTable)}
          onClose={() => {
            setSelectedInvoiceOrder(null);
            setSelectedInvoiceTable(null);
          }}
          order={selectedInvoiceOrder}
          tableData={selectedInvoiceTable}
          inventoryProducts={products}
          currentUser={user}
        />
      )}

      {/* MODAL DE COBRO Y CIERRE DE MESA */}
      {checkoutTableData && (
        <TableCheckoutModal
          isOpen={Boolean(checkoutTableData)}
          onClose={() => setCheckoutTableData(null)}
          tableName={checkoutTableData.tableName}
          orders={checkoutTableData.orders || []}
          currentUser={user}
          onTableClosed={() => setCheckoutTableData(null)}
        />
      )}

    </div>
  );
};
