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
  Coffee
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { ZENIT_RECIPES, MENU_CATEGORIES } from '../data/zenitRecipes';
import { orderService, ORDER_STATUS } from '../services/orderService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatNumber, formatTime } from '../utils/formatters';

const TABLES = [
  'Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5',
  'Mesa 6', 'Mesa 7', 'Mesa 8', 'Mesa 9', 'Mesa 10',
  'Mesa 11', 'Mesa 12', 'Barra 1', 'Barra 2', 'Terraza 1', 'Terraza 2'
];

export const WaiterPage = () => {
  const { user } = useAuth();
  const { products } = useInventory();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders'
  const [selectedTable, setSelectedTable] = useState('Mesa 1');
  const [stationFilter, setStationFilter] = useState('ALL'); // 'ALL' | 'KITCHEN' | 'BAR'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [selectedDishDetail, setSelectedDishDetail] = useState(null);

  const companyId = user?.companyId || 'default_company';

  // Suscripción a pedidos en vivo
  useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (orders) => {
      setLiveOrders(orders);
    });
    return () => unsub();
  }, [companyId]);

  // Verificar disponibilidad de cada plato según stock real de inventario
  const dishesWithAvailability = useMemo(() => {
    return ZENIT_RECIPES.map(dish => {
      const isDrink = dish.category === 'Bebidas' || dish.category === 'Cócteles' || dish.category === 'Cócteles de Altura' || dish.destination === 'BAR';
      const validation = orderService.validateAvailability([{ recipe: dish, quantity: 1 }], products);
      return {
        ...dish,
        destination: isDrink ? 'BAR' : 'KITCHEN',
        isAvailable: validation.isAvailable,
        missing: validation.missing
      };
    });
  }, [products]);

  // Filtrado de platos por estación (Cocina / Bar), categoría y buscador
  const filteredDishes = useMemo(() => {
    return dishesWithAvailability.filter(dish => {
      // Filtro de estación (Cocina / Bar)
      if (stationFilter === 'KITCHEN' && dish.destination !== 'KITCHEN') return false;
      if (stationFilter === 'BAR' && dish.destination !== 'BAR') return false;

      // Filtro de categoría
      const matchCat = selectedCategory === 'ALL' || dish.category === selectedCategory;
      
      // Filtro de texto
      const q = search.toLowerCase().trim();
      const matchSearch = !q || 
        dish.name.toLowerCase().includes(q) || 
        dish.description.toLowerCase().includes(q) ||
        dish.ingredients?.some(i => i.productName.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [dishesWithAvailability, stationFilter, selectedCategory, search]);

  // Agregar plato al carrito
  const addToCart = (dish) => {
    if (!dish.isAvailable) {
      showToast(`Este item no está disponible temporalmente por falta de insumos (${dish.missing?.map(m => m.productName).join(', ')}).`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: dish.id,
        name: dish.name,
        category: dish.category,
        destination: dish.destination,
        price: dish.price,
        quantity: 1,
        notes: '',
        recipe: dish
      }];
    });

    showToast(`${dish.name} agregado al pedido`, 'info');
  };

  // Modificar cantidad en carrito
  const updateQuantity = (dishId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === dishId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Modificar nota de plato
  const updateItemNotes = (dishId, notes) => {
    setCart(prev => prev.map(item => item.id === dishId ? { ...item, notes } : item));
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

    // Validar disponibilidad de toda la orden acumulada
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

      showToast(`¡Comanda enviada a Cocina y Bar con éxito para ${selectedTable}! Stock descontado automáticamente.`, 'success');
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
      default:
        return { label: status, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  // Pedidos activos (no entregados ni cancelados)
  const myActiveOrders = useMemo(() => {
    return liveOrders.filter(o => o.status !== ORDER_STATUS.CANCELLED);
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

        {/* Selector de Mesa y Pestañas */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Selector de Mesa */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">Mesa:</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-transparent text-sm font-black text-emerald-400 focus:outline-none cursor-pointer"
            >
              {TABLES.map(t => (
                <option key={t} value={t} className="bg-slate-900 text-slate-100">{t}</option>
              ))}
            </select>
          </div>

          {/* Switch de Vistas */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'menu'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🍽️ Menú & Comanda
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 Pedidos en Cocina & Bar
              {myActiveOrders.filter(o => o.status === ORDER_STATUS.READY).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* VISTA 1: MENÚ Y TOMA DE COMANDA */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA (2/3): CATÁLOGO DE PLATOS Y BEBIDAS */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filtro de Estación: Todo / Cocina / Bar */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => { setStationFilter('ALL'); setSelectedCategory('ALL'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  stationFilter === 'ALL'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Todo el Menú
              </button>

              <button
                onClick={() => { setStationFilter('KITCHEN'); setSelectedCategory('ALL'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  stationFilter === 'KITCHEN'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                🍳 Cocina & Parrilla
              </button>

              <button
                onClick={() => { setStationFilter('BAR'); setSelectedCategory('ALL'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  stationFilter === 'BAR'
                    ? 'bg-purple-500 text-slate-950 shadow-md font-black'
                    : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                <Wine className="w-3.5 h-3.5" />
                🍸 Bar & Bebidas
              </button>
            </div>

            {/* Buscador y Categorías */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ingrediente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Categorías en scroll horizontal */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
                          <span className="text-sm font-black text-emerald-400 shrink-0">${dish.price.toFixed(2)}</span>
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
                        onClick={() => setSelectedDishDetail(dish)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                      >
                        Ficha técnica
                      </button>

                      <Button
                        size="sm"
                        variant={dish.isAvailable ? "primary" : "secondary"}
                        disabled={!dish.isAvailable}
                        onClick={() => addToCart(dish)}
                        icon={Plus}
                        className="text-xs py-1.5 px-3"
                      >
                        {dish.isAvailable ? 'Agregar' : 'Sin Stock'}
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
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
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

                        {/* Cantidad +/- */}
                        <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-1 border border-slate-800">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-slate-100 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-slate-400 hover:text-emerald-400"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Observación por plato */}
                      <input
                        type="text"
                        placeholder="Ej: Con hielo, término medio, sin ají..."
                        value={item.notes}
                        onChange={(e) => updateItemNotes(item.id, e.target.value)}
                        className="w-full text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Observación General de la Mesa */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Instrucciones Generales:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Bebidas primero, cliente alérgico..."
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

      {/* VISTA 2: ESTADO DE PEDIDOS EN COCINA & BAR */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Comandas Activas en Sala ({myActiveOrders.length})
            </h3>
            <span className="text-xs text-slate-400">Actualización en tiempo real desde Cocina y Bar</span>
          </div>

          {myActiveOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              No hay comandas activas en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myActiveOrders.map(order => {
                const statusMeta = getStatusBadge(order.status);
                const isReady = order.status === ORDER_STATUS.READY;

                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 shadow-xl ${
                      isReady 
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/30' 
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-base font-black text-white block">{order.table}</span>
                          <span className="text-[10px] text-slate-400">Mesero: {order.waiterName}</span>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-xl border ${statusMeta.bg}`}>
                          {statusMeta.label}
                        </span>
                      </div>

                      {/* Lista de Platos y Bebidas */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between text-xs">
                            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                              <span>{item.quantity}x {item.name}</span>
                              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                item.category === 'Bebidas' ? 'bg-purple-950 text-purple-300' : 'bg-amber-950 text-amber-300'
                              }`}>
                                {item.category === 'Bebidas' ? 'Bar' : 'Cocina'}
                              </span>
                            </span>
                            {item.notes && (
                              <span className="text-[10px] text-amber-300 italic">({item.notes})</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="p-2 rounded-xl bg-slate-950 text-[11px] text-slate-300 border border-slate-800">
                          <span className="font-bold text-amber-400">Nota: </span>{order.notes}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">
                        Hora: {formatTime(order.createdAt)}
                      </span>

                      {isReady ? (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleMarkDelivered(order.id)}
                          icon={CheckCircle2}
                          className="text-xs font-bold"
                        >
                          Marcar Entregado
                        </Button>
                      ) : (
                        <span className="text-xs font-black text-emerald-400">
                          ${order.total?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Ficha Técnica del Plato */}
      {selectedDishDetail && (
        <Modal
          isOpen={Boolean(selectedDishDetail)}
          onClose={() => setSelectedDishDetail(null)}
          title={`Ficha Técnica: ${selectedDishDetail.name}`}
        >
          <div className="space-y-4">
            <div className="h-44 rounded-2xl overflow-hidden">
              <img
                src={selectedDishDetail.image}
                alt={selectedDishDetail.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-slate-300">{selectedDishDetail.description}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Precio de venta:</span>
                <span className="text-sm font-black text-emerald-400">${selectedDishDetail.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Insumos deducidos */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Descuento Automático de Inventario por Porción:
              </h5>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {selectedDishDetail.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">{ing.productName}</span>
                    <span className="font-bold text-emerald-400">{ing.grams} g ({(ing.grams / 1000).toFixed(3)} kg)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acompañamientos */}
            {selectedDishDetail.accompaniments && (
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Acompañamientos incluidos:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDishDetail.accompaniments.map((acc, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] bg-slate-800 text-slate-300">
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};
