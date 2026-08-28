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
  Utensils, 
  Plus, 
  PackagePlus,
  Eye,
  Search,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { Button } from '../components/common/Button';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { DishIngredientsModal } from '../components/orders/DishIngredientsModal';
import { formatTime, formatDateTime } from '../utils/formatters';

export const KitchenPage = () => {
  const { user } = useAuth();
  const { addProduct } = useInventory();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ACTIVE'); // 'ACTIVE' | 'PENDING' | 'PREPARING' | 'READY' | 'ALL'
  const [search, setSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [inspectingDish, setInspectingDish] = useState(null);
  const [inspectingOrderContext, setInspectingOrderContext] = useState(null);

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
        showToast('Comanda en preparación en parrilla/cocina.', 'info');
      } else if (newStatus === ORDER_STATUS.DELIVERED) {
        showToast('Comanda entregada en mesa.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar estado en cocina', 'error');
    }
  };

  // Filtrar pedidos exclusivos de Cocina
  const kitchenOrders = useMemo(() => {
    return orders
      .map(order => {
        const kitchenItems = order.items?.filter(item => {
          const cat = (item.category || '').toLowerCase();
          const isBar = item.destination === 'BAR' || 
                        cat.includes('bebida') || 
                        cat.includes('coctel') || 
                        cat.includes('cóctel') || 
                        cat.includes('bar') || 
                        cat.includes('licor');
          return !isBar;
        }) || [];

        return {
          ...order,
          kitchenItems,
          hasKitchenItems: kitchenItems.length > 0
        };
      })
      .filter(order => order.hasKitchenItems);
  }, [orders]);

  // Filtrado de comandas según estado y buscador
  const filteredOrders = useMemo(() => {
    return kitchenOrders.filter(order => {
      // Filtro de estado
      if (filterStatus === 'ACTIVE') {
        if (order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) return false;
      } else if (filterStatus !== 'ALL') {
        if (order.status !== filterStatus) return false;
      }

      // Filtro de texto
      const q = search.toLowerCase().trim();
      if (!q) return true;

      const matchTable = order.table?.toLowerCase().includes(q);
      const matchDish = order.kitchenItems?.some(i => i.name?.toLowerCase().includes(q));
      const matchNotes = order.notes?.toLowerCase().includes(q) || order.kitchenItems?.some(i => i.notes?.toLowerCase().includes(q));

      return matchTable || matchDish || matchNotes;
    });
  }, [kitchenOrders, filterStatus, search]);

  // Contadores de Cocina
  const pendingCount = useMemo(() => kitchenOrders.filter(o => o.status === ORDER_STATUS.PENDING).length, [kitchenOrders]);
  const preparingCount = useMemo(() => kitchenOrders.filter(o => o.status === ORDER_STATUS.PREPARING).length, [kitchenOrders]);
  const readyCount = useMemo(() => kitchenOrders.filter(o => o.status === ORDER_STATUS.READY).length, [kitchenOrders]);

  const getStatusCardStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'bg-amber-950/20 border-amber-500/50 shadow-amber-950/40 ring-1 ring-amber-500/30';
      case ORDER_STATUS.PREPARING:
        return 'bg-sky-950/20 border-sky-500/50 shadow-sky-950/40 ring-1 ring-sky-500/30';
      case ORDER_STATUS.READY:
        return 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-950/50 ring-2 ring-emerald-500/50';
      case ORDER_STATUS.CANCELLED:
        return 'bg-rose-950/30 border-rose-900/60 opacity-60';
      case ORDER_STATUS.DELIVERED:
        return 'bg-slate-900/60 border-slate-800 opacity-60';
      default:
        return 'bg-slate-900 border-slate-800';
    }
  };

  const handleInspectDish = (item, order) => {
    setInspectingDish(item);
    setInspectingOrderContext({
      table: order.table,
      waiterName: order.waiterName,
      status: order.status
    });
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
              Control de tiempos, preparación y consulta de ingredientes de comandas
            </p>
          </div>
        </div>

        {/* Acciones de Insumo y Filtros */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsProductModalOpen(true)}
            icon={PackagePlus}
            className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-bold"
          >
            + Registrar Insumo (Cocina)
          </Button>

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
              🔵 En Preparación ({preparingCount})
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
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Historial ({kitchenOrders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Buscador Rápido de Cocina */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por mesa (ej: Mesa 3), plato o instrucción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid de Tickets KDS de Cocina */}
      {filteredOrders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <ChefHat className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-300">
            No hay comandas pendientes en Cocina
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cuando los meseros envíen platos desde sala, los tickets aparecerán aquí automáticamente con alertas sonoras.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map(order => {
            const isPending = order.status === ORDER_STATUS.PENDING;
            const isPreparing = order.status === ORDER_STATUS.PREPARING;
            const isReady = order.status === ORDER_STATUS.READY;
            const isDelivered = order.status === ORDER_STATUS.DELIVERED;
            const isCancelled = order.status === ORDER_STATUS.CANCELLED;

            return (
              <div
                key={order.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 shadow-xl ${getStatusCardStyle(order.status)}`}
              >
                <div className="space-y-3.5">
                  
                  {/* Encabezado del Ticket: Mesa, Mesero y Hora */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="text-2xl font-black text-white tracking-tight block">
                        {order.table}
                      </span>
                      <span className="text-xs text-slate-400">
                        Mesero: <strong className="text-slate-200">{order.waiterName || 'Sala'}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono justify-end">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatTime(order.createdAt)}</span>
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 mt-1 text-[10px] font-black uppercase rounded-lg border ${
                        isPending ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' :
                        isPreparing ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                        isReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        isCancelled ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isPending ? '🟡 PENDIENTE' : isPreparing ? '🔵 EN PARRILLA' : isReady ? '🟢 LISTO PARA SERVIR' : isCancelled ? '🔴 CANCELADO' : '⚫ ENTREGADO'}
                      </span>
                    </div>
                  </div>

                  {/* Lista de Platos de Cocina */}
                  <div className="space-y-2.5">
                    {order.kitchenItems?.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl border space-y-2 transition-all ${
                          item.cancelled
                            ? 'bg-rose-950/30 border-rose-500/40 line-through text-rose-300'
                            : 'bg-slate-950/90 border-slate-800/90'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-black text-slate-100 leading-tight">
                            <span className="text-emerald-400 text-base font-black mr-1.5">{item.quantity}x</span>
                            {item.name}
                          </span>

                          {/* BOTÓN VISIBLE: VER INGREDIENTES */}
                          <button
                            type="button"
                            onClick={() => handleInspectDish(item, order)}
                            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 hover:scale-105"
                            title="Ver ficha técnica, ingredientes y gramajes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver ingredientes</span>
                          </button>
                        </div>

                        {/* NOTA / MODIFICACIÓN ESPECIAL DEL CLIENTE */}
                        {item.notes && !item.cancelled && (
                          <div className="text-xs font-bold text-amber-200 bg-amber-500/20 px-2.5 py-1.5 rounded-xl border border-amber-500/40 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>⚠️ {item.notes}</span>
                          </div>
                        )}

                        {/* AVISO DE PLATO CANCELADO */}
                        {item.cancelled && (
                          <div className="text-[11px] font-black text-rose-400 bg-rose-950/60 p-2 rounded-xl border border-rose-500/50">
                            🚫 PLATO CANCELADO POR {item.cancelledBy || 'SALA'} • Motivo: {item.cancelReason || 'Cliente canceló'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Observación General de Mesa */}
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
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-black shadow-lg shadow-emerald-950/60"
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

                  {isCancelled && (
                    <div className="text-center text-xs text-rose-400 font-bold py-1 bg-rose-950/30 rounded-xl">
                      ✕ Comanda anulada por sala
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal para ver ingredientes y preparación de un plato */}
      {inspectingDish && (
        <DishIngredientsModal
          isOpen={Boolean(inspectingDish)}
          onClose={() => setInspectingDish(null)}
          dish={inspectingDish}
          orderContext={inspectingOrderContext}
        />
      )}

      {/* Modal para que Cocina registre un nuevo insumo */}
      {isProductModalOpen && (
        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          loading={modalLoading}
          defaultLocation="Cocina"
          onSubmit={async (formData) => {
            setModalLoading(true);
            try {
              await addProduct(formData);
              setIsProductModalOpen(false);
              showToast(`Insumo "${formData.name}" registrado exitosamente en el inventario central.`, 'success');
            } catch (err) {
              showToast(err.message || 'Error al registrar insumo', 'error');
            } finally {
              setModalLoading(false);
            }
          }}
        />
      )}

    </div>
  );
};
