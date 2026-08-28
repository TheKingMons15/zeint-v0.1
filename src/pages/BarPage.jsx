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
  PackagePlus,
  Eye,
  Search,
  X,
  AlertTriangle,
  Layers,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  History,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { DishIngredientsModal } from '../components/orders/DishIngredientsModal';
import { BarProductModal } from '../components/bar/BarProductModal';
import { BarMovementModal } from '../components/bar/BarMovementModal';
import { formatTime, formatDateTime } from '../utils/formatters';

export const BarPage = () => {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, registerMovement, movements } = useInventory();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('kds'); // 'kds' | 'inventory' | 'movements'
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ACTIVE'); // 'ACTIVE' | 'PENDING' | 'PREPARING' | 'READY' | 'ALL'
  const [search, setSearch] = useState('');
  
  // Modales de Bar
  const [inspectingDrink, setInspectingDrink] = useState(null);
  const [inspectingOrderContext, setInspectingOrderContext] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [movementModalState, setMovementModalState] = useState({ isOpen: false, type: 'ENTRY', defaultProductId: '' });
  const [modalLoading, setModalLoading] = useState(false);

  // Filtros de inventario de bar
  const [barCategoryFilter, setBarCategoryFilter] = useState('ALL');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const companyId = user?.companyId || 'default_company';

  useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsub();
  }, [companyId]);

  // Filtrar pedidos exclusivos de Bar (solo bebidas, licores, cócteles)
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

  // Filtrar comandas según estado y buscador
  const filteredOrders = useMemo(() => {
    return barOrders.filter(order => {
      if (filterStatus === 'ACTIVE') {
        if (order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) return false;
      } else if (filterStatus !== 'ALL') {
        if (order.status !== filterStatus) return false;
      }

      const q = search.toLowerCase().trim();
      if (!q) return true;

      const matchTable = order.table?.toLowerCase().includes(q);
      const matchDrink = order.drinkItems?.some(i => i.name?.toLowerCase().includes(q));
      const matchNotes = order.notes?.toLowerCase().includes(q) || order.drinkItems?.some(i => i.notes?.toLowerCase().includes(q));

      return matchTable || matchDrink || matchNotes;
    });
  }, [barOrders, filterStatus, search]);

  // Productos pertenecientes a la barra
  const barProducts = useMemo(() => {
    return products.filter(p => {
      const loc = (p.location || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      return loc.includes('bar') || cat.includes('licor') || cat.includes('bebida') || cat.includes('coctel') || cat.includes('jarabe') || cat.includes('cristaleria');
    });
  }, [products]);

  // Productos de bar filtrados
  const filteredBarProducts = useMemo(() => {
    return barProducts.filter(p => {
      if (barCategoryFilter !== 'ALL' && p.category !== barCategoryFilter) return false;
      if (onlyLowStock && (Number(p.currentStock || 0) > Number(p.minStock || 0))) return false;

      const q = search.toLowerCase().trim();
      if (!q) return true;

      return (
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.presentation?.toLowerCase().includes(q)
      );
    });
  }, [barProducts, barCategoryFilter, onlyLowStock, search]);

  // Movimientos históricos de barra
  const barMovements = useMemo(() => {
    return (movements || []).filter(m => {
      const cat = (m.category || '').toLowerCase();
      const loc = (m.location || '').toLowerCase();
      return loc.includes('bar') || cat.includes('licor') || cat.includes('bebida') || cat.includes('coctel');
    });
  }, [movements]);

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
      showToast('Error al actualizar estado en bar', 'error');
    }
  };

  // Guardar nuevo producto o editar en Bar
  const handleSaveBarProduct = async (productData) => {
    setModalLoading(true);
    try {
      if (productData.id) {
        await updateProduct(productData.id, productData);
        showToast(`Producto "${productData.name}" actualizado correctamente.`, 'success');
      } else {
        await addProduct(productData);
        showToast(`Botella/Insumo "${productData.name}" agregado al inventario de Bar.`, 'success');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      showToast(err.message || 'Error al guardar producto', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Eliminar producto de Bar
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setModalLoading(true);
    try {
      await deleteProduct(productToDelete.id);
      showToast(`Producto "${productToDelete.name}" eliminado del bar.`, 'info');
      setProductToDelete(null);
    } catch (err) {
      showToast(err.message || 'Error al eliminar producto', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Registrar movimiento de Bar (+Entrada / -Salida / Merma)
  const handleSaveBarMovement = async (movementData) => {
    setModalLoading(true);
    try {
      await registerMovement(movementData);
      showToast(`Movimiento registrado con éxito (${movementData.type === 'ENTRY' ? '+ Entrada' : '- Salida'}).`, 'success');
      setMovementModalState({ isOpen: false, type: 'ENTRY', defaultProductId: '' });
    } catch (err) {
      showToast(err.message || 'Error al registrar movimiento', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Contadores KDS
  const pendingCount = useMemo(() => barOrders.filter(o => o.status === ORDER_STATUS.PENDING).length, [barOrders]);
  const preparingCount = useMemo(() => barOrders.filter(o => o.status === ORDER_STATUS.PREPARING).length, [barOrders]);
  const readyCount = useMemo(() => barOrders.filter(o => o.status === ORDER_STATUS.READY).length, [barOrders]);
  const lowStockCount = useMemo(() => barProducts.filter(p => Number(p.currentStock || 0) <= Number(p.minStock || 0)).length, [barProducts]);

  const getStatusCardStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'bg-purple-950/20 border-purple-500/50 shadow-purple-950/40 ring-1 ring-purple-500/30';
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

  const handleInspectDrink = (item, order) => {
    setInspectingDrink(item);
    setInspectingOrderContext({
      table: order.table,
      waiterName: order.waiterName,
      status: order.status
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-20">
      
      {/* Header Bar & Coctelería */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-lg shadow-purple-950/50">
            <Wine className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Módulo de Bar & Coctelería Zénit
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full">
                {user?.displayName || 'Marlon (Bar)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestión de pedidos en barra, coctelería y control integral de licores e insumos
            </p>
          </div>
        </div>

        {/* Pestañas Principales: KDS vs Inventario Bar vs Historial */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
          <button
            onClick={() => {
              setActiveTab('kds');
              setSearch('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'kds'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wine className="w-4 h-4" />
            <span>Comandas KDS</span>
            {pendingCount + preparingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-200 text-[10px] font-black animate-pulse">
                {pendingCount + preparingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('inventory');
              setSearch('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventario de Barra ({barProducts.length})</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-bounce">
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('movements');
              setSearch('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'movements'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Movimientos ({barMovements.length})</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: COMANDAS KDS EN VIVO DE BARRA */}
      {activeTab === 'kds' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros KDS */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Buscador */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar comanda por mesa (ej: Mesa 2), cóctel o nota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtros de Estado */}
            <div className="flex items-center gap-1.5 flex-wrap">
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
                🔵 En Barra ({preparingCount})
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
                Historial ({barOrders.length})
              </button>
            </div>
          </div>

          {/* Grid de Tickets KDS de Bar */}
          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Wine className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
              <h3 className="text-base font-bold text-slate-300">
                No hay pedidos de Bar pendientes
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Cuando los meseros soliciten cócteles, vinos o bebidas, las comandas aparecerán aquí en vivo con alertas sonoras.
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
                            {isPending ? '🟡 PENDIENTE' : isPreparing ? '🔵 EN COCTELERA' : isReady ? '🟢 LISTO EN BARRA' : isCancelled ? '🔴 CANCELADO' : '⚫ ENTREGADO'}
                          </span>
                        </div>
                      </div>

                      {/* Lista de Bebidas y Tragos */}
                      <div className="space-y-2.5">
                        {order.drinkItems?.map((item, idx) => (
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
                                <span className="text-purple-400 text-base font-black mr-1.5">{item.quantity}x</span>
                                {item.name}
                              </span>

                              {/* BOTÓN VISIBLE: VER INGREDIENTES */}
                              <button
                                type="button"
                                onClick={() => handleInspectDrink(item, order)}
                                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 hover:scale-105"
                                title="Ver receta de cóctel e ingredientes"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ver receta</span>
                              </button>
                            </div>

                            {/* NOTA / MODIFICACIÓN ESPECIAL DEL CLIENTE */}
                            {item.notes && !item.cancelled && (
                              <div className="text-xs font-bold text-amber-200 bg-amber-500/20 px-2.5 py-1.5 rounded-xl border border-amber-500/40 flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span>⚠️ {item.notes}</span>
                              </div>
                            )}

                            {/* AVISO DE CANCELADO */}
                            {item.cancelled && (
                              <div className="text-[11px] font-black text-rose-400 bg-rose-950/60 p-2 rounded-xl border border-rose-500/50">
                                🚫 BEBIDA CANCELADA POR {item.cancelledBy || 'SALA'} • Motivo: {item.cancelReason || 'Cancelado'}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Observación General */}
                      {order.notes && (
                        <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-amber-200 border border-amber-500/30">
                          <span className="font-bold">Nota Mesa: </span>{order.notes}
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
                          className="py-2.5 bg-purple-600 hover:bg-purple-500 text-xs font-black"
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
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-black shadow-lg shadow-emerald-950/60"
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
                          Marcar como Entregado en Mesa
                        </Button>
                      )}

                      {isDelivered && (
                        <div className="text-center text-xs text-slate-500 font-mono py-1">
                          ✓ Bebidas servidas en mesa
                        </div>
                      )}

                      {isCancelled && (
                        <div className="text-center text-xs text-rose-400 font-bold py-1 bg-rose-950/30 rounded-xl">
                          ✕ Pedido anulado por sala
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* VISTA 2: GESTIÓN INTEGRAL DE INVENTARIO PARA EL BARMAN (MARLON) */}
      {activeTab === 'inventory' && (
        <div className="space-y-5">
          
          {/* Controles de Barra: Buscar, Filtros y Acciones */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Wine className="w-5 h-5 text-purple-400" />
                  Inventario de Barra, Licores & Mixers
                </h3>
                <p className="text-xs text-slate-400">
                  Control de stock de botellas, registro de entradas, consumos y mermas
                </p>
              </div>

              {/* Botones de Acción de Barra */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => setMovementModalState({ isOpen: true, type: 'ENTRY', defaultProductId: '' })}
                  icon={TrendingUp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold"
                >
                  + Entrada de Botellas
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setMovementModalState({ isOpen: true, type: 'EXIT', defaultProductId: '' })}
                  icon={TrendingDown}
                  className="bg-rose-600 hover:bg-rose-500 text-xs font-bold"
                >
                  - Salida / Consumo / Merma
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  icon={Plus}
                  className="bg-purple-600 hover:bg-purple-500 text-xs font-black shadow-md"
                >
                  + Nueva Botella / Insumo
                </Button>
              </div>
            </div>

            {/* Barra de Búsqueda y Filtros de Categoría */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, marca, presentación (ej: Ron, 750ml, Tanqueray)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Checkbox de Bajo Stock */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyLowStock(!onlyLowStock)}
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    onlyLowStock
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 ring-1 ring-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>⚠️ Solo Bajo Stock ({lowStockCount})</span>
                </button>
              </div>
            </div>

          </div>

          {/* Tabla / Tarjetas de Inventario de Bar */}
          {filteredBarProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <Wine className="w-8 h-8 mx-auto text-slate-600 mb-1" />
              <p className="font-bold text-slate-300">No se encontraron botellas o insumos de bar</p>
              <p className="text-[11px] text-slate-500">Pulsa "+ Nueva Botella / Insumo" para registrar productos en la barra.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBarProducts.map(product => {
                const stock = Number(product.currentStock || 0);
                const min = Number(product.minStock || 0);
                const isLow = stock <= min;

                return (
                  <div
                    key={product.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-md ${
                      isLow
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/30 ring-1 ring-rose-500/30'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950 text-purple-300 border border-slate-800">
                            {product.category || 'Bar'}
                          </span>
                          <h4 className="text-sm font-black text-white mt-1 leading-snug">
                            {product.name}
                          </h4>
                          {product.brand && (
                            <p className="text-[11px] text-slate-400">
                              Marca: <strong className="text-slate-300">{product.brand}</strong> {product.presentation ? `• ${product.presentation}` : ''}
                            </p>
                          )}
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase border shrink-0 ${
                          isLow
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {isLow ? '⚠️ Stock Bajo' : '🟢 Óptimo'}
                        </span>
                      </div>

                      {/* Medidores de Stock */}
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Disponible:</span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            {stock} <span className="text-[11px] font-normal text-slate-400">{product.unit || 'botella'}</span>
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Stock Mínimo:</span>
                          <span className="text-xs font-bold text-amber-300 font-mono">
                            {min} {product.unit || 'botella'}
                          </span>
                        </div>
                      </div>

                      {product.cost > 0 && (
                        <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                          <span>Costo unitario:</span>
                          <span className="font-bold text-slate-200">${Number(product.cost).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Acciones Rápidas del Producto */}
                    <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setMovementModalState({ isOpen: true, type: 'ENTRY', defaultProductId: product.id })}
                          className="px-2 py-1 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 rounded-lg text-[11px] font-bold"
                          title="Ingresar botellas"
                        >
                          + Entrada
                        </button>
                        <button
                          onClick={() => setMovementModalState({ isOpen: true, type: 'EXIT', defaultProductId: product.id })}
                          className="px-2 py-1 bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-500/30 rounded-lg text-[11px] font-bold"
                          title="Registrar consumo o merma"
                        >
                          - Salida
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                          title="Editar producto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg"
                          title="Eliminar del inventario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* VISTA 3: HISTORIAL DE MOVIMIENTOS DE BARRA */}
      {activeTab === 'movements' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Historial de Entradas, Salidas y Mermas de Bar
            </h3>
            <p className="text-xs text-slate-400">
              Auditoría completa de movimientos realizados en barra con usuario, fecha y motivo
            </p>
          </div>

          {barMovements.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              No hay movimientos registrados en la barra aún.
            </div>
          ) : (
            <div className="space-y-2.5">
              {barMovements.map(mov => (
                <div
                  key={mov.id}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      mov.type === 'ENTRY'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {mov.type === 'ENTRY' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{mov.productName}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          mov.type === 'ENTRY' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          {mov.type === 'ENTRY' ? `+${mov.quantity} ${mov.unit || ''}` : `-${mov.quantity} ${mov.unit || ''}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Motivo: <strong className="text-slate-300">{mov.reason || 'Movimiento'}</strong> {mov.notes ? `• "${mov.notes}"` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-300 block font-bold">
                      {mov.userName || 'Marlon'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {mov.date || formatTime(mov.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal para ver ingredientes de bebidas */}
      {inspectingDrink && (
        <DishIngredientsModal
          isOpen={Boolean(inspectingDrink)}
          onClose={() => setInspectingDrink(null)}
          dish={inspectingDrink}
          orderContext={inspectingOrderContext}
        />
      )}

      {/* Modal de Crear / Editar Producto de Bar */}
      {isProductModalOpen && (
        <BarProductModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSave={handleSaveBarProduct}
          loading={modalLoading}
        />
      )}

      {/* Modal de Movimiento de Bar (+Entrada / -Salida) */}
      {movementModalState.isOpen && (
        <BarMovementModal
          isOpen={movementModalState.isOpen}
          onClose={() => setMovementModalState({ isOpen: false, type: 'ENTRY', defaultProductId: '' })}
          type={movementModalState.type}
          products={barProducts}
          defaultProductId={movementModalState.defaultProductId}
          onSave={handleSaveBarMovement}
          loading={modalLoading}
        />
      )}

      {/* Modal de Confirmación para Eliminar Producto */}
      {productToDelete && (
        <Modal
          isOpen={Boolean(productToDelete)}
          onClose={() => setProductToDelete(null)}
          title="Eliminar producto de Bar"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              ¿Estás seguro de que deseas eliminar permanentemente <strong>{productToDelete.name}</strong> del inventario del bar?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setProductToDelete(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteProduct} loading={modalLoading} icon={Trash2}>
                Eliminar Permanentemente
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
