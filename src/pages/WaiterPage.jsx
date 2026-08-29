import React, { useState, useEffect, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Minus, 
  Send, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChefHat, 
  Wine, 
  Sparkles, 
  X, 
  Search, 
  Filter, 
  Bell, 
  Flame, 
  CheckCircle, 
  Eye, 
  Coffee,
  FileText,
  Trash2,
  AlertCircle,
  RotateCcw,
  Receipt,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { MENU_CATEGORIES } from '../data/zenitRecipes';
import { recipeService } from '../services/recipeService';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ItemCustomizationModal } from '../components/orders/ItemCustomizationModal';
import { DishIngredientsModal } from '../components/orders/DishIngredientsModal';
import { OrderCancellationModal } from '../components/orders/OrderCancellationModal';
import { InvoiceDetailModal } from '../components/orders/InvoiceDetailModal';
import { TableCheckoutModal } from '../components/orders/TableCheckoutModal';
import { ALL_RESTAURANT_TABLES } from '../utils/constants';
import { formatNumber, formatTime, formatDateTime } from '../utils/formatters';

const TABLES = ALL_RESTAURANT_TABLES;

export const WaiterPage = () => {
  const { user } = useAuth();
  const { products } = useInventory();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders'
  const [selectedTable, setSelectedTable] = useState('Mesa 1');
  const [stationFilter, setStationFilter] = useState('ALL'); // 'ALL' | 'KITCHEN' | 'BAR'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ACTIVE'); // 'ACTIVE' | 'ALL' | 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // Modales
  const [customizingItem, setCustomizingItem] = useState(null);
  const [viewingDishIngredients, setViewingDishIngredients] = useState(null);
  const [cancellingOrderData, setCancellingOrderData] = useState(null);
  const [cancellingLoading, setCancellingLoading] = useState(false);
  const [itemToDeleteFromCart, setItemToDeleteFromCart] = useState(null);
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState(null);
  const [selectedTableForPrecount, setSelectedTableForPrecount] = useState(null);
  const [tableForCheckout, setTableForCheckout] = useState(null);

  const companyId = user?.companyId || 'default_company';

  // Suscripción a recetas maestras en vivo
  useEffect(() => {
    const unsub = recipeService.subscribeRecipes(companyId, (liveRecipes) => {
      setRecipes(liveRecipes);
    });
    return () => unsub();
  }, [companyId]);

  // Suscripción a pedidos en vivo
  useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (orders) => {
      setLiveOrders(orders);
    });
    return () => unsub();
  }, [companyId]);

  // Verificar disponibilidad de cada plato según stock real de inventario
  const dishesWithAvailability = useMemo(() => {
    return recipes.map(dish => {
      const isDrink = dish.category === 'Bebidas' || dish.category === 'Cócteles' || dish.category === 'Cócteles de Altura' || dish.destination === 'BAR';
      
      if (isDrink) {
        return {
          ...dish,
          destination: 'BAR',
          isAvailable: true,
          missing: []
        };
      }

      const validation = orderService.validateAvailability([{ recipe: dish, quantity: 1 }], products);
      return {
        ...dish,
        destination: 'KITCHEN',
        isAvailable: validation.isAvailable,
        missing: validation.missing
      };
    });
  }, [recipes, products]);

  // Filtrado de platos en pestaña Menú
  const filteredDishes = useMemo(() => {
    return dishesWithAvailability.filter(dish => {
      if (stationFilter === 'KITCHEN' && dish.destination !== 'KITCHEN') return false;
      if (stationFilter === 'BAR' && dish.destination !== 'BAR') return false;

      const matchCat = selectedCategory === 'ALL' || dish.category === selectedCategory;
      
      const q = search.toLowerCase().trim();
      const matchSearch = !q || 
        dish.name.toLowerCase().includes(q) || 
        dish.description?.toLowerCase().includes(q) ||
        dish.ingredients?.some(i => i.productName?.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [dishesWithAvailability, stationFilter, selectedCategory, search]);

  // Filtrado de comandas en pestaña Pedidos
  const filteredLiveOrders = useMemo(() => {
    return liveOrders.filter(order => {
      // Filtro de estado
      if (orderStatusFilter === 'ACTIVE') {
        if (order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) return false;
      } else if (orderStatusFilter !== 'ALL') {
        if (order.status !== orderStatusFilter) return false;
      }

      // Filtro de buscador (Mesa, Mesero, Plato, ID)
      const q = search.toLowerCase().trim();
      if (!q) return true;

      const matchTable = order.table?.toLowerCase().includes(q);
      const matchWaiter = order.waiterName?.toLowerCase().includes(q);
      const matchId = order.id?.toLowerCase().includes(q);
      const matchDish = order.items?.some(i => i.name?.toLowerCase().includes(q));

      return matchTable || matchWaiter || matchId || matchDish;
    });
  }, [liveOrders, orderStatusFilter, search]);

  // Agregar plato al carrito
  const addToCart = (dish) => {
    if (!dish.isAvailable) {
      showToast(`Este item no está disponible temporalmente por falta de insumos (${dish.missing?.map(m => m.productName).join(', ')}).`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id && !item.notes);
      if (existing) {
        return prev.map(item => (item.id === dish.id && !item.notes) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: dish.id + '_' + Date.now(),
        originalDishId: dish.id,
        name: dish.name,
        category: dish.category,
        destination: dish.destination,
        price: dish.price,
        quantity: 1,
        notes: '',
        customizations: {
          removedIngredients: [],
          substitutions: [],
          additions: [],
          allergens: []
        },
        recipe: dish
      }];
    });

    showToast(`${dish.name} agregado al pedido`, 'info');
  };

  // Modificar cantidad en carrito
  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) {
            setItemToDeleteFromCart(item);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  // Eliminar definitivamente del carrito
  const confirmDeleteFromCart = () => {
    if (itemToDeleteFromCart) {
      setCart(prev => prev.filter(i => i.id !== itemToDeleteFromCart.id));
      setItemToDeleteFromCart(null);
      showToast('Item eliminado de la comanda', 'info');
    }
  };

  // Guardar personalizaciones y notas del plato
  const handleSaveCustomization = (customizationData) => {
    if (customizingItem) {
      setCart(prev => prev.map(item => {
        if (item.id === customizingItem.id) {
          return {
            ...item,
            notes: customizationData.notes,
            customizations: customizationData.customizations
          };
        }
        return item;
      }));
      setCustomizingItem(null);
      showToast('Notas y modificaciones guardadas para el plato', 'success');
    }
  };

  // Total del carrito
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Enviar pedido a cocina y bar
  const handleSendOrder = async () => {
    if (cart.length === 0) {
      showToast('El pedido está vacío. Agrega al menos un plato o bebida.', 'error');
      return;
    }

    const validation = orderService.validateAvailability(cart, products);
    if (!validation.isAvailable) {
      const missingNames = validation.missing.map(m => `${m.productName} (Faltan ${(m.required - m.available).toFixed(2)} ${m.unit})`).join(', ');
      showToast(`No es posible enviar el pedido. Insumos insuficientes: ${missingNames}`, 'error');
      return;
    }

    setSendingOrder(true);
    try {
      await orderService.createOrder({
        table: selectedTable,
        items: cart,
        notes: generalNotes,
        companyId
      }, user, products);

      showToast(`¡Comanda enviada a Cocina y Bar con éxito para ${selectedTable}!`, 'success');
      setCart([]);
      setGeneralNotes('');
      setActiveTab('orders');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al enviar pedido', 'error');
    } finally {
      setSendingOrder(false);
    }
  };

  // Confirmar cancelación de comanda o item ya enviado
  const handleConfirmCancellation = async ({ orderId, itemId, reason }) => {
    setCancellingLoading(true);
    try {
      if (itemId) {
        await orderService.cancelOrderItem(orderId, itemId, reason, user, products);
        showToast('Plato cancelado exitosamente. Cocina y Bar han sido notificados.', 'info');
      } else {
        await orderService.cancelOrder(orderId, reason, user);
        showToast('Comanda anulada completamente.', 'info');
      }
      setCancellingOrderData(null);
    } catch (err) {
      showToast(err.message || 'Error al cancelar', 'error');
    } finally {
      setCancellingLoading(false);
    }
  };

  // Marcar pedido como entregado en mesa
  const handleMarkDelivered = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, ORDER_STATUS.DELIVERED, user);
      showToast('Pedido marcado como entregado en mesa', 'success');
    } catch (err) {
      showToast('Error al actualizar pedido', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return { label: '🟡 Pendiente', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
      case ORDER_STATUS.PREPARING:
        return { label: '🔵 En Preparación', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
      case ORDER_STATUS.READY:
        return { label: '🟢 ¡LISTO PARA RETIRAR!', bg: 'bg-emerald-500/30 text-emerald-200 border-emerald-400 font-black animate-bounce' };
      case ORDER_STATUS.DELIVERED:
        return { label: '⚫ Entregado', bg: 'bg-slate-800 text-slate-400 border-slate-700' };
      case ORDER_STATUS.CANCELLED:
        return { label: '🔴 Cancelado', bg: 'bg-rose-950/80 text-rose-300 border-rose-500/40' };
      default:
        return { label: status, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const activeOrdersCount = useMemo(() => {
    return liveOrders.filter(o => o.status !== ORDER_STATUS.DELIVERED && o.status !== ORDER_STATUS.CANCELLED).length;
  }, [liveOrders]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-20">
      
      {/* Header Operativo del Mesero */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-emerald-400" />
              Toma de Pedidos (Cocina & Bar)
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
              {user?.displayName || 'Mesero Zénit'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Atención de comandas en sala con enrutamiento automático a Cocina y Bar
          </p>
        </div>

        {/* Pestañas: Carta / Menú vs Comandas Activas */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('menu');
              setSearch('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Carta / Tomar Pedido</span>
            {cart.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-400 text-[10px] font-black">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              setSearch('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Comandas en Sala</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA AVANZADA MULTI-CRITERIO */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'menu'
                ? '🔍 Buscar plato, cóctel, ingrediente, categoría o descripción...'
                : '🔍 Buscar comanda por mesa (ej: Mesa 4), mesero, ID o nombre de plato...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros rápidos según la pestaña */}
        {activeTab === 'menu' ? (
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            {/* Filtro por Estación (Cocina vs Bar) */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">Estación:</span>
              <button
                onClick={() => setStationFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  stationFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🍽️ Todo
              </button>
              <button
                onClick={() => setStationFilter('KITCHEN')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  stationFilter === 'KITCHEN' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                🍳 Solo Cocina
              </button>
              <button
                onClick={() => setStationFilter('BAR')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  stationFilter === 'BAR' ? 'bg-purple-500 text-white font-black' : 'text-purple-400/80 hover:text-purple-300'
                }`}
              >
                🍸 Solo Bar
              </button>
            </div>

            {/* Selector de Mesa */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Mesa:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-1 font-bold focus:outline-none focus:border-emerald-500"
              >
                {TABLES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Filtrar Comandas:</span>
            {[
              { id: 'ACTIVE', label: `Activas (${activeOrdersCount})` },
              { id: 'ALL', label: `Todas (${liveOrders.length})` },
              { id: ORDER_STATUS.PENDING, label: '🟡 Pendientes' },
              { id: ORDER_STATUS.PREPARING, label: '🔵 En Preparación' },
              { id: ORDER_STATUS.READY, label: '🟢 Listas' },
              { id: ORDER_STATUS.DELIVERED, label: '⚫ Entregadas' },
              { id: ORDER_STATUS.CANCELLED, label: '🔴 Canceladas' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setOrderStatusFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  orderStatusFilter === f.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VISTA 1: CARTA / TOMA DE PEDIDOS */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA (2/3): CATÁLOGO DE PLATOS Y BEBIDAS */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Carrusel de Categorías */}
            <div className="overflow-x-auto pb-1 no-scrollbar">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'ALL'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Todas las Categorías
                </button>
                {MENU_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Platos y Cócteles (Vista Rápida sin fotos para meseros) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDishes.map(dish => {
                const isBar = dish.destination === 'BAR';

                return (
                  <div
                    key={dish.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                      dish.isAvailable
                        ? 'bg-slate-900/95 border-slate-800 hover:border-emerald-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Cabecera con Categoría, Estación y Disponibilidad */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-950 text-emerald-400 rounded-lg border border-slate-800">
                            {dish.category}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border ${
                            isBar 
                              ? 'bg-purple-950 text-purple-300 border-purple-500/40' 
                              : 'bg-amber-950 text-amber-300 border-amber-500/40'
                          }`}>
                            {isBar ? '🍸 Bar' : '🍳 Cocina'}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full border ${
                          dish.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}>
                          {dish.isAvailable ? '🟢 Disponible' : '🔴 Agotado'}
                        </span>
                      </div>

                      {/* Nombre y Precio */}
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-sm font-black text-slate-100 leading-snug">{dish.name}</h4>
                          <span className="text-sm font-black text-emerald-400 shrink-0">${dish.price?.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{dish.description}</p>
                      </div>

                      {/* Insumos resumidos */}
                      {dish.ingredients && dish.ingredients.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-300">Insumos: </span>
                          {dish.ingredients.map(i => `${i.productName}`).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setViewingDishIngredients(dish)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                      >
                        🔍 Ver ingredientes
                      </button>

                      <Button
                        size="sm"
                        variant={dish.isAvailable ? "primary" : "secondary"}
                        disabled={!dish.isAvailable}
                        onClick={() => addToCart(dish)}
                        icon={Plus}
                        className="text-xs py-1.5 px-3 font-bold"
                      >
                        {dish.isAvailable ? '+ Agregar' : 'Sin Stock'}
                      </Button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* COLUMNA DERECHA (1/3): COMANDA / CARRITO DE LA MESA */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl sticky top-20 space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">
                    Comanda - {selectedTable}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {totalItemsCount} Item(s)
                </span>
              </div>

              {/* Items del Carrito */}
              {cart.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No hay items en esta comanda. Selecciona platos de cocina o bebidas del bar a la izquierda.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="text-xs font-bold text-slate-100">{item.name}</h5>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                              item.destination === 'BAR' ? 'bg-purple-950 text-purple-300' : 'bg-amber-950 text-amber-300'
                            }`}>
                              {item.destination === 'BAR' ? 'Bar' : 'Cocina'}
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)} (${item.price.toFixed(2)} c/u)
                          </span>
                        </div>

                        {/* Controles de Cantidad y Eliminar */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1.5 bg-slate-900 rounded-xl p-1 border border-slate-800">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 text-slate-400 hover:text-rose-400"
                              title="Reducir o eliminar"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black text-slate-100 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 text-slate-400 hover:text-emerald-400"
                              title="Aumentar"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => setItemToDeleteFromCart(item)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Eliminar plato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Resumen de Nota / Modificación del plato */}
                      {item.notes ? (
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-2">
                          <div className="text-[11px] text-amber-200">
                            <strong className="text-amber-400">Nota: </strong>{item.notes}
                          </div>
                          <button
                            onClick={() => setCustomizingItem(item)}
                            className="text-[10px] text-amber-400 underline shrink-0 hover:text-amber-300"
                          >
                            Editar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCustomizingItem(item)}
                          className="w-full text-left text-[11px] text-slate-400 hover:text-amber-300 py-1 px-2 rounded-lg border border-dashed border-slate-800 hover:border-amber-500/40 flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span>+ Agregar Nota / Modificación (Término, Sin cebolla...)</span>
                        </button>
                      )}

                    </div>
                  ))}
                </div>
              )}

              {/* Observación General de la Mesa */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Instrucciones Generales de la Mesa:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Bebidas primero, mesa de cumpleaños..."
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Resumen de Total y Botón de Enviar */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-400">Total Comanda:</span>
                  <span className="text-lg font-black text-emerald-400">${cartTotal.toFixed(2)}</span>
                </div>

                <Button
                  fullWidth
                  variant="success"
                  disabled={cart.length === 0 || sendingOrder}
                  loading={sendingOrder}
                  onClick={handleSendOrder}
                  icon={Send}
                  className="py-3 text-sm font-black bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-950/50"
                >
                  ENVIAR A COCINA Y BAR
                </Button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* VISTA 2: ESTADO DE PEDIDOS & CANCELACIONES EN TIEMPO REAL */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Comandas en Sala ({filteredLiveOrders.length})
            </h3>
            
            <div className="flex items-center gap-2 flex-wrap">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    const tbl = e.target.value;
                    const tblOrders = liveOrders.filter(o => o.table === tbl && o.status !== ORDER_STATUS.CANCELLED);
                    setSelectedTableForPrecount({ 
                      tableName: tbl, 
                      orders: tblOrders,
                      waiters: Array.from(new Set(tblOrders.map(o => o.waiterName).filter(Boolean)))
                    });
                    setViewingInvoiceOrder(null);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="bg-slate-950 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none cursor-pointer shadow-md"
              >
                <option value="" disabled>📄 Consultar Precuenta por Mesa...</option>
                {TABLES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500 hidden md:inline">• En vivo desde Cocina y Bar</span>
            </div>
          </div>

          {filteredLiveOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="font-bold text-slate-300">No se encontraron comandas con el filtro seleccionado</p>
              <p className="text-[11px] text-slate-500">Prueba ajustando el término de búsqueda o cambiando el filtro de estado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLiveOrders.map(order => {
                const badge = getStatusBadge(order.status);
                const isReady = order.status === ORDER_STATUS.READY;
                const isCancelled = order.status === ORDER_STATUS.CANCELLED;

                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 shadow-xl ${
                      isReady
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-950/40 ring-2 ring-emerald-500/50'
                        : isCancelled
                        ? 'bg-rose-950/20 border-rose-900/60 opacity-60'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Encabezado: Mesa + Estado + Hora */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-xl font-black text-white block">
                            {order.table}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Por: <strong className="text-slate-200">{order.waiterName}</strong>
                          </span>
                        </div>

                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-mono mt-1">
                            {formatTime(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Lista de Platos en la Comanda */}
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2 rounded-xl text-xs flex items-start justify-between gap-2 ${
                              item.cancelled 
                                ? 'bg-rose-950/30 border border-rose-500/30 line-through text-rose-300'
                                : 'bg-slate-950 text-slate-200 border border-slate-800/80'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-emerald-400">{item.quantity}x</span>
                                <span className="font-bold">{item.name}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  item.destination === 'BAR' ? 'bg-purple-950 text-purple-300' : 'bg-amber-950 text-amber-300'
                                }`}>
                                  {item.destination === 'BAR' ? 'Bar' : 'Cocina'}
                                </span>
                              </div>

                              {/* Nota del plato */}
                              {item.notes && !item.cancelled && (
                                <div className="text-[10px] text-amber-300 font-medium">
                                  📝 {item.notes}
                                </div>
                              )}

                              {item.cancelled && (
                                <div className="text-[10px] text-rose-400 font-bold">
                                  🚫 Cancelado ({item.cancelReason || 'Por cliente'})
                                </div>
                              )}
                            </div>

                            {/* Botones de acción por plato */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setViewingDishIngredients({ ...item, recipe: item.recipe || item })}
                                className="p-1 text-slate-400 hover:text-slate-200"
                                title="Ver ingredientes"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {!item.cancelled && order.status !== ORDER_STATUS.DELIVERED && (
                                <button
                                  type="button"
                                  onClick={() => setCancellingOrderData({ order, item })}
                                  className="p-1 text-slate-500 hover:text-rose-400"
                                  title="Cancelar este plato"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                          </div>
                        ))}
                      </div>

                      {/* Observación General */}
                      {order.notes && (
                        <div className="p-2 rounded-xl bg-slate-950 text-xs text-amber-200 border border-amber-500/30">
                          <span className="font-bold">Nota Mesa: </span>{order.notes}
                        </div>
                      )}

                    </div>

                    {/* Acciones de Entrega / Anulación */}
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs pb-1">
                        <span className="text-slate-400">Total Comanda:</span>
                        <span className="text-sm font-black text-emerald-400">${Number(order.total || 0).toFixed(2)}</span>
                      </div>

                      {/* Botones de Factura y Cobro */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setViewingInvoiceOrder(order);
                            setSelectedTableForPrecount(null);
                          }}
                          icon={Receipt}
                          className="py-2 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 bg-slate-950/60"
                        >
                          Precuenta
                        </Button>

                        <Button
                          variant="success"
                          onClick={() => {
                            const tblOrders = liveOrders.filter(o => o.table === order.table && o.status !== ORDER_STATUS.CANCELLED);
                            setTableForCheckout({
                              tableName: order.table,
                              orders: tblOrders.length > 0 ? tblOrders : [order]
                            });
                          }}
                          icon={CreditCard}
                          className="py-2 text-[11px] font-black bg-emerald-600 hover:bg-emerald-500 shadow-md"
                        >
                          Cobrar Mesa
                        </Button>
                      </div>

                      {isReady && (
                        <Button
                          fullWidth
                          variant="success"
                          onClick={() => handleMarkDelivered(order.id)}
                          icon={CheckCircle2}
                          className="py-2.5 text-xs font-black bg-emerald-600 hover:bg-emerald-500"
                        >
                          MARCAR COMO ENTREGADO EN MESA
                        </Button>
                      )}

                      {!isCancelled && order.status !== ORDER_STATUS.DELIVERED && (
                        <Button
                          fullWidth
                          variant="outline"
                          onClick={() => setCancellingOrderData({ order, item: null })}
                          icon={Trash2}
                          className="py-2 text-[11px] font-bold text-slate-400 hover:text-rose-400 hover:border-rose-500/40"
                        >
                          Anular Comanda Completa
                        </Button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Personalización & Notas de Plato */}
      {customizingItem && (
        <ItemCustomizationModal
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
          item={customizingItem}
          onSave={handleSaveCustomization}
        />
      )}

      {/* Modal de Consulta de Ingredientes */}
      {viewingDishIngredients && (
        <DishIngredientsModal
          isOpen={Boolean(viewingDishIngredients)}
          onClose={() => setViewingDishIngredients(null)}
          dish={viewingDishIngredients}
        />
      )}

      {/* Modal de Cancelación de Plato / Comanda */}
      {cancellingOrderData && (
        <OrderCancellationModal
          isOpen={Boolean(cancellingOrderData)}
          onClose={() => setCancellingOrderData(null)}
          order={cancellingOrderData.order}
          item={cancellingOrderData.item}
          onConfirm={handleConfirmCancellation}
          loading={cancellingLoading}
        />
      )}

      {/* Modal de Confirmación para Eliminar Item del Carrito */}
      {itemToDeleteFromCart && (
        <Modal
          isOpen={Boolean(itemToDeleteFromCart)}
          onClose={() => setItemToDeleteFromCart(null)}
          title="Eliminar plato de la comanda"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              ¿Estás seguro de que deseas eliminar <strong>{itemToDeleteFromCart.name}</strong> del pedido actual?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setItemToDeleteFromCart(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDeleteFromCart} icon={Trash2}>
                Eliminar Plato
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Detalle de Factura / Precuenta */}
      {(viewingInvoiceOrder || selectedTableForPrecount) && (
        <InvoiceDetailModal
          isOpen={Boolean(viewingInvoiceOrder || selectedTableForPrecount)}
          onClose={() => {
            setViewingInvoiceOrder(null);
            setSelectedTableForPrecount(null);
          }}
          order={viewingInvoiceOrder}
          tableData={selectedTableForPrecount}
          inventoryProducts={products}
          currentUser={user}
        />
      )}

      {/* Modal de Cierre de Cuenta & División de Mesa */}
      {tableForCheckout && (
        <TableCheckoutModal
          isOpen={Boolean(tableForCheckout)}
          onClose={() => setTableForCheckout(null)}
          tableName={tableForCheckout.tableName}
          orders={tableForCheckout.orders}
          currentUser={user}
          onTableClosed={() => setTableForCheckout(null)}
        />
      )}

    </div>
  );
};

