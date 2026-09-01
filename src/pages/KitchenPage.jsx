import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
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
  AlertTriangle,
  Boxes,
  Layers
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { Button } from '../components/common/Button';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { DishIngredientsModal } from '../components/orders/DishIngredientsModal';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { ProductCard } from '../components/products/ProductCard';
import { CategoryFilterBar } from '../components/products/CategoryFilterBar';
import { formatTime, formatDateTime, formatNumber } from '../utils/formatters';
import { KITCHEN_CATEGORIES, isKitchenProduct } from '../utils/constants';

export const KitchenPage = () => {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const { showToast } = useToast();
  const { handleOpenMovementModal } = useOutletContext() || {};

  // Modo de pantalla: 'ORDERS' (KDS Comandas) | 'STOCK' (Inventario de Cocina)
  const [kitchenMode, setKitchenMode] = useState('ORDERS');

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ACTIVE'); // 'ACTIVE' | 'PENDING' | 'PREPARING' | 'READY' | 'ALL'
  const [search, setSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategory, setStockCategory] = useState('ALL');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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

      // Buscador
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTable = (order.table || '').toLowerCase().includes(q);
        const matchItems = order.kitchenItems?.some(i => i.name.toLowerCase().includes(q) || (i.notes && i.notes.toLowerCase().includes(q)));
        const matchWaiter = (order.waiterName || '').toLowerCase().includes(q);
        return matchTable || matchItems || matchWaiter;
      }

      return true;
    });
  }, [kitchenOrders, filterStatus, search]);

  // Contadores de Cocina
  const pendingCount = useMemo(() => kitchenOrders.filter(o => o.status === ORDER_STATUS.PENDING).length, [kitchenOrders]);
  const preparingCount = useMemo(() => kitchenOrders.filter(o => o.status === ORDER_STATUS.PREPARING).length, [kitchenOrders]);
  const readyCount = useMemo(() => kitchenOrders.filter(o => o.status === ORDER_STATUS.READY).length, [kitchenOrders]);

  const getStatusCardStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'apple-glass-card border-amber-500/40 shadow-apple-glow-amber';
      case ORDER_STATUS.PREPARING:
        return 'apple-glass-card border-sky-500/40 shadow-apple-glow-blue';
      case ORDER_STATUS.READY:
        return 'apple-glass-card border-emerald-500/40 shadow-apple-glow-emerald';
      case ORDER_STATUS.CANCELLED:
        return 'bg-black/50 border-rose-500/30 opacity-70';
      default:
        return 'apple-glass border-white/10 opacity-70';
    }
  };

  const handleInspectDish = (item, order) => {
    setInspectingDish({
      id: item.recipeId || item.id,
      name: item.name,
      category: item.category || 'Cocina',
      price: item.price,
      destination: item.destination || 'KITCHEN'
    });
    setInspectingOrderContext({
      table: order.table,
      waiter: order.waiterName,
      time: order.createdAt
    });
  };

  const filterOptions = [
    { value: 'ACTIVE', label: 'Activas', count: pendingCount + preparingCount + readyCount },
    { value: ORDER_STATUS.PENDING, label: 'Pendientes', count: pendingCount },
    { value: ORDER_STATUS.PREPARING, label: 'En Parrilla', count: preparingCount },
    { value: ORDER_STATUS.READY, label: 'Listas', count: readyCount },
    { value: 'ALL', label: 'Historial', count: kitchenOrders.length }
  ];

  // Insumos exclusivos de Cocina
  const kitchenProducts = useMemo(() => {
    return products.filter(isKitchenProduct);
  }, [products]);

  // Insumos de Cocina filtrados por categoría y buscador
  const filteredKitchenProducts = useMemo(() => {
    return kitchenProducts.filter(p => {
      const matchCat = stockCategory === 'ALL' || p.category === stockCategory;
      const q = stockSearch.toLowerCase().trim();
      const matchSearch = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.unit?.toLowerCase().includes(q) ||
        p.notes?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [kitchenProducts, stockCategory, stockSearch]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`¿Eliminar "${product.name}" del inventario de cocina?`)) {
      await deleteProduct(product.id, product.name);
      showToast(`Insumo "${product.name}" eliminado`, 'info');
    }
  };

  const handleProductSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showToast(`Insumo "${formData.name}" actualizado.`, 'success');
      } else {
        await addProduct(formData);
        showToast(`Insumo "${formData.name}" registrado en cocina.`, 'success');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      showToast(err.message || 'Error al guardar insumo', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const mainTabs = [
    { value: 'ORDERS', label: 'Comandas KDS', icon: ChefHat, count: kitchenOrders.length },
    { value: 'STOCK', label: 'Stock de Cocina', icon: Boxes, count: kitchenProducts.length }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-apple-fade pb-20">
      
      {/* Header Operativo de Cocina */}
      <div className="p-6 sm:p-7 rounded-3xl apple-glass-sheet border border-white/15 shadow-apple-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-apple-glow-amber">
              <ChefHat className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Estación de Cocina & Parrilla
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  {user?.displayName || 'Cocina Zénit'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Despacho de comandas en tiempo real y control de existencias de cocina
              </p>
            </div>
          </div>
        </div>

        {/* Selector de Modo Principal (Comandas KDS vs Stock de Cocina) y Botón de Agregar */}
        <div className="flex items-center gap-3 flex-wrap">
          <SegmentedControl
            options={mainTabs}
            value={kitchenMode}
            onChange={setKitchenMode}
            size="md"
          />

          <Button
            size="sm"
            variant="amber"
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            icon={PackagePlus}
            className="text-xs font-black shadow-apple-glow-amber"
          >
            + Insumo Cocina
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODO 1: COMANDAS KDS                                                      */}
      {/* ========================================================================= */}
      {kitchenMode === 'ORDERS' && (
        <div className="space-y-5">
          {/* Sub-Header con Filtros de Estado y Buscador de Comandas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <SegmentedControl
              options={filterOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              size="sm"
            />

            <div className="p-2.5 px-3.5 rounded-2xl apple-glass-card border border-white/10 flex items-center gap-2.5 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar por mesa (ej: Mesa 3), plato o instrucción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
              />
              {search && (
                <button onClick={() => setSearch('')} className="p-1 text-slate-400 hover:text-white rounded-full bg-white/10">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
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
    </div>
  )}

      {/* ========================================================================= */}
      {/* MODO 2: STOCK E INVENTARIO DIRECTO DE COCINA                              */}
      {/* ========================================================================= */}
      {kitchenMode === 'STOCK' && (
        <div className="space-y-5 animate-apple-fade">
          
          {/* Barra de Búsqueda Rápida de Stock de Cocina */}
          <div className="p-4 rounded-3xl apple-glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="🔍 Buscar proteína o insumo (ej: camarón, costilla, carne de hamburguesa, chinchulines, cuerito)..."
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
              />
              {stockSearch && (
                <button 
                  onClick={() => setStockSearch('')} 
                  className="p-1 text-slate-400 hover:text-white rounded-full bg-white/10"
                  title="Limpiar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <Button
              size="sm"
              variant="amber"
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              icon={Plus}
              className="text-xs font-black shrink-0"
            >
              + Agregar Insumo Faltante
            </Button>
          </div>

          {/* Filtro de Categorías de Cocina */}
          <CategoryFilterBar
            selectedCategory={stockCategory}
            onSelectCategory={setStockCategory}
            categories={KITCHEN_CATEGORIES}
          />

          {/* Grid de Insumos de Cocina con Botones de Entrada y Salida */}
          {filteredKitchenProducts.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Boxes className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
              <h3 className="text-base font-bold text-slate-300">
                No se encontraron insumos de cocina
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hay productos en esta categoría o búsqueda. Puedes agregar uno nuevo ahora mismo.
              </p>
              <Button
                variant="amber"
                size="sm"
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                icon={Plus}
                className="mt-2"
              >
                + Crear Insumo en Cocina
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredKitchenProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onQuickEntry={(p) => handleOpenMovementModal && handleOpenMovementModal('ENTRY', p.id)}
                  onQuickExit={(p) => handleOpenMovementModal && handleOpenMovementModal('EXIT', p.id)}
                />
              ))}
            </div>
          )}

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

      {/* Modal para que Cocina registre o edite un insumo */}
      {isProductModalOpen && (
        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          initialData={editingProduct}
          loading={modalLoading}
          defaultLocation="Cocina"
          onSubmit={handleProductSubmit}
        />
      )}

    </div>
  );
};
