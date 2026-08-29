import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Scale, 
  Printer, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Users, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Eye, 
  CheckCircle2, 
  ChefHat, 
  Wine, 
  FileText, 
  Download, 
  Layers,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { isAuthorizedBillingUser, ALL_RESTAURANT_TABLES } from '../utils/constants';
import { getTodayDateString, formatTime, formatDate, formatDateTime, formatNumber } from '../utils/formatters';
import { InvoiceDetailModal } from '../components/orders/InvoiceDetailModal';
import { TableCheckoutModal } from '../components/orders/TableCheckoutModal';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const InvoiceHistoryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { products = [], movements = [], loading: inventoryLoading } = useInventory() || {};
  const { showToast } = useToast();

  const isAuthorized = isAuthorizedBillingUser(user);

  // Estados de Filtros de Fecha
  const [dateMode, setDateMode] = useState('single'); // 'single' | 'range' | 'all'
  const [selectedSingleDate, setSelectedSingleDate] = useState(getTodayDateString());
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());

  // Filtros Secundarios
  const [search, setSearch] = useState('');
  const [tableFilter, setTableFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'tables' | 'movements'

  // Estados de Órdenes
  const [orders, setOrders] = useState([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedInvoiceTable, setSelectedInvoiceTable] = useState(null);

  const companyId = user?.companyId || 'default_company';

  React.useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (liveOrders) => {
      setOrders(liveOrders || []);
    });
    return () => unsub();
  }, [companyId]);

  // Accesos rápidos de fecha
  const setQuickDate = (type) => {
    const today = new Date();
    const todayStr = getTodayDateString();

    if (type === 'today') {
      setDateMode('single');
      setSelectedSingleDate(todayStr);
    } else if (type === 'yesterday') {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      const yestStr = yest.toISOString().split('T')[0];
      setDateMode('single');
      setSelectedSingleDate(yestStr);
    } else if (type === 'last7') {
      const past7 = new Date(today);
      past7.setDate(past7.getDate() - 7);
      setDateMode('range');
      setStartDate(past7.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (type === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setDateMode('range');
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (type === 'all') {
      setDateMode('all');
    }
  };

  // Filtrar órdenes según fechas seleccionadas
  const filteredOrdersByDate = useMemo(() => {
    return orders.filter(order => {
      if (order.status === ORDER_STATUS.CANCELLED) return false;

      let orderDateStr = '';
      if (order.createdAt?.toDate) {
        orderDateStr = order.createdAt.toDate().toISOString().split('T')[0];
      } else if (typeof order.createdAt === 'string') {
        orderDateStr = order.createdAt.split('T')[0];
      } else if (order.date) {
        orderDateStr = order.date;
      }

      if (!orderDateStr) return true;

      if (dateMode === 'single') {
        return orderDateStr === selectedSingleDate;
      } else if (dateMode === 'range') {
        return orderDateStr >= startDate && orderDateStr <= endDate;
      } else if (dateMode === 'all') {
        return true;
      }
      return true;
    });
  }, [orders, dateMode, selectedSingleDate, startDate, endDate]);

  // Filtrado final de órdenes con buscador y filtros de mesa / método
  const finalFilteredOrders = useMemo(() => {
    return filteredOrdersByDate.filter(order => {
      if (tableFilter !== 'ALL' && order.table !== tableFilter) return false;
      
      const method = order.paymentDetails?.paymentMethod || 'EFECTIVO';
      if (paymentFilter !== 'ALL' && method !== paymentFilter) return false;

      const q = search.toLowerCase().trim();
      if (!q) return true;

      const matchTable = order.table?.toLowerCase().includes(q);
      const matchWaiter = order.waiterName?.toLowerCase().includes(q);
      const matchId = order.id?.toLowerCase().includes(q);
      const matchDish = order.items?.some(i => i.name?.toLowerCase().includes(q));

      return matchTable || matchWaiter || matchId || matchDish;
    });
  }, [filteredOrdersByDate, tableFilter, paymentFilter, search]);

  // Métricas financieras calculadas para el período seleccionado
  const periodMetrics = useMemo(() => {
    let totalFacturado = 0;
    let kitchenRevenue = 0;
    let barRevenue = 0;
    let totalCostoInsumos = 0;

    filteredOrdersByDate.forEach(order => {
      const orderTotal = Number(order.total || 0);
      totalFacturado += orderTotal;

      (order.items || []).forEach(item => {
        if (!item.cancelled) {
          const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
          if (item.destination === 'BAR') {
            barRevenue += itemTotal;
          } else {
            kitchenRevenue += itemTotal;
          }

          if (products && products.length > 0) {
            const costData = orderService.calculateItemCost(item, products);
            totalCostoInsumos += costData.totalCost;
          }
        }
      });
    });

    const margenBruto = Number((totalFacturado - totalCostoInsumos).toFixed(2));
    const margenPercent = totalFacturado > 0 ? Number(((margenBruto / totalFacturado) * 100).toFixed(1)) : 0;
    const avgTicket = filteredOrdersByDate.length > 0 ? totalFacturado / filteredOrdersByDate.length : 0;

    return {
      totalFacturado: Number(totalFacturado.toFixed(2)),
      kitchenRevenue: Number(kitchenRevenue.toFixed(2)),
      barRevenue: Number(barRevenue.toFixed(2)),
      totalCostoInsumos: Number(totalCostoInsumos.toFixed(2)),
      margenBruto,
      margenPercent,
      avgTicket: Number(avgTicket.toFixed(2)),
      totalOrders: filteredOrdersByDate.length,
      distinctTables: Array.from(new Set(filteredOrdersByDate.map(o => o.table))).length
    };
  }, [filteredOrdersByDate, products]);

  // Consolidado por mesa en el período seleccionado
  const tableSummaryList = useMemo(() => {
    const map = {};

    filteredOrdersByDate.forEach(order => {
      const tbl = order.table || 'Sin Mesa';
      if (!map[tbl]) {
        map[tbl] = {
          tableName: tbl,
          orders: [],
          totalConsumo: 0,
          costoInsumos: 0,
          waiters: new Set(),
          itemsMap: {}
        };
      }

      map[tbl].orders.push(order);
      map[tbl].totalConsumo += Number(order.total || 0);
      if (order.waiterName) map[tbl].waiters.add(order.waiterName);

      (order.items || []).forEach(item => {
        if (!item.cancelled) {
          if (!map[tbl].itemsMap[item.name]) {
            map[tbl].itemsMap[item.name] = { name: item.name, quantity: 0, price: item.price };
          }
          map[tbl].itemsMap[item.name].quantity += Number(item.quantity || 1);

          if (products && products.length > 0) {
            const costData = orderService.calculateItemCost(item, products);
            map[tbl].costoInsumos += costData.totalCost;
          }
        }
      });
    });

    return Object.values(map).map(t => {
      const margenBruto = Number((t.totalConsumo - t.costoInsumos).toFixed(2));
      const margenPercent = t.totalConsumo > 0 ? Number(((margenBruto / t.totalConsumo) * 100).toFixed(1)) : 0;
      return {
        ...t,
        waiters: Array.from(t.waiters),
        itemsConsolidated: Object.values(t.itemsMap),
        margenBruto,
        margenPercent
      };
    }).sort((a, b) => b.totalConsumo - a.totalConsumo);
  }, [filteredOrdersByDate, products]);

  // Movimientos de inventario filtrados por fecha
  const filteredMovements = useMemo(() => {
    return (movements || []).filter(m => {
      let movDate = m.date;
      if (!movDate && m.createdAt) {
        movDate = typeof m.createdAt === 'string' ? m.createdAt.split('T')[0] : '';
      }
      if (!movDate) return true;

      if (dateMode === 'single') return movDate === selectedSingleDate;
      if (dateMode === 'range') return movDate >= startDate && movDate <= endDate;
      return true;
    });
  }, [movements, dateMode, selectedSingleDate, startDate, endDate]);

  // Impresión del Reporte del Período
  const handlePrintPeriodReport = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Por favor habilita las ventanas emergentes para imprimir.');
      return;
    }

    const titleDate = dateMode === 'single' 
      ? `Fecha: ${selectedSingleDate}` 
      : dateMode === 'range' 
      ? `Período: ${startDate} al ${endDate}` 
      : 'Historial Completo';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte Financiero de Facturación - ${titleDate}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; font-size: 12px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
            .title { font-size: 18px; font-weight: bold; }
            .subtitle { font-size: 12px; color: #555; }
            .metrics-grid { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f4f4f4; padding: 10px; border-radius: 6px; }
            .metric-box { text-align: center; }
            .metric-val { font-size: 16px; font-weight: bold; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; font-size: 11px; }
            th { background: #eee; font-weight: bold; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">RESTAURANTE ZÉNIT</div>
            <div class="subtitle">Reporte Oficial de Facturación y Costos de Insumos</div>
            <div class="subtitle"><strong>${titleDate}</strong> • Generado por: ${user?.displayName || 'Administración Zénit'}</div>
          </div>

          <div class="metrics-grid">
            <div class="metric-box">
              <div>Total Facturado</div>
              <div class="metric-val">$${periodMetrics.totalFacturado.toFixed(2)}</div>
            </div>
            <div class="metric-box">
              <div>Costo Insumos</div>
              <div class="metric-val">$${periodMetrics.totalCostoInsumos.toFixed(2)}</div>
            </div>
            <div class="metric-box">
              <div>Ganancia Bruta</div>
              <div class="metric-val">+$${periodMetrics.margenBruto.toFixed(2)} (${periodMetrics.margenPercent}%)</div>
            </div>
            <div class="metric-box">
              <div>Comandas</div>
              <div class="metric-val">${periodMetrics.totalOrders}</div>
            </div>
          </div>

          <h3>Detalle de Comandas y Facturas Emitidas</h3>
          <table>
            <thead>
              <tr>
                <th>N° Control</th>
                <th>Fecha / Hora</th>
                <th>Mesa</th>
                <th>Mesero</th>
                <th>Método</th>
                <th class="text-right">Total ($)</th>
                <th class="text-right">Costo Insumos ($)</th>
                <th class="text-right">Ganancia ($)</th>
              </tr>
            </thead>
            <tbody>
              ${finalFilteredOrders.map(o => {
                const orderCost = products ? orderService.calculateOrderCost(o, products) : null;
                const totalCostVal = Number(orderCost?.totalCost || 0);
                const marginVal = Number(orderCost?.margin ?? orderCost?.marginDollars ?? 0);
                return `
                  <tr>
                    <td>#CMD-${(o.id || '').substring(0, 7)}</td>
                    <td>${formatDateTime(o.createdAt)}</td>
                    <td><strong>${o.table}</strong></td>
                    <td>${o.waiterName || 'Mesero'}</td>
                    <td>${o.paymentDetails?.paymentMethod || 'EFECTIVO'}</td>
                    <td class="text-right bold">$${Number(o.total || 0).toFixed(2)}</td>
                    <td class="text-right">$${totalCostVal.toFixed(2)}</td>
                    <td class="text-right bold">+$${marginVal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (authLoading) {
    return <LoadingSpinner fullPage label="Cargando historial de facturación..." />;
  }

  // Bloqueo estricto para usuarios no autorizados
  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 rounded-3xl bg-slate-900/80 border border-rose-500/30 animate-fade-in mt-12">
        <div className="p-4 rounded-full bg-rose-500/20 text-rose-400 w-16 h-16 mx-auto flex items-center justify-center border border-rose-500/40">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-white">Módulo Exclusivo y Confidencial</h3>
        <p className="text-xs text-slate-400">
          El histórico de facturas, balances de costos y auditoría de recaudación está reservado exclusivamente para la administración.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-20">
      
      {/* HEADER DE PÁGINA */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Receipt className="w-6 h-6 text-purple-400" />
              Historial de Facturas & Movimientos
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full">
              ADMINISTRACIÓN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registro consolidado de comandas, facturas emitidas, métodos de pago y costos de cualquier día anterior
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            icon={Printer}
            onClick={handlePrintPeriodReport}
            className="text-xs py-2 px-3 font-bold border-purple-500/40 text-purple-300 hover:bg-purple-950/60"
          >
            Imprimir Reporte Financiero
          </Button>
        </div>
      </div>

      {/* PANEL DE CONTROL DE FECHAS & FILTROS RÁPIDOS */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          
          {/* Botones de Selección Rápida */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1">Rápido:</span>
            <button
              onClick={() => setQuickDate('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateMode === 'single' && selectedSingleDate === getTodayDateString()
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setQuickDate('yesterday')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            >
              Ayer
            </button>
            <button
              onClick={() => setQuickDate('last7')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            >
              Últimos 7 días
            </button>
            <button
              onClick={() => setQuickDate('thisMonth')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            >
              Este Mes
            </button>
            <button
              onClick={() => setQuickDate('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateMode === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Todo el Historial
            </button>
          </div>

          {/* Selectores de Fecha Personalizados */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setDateMode('single')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  dateMode === 'single' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Día Único
              </button>
              <button
                onClick={() => setDateMode('range')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  dateMode === 'range' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rango (Desde - Hasta)
              </button>
            </div>

            {dateMode === 'single' && (
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-purple-500/40 text-xs">
                <Calendar className="w-4 h-4 text-purple-400" />
                <input
                  type="date"
                  value={selectedSingleDate}
                  onChange={(e) => setSelectedSingleDate(e.target.value)}
                  className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
                />
              </div>
            )}

            {dateMode === 'range' && (
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-purple-500/40 text-xs">
                <Calendar className="w-4 h-4 text-purple-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
                />
                <span className="text-slate-500 font-bold">➔</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
                />
              </div>
            )}
          </div>

        </div>

        {/* Buscador y Filtros Secundarios */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por mesa, mesero, plato, ID (#CMD)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">Todas las Mesas (1 al 21, Barras, Terrazas)</option>
              {ALL_RESTAURANT_TABLES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">Todos los Métodos de Pago</option>
              <option value="EFECTIVO">💵 Solo Efectivo</option>
              <option value="TARJETA_DEBITO">💳 Tarjeta Débito</option>
              <option value="TARJETA_CREDITO">💳 Tarjeta Crédito</option>
              <option value="TRANSFERENCIA">📱 Transferencia / DeUna</option>
              <option value="MIXTO">🔀 Pago Mixto</option>
            </select>
          </div>
        </div>

      </div>

      {/* KPIS FINANCIEROS DEL PERÍODO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Facturado"
          value={`$${periodMetrics.totalFacturado.toFixed(2)}`}
          subtitle={`${periodMetrics.totalOrders} comandas emitidas`}
          icon={DollarSign}
          color="emerald"
        />

        <StatCard
          title="Costo de Insumos"
          value={`$${periodMetrics.totalCostoInsumos.toFixed(2)}`}
          subtitle="Materia prima consumida"
          icon={Scale}
          color="purple"
        />

        <StatCard
          title="Ganancia Bruta Real"
          value={`+$${periodMetrics.margenBruto.toFixed(2)}`}
          subtitle={`Margen: ${periodMetrics.margenPercent}%`}
          icon={TrendingUp}
          color="teal"
        />

        <StatCard
          title="Ticket Promedio"
          value={`$${periodMetrics.avgTicket.toFixed(2)}`}
          subtitle={`${periodMetrics.distinctTables} mesas atendidas`}
          icon={Receipt}
          color="sky"
        />
      </div>

      {/* NAVEGACIÓN DE PESTAÑAS (Apple Segmented Control) */}
      <div>
        <SegmentedControl
          options={[
            { value: 'invoices', label: 'Comandas y Facturas', icon: Receipt, count: finalFilteredOrders.length },
            { value: 'tables', label: 'Consolidado por Mesa', icon: Users, count: tableSummaryList.length },
            { value: 'movements', label: 'Movimientos Inventario', icon: Layers, count: filteredMovements.length }
          ]}
          value={activeTab}
          onChange={setActiveTab}
          size="md"
        />
      </div>

      {/* ============================================================ */}
      {/* VISTA 1: TABLA DE FACTURAS Y COMANDAS EMITIDAS                */}
      {/* ============================================================ */}
      {activeTab === 'invoices' && (
        <div className="p-6 sm:p-7 rounded-3xl apple-glass-sheet border border-white/15 shadow-apple-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-purple-400" />
              Registro Histórico de Comandas y Facturas
            </h3>
            <span className="text-xs text-slate-400 font-medium">{finalFilteredOrders.length} registros encontrados</span>
          </div>

          {finalFilteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No se encontraron facturas o comandas en el período seleccionado.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] font-black uppercase">
                    <th className="py-3 px-3.5">N° Control</th>
                    <th className="py-3 px-3.5">Fecha & Hora</th>
                    <th className="py-3 px-3.5">Mesa</th>
                    <th className="py-3 px-3.5">Mesero</th>
                    <th className="py-3 px-3.5">Método de Pago</th>
                    <th className="py-3 px-3.5 text-right">Facturado ($)</th>
                    <th className="py-3 px-3.5 text-right text-purple-300">Costo Insumos ($)</th>
                    <th className="py-3 px-3.5 text-right text-teal-300">Ganancia ($)</th>
                    <th className="py-3 px-3.5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {finalFilteredOrders.map((order) => {
                    const orderCost = products ? orderService.calculateOrderCost(order, products) : null;
                    const totalCostVal = Number(orderCost?.totalCost || 0);
                    const marginVal = Number(orderCost?.margin ?? orderCost?.marginDollars ?? 0);
                    const marginPercentVal = Number(orderCost?.marginPercent || 0);
                    const method = order.paymentDetails?.paymentMethod || 'EFECTIVO';

                    return (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-300">
                          #CMD-{(order.id || '').substring(0, 7)}
                        </td>
                        <td className="py-3 px-3.5 text-slate-400 font-mono text-[11px]">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-white">
                          {order.table}
                        </td>
                        <td className="py-3 px-3.5 text-slate-300">
                          {order.waiterName || 'Mesero'}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                            {method}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-400">
                          ${Number(order.total || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono text-purple-300">
                          ${totalCostVal.toFixed(2)}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-teal-300">
                          +${marginVal.toFixed(2)} ({marginPercentVal}%)
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedInvoiceOrder(order);
                              setSelectedInvoiceTable(null);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white text-[10px] font-bold border border-purple-500/40 transition-all flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Factura</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 2: CONSOLIDADO POR MESA EN EL PERÍODO                   */}
      {/* ============================================================ */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tableSummaryList.map((table) => (
            <div
              key={table.tableName}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <h4 className="text-base font-black text-white">{table.tableName}</h4>
                    <span className="text-[11px] text-slate-400">
                      {table.orders.length} comandas en el período
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Consumido</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      ${table.totalConsumo.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Métricas de costos de la mesa */}
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Costo Insumos:</span>
                    <span className="font-mono text-purple-300 font-bold">${table.costoInsumos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ganancia Bruta:</span>
                    <span className="font-mono text-teal-300 font-bold">+${table.margenBruto.toFixed(2)} ({table.margenPercent}%)</span>
                  </div>
                </div>

                {/* Platos más pedidos en la mesa */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Platos consumidos:</span>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    {table.itemsConsolidated.map((i, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                        {i.quantity}x {i.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedInvoiceTable(table);
                    setSelectedInvoiceOrder(null);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-950 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Ver Factura Consolidada</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 3: MOVIMIENTOS DE INVENTARIO DEL PERÍODO               */}
      {/* ============================================================ */}
      {activeTab === 'movements' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Auditoría de Entradas, Salidas y Consumos
            </h3>
            <span className="text-xs text-slate-400">{filteredMovements.length} movimientos</span>
          </div>

          {filteredMovements.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No se registraron movimientos en las fechas seleccionadas.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] font-black uppercase">
                    <th className="py-3 px-3.5">Fecha</th>
                    <th className="py-3 px-3.5">Tipo</th>
                    <th className="py-3 px-3.5">Producto</th>
                    <th className="py-3 px-3.5">Cantidad</th>
                    <th className="py-3 px-3.5">Stock Resultante</th>
                    <th className="py-3 px-3.5">Motivo / Mesa</th>
                    <th className="py-3 px-3.5">Responsable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMovements.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3.5 font-mono text-[11px] text-slate-400">
                        {m.date || formatDateTime(m.createdAt)}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                          m.type === 'ENTRY' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {m.type === 'ENTRY' ? '+ Entrada' : '- Salida'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-white">{m.productName}</td>
                      <td className="py-3 px-3.5 font-mono font-bold">
                        {m.type === 'ENTRY' ? '+' : '-'}{m.quantity} {m.unit || 'kg'}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-400">
                        {m.newStock} {m.unit || 'kg'}
                      </td>
                      <td className="py-3 px-3.5 text-slate-300">{m.reason || 'Consumo en Sala'}</td>
                      <td className="py-3 px-3.5 text-slate-400">{m.userName || 'Sistema'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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

    </div>
  );
};
