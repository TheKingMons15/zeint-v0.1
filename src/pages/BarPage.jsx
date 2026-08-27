import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wine, 
  GlassWater, 
  Clock, 
  CheckCircle2, 
  Play, 
  CheckCheck, 
  Sparkles,
  CupSoda,
  Beer,
  Coffee,
  Plus,
  PackagePlus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { Button } from '../components/common/Button';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { formatTime } from '../utils/formatters';

export const BarPage = () => {
  const { user } = useAuth();
  const { addProduct } = useInventory();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ACTIVE'); // 'ACTIVE' | 'PENDING' | 'PREPARING' | 'READY' | 'ALL'
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const companyId = user?.companyId || 'default_company';

  useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsub();
  }, [companyId]);

  // Filtrar pedidos exclusivos de Bar (eliminando completamente cualquier plato de cocina)
  const barOrders = useMemo(() => {
    return orders
      .map(order => {
        const drinkItems = order.items?.filter(item => {
          const cat = (item.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return cat.includes('bebida') || cat.includes('coctel') || cat.includes('bar') || cat.includes('licor') || cat.includes('cafe') || item.destination === 'BAR';
        }) || [];

        return {
          ...order,
          drinkItems,
          hasDrinkItems: drinkItems.length > 0
        };
      })
      .filter(order => order.hasDrinkItems);
  }, [orders]);

  // Cambiar estado de la comanda en Bar
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, user);
      if (newStatus === ORDER_STATUS.READY) {
        showToast('¡Bebidas marcadas como LISTAS! El mesero ha sido notificado para retirar en Bar.', 'success');
      } else if (newStatus === ORDER_STATUS.PREPARING) {
        showToast('Comanda en preparación en Bar.', 'info');
      } else if (newStatus === ORDER_STATUS.DELIVERED) {
        showToast('Bebidas entregadas en mesa.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar estado en Bar', 'error');
    }
  };

  // Filtrado de comandas de bar
  const filteredOrders = useMemo(() => {
    return barOrders.filter(order => {
      if (filterStatus === 'ACTIVE') {
        return order.status === ORDER_STATUS.PENDING || 
               order.status === ORDER_STATUS.PREPARING || 
               order.status === ORDER_STATUS.READY;
      }
      if (filterStatus === 'ALL') return true;
      return order.status === filterStatus;
    });
  }, [barOrders, filterStatus]);

  // Contadores Bar
  const pendingCount = useMemo(() => barOrders.filter(o => o.status === ORDER_STATUS.PENDING).length, [barOrders]);
  const preparingCount = useMemo(() => barOrders.filter(o => o.status === ORDER_STATUS.PREPARING).length, [barOrders]);
  const readyCount = useMemo(() => barOrders.filter(o => o.status === ORDER_STATUS.READY).length, [barOrders]);

  const getStatusCardStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'bg-purple-950/20 border-purple-500/50 shadow-purple-950/40 ring-1 ring-purple-500/30';
      case ORDER_STATUS.PREPARING:
        return 'bg-cyan-950/20 border-cyan-500/50 shadow-cyan-950/40 ring-1 ring-cyan-500/30';
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
      
      {/* Header KDS Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-lg shadow-purple-950/50">
            <Wine className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Pantalla KDS de Bar & Coctelería
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full animate-pulse">
                BAR EN VIVO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control de despacho de cócteles, jugos, vinos, cervezas y cafetería
            </p>
          </div>
        </div>

        {/* Acciones y Filtros de Estado */}
        <div className="flex items-center gap-3 flex-wrap">
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsProductModalOpen(true)}
            icon={PackagePlus}
            className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs font-bold"
          >
            + Registrar Insumo / Bebida (Bar)
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
                  ? 'bg-purple-500 text-slate-950 shadow-md font-black'
                  : 'text-purple-400/80 hover:text-purple-300'
              }`}
            >
              🟡 Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus(ORDER_STATUS.PREPARING)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === ORDER_STATUS.PREPARING
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-cyan-400/80 hover:text-cyan-300'
              }`}
            >
              🔵 En Coctelera ({preparingCount})
            </button>
            <button
              onClick={() => setFilterStatus(ORDER_STATUS.READY)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === ORDER_STATUS.READY
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              🟢 Listas en Barra ({readyCount})
            </button>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'ALL'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Historial
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Comandas en Vivo para el Bar */}
      {filteredOrders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
          <Wine className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No hay comandas de bar en este momento</h4>
          <p className="text-xs text-slate-500">Los pedidos de bebidas y cócteles enviados por los meseros aparecerán aquí en tiempo real.</p>
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
                  
                  {/* Encabezado: Mesa + Hora + Mesero */}
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
                      <span className="text-xs font-mono font-bold text-purple-400 block">
                        {formatTime(order.createdAt)}
                      </span>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase rounded-lg border ${
                        isPending ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                        isPreparing ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                        isReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isPending ? '🟡 PENDIENTE BAR' : isPreparing ? '🔵 EN COCTELERA' : isReady ? '🟢 LISTO BAR' : '⚫ ENTREGADO'}
                      </span>
                    </div>
                  </div>

                  {/* Lista de Bebidas / Items de Bar */}
                  <div className="space-y-2.5">
                    {order.drinkItems?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold text-slate-100 leading-tight">
                            <span className="text-purple-400 text-base font-black mr-1.5">{item.quantity}x</span>
                            {item.name}
                          </span>
                        </div>

                        {item.notes && (
                          <div className="text-[11px] font-semibold text-purple-300 bg-purple-950/30 px-2 py-0.5 rounded-lg border border-purple-500/20">
                            🍸 {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Observación General */}
                  {order.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-purple-200 border border-purple-500/30">
                      <span className="font-bold">Nota: </span>{order.notes}
                    </div>
                  )}

                </div>

                {/* Botones Táctiles para el Bartender */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  {isPending && (
                    <Button
                      fullWidth
                      variant="primary"
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.PREPARING)}
                      icon={Play}
                      className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-black"
                    >
                      INICIAR PREPARACIÓN EN BARRA
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
                      ¡MARCAR LISTO EN BARRA!
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
                      Marcar como Retirado / Servido
                    </Button>
                  )}

                  {isDelivered && (
                    <div className="text-center text-xs text-slate-500 font-mono py-1">
                      ✓ Bebidas entregadas en mesa
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal para que Bar registre un nuevo insumo */}
      {isProductModalOpen && (
        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          loading={modalLoading}
          defaultLocation="Bar"
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
