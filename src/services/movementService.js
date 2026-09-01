import { 
  collection, 
  doc, 
  getDocs,
  runTransaction, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { getTodayDateString } from '../utils/formatters';
import { auditService } from './auditService';

const DEMO_MOVEMENTS_KEY = 'inventario_demo_movements';
const DEMO_PRODUCTS_KEY = 'inventario_demo_products';

const todayStr = getTodayDateString();
const INITIAL_DEMO_MOVEMENTS = [
  {
    id: 'mov_1',
    type: 'ENTRY',
    productId: 'prod_1',
    productName: 'Filete de pollo',
    category: 'Proteínas',
    unit: 'kg',
    quantity: 15.0,
    previousStock: 0,
    newStock: 15.0,
    reason: 'Compra a Proveedor',
    notes: 'Recibido fresco para producción',
    date: todayStr,
    createdAt: new Date().toISOString(),
    userName: 'Karen (Administrador)',
    userEmail: 'karenadmin@zenit.com',
    companyId: DEFAULT_COMPANY_ID
  }
];

export const movementService = {
  // Suscripción a movimientos (últimos 100 movimientos ordenados por fecha)
  subscribe(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_MOVEMENTS_KEY);
      if (!stored) {
        localStorage.setItem(DEMO_MOVEMENTS_KEY, JSON.stringify(INITIAL_DEMO_MOVEMENTS));
        stored = JSON.stringify(INITIAL_DEMO_MOVEMENTS);
      }
      callback(JSON.parse(stored));

      const handleStorage = () => {
        const data = JSON.parse(localStorage.getItem(DEMO_MOVEMENTS_KEY) || '[]');
        callback(data);
      };
      window.addEventListener('demo_movements_updated', handleStorage);
      return () => window.removeEventListener('demo_movements_updated', handleStorage);
    }

    try {
      const q = query(
        collection(db, 'movements'),
        where('companyId', '==', companyId)
      );

      return onSnapshot(q, (snapshot) => {
        const movements = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Ordenamiento seguro en memoria por fecha descendente
        movements.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || a.date || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || b.date || 0);
          return dateB - dateA;
        });

        callback(movements);
      }, (error) => {
        console.error("Error subscribing to movements in Firestore:", error);
        callback([]);
      });
    } catch (e) {
      console.error("Exception in movementService.subscribe:", e);
      callback([]);
      return () => {};
    }
  },

  // Consulta directa y rápida de movimientos en segundo plano
  async fetchFreshMovements(companyId = DEFAULT_COMPANY_ID) {
    if (isDemoMode) {
      return JSON.parse(localStorage.getItem(DEMO_MOVEMENTS_KEY) || '[]');
    }
    try {
      const q = query(
        collection(db, 'movements'),
        where('companyId', '==', companyId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || a.date || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || b.date || 0);
        return dateB - dateA;
      });
      return items;
    } catch (e) {
      console.warn("Background movement sync notice:", e.message);
      return [];
    }
  },

  // Registrar movimiento (Entrada o Salida) con transacción atómica y auditoría
  async registerMovement(movementData, user) {
    const { productId, type, quantity, reason, notes, date } = movementData;
    const qty = Number(quantity);

    if (!productId) throw new Error("Debe seleccionar un producto");
    if (!qty || qty <= 0) throw new Error("La cantidad debe ser mayor a 0");
    if (!type || !['ENTRY', 'EXIT'].includes(type)) throw new Error("Tipo de movimiento inválido");

    const movementDate = date || getTodayDateString();

    if (isDemoMode) {
      const products = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      const productIndex = products.findIndex(p => p.id === productId);

      if (productIndex === -1) throw new Error("Producto no encontrado");

      const product = products[productIndex];
      const previousStock = Number(product.currentStock || 0);
      let newStock = 0;

      if (type === 'ENTRY') {
        newStock = previousStock + qty;
      } else {
        newStock = previousStock - qty;
      }

      // Actualizar producto en demo
      products[productIndex].currentStock = newStock;
      products[productIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event('demo_products_updated'));

      // Crear movimiento en demo
      const movements = JSON.parse(localStorage.getItem(DEMO_MOVEMENTS_KEY) || '[]');
      const createdMovement = {
        id: 'mov_' + Date.now(),
        type,
        productId: product.id,
        productName: product.name,
        category: product.category,
        unit: product.unit,
        quantity: qty,
        previousStock,
        newStock,
        reason: reason || (type === 'ENTRY' ? 'Entrada manual' : 'Salida manual'),
        notes: notes || '',
        date: movementDate,
        createdAt: new Date().toISOString(),
        userId: user?.uid || 'demo_user',
        userName: user?.displayName || 'Usuario',
        userEmail: user?.email || 'usuario@zenit.com',
        companyId: user?.companyId || DEFAULT_COMPANY_ID
      };

      movements.unshift(createdMovement);
      localStorage.setItem(DEMO_MOVEMENTS_KEY, JSON.stringify(movements));
      window.dispatchEvent(new Event('demo_movements_updated'));

      // Registrar en bitácora de auditoría
      await auditService.logAction(user, type === 'ENTRY' ? 'ENTRY_MOVEMENT' : 'EXIT_MOVEMENT', {
        product: product.name,
        category: product.category,
        quantity: `${type === 'ENTRY' ? '+' : '-'}${qty} ${product.unit}`,
        stockChange: `${previousStock} → ${newStock} ${product.unit}`,
        reason: createdMovement.reason,
        notes: notes || ''
      });

      return createdMovement;
    }

    // Transacción atómica en Firestore
    const result = await runTransaction(db, async (transaction) => {
      const productRef = doc(db, 'products', productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists()) {
        throw new Error("El producto seleccionado no existe en la base de datos");
      }

      const productData = productDoc.data();
      const previousStock = Number(productData.currentStock || 0);
      let newStock = 0;

      if (type === 'ENTRY') {
        newStock = previousStock + qty;
      } else {
        newStock = previousStock - qty;
      }

      // 1. Actualizar stock del producto
      transaction.update(productRef, {
        currentStock: newStock,
        updatedAt: serverTimestamp()
      });

      // 2. Crear documento de movimiento
      const movementRef = doc(collection(db, 'movements'));
      const newMovement = {
        type,
        productId: productDoc.id,
        productName: productData.name,
        category: productData.category,
        unit: productData.unit,
        quantity: qty,
        previousStock,
        newStock,
        reason: reason || (type === 'ENTRY' ? 'Entrada manual' : 'Salida manual'),
        notes: notes || '',
        date: movementDate,
        createdAt: serverTimestamp(),
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || 'Usuario',
        userEmail: user?.email || '',
        companyId: user?.companyId || DEFAULT_COMPANY_ID
      };

      transaction.set(movementRef, newMovement);

      return { 
        id: movementRef.id, 
        ...newMovement,
        productName: productData.name,
        unit: productData.unit,
        category: productData.category
      };
    });

    // Registrar en auditoría
    await auditService.logAction(user, type === 'ENTRY' ? 'ENTRY_MOVEMENT' : 'EXIT_MOVEMENT', {
      product: result.productName,
      category: result.category,
      quantity: `${type === 'ENTRY' ? '+' : '-'}${qty} ${result.unit}`,
      stockChange: `${result.previousStock} → ${result.newStock} ${result.unit}`,
      reason: result.reason,
      notes: notes || ''
    });

    return result;
  }
};
