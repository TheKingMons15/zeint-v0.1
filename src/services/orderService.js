// =========================================================================
// SERVICIO DE PEDIDOS Y COMANDAS EN TIEMPO REAL (ZÉNIT KDS & SALA)
// Integración con deducción atómica de inventario y control de cancelaciones
// =========================================================================

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { getTodayDateString } from '../utils/formatters';
import { auditService } from './auditService';

const DEMO_ORDERS_KEY = 'zenit_demo_orders';
const DEMO_PRODUCTS_KEY = 'inventario_demo_products';
const DEMO_MOVEMENTS_KEY = 'inventario_demo_movements';

export const ORDER_STATUS = {
  PENDING: 'PENDING',       // 🟡 Recibido / Pendiente
  PREPARING: 'PREPARING',   // 🔵 En preparación / Parrilla / Coctelera
  READY: 'READY',           // 🟢 Listo para servir / en Barra
  DELIVERED: 'DELIVERED',   // ⚫ Entregado en mesa / Finalizado
  CANCELLED: 'CANCELLED'    // 🔴 Cancelado / Anulado
};

export const orderService = {
  // 1. Calcular insumos requeridos para los platos de la comanda
  calculateTotalIngredients(cartItems) {
    const requiredIngredients = {};

    cartItems.forEach(item => {
      if (item.cancelled) return; // Omitir items cancelados
      const recipe = item.recipe || item;
      const qty = item.quantity || 1;

      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          // Si el ingrediente fue retirado explícitamente por el comensal, no lo descontamos
          const isRemoved = item.customizations?.removedIngredients?.some(
            rem => rem.toLowerCase() === ing.productName.toLowerCase()
          );
          if (isRemoved) return;

          const grams = (ing.grams || 0) * qty;
          const kg = grams / 1000;

          if (!requiredIngredients[ing.productName]) {
            requiredIngredients[ing.productName] = {
              productName: ing.productName,
              totalGrams: 0,
              totalKg: 0
            };
          }
          requiredIngredients[ing.productName].totalGrams += grams;
          requiredIngredients[ing.productName].totalKg += kg;
        });
      }
    });

    return Object.values(requiredIngredients);
  },

  // 2. Validar disponibilidad de stock antes de enviar comanda
  validateAvailability(cartItems, inventoryProducts) {
    // Solo validamos ingredientes de platos de cocina (los de bar y bebidas están con stock full)
    const kitchenItems = cartItems.filter(item => {
      const isBar = item.destination === 'BAR' || 
                    item.category === 'Bebidas' || 
                    item.category === 'Cócteles de Altura' || 
                    (item.category || '').toLowerCase().includes('coctel');
      return !isBar;
    });

    const required = this.calculateTotalIngredients(kitchenItems);
    const missing = [];

    required.forEach(req => {
      const product = inventoryProducts.find(p => p.name?.toLowerCase() === req.productName?.toLowerCase());
      const currentStock = Number(product?.currentStock || 0);
      const needed = req.totalKg;

      if (!product || currentStock < needed) {
        missing.push({
          productName: req.productName,
          required: req.totalKg,
          available: currentStock,
          unit: product?.unit || 'kg'
        });
      }
    });

    return {
      isAvailable: missing.length === 0,
      missing
    };
  },

  // 3. Crear pedido en tiempo real con descuento automático de inventario
  async createOrder(orderData, user, inventoryProducts = []) {
    const { table, items, notes, companyId = DEFAULT_COMPANY_ID } = orderData;
    const todayStr = getTodayDateString();

    const activeItems = items.map(item => ({
      id: item.id || 'item_' + Math.random().toString(36).substring(2, 7),
      name: item.name,
      category: item.category || 'Varios',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      destination: item.destination || (item.category === 'Bebidas' || item.category === 'Cócteles de Altura' ? 'BAR' : 'KITCHEN'),
      notes: item.notes || '',
      customizations: item.customizations || {
        removedIngredients: [],
        substitutions: [],
        additions: [],
        allergens: []
      },
      ingredients: item.recipe?.ingredients || item.ingredients || [],
      accompaniments: item.recipe?.accompaniments || item.accompaniments || [],
      cancelled: false,
      cancelledAt: null,
      cancelledBy: null,
      cancelReason: ''
    }));

    const total = activeItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const requiredIngredients = this.calculateTotalIngredients(activeItems);

    const orderDocData = {
      table: table || 'Mesa 1',
      items: activeItems,
      total,
      notes: notes || '',
      status: ORDER_STATUS.PENDING,
      waiterId: user?.uid || 'mesero_demo',
      waiterName: user?.displayName || 'Mesero',
      waiterEmail: user?.email || '',
      date: todayStr,
      companyId,
      createdAt: isDemoMode ? new Date().toISOString() : serverTimestamp(),
      updatedAt: isDemoMode ? new Date().toISOString() : serverTimestamp()
    };

    if (isDemoMode) {
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
      const newOrder = {
        ...orderDocData,
        id: 'ord_' + Date.now(),
        createdAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('demo_orders_updated'));

      // Descontar inventario local
      const products = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      const movements = JSON.parse(localStorage.getItem(DEMO_MOVEMENTS_KEY) || '[]');

      requiredIngredients.forEach(req => {
        const pIndex = products.findIndex(p => p.name?.toLowerCase() === req.productName?.toLowerCase());
        if (pIndex !== -1) {
          const prev = Number(products[pIndex].currentStock || 0);
          const deduct = Number(req.totalKg.toFixed(3));
          const newStock = Number(Math.max(0, prev - deduct).toFixed(3));

          products[pIndex].currentStock = newStock;
          movements.unshift({
            id: 'mov_' + Date.now() + '_' + Math.random(),
            type: 'EXIT',
            productId: products[pIndex].id,
            productName: products[pIndex].name,
            category: products[pIndex].category,
            unit: products[pIndex].unit,
            quantity: deduct,
            previousStock: prev,
            newStock,
            reason: `Pedido ${table} - Comanda`,
            notes: `Consumo automático por receta`,
            date: todayStr,
            createdAt: new Date().toISOString(),
            userName: user?.displayName || 'Mesero',
            userEmail: user?.email || '',
            companyId
          });
        }
      });

      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
      localStorage.setItem(DEMO_MOVEMENTS_KEY, JSON.stringify(movements));
      window.dispatchEvent(new Event('demo_products_updated'));
      window.dispatchEvent(new Event('demo_movements_updated'));

      try {
        await auditService.logAction(user, 'CREATE_ORDER', {
          table,
          dishes: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
          total: `$${total.toFixed(2)}`
        });
      } catch (e) {
        console.warn(e);
      }

      return newOrder;
    }

    // ONLINE FIRESTORE: Batch transaction
    const batch = writeBatch(db);

    const orderDocId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const orderRef = doc(db, 'products', orderDocId);
    
    batch.set(orderRef, {
      id: orderDocId,
      name: `Comanda ${table}`,
      minStock: 0,
      isOrder: true,
      ...orderDocData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Descontar insumos automáticos
    const movementsRef = collection(db, 'movements');

    for (const req of requiredIngredients) {
      const product = inventoryProducts.find(p => p.name?.toLowerCase() === req.productName?.toLowerCase());
      if (product && product.id && !product.isOrder) {
        const prodRef = doc(db, 'products', product.id);
        const prevStock = Number(product.currentStock || 0);
        const deductQty = Number(req.totalKg.toFixed(3));
        const newStock = Number(Math.max(0, prevStock - deductQty).toFixed(3));

        batch.update(prodRef, {
          currentStock: newStock,
          updatedAt: serverTimestamp()
        });

        const movRef = doc(movementsRef);
        batch.set(movRef, {
          type: 'EXIT',
          productId: product.id,
          productName: product.name,
          category: product.category,
          unit: product.unit,
          quantity: deductQty,
          previousStock: prevStock,
          newStock,
          reason: `Pedido ${table} - Comanda`,
          notes: `Descuento automático por receta`,
          date: todayStr,
          userId: user?.uid || 'mesero',
          userName: user?.displayName || 'Mesero',
          userEmail: user?.email || '',
          companyId,
          createdAt: serverTimestamp()
        });
      }
    }

    await batch.commit();

    try {
      await auditService.logAction(user, 'CREATE_ORDER', {
        table,
        dishes: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
        total: `$${total.toFixed(2)}`,
        message: `Comanda enviada para ${table}`
      });
    } catch (auditErr) {
      console.warn("No se pudo registrar log de auditoría:", auditErr.message);
    }

    return { id: orderDocId, ...orderDocData };
  },

  // 4. Suscripción en tiempo real a Pedidos de Cocina / Bar / Sala
  subscribeOrders(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_ORDERS_KEY);
      if (!stored) {
        localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify([]));
        stored = '[]';
      }
      callback(JSON.parse(stored));

      const handleStorage = () => {
        const data = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
        callback(data);
      };
      window.addEventListener('demo_orders_updated', handleStorage);
      return () => window.removeEventListener('demo_orders_updated', handleStorage);
    }

    try {
      const q = query(
        collection(db, 'products'),
        where('isOrder', '==', true)
      );

      return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Ordenar por fecha descendente
        orders.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        callback(orders);
      }, (error) => {
        console.error("Error subscribing to orders in Firestore:", error);
        callback([]);
      });
    } catch (e) {
      console.error("Exception in orderService.subscribeOrders:", e);
      callback([]);
      return () => {};
    }
  },

  // 5. Actualizar estado del pedido (Pendiente ➔ Preparando ➔ Listo ➔ Entregado)
  async updateOrderStatus(orderId, newStatus, user) {
    if (isDemoMode) {
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
      const index = orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        orders[index].status = newStatus;
        orders[index].updatedAt = new Date().toISOString();
        localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
        window.dispatchEvent(new Event('demo_orders_updated'));
      }

      try {
        await auditService.logAction(user, 'ORDER_STATUS_CHANGED', {
          orderId,
          newStatus,
          message: `Estado de comanda cambiado a ${newStatus}`
        });
      } catch (e) {
        console.warn("Audit error:", e);
      }
      return;
    }

    const orderRef = doc(db, 'products', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    try {
      await auditService.logAction(user, 'ORDER_STATUS_CHANGED', {
        orderId,
        newStatus,
        message: `Comanda actualizada a estado: ${newStatus}`
      });
    } catch (e) {
      console.warn("Audit error:", e);
    }
  },

  // 6. Cancelar un producto específico dentro de una comanda ya enviada
  async cancelOrderItem(orderId, itemIndexOrId, reason = 'Cancelado por el cliente', user, inventoryProducts = []) {
    if (isDemoMode) {
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
      const index = orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        const order = orders[index];
        const itemIdx = typeof itemIndexOrId === 'number' ? itemIndexOrId : order.items.findIndex(i => i.id === itemIndexOrId);
        if (itemIdx !== -1) {
          order.items[itemIdx].cancelled = true;
          order.items[itemIdx].cancelledAt = new Date().toISOString();
          order.items[itemIdx].cancelledBy = user?.displayName || 'Mesero';
          order.items[itemIdx].cancelReason = reason;

          // Recalcular total activo
          const activeTotal = order.items
            .filter(i => !i.cancelled)
            .reduce((sum, i) => sum + (i.price * i.quantity), 0);
          order.total = activeTotal;

          // Si todos los items fueron cancelados, marcar orden como CANCELLED
          if (order.items.every(i => i.cancelled)) {
            order.status = ORDER_STATUS.CANCELLED;
          }

          order.updatedAt = new Date().toISOString();
          localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
          window.dispatchEvent(new Event('demo_orders_updated'));
        }
      }
      return;
    }

    const orderRef = doc(db, 'products', orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) throw new Error("La comanda no existe");

    const orderData = snap.data();
    const items = [...(orderData.items || [])];

    const itemIdx = typeof itemIndexOrId === 'number' ? itemIndexOrId : items.findIndex(i => i.id === itemIndexOrId);
    if (itemIdx === -1) throw new Error("El plato no fue encontrado en la comanda");

    items[itemIdx] = {
      ...items[itemIdx],
      cancelled: true,
      cancelledAt: new Date().toISOString(),
      cancelledBy: user?.displayName || 'Mesero',
      cancelReason: reason
    };

    const activeTotal = items
      .filter(i => !i.cancelled)
      .reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const allCancelled = items.every(i => i.cancelled);

    await updateDoc(orderRef, {
      items,
      total: activeTotal,
      status: allCancelled ? ORDER_STATUS.CANCELLED : orderData.status,
      lastCancelledItem: {
        name: items[itemIdx].name,
        table: orderData.table,
        cancelledBy: user?.displayName || 'Mesero',
        reason,
        timestamp: Date.now()
      },
      updatedAt: serverTimestamp()
    });

    try {
      await auditService.logAction(user, 'CANCEL_ORDER_ITEM', {
        orderId,
        table: orderData.table,
        dishName: items[itemIdx].name,
        reason,
        message: `Plato "${items[itemIdx].name}" cancelado en ${orderData.table}. Motivo: ${reason}`
      });
    } catch (e) {
      console.warn("Audit error:", e);
    }
  },

  // 7. Cancelar la comanda completa
  async cancelOrder(orderId, reason = 'Cancelado por el cliente', user) {
    if (isDemoMode) {
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
      const index = orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        orders[index].status = ORDER_STATUS.CANCELLED;
        orders[index].cancelledAt = new Date().toISOString();
        orders[index].cancelledBy = user?.displayName || 'Mesero';
        orders[index].cancelReason = reason;
        orders[index].items?.forEach(i => {
          i.cancelled = true;
          i.cancelledAt = new Date().toISOString();
          i.cancelledBy = user?.displayName || 'Mesero';
          i.cancelReason = reason;
        });
        orders[index].updatedAt = new Date().toISOString();
        localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
        window.dispatchEvent(new Event('demo_orders_updated'));
      }
      return;
    }

    const orderRef = doc(db, 'products', orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) throw new Error("La comanda no existe");

    const orderData = snap.data();
    const items = (orderData.items || []).map(i => ({
      ...i,
      cancelled: true,
      cancelledAt: new Date().toISOString(),
      cancelledBy: user?.displayName || 'Mesero',
      cancelReason: reason
    }));

    await updateDoc(orderRef, {
      status: ORDER_STATUS.CANCELLED,
      items,
      cancelledAt: new Date().toISOString(),
      cancelledBy: user?.displayName || 'Mesero',
      cancelReason: reason,
      lastCancelledOrder: {
        table: orderData.table,
        cancelledBy: user?.displayName || 'Mesero',
        reason,
        timestamp: Date.now()
      },
      updatedAt: serverTimestamp()
    });

    try {
      await auditService.logAction(user, 'CANCEL_FULL_ORDER', {
        orderId,
        table: orderData.table,
        reason,
        message: `Comanda de ${orderData.table} anulada completamente. Motivo: ${reason}`
      });
    } catch (e) {
      console.warn("Audit error:", e);
    }
  }
};
