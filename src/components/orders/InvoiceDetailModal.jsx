import React, { useState, useMemo, useRef } from 'react';
import { 
  Receipt, 
  Printer, 
  X, 
  UtensilsCrossed, 
  ChefHat, 
  Wine, 
  DollarSign, 
  Clock, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Percent,
  Layers,
  FileText,
  Trash2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { orderService, ORDER_STATUS } from '../../services/orderService';
import { isAuthorizedBillingUser } from '../../utils/constants';
import { formatDateTime, formatTime, formatNumber, formatDate } from '../../utils/formatters';

export const InvoiceDetailModal = ({
  isOpen,
  onClose,
  order = null,
  tableData = null,
  inventoryProducts = [],
  currentUser = null,
  onUpdateStatus = null,
  onCancelItem = null
}) => {
  const [selectedOrderTab, setSelectedOrderTab] = useState('ALL'); // 'ALL' | orderId
  const [showCostDetails, setShowCostDetails] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0); // 0% | 10%
  const printRef = useRef(null);

  const isAuthorized = isAuthorizedBillingUser(currentUser);

  // Determinar los datos a mostrar: orden individual o consolidado de mesa
  const effectiveOrders = useMemo(() => {
    if (order) return [order];
    if (tableData && tableData.orders) return tableData.orders;
    return [];
  }, [order, tableData]);

  // Filtrar según pestaña seleccionada en caso de mesa consolidada
  const displayedOrders = useMemo(() => {
    if (selectedOrderTab === 'ALL') return effectiveOrders;
    return effectiveOrders.filter(o => o.id === selectedOrderTab);
  }, [effectiveOrders, selectedOrderTab]);

  // Consolidar todos los ítems mostrados
  const consolidatedItems = useMemo(() => {
    const items = [];
    displayedOrders.forEach(ord => {
      (ord.items || []).forEach(item => {
        const costData = orderService.calculateItemCost(item, inventoryProducts);
        items.push({
          ...item,
          orderId: ord.id,
          orderTable: ord.table,
          orderStatus: ord.status,
          orderCreatedAt: ord.createdAt,
          costData
        });
      });
    });
    return items;
  }, [displayedOrders, inventoryProducts]);

  // Totales financieros y de costos
  const totals = useMemo(() => {
    let subtotalKitchen = 0;
    let subtotalBar = 0;
    let totalCostoKitchen = 0;
    let totalCostoBar = 0;
    let totalCancelledAmount = 0;

    consolidatedItems.forEach(item => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      const totalItem = price * qty;
      const costItem = Number(item.costData?.totalCost || 0);

      if (item.cancelled) {
        totalCancelledAmount += totalItem;
        return;
      }

      if (item.destination === 'BAR') {
        subtotalBar += totalItem;
        totalCostoBar += costItem;
      } else {
        subtotalKitchen += totalItem;
        totalCostoKitchen += costItem;
      }
    });

    const subtotalNeto = subtotalKitchen + subtotalBar;
    const tipAmount = tipPercentage > 0 ? (subtotalNeto * (tipPercentage / 100)) : 0;
    const totalPagar = subtotalNeto + tipAmount;

    const totalCostoInsumos = totalCostoKitchen + totalCostoBar;
    const margenBruto = subtotalNeto - totalCostoInsumos;
    const margenPercent = subtotalNeto > 0 ? ((margenBruto / subtotalNeto) * 100) : 0;

    return {
      subtotalKitchen: Number(subtotalKitchen.toFixed(2)),
      subtotalBar: Number(subtotalBar.toFixed(2)),
      subtotalNeto: Number(subtotalNeto.toFixed(2)),
      tipAmount: Number(tipAmount.toFixed(2)),
      totalPagar: Number(totalPagar.toFixed(2)),
      totalCostoKitchen: Number(totalCostoKitchen.toFixed(2)),
      totalCostoBar: Number(totalCostoBar.toFixed(2)),
      totalCostoInsumos: Number(totalCostoInsumos.toFixed(2)),
      margenBruto: Number(margenBruto.toFixed(2)),
      margenPercent: Number(margenPercent.toFixed(1)),
      totalCancelledAmount: Number(totalCancelledAmount.toFixed(2)),
      activeItemsCount: consolidatedItems.filter(i => !i.cancelled).length
    };
  }, [consolidatedItems, tipPercentage]);

  if (!isOpen) return null;

  const tableName = tableData?.tableName || order?.table || 'Mesa 1';
  const waiterName = order?.waiterName || (tableData?.waiters && tableData.waiters.length > 0 ? tableData.waiters.join(', ') : 'Mesero de Turno');
  const invoiceId = order ? `CMD-${order.id.slice(-6).toUpperCase()}` : `MESA-${tableName.replace(/\s+/g, '').toUpperCase()}`;
  const latestDate = order?.createdAt || tableData?.lastCreatedAt || new Date();

  // Función de impresión nativa optimizada
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Por favor habilita las ventanas emergentes para imprimir la factura.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factura / Precuenta - ${tableName} - Restaurante Zénit</title>
          <style>
            @media print {
              body { margin: 0; padding: 15px; font-family: 'Courier New', Courier, monospace; color: #000; font-size: 12px; }
              .no-print { display: none; }
            }
            body { font-family: 'Courier New', Courier, monospace; max-width: 400px; margin: 20px auto; padding: 15px; border: 1px dashed #999; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .item-name { flex: 1; padding-right: 10px; }
            .header-title { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
            .header-subtitle { font-size: 11px; margin-bottom: 8px; }
            .table-info { font-size: 11px; margin-bottom: 8px; }
            .total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 6px; }
            .note { font-size: 10px; font-style: italic; color: #555; margin-left: 12px; }
          </style>
        </head>
        <body>
          <div class="text-center">
            <div class="header-title">RESTAURANTE ZÉNIT</div>
            <div class="header-subtitle">Gastronomía de Altura & Coctelería de Autor</div>
            <div class="header-subtitle">RUC: 1792458912001 • Tel: (02) 234-5678</div>
          </div>
          <div class="divider"></div>
          <div class="table-info">
            <div><strong>DOCUMENTO:</strong> PRECUENTA / CONSUMO</div>
            <div><strong>N° CONTROL:</strong> ${invoiceId}</div>
            <div><strong>UBICACIÓN:</strong> ${tableName}</div>
            <div><strong>ATENDIDO POR:</strong> ${waiterName}</div>
            <div><strong>FECHA/HORA:</strong> ${formatDateTime(latestDate)}</div>
          </div>
          <div class="divider"></div>
          <div>
            <div class="item-row bold" style="border-bottom: 1px solid #000; padding-bottom: 4px;">
              <span style="width: 30px;">CANT</span>
              <span class="item-name">DESCRIPCIÓN</span>
              <span style="width: 60px;" class="text-right">TOTAL</span>
            </div>
            ${consolidatedItems.filter(i => !i.cancelled).map(i => `
              <div style="margin-top: 4px;">
                <div class="item-row">
                  <span style="width: 30px;">${i.quantity}x</span>
                  <span class="item-name">${i.name}</span>
                  <span style="width: 60px;" class="text-right">$${(Number(i.price || 0) * Number(i.quantity || 1)).toFixed(2)}</span>
                </div>
                ${i.notes ? `<div class="note">Nota: ${i.notes}</div>` : ''}
              </div>
            `).join('')}
          </div>
          <div class="divider"></div>
          <div class="item-row">
            <span>Subtotal Cocina & Parrilla:</span>
            <span>$${totals.subtotalKitchen.toFixed(2)}</span>
          </div>
          <div class="item-row">
            <span>Subtotal Bar & Coctelería:</span>
            <span>$${totals.subtotalBar.toFixed(2)}</span>
          </div>
          <div class="item-row bold">
            <span>Subtotal Neto:</span>
            <span>$${totals.subtotalNeto.toFixed(2)}</span>
          </div>
          ${tipPercentage > 0 ? `
            <div class="item-row">
              <span>Propina Sugerida (${tipPercentage}%):</span>
              <span>$${totals.tipAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="divider"></div>
          <div class="total-row">
            <span>TOTAL A PAGAR:</span>
            <span>$${totals.totalPagar.toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <div class="text-center" style="font-size: 10px; margin-top: 15px;">
            <div>¡Gracias por su visita a Restaurante Zénit!</div>
            <div>Este documento constituye una precuenta informativa de consumo en mesa.</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        ref={printRef}
        className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl transition-all animate-slide-up max-h-[92vh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* CABECERA OFICIAL DE LA FACTURA */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Detalle de Factura & Cuenta
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {tableName}
                </span>
                {isAuthorized && (
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Exclusivo Karen & Wladimir
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span>N° Control: <strong className="text-slate-200 font-mono">{invoiceId}</strong></span>
                <span>•</span>
                <span>Mesero: <strong className="text-slate-200">{waiterName}</strong></span>
                <span>•</span>
                <span>Fecha: <strong className="text-slate-300 font-mono">{formatDateTime(latestDate)}</strong></span>
              </p>
            </div>
          </div>

          {/* Botones de Cabecera: Imprimir y Cerrar */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              icon={Printer}
              onClick={handlePrint}
              className="text-xs font-bold bg-slate-950/80 border-slate-700 hover:border-emerald-500 text-slate-200"
            >
              Imprimir Ticket
            </Button>
            <button
              onClick={onClose}
              className="rounded-2xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SELECTOR DE COMANDAS (Si la mesa tiene múltiples pedidos) */}
        {effectiveOrders.length > 1 && (
          <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Comandas de la Mesa:</span>
            <button
              onClick={() => setSelectedOrderTab('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedOrderTab === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Consolidado Completo ({effectiveOrders.length})
            </button>
            {effectiveOrders.map((ord, idx) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderTab(ord.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedOrderTab === ord.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Comanda #{idx + 1} ({formatTime(ord.createdAt)})
              </button>
            ))}
          </div>
        )}

        {/* CUERPO DEL MODAL CON SCROLL INDEPENDIENTE */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 pr-2">
          
          {/* TABLA DE PRODUCTOS / ÍTEMS FACTURADOS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                Ítems Facturados en Mesa ({totals.activeItemsCount})
              </h4>
              
              {/* Toggle para Administradores: Ver Costos Unitarios */}
              {isAuthorized && (
                <button
                  onClick={() => setShowCostDetails(!showCostDetails)}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors bg-purple-950/30 px-2.5 py-1 rounded-xl border border-purple-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showCostDetails ? 'Ocultar Costos de Insumos' : 'Ver Costos y Margen de Insumos'}</span>
                </button>
              )}
            </div>

            {consolidatedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-slate-950 border border-slate-800">
                No hay productos en esta factura o comanda.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 shadow-md">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] font-black uppercase">
                      <th className="py-3 px-3.5 text-center">Cant</th>
                      <th className="py-3 px-3.5">Plato / Bebida</th>
                      <th className="py-3 px-3.5">Estación</th>
                      <th className="py-3 px-3.5 text-right">P. Unitario</th>
                      <th className="py-3 px-3.5 text-right">Total ($)</th>
                      {isAuthorized && showCostDetails && (
                        <>
                          <th className="py-3 px-3.5 text-right text-purple-400 bg-purple-950/20">Costo Insumo</th>
                          <th className="py-3 px-3.5 text-right text-teal-400 bg-teal-950/20">Margen ($/%)</th>
                        </>
                      )}
                      <th className="py-3 px-3.5 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {consolidatedItems.map((item, idx) => {
                      const isBar = item.destination === 'BAR';
                      const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);

                      return (
                        <tr 
                          key={item.id || idx} 
                          className={`hover:bg-slate-900/60 transition-colors ${
                            item.cancelled ? 'opacity-40 line-through bg-rose-950/10' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3.5 text-center font-black text-emerald-400">
                            {item.quantity}x
                          </td>

                          <td className="py-2.5 px-3.5">
                            <span className="font-bold text-slate-100 block">{item.name}</span>
                            {item.notes && (
                              <span className="text-[10px] text-amber-300 font-medium block mt-0.5">
                                📝 {item.notes}
                              </span>
                            )}
                            {item.cancelled && (
                              <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                                🚫 Cancelado: {item.cancelReason || 'Por comensal'}
                              </span>
                            )}
                          </td>

                          <td className="py-2.5 px-3.5">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                              isBar 
                                ? 'bg-purple-950 text-purple-300 border-purple-500/40' 
                                : 'bg-amber-950 text-amber-300 border-amber-500/40'
                            }`}>
                              {isBar ? '🍸 Bar' : '🍳 Cocina'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3.5 text-right font-mono text-slate-300">
                            ${Number(item.price || 0).toFixed(2)}
                          </td>

                          <td className="py-2.5 px-3.5 text-right font-mono font-bold text-white">
                            ${itemTotal.toFixed(2)}
                          </td>

                          {/* Columnas de Costos Exclusivas para Karen y Wladimir */}
                          {isAuthorized && showCostDetails && (
                            <>
                              <td className="py-2.5 px-3.5 text-right font-mono text-purple-300 bg-purple-950/10">
                                ${item.costData?.totalCost.toFixed(2)}
                                <span className="block text-[9px] text-slate-500">
                                  (${item.costData?.unitCost.toFixed(2)} c/u)
                                </span>
                              </td>
                              <td className="py-2.5 px-3.5 text-right font-mono text-teal-300 bg-teal-950/10">
                                +${item.costData?.marginDollars.toFixed(2)}
                                <span className="block text-[9px] text-teal-400/80">
                                  {item.costData?.marginPercent}%
                                </span>
                              </td>
                            </>
                          )}

                          <td className="py-2.5 px-3.5 text-center">
                            {item.cancelled ? (
                              <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-500/20 text-rose-300">
                                Cancelado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300">
                                Venta Activa
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* DESGLOSE FINANCIERO Y RESUMEN DE LA CUENTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Panel Izquierdo: Desglose por Estación y Propina */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Desglose Operativo por Estación
              </h5>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">Cocina & Parrilla:</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300">${totals.subtotalKitchen.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Wine className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Bar & Coctelería:</span>
                  </div>
                  <span className="font-mono font-bold text-purple-300">${totals.subtotalBar.toFixed(2)}</span>
                </div>
              </div>

              {/* Selector Rápido de Propina Sugerida */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-bold">Propina Sugerida:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTipPercentage(0)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      tipPercentage === 0 ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    0%
                  </button>
                  <button
                    onClick={() => setTipPercentage(10)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      tipPercentage === 10 ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    +10% ($ {((totals.subtotalNeto * 0.10)).toFixed(2)})
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Derecho: Total Final a Pagar */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 shadow-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono font-bold text-slate-200">${totals.subtotalNeto.toFixed(2)}</span>
                </div>

                {tipPercentage > 0 && (
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Propina Sugerida (10%):</span>
                    <span className="font-mono font-bold text-emerald-400">+${totals.tipAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
                    Total a Pagar:
                  </span>
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    ${totals.totalPagar.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 text-right">
                  Precuenta de consumo oficial Restaurante Zénit
                </p>
              </div>
            </div>

          </div>

          {/* PANEL DE COSTOS Y RENTABILIDAD (EXCLUSIVO KAREN Y WLADIMIR) */}
          {isAuthorized && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                      Análisis de Costos y Rentabilidad de la Mesa
                      <span className="px-2 py-0.2 text-[9px] font-black uppercase rounded bg-purple-500/30 text-purple-200 border border-purple-400/40">
                        Karen & Wladimir
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      Cálculo automático según fichas técnicas e insumos de inventario
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-teal-400 font-mono block">
                    Margen: {totals.margenPercent}%
                  </span>
                </div>
              </div>

              {/* Métricas de Costos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Costo Insumos */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Costo de Insumos:</span>
                  <span className="text-lg font-black text-purple-300 font-mono">
                    ${totals.totalCostoInsumos.toFixed(2)}
                  </span>
                  <span className="block text-[9px] text-slate-500 mt-0.5">
                    Cocina: ${totals.totalCostoKitchen.toFixed(2)} • Bar: ${totals.totalCostoBar.toFixed(2)}
                  </span>
                </div>

                {/* Ganancia Bruta */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Ganancia Bruta Real:</span>
                  <span className="text-lg font-black text-emerald-300 font-mono">
                    +${totals.margenBruto.toFixed(2)}
                  </span>
                  <span className="block text-[9px] text-slate-500 mt-0.5">
                    Ventas ($ {totals.subtotalNeto.toFixed(2)}) - Insumos
                  </span>
                </div>

                {/* Margen Porcentual */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-teal-500/30">
                  <span className="text-[10px] uppercase font-bold text-teal-400 block">Rentabilidad Mesa:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-teal-300 font-mono">
                      {totals.margenPercent}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {totals.margenPercent >= 60 ? '🟢 Excelente' : totals.margenPercent >= 45 ? '🟡 Bueno' : '🔴 Revisar'}
                    </span>
                  </div>
                  {/* Barra de progreso de margen */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className={`h-full rounded-full ${
                        totals.margenPercent >= 60 ? 'bg-emerald-500' : totals.margenPercent >= 45 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, totals.margenPercent))}%` }}
                    />
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* PIE DEL MODAL CON ACCIONES */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Restaurante Zénit • Control de facturación en mesa</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs py-2 px-4"
            >
              Cerrar
            </Button>

            <Button
              variant="primary"
              icon={Printer}
              onClick={handlePrint}
              className="text-xs py-2 px-4 font-bold shadow-lg"
            >
              Imprimir Ticket Precuenta
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};