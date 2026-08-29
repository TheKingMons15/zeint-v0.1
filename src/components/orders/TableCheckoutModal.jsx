import React, { useState, useMemo, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Users, 
  CheckCircle2, 
  Printer, 
  X, 
  Percent, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  UserCheck, 
  Wallet, 
  Smartphone, 
  Divide, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { orderService, ORDER_STATUS } from '../../services/orderService';
import { useToast } from '../../hooks/useToast';
import { formatTime, formatDateTime } from '../../utils/formatters';

const PAYMENT_METHODS = [
  { id: 'EFECTIVO', label: 'Efectivo', icon: DollarSign, color: 'emerald' },
  { id: 'TARJETA_DEBITO', label: 'Tarjeta Débito', icon: CreditCard, color: 'sky' },
  { id: 'TARJETA_CREDITO', label: 'Tarjeta Crédito', icon: CreditCard, color: 'indigo' },
  { id: 'TRANSFERENCIA', label: 'Transferencia / DeUna', icon: Smartphone, color: 'purple' },
  { id: 'MIXTO', label: 'Pago Mixto', icon: Wallet, color: 'amber' }
];

export const TableCheckoutModal = ({
  isOpen,
  onClose,
  tableName = '',
  orders = [],
  currentUser = null,
  onTableClosed = () => {}
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('full'); // 'full' | 'split_equal'
  const [loading, setLoading] = useState(false);

  // Estados Pago Cuenta Completa
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [tipPercent, setTipPercent] = useState(10);
  const [customTip, setCustomTip] = useState(0);
  const [receivedCash, setReceivedCash] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [closureNotes, setClosureNotes] = useState('');

  // Estados Pago Mixto
  const [mixedCash, setMixedCash] = useState('');
  const [mixedCard, setMixedCard] = useState('');
  const [mixedTransfer, setMixedTransfer] = useState('');

  // Estados División Equitativa (Partes Iguales)
  const [splitCount, setSplitCount] = useState(2);
  const [splitEqualPayments, setSplitEqualPayments] = useState([]);

  // Consolidar todos los ítems activos de la mesa
  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== ORDER_STATUS.CANCELLED);
  }, [orders]);

  const consolidatedItems = useMemo(() => {
    const map = {};
    activeOrders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!item.cancelled) {
          const key = `${item.name}_${item.price}_${item.destination || 'KITCHEN'}`;
          if (!map[key]) {
            map[key] = {
              ...item,
              quantity: 0,
              originalOrders: [order.id]
            };
          }
          map[key].quantity += Number(item.quantity || 1);
        }
      });
    });
    return Object.values(map);
  }, [activeOrders]);

  // Totales base
  const baseSubtotal = useMemo(() => {
    return consolidatedItems.reduce((sum, i) => sum + (Number(i.price || 0) * Number(i.quantity || 1)), 0);
  }, [consolidatedItems]);

  const discountAmount = useMemo(() => {
    return (baseSubtotal * (Number(discountPercent || 0) / 100));
  }, [baseSubtotal, discountPercent]);

  const subtotalAfterDiscount = useMemo(() => {
    return Math.max(0, baseSubtotal - discountAmount);
  }, [baseSubtotal, discountAmount]);

  const tipAmount = useMemo(() => {
    if (customTip > 0) return Number(customTip);
    return (subtotalAfterDiscount * (Number(tipPercent || 0) / 100));
  }, [subtotalAfterDiscount, tipPercent, customTip]);

  const totalToPay = useMemo(() => {
    return Number((subtotalAfterDiscount + tipAmount).toFixed(2));
  }, [subtotalAfterDiscount, tipAmount]);

  // Cálculo de cambio en efectivo
  const cashChange = useMemo(() => {
    const cash = parseFloat(receivedCash) || 0;
    if (cash >= totalToPay) {
      return Number((cash - totalToPay).toFixed(2));
    }
    return 0;
  }, [receivedCash, totalToPay]);

  // Inicializar pagos de división equitativa
  useEffect(() => {
    const quota = totalToPay > 0 ? Number((totalToPay / splitCount).toFixed(2)) : 0;
    const initialSplits = Array.from({ length: splitCount }, (_, idx) => ({
      id: idx + 1,
      name: `Comensal ${idx + 1}`,
      amount: quota,
      paymentMethod: 'EFECTIVO',
      paid: false
    }));
    setSplitEqualPayments(initialSplits);
  }, [splitCount, totalToPay]);

  if (!isOpen) return null;

  // Imprimir Ticket de Cierre / Factura
  const handlePrintReceipt = (guestTitle = '', specificAmount = null, specificItems = null) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Por favor habilita las ventanas emergentes para imprimir el comprobante.');
      return;
    }

    const itemsToPrint = specificItems || consolidatedItems;
    const printTotal = specificAmount !== null ? specificAmount : totalToPay;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante de Pago - ${tableName} - Restaurante Zénit</title>
          <style>
            @media print {
              body { margin: 0; padding: 15px; font-family: 'Courier New', Courier, monospace; color: #000; font-size: 12px; }
              .no-print { display: none; }
            }
            body { font-family: 'Courier New', Courier, monospace; max-width: 380px; margin: 20px auto; padding: 15px; border: 1px dashed #777; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
            .item-name { flex: 1; padding-right: 8px; }
            .header-title { font-size: 16px; font-weight: bold; }
            .header-sub { font-size: 10px; margin-bottom: 2px; }
            .total-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-top: 4px; }
            .highlight { background: #eee; padding: 4px; border-radius: 4px; margin-top: 6px; }
          </style>
        </head>
        <body>
          <div class="text-center">
            <div class="header-title">RESTAURANTE ZÉNIT</div>
            <div class="header-sub">Gastronomía de Altura & Coctelería de Autor</div>
            <div class="header-sub">RUC: 1792458912001 • Matriz Ibarra</div>
            <div class="header-sub">COMPROBANTE DE VENTA EN MESA</div>
          </div>
          <div class="divider"></div>
          <div style="font-size: 11px;">
            <div><strong>MESA:</strong> ${tableName} ${guestTitle ? `(${guestTitle})` : ''}</div>
            <div><strong>FECHA:</strong> ${formatDateTime(new Date())}</div>
            <div><strong>MÉTODO:</strong> ${paymentMethod}</div>
            <div><strong>ATENDIDO:</strong> ${currentUser?.displayName || 'Mesero'}</div>
          </div>
          <div class="divider"></div>
          <div>
            <div class="item-row bold" style="border-bottom: 1px solid #000; padding-bottom: 2px;">
              <span style="width: 25px;">CT</span>
              <span class="item-name">DETALLE</span>
              <span style="width: 55px;" class="text-right">TOTAL</span>
            </div>
            ${itemsToPrint.map(i => `
              <div class="item-row">
                <span style="width: 25px;">${i.quantity}x</span>
                <span class="item-name">${i.name}</span>
                <span style="width: 55px;" class="text-right">$${(Number(i.price || 0) * Number(i.quantity || 1)).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="divider"></div>
          <div style="font-size: 11px;">
            <div class="item-row">
              <span>Subtotal Neto:</span>
              <span>$${baseSubtotal.toFixed(2)}</span>
            </div>
            ${discountAmount > 0 ? `
              <div class="item-row" style="color: #b00;">
                <span>Descuento (${discountPercent}%):</span>
                <span>-$${discountAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            ${tipAmount > 0 ? `
              <div class="item-row">
                <span>Propina / Servicio sugerido:</span>
                <span>+$${tipAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row highlight">
              <span>TOTAL A PAGAR:</span>
              <span>$${printTotal.toFixed(2)}</span>
            </div>
            ${receivedCash && paymentMethod === 'EFECTIVO' ? `
              <div class="item-row" style="margin-top: 4px;">
                <span>Efectivo Recibido:</span>
                <span>$${parseFloat(receivedCash).toFixed(2)}</span>
              </div>
              <div class="item-row bold">
                <span>Cambio / Vuelto:</span>
                <span>$${cashChange.toFixed(2)}</span>
              </div>
            ` : ''}
          </div>
          <div class="divider"></div>
          <div class="text-center" style="font-size: 10px; margin-top: 8px;">
            <div>¡Gracias por su visita al Restaurante Zénit!</div>
            <div>Esperamos verte pronto entre las nubes.</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Confirmar Cierre Total de Mesa
  const handleConfirmFullClosure = async () => {
    try {
      setLoading(true);

      const paymentData = {
        paymentMethod,
        tip: tipAmount,
        discount: discountAmount,
        totalPaid: totalToPay,
        receivedAmount: parseFloat(receivedCash) || totalToPay,
        change: cashChange,
        reference: paymentReference,
        notes: closureNotes,
        mixedDetails: paymentMethod === 'MIXTO' ? {
          cash: parseFloat(mixedCash) || 0,
          card: parseFloat(mixedCard) || 0,
          transfer: parseFloat(mixedTransfer) || 0
        } : null,
        splitPayments: activeTab === 'split_equal' ? splitEqualPayments : []
      };

      await orderService.closeTableAccount(tableName, paymentData, currentUser);

      showToast(`¡Cuenta de ${tableName} cerrada exitosamente! Mesa liberada.`, 'success');
      onTableClosed();
      onClose();
    } catch (error) {
      console.error("Error closing table:", error);
      showToast('Ocurrió un error al cerrar la cuenta de la mesa', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ENCABEZADO */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{tableName}</h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Cierre & Facturación
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeOrders.length} comanda(s) activas • Total Acumulado: <strong className="text-emerald-400">${totalToPay.toFixed(2)}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS (CUENTA COMPLETA vs INDIVIDUALES) */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('full')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'full'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Cuenta Única Completa (${totalToPay.toFixed(2)})</span>
          </button>

          <button
            onClick={() => setActiveTab('split_equal')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'split_equal'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Divide className="w-4 h-4" />
            <span>Dividir Partes Iguales ({splitCount} pers.)</span>
          </button>
        </div>

        {/* CONTENIDO DEL MODAL */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-200 flex-1">
          
          {/* ============================================================ */}
          {/* MODO 1: CUENTA COMPLETA                                       */}
          {/* ============================================================ */}
          {activeTab === 'full' && (
            <div className="space-y-5">
              
              {/* Resumen de Valores */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Consumo en Sala:</span>
                  <span className="font-mono text-slate-200 font-bold">${baseSubtotal.toFixed(2)}</span>
                </div>

                {/* Descuento */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Descuento aplicado:</span>
                  <div className="flex items-center gap-1">
                    {[0, 5, 10, 15].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountPercent(pct)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          discountPercent === pct ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                    {discountAmount > 0 && (
                      <span className="font-mono text-rose-400 font-bold ml-1">-${discountAmount.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Propina sugerida */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Propina / Servicio sugerido:</span>
                  <div className="flex items-center gap-1">
                    {[0, 5, 10, 12].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setTipPercent(pct);
                          setCustomTip(0);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tipPercent === pct && customTip === 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                    {tipAmount > 0 && (
                      <span className="font-mono text-emerald-400 font-bold ml-1">+${tipAmount.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Gran Total */}
                <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                  <span className="text-sm font-black text-white">TOTAL FINAL A COBRAR:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                    ${totalToPay.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Selección de Método de Pago */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Selecciona el Método de Pago:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(m => {
                    const isSelected = paymentMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detalle si es Efectivo */}
              {paymentMethod === 'EFECTIVO' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      💵 Efectivo Recibido:
                    </label>
                    <div className="flex gap-1.5">
                      {[totalToPay, 10, 20, 50, 100].filter(v => v >= totalToPay || v === totalToPay).slice(0, 4).map((val, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setReceivedCash(val.toString())}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono font-bold hover:bg-slate-700"
                        >
                          ${Number(val).toFixed(2)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder={`$${totalToPay.toFixed(2)}`}
                        value={receivedCash}
                        onChange={(e) => setReceivedCash(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Cambio / Vuelto:</span>
                      <span className={`text-base font-mono font-black ${cashChange > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                        ${cashChange.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalle si es Tarjeta o Transferencia */}
              {(paymentMethod.includes('TARJETA') || paymentMethod === 'TRANSFERENCIA') && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-fade-in text-xs">
                  <label className="font-bold text-slate-300 block">
                    N° de Referencia / Lote / Comprobante (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: LOTE-89412 / REF-009841"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}

              {/* Detalle si es Pago Mixto */}
              {paymentMethod === 'MIXTO' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3 animate-fade-in text-xs">
                  <label className="font-bold text-amber-300 block">
                    Distribución de Pago Mixto (Total a cubrir: ${totalToPay.toFixed(2)}):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Efectivo ($):</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={mixedCash}
                        onChange={(e) => setMixedCash(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Tarjeta ($):</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={mixedCard}
                        onChange={(e) => setMixedCard(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Transferencia ($):</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={mixedTransfer}
                        onChange={(e) => setMixedTransfer(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* MODO 2: DIVISIÓN EQUITATIVA (SPLIT BILL EN PARTES IGUALES)   */}
          {/* ============================================================ */}
          {activeTab === 'split_equal' && (
            <div className="space-y-4">
              
              {/* Selector de número de comensales */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" />
                    ¿Entre cuántas personas se divide la cuenta?
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Total Mesa: <strong className="text-white">${totalToPay.toFixed(2)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-base font-black px-2 text-purple-300">{splitCount}</span>
                  <button
                    type="button"
                    onClick={() => setSplitCount(Math.min(15, splitCount + 1))}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lista de comensales con su cuota */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {splitEqualPayments.map((guest, idx) => (
                  <div
                    key={guest.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      guest.paid
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-950/80 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{guest.name}</span>
                        {guest.paid && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Pagado
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-black font-mono text-purple-300 block">
                        ${guest.amount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={guest.paymentMethod}
                        onChange={(e) => {
                          const updated = [...splitEqualPayments];
                          updated[idx].paymentMethod = e.target.value;
                          setSplitEqualPayments(updated);
                        }}
                        className="bg-slate-900 border border-slate-800 text-[11px] rounded-xl px-2 py-1 text-slate-300"
                      >
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="TARJETA_DEBITO">Tarjeta Débito</option>
                        <option value="TARJETA_CREDITO">Tarjeta Crédito</option>
                        <option value="TRANSFERENCIA">Transferencia / DeUna</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handlePrintReceipt(guest.name, guest.amount, consolidatedItems)}
                        className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        title="Imprimir ticket individual de este comensal"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...splitEqualPayments];
                          updated[idx].paid = !updated[idx].paid;
                          setSplitEqualPayments(updated);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          guest.paid
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500 hover:text-white'
                        }`}
                      >
                        {guest.paid ? '✓ Listo' : 'Cobrar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* PIE DEL MODAL DE COBRO */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              icon={Printer}
              onClick={() => handlePrintReceipt()}
              className="text-xs py-2 px-3 font-bold"
            >
              Imprimir Factura
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs py-2 px-3"
            >
              Cancelar
            </Button>

            <Button
              variant="success"
              icon={CheckCircle2}
              onClick={handleConfirmFullClosure}
              loading={loading}
              className="text-xs py-2 px-5 font-black bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-950/60"
            >
              COBRAR & CERRAR MESA (${totalToPay.toFixed(2)})
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
