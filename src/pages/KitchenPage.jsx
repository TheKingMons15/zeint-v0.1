import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChefHat, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Play, 
  CheckCheck, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  Volume2,
  Utensils
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { Button } from '../components/common/Button';
import { formatTime, formatDateTime } from '../utils/formatters';

export const KitchenPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ACTIVE'); // 'ACTIVE' | 'PENDING' | 'PREPARING' | 'READY' | 'ALL'
  const companyId = user?.companyId || 'default_company';

  useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsub();
  }, [companyId]);

  // Cambiar estado de la comanda
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, user);
      if (newStatus === ORDER_STATUS.READY) {
        showToast('¡Plato marcado como LISTO! El mesero ha sido notificado.', 'success');
      } else if (newStatus === ORDER_STATUS.PREPARING) {
        showToast('Comanda en preparación.', 'info');
      } else if (newStatus === ORDER_STATUS.DELIVERED) {
        showToast('Comanda entregada en mesa.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar estado en cocina', 'error');
    }
  };

  // Filtrado de comandas
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (filterStatus === 'ACTIVE') {
        return order.status === ORDER_STATUS.PENDING || 
               order.status === ORDER_STATUS.PREPARING || 
               order.status === ORDER_STATUS.READY;
      }
      if (filterStatus === 'ALL') return true;
      return order.status === filterStatus;
    });
  }, [orders, filterStatus]);

  // Contadores
  const pendingCount = useMemo(() => orders.filter(o => o.status === ORDER_STATUS.PENDING).length, [orders]);
  const preparingCount = useMemo(() => orders.filter(o => o.status === ORDER_STATUS.PREPARING).length, [orders]);
  const readyCount = useMemo(() => orders.filter(o => o.status === ORDER_STATUS.READY).length, [orders]);

  const getStatusCardStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'bg-amber-950/20 border-amber-500/50 shadow-amber-950/40 ring-1 ring-amber-500/30';
      case ORDER_STATUS.PREPARING:
        return 'bg-sky-950/20 border-sky-500/50 shadow-sky-950/40 ring-1 ring-sky-500/30';
      case ORDER_STATUS.READY:
        return 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-950/50 ring-2 ring-emerald-500/50';
      case ORDER_STATUS.DELIVERED:
        return 'bg-slate-900/60 border-slate-800 opacity-60';
      default:
        return 'bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-20">
      
      {/* Header KDS Cocina */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-950/50">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Pantalla KDS de Cocina & Parrilla
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full animate-pulse">
                EN VIVO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control de tiempos, preparación y despacho de comandas en sala
            </p>
          </div>
        </div>

        {/* Filtros de Estado */}
        <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'ACTIVE'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Activas ({pendingCount + preparingCount + readyCount})
          </button>
          <button
            onClick={() => setFilterStatus(ORDER_STATUS.PENDING)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === ORDER_STATUS.PENDING
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            🟡 Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus(ORDER_STATUS.PREPARING)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === ORDER_STATUS.PREPARING
                ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                : 'text-sky-400/80 hover:text-sky-300'
            }`}
          >
            🔵 En Parrilla ({preparingCount})
          </button>
          <button
            onClick={() => setFilterStatus(ORDER_STATUS.READY)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === ORDER_STATUS.READY
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-emerald-400/80 hover:text-emerald-300'
            }`}
          >
            🟢 Listas ({readyCount})
          </button>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'ALL'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Historial Turno
          </button>
        </div>
      </div>

      {/* Grid de Comandas en Vivo */}
      {filteredOrders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
          <ChefHat className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No hay comandas en este estado</h4>
          <p className="text-xs text-slate-500">Los nuevos pedidos enviados por los meseros aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map(order => {
            const isPending = order.status === ORDER_STATUS.PENDING;
            const isPreparing = order.status === ORDER_STATUS.PREPARING;
            const isReady = order.status === ORDER_STATUS.READY;
            const isDelivered = order.status === ORDER_STATUS.DELIVERED;

            return (
              <div
                key={order.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 shadow-xl ${getStatusCardStyle(order.status)}`}
              >
                <div className="space-y-3">
                  
                  {/* Encabezado de Comanda: Mesa + Hora + Mesero */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xl font-black text-white block tracking-tight">
                        {order.table}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Mesero: <strong className="text-slate-200">{order.waiterName}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">
                        {formatTime(order.createdAt)}
                      </span>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase rounded-lg border ${
                        isPending ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        isPreparing ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                        isReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isPending ? '🟡 PENDIENTE' : isPreparing ? '🔵 PREPARANDO' : isReady ? '🟢 LISTO' : '⚫ ENTREGADO'}
                      </span>
                    </div>
                  </div>

                  {/* Lista de Platos y Cantidades */}
                  <div className="space-y-2.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold text-slate-100 leading-tight">
                            <span className="text-emerald-400 text-base font-black mr-1.5">{item.quantity}x</span>
                            {item.name}
                          </span>
                        </div>

                        {item.notes && (
                          <div className="text-[11px] font-semibold text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            ⚠️ {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Observación General */}
                  {order.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-amber-200 border border-amber-500/30">
                      <span className="font-bold">Nota General: </span>{order.notes}
                    </div>
                  )}

                </div>

                {/* Botones Táctiles de Acción en 1 Toque */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  {isPending && (
                    <Button
                      fullWidth
                      variant="primary"
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.PREPARING)}
                      icon={Play}
                      className="py-2.5 bg-sky-600 hover:bg-sky-500 text-xs font-black"
                    >
                      INICIAR PREPARACIÓN (EN PARRILLA)
                    </Button>
                  )}

                  {isPreparing && (
                    <Button
                      fullWidth
                      variant="success"
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.READY)}
                      icon={CheckCircle2}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-black"
                    >
                      ¡MARCAR LISTO PARA SERVIR!
                    </Button>
                  )}

                  {isReady && (
                    <Button
                      fullWidth
                      variant="secondary"
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.DELIVERED)}
                      icon={CheckCheck}
                      className="py-2 text-xs font-bold"
                    >
                      Marcar como Entregado en Mesa
                    </Button>
                  )}

                  {isDelivered && (
                    <div className="text-center text-xs text-slate-500 font-mono py-1">
                      ✓ Comanda finalizada y servida
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
