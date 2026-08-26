import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { auditService } from './auditService';
import { getTodayDateString } from '../utils/formatters';

const DEMO_ORDERS_KEY = 'inventario_demo_orders';
const DEMO_PRODUCTS_KEY = 'inventario_demo_products';
const DEMO_MOVEMENTS_KEY = 'inventario_demo_movements';

export const ORDER_STATUS = {
  PENDING: 'PENDING',       // 🟡 Pendiente
  PREPARING: 'PREPARING',   // 🔵 Preparando
  READY: 'READY',           // 🟢 Listo para servir
  DELIVERED: 'DELIVERED',   // ⚫ Entregado
  CANCELLED: 'CANCELLED'    // 🔴 Cancelado
};

export const orderService = {
  // 1. Calcular deducciones agregadas de ingredientes para un carrito de pedidos
  calculateTotalIngredients(cartItems) {
    const requiredIngredients = {};

    cartItems.forEach(item => {
      const recipe = item.recipe;
      const qty = item.quantity || 1;

      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
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
    const required = this.calculateTotalIngredients(cartItems);
    const missing = [];

    required.forEach(req => {
      const product = inventoryProducts.find(p => p.name.toLowerCase() === req.productName.toLowerCase());
      const currentStock = Number(product?.currentStock || 0);

      // Si el producto se mide en kg, comparamos con totalKg; si no, comparamos con totalGrams o unidades
      const isKg = product?.unit === 'kg';
      const needed = isKg ? req.totalKg : req.totalKg; // stock en inventario está en kg/unidades

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
  async createOrder(orderData, user, inventoryProducts) {
    const { table, items, notes, companyId = DEFAULT_COMPANY_ID } = orderData;
    const todayStr = getTodayDateString();

    const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const requiredIngredients = this.calculateTotalIngredients(items);

    const orderDocData = {
      table: table || 'Mesa 1',
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || '',
        ingredients: item.recipe?.ingredients || []
      })),
      total,
      notes: notes || '',
      status: ORDER_STATUS.PENDING,
      waiterId: user?.uid || 'mesero_demo',
      waiterName: user?.displayName || 'Carolina (Mesero)',
      waiterEmail: user?.email || 'carolina@zenitmesero.com',
      date: todayStr,
      companyId,
      createdAt: isDemoMode ? new Date().toISOString() : serverTimestamp(),
      updatedAt: isDemoMode ? new Date().toISOString() : serverTimestamp()
    };

    if (isDemoMode) {
      // 1. Guardar pedido en localStorage
      const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
      const newOrder = {
        ...orderDocData,
        id: 'ord_' + Date.now(),
        createdAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('demo_orders_updated'));

      // 2. Descontar stock de productos en demo
      const products = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      const movements = JSON.parse(localStorage.getItem(DEMO_MOVEMENTS_KEY) || '[]');

      requiredIngredients.forEach(req => {
        const pIndex = products.findIndex(p => p.name.toLowerCase() === req.productName.toLowerCase());
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
            reason: `Pedido ${table} - Comanda de cocina`,
            notes: `Consumo automático por receta`,
            date: todayStr,
            createdAt: new Date().toISOString(),
            userName: user?.displayName || 'Carolina (Mesero)',
            userEmail: user?.email || 'carolina@zenitmesero.com',
            companyId
          });
        }
      });

      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
      localStorage.setItem(DEMO_MOVEMENTS_KEY, JSON.stringify(movements));
      window.dispatchEvent(new Event('demo_products_updated'));
      window.dispatchEvent(new Event('demo_movements_updated'));

      // 3. Auditoría
      await auditService.logAction(user, 'CREATE_ORDER', {
        table,
        dishes: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
        total: `$${total.toFixed(2)}`
      });

      return newOrder;
    }

    // ONLINE FIRESTORE: Batch transaction
    const batch = writeBatch(db);

    // A. Crear documento del Pedido en 'orders'
    const orderRef = doc(collection(db, 'orders'));
    batch.set(orderRef, {
      ...orderDocData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // B. Descontar ingredientes y crear movimientos de inventario automáticos
    const movementsRef = collection(db, 'movements');

    for (const req of requiredIngredients) {
      const product = inventoryProducts.find(p => p.name.toLowerCase() === req.productName.toLowerCase());
      if (product && product.id) {
        const prodRef = doc(db, 'products', product.id);
        const prevStock = Number(product.currentStock || 0);
        const deductQty = Number(req.totalKg.toFixed(3));
        const newStock = Number(Math.max(0, prevStock - deductQty).toFixed(3));

        // Actualizar stock de producto
        batch.update(prodRef, {
          currentStock: newStock,
          updatedAt: serverTimestamp()
        });

        // Registrar movimiento de salida automático
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
          reason: `Pedido ${table} - Comanda cocina`,
          notes: `Descuento automático por receta de cocina`,
          date: todayStr,
          userId: user?.uid || 'mesero',
          userName: user?.displayName || 'Carolina (Mesero)',
          userEmail: user?.email || 'carolina@zenitmesero.com',
          companyId,
          createdAt: serverTimestamp()
        });
      }
    }

    await batch.commit();

    // C. Registrar en bitácora de auditoría
    await auditService.logAction(user, 'CREATE_ORDER', {
      table,
      dishes: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      total: `$${total.toFixed(2)}`,
      message: `Comanda enviada a cocina para ${table}`
    });

    return { id: orderRef.id, ...orderDocData };
  },

  // 4. Suscripción en tiempo real a Pedidos de Cocina / Sala
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
        collection(db, 'orders'),
        where('companyId', '==', companyId)
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

  // 5. Actualizar estado del pedido (Cocina: Pendiente ➔ Preparando ➔ Listo ➔ Entregado)
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

      await auditService.logAction(user, 'ORDER_STATUS_CHANGED', {
        orderId,
        newStatus,
        message: `Estado de comanda cambiado a ${newStatus}`
      });
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    await auditService.logAction(user, 'ORDER_STATUS_CHANGED', {
      orderId,
      newStatus,
      message: `Comanda actualizada a estado: ${newStatus}`
    });
  }
};
