import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';

const DEMO_PRODUCTS_KEY = 'inventario_demo_products';

// Datos iniciales de demostración con las categorías solicitadas
const INITIAL_DEMO_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Tomate Chonto',
    category: 'Vegetales',
    unit: 'kg',
    currentStock: 35.5,
    minStock: 10.0,
    initialStock: 40.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_2',
    name: 'Cebolla Cabezona',
    category: 'Vegetales',
    unit: 'kg',
    currentStock: 8.0, // Stock bajo
    minStock: 15.0,
    initialStock: 25.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_3',
    name: 'Pechuga de Pollo Fresca',
    category: 'Carnes',
    unit: 'kg',
    currentStock: 48.0,
    minStock: 12.0,
    initialStock: 50.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_4',
    name: 'Carne Molida Especial',
    category: 'Carnes',
    unit: 'kg',
    currentStock: 5.0, // Stock bajo
    minStock: 10.0,
    initialStock: 20.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_5',
    name: 'Queso Mozzarella Bloque',
    category: 'Quesos',
    unit: 'kg',
    currentStock: 22.0,
    minStock: 8.0,
    initialStock: 25.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_6',
    name: 'Queso Campesino Fresco',
    category: 'Quesos',
    unit: 'kg',
    currentStock: 3.5, // Stock bajo
    minStock: 6.0,
    initialStock: 15.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_7',
    name: 'Yogurt Griego Natural',
    category: 'Yogures',
    unit: 'l',
    currentStock: 18.0,
    minStock: 5.0,
    initialStock: 20.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_8',
    name: 'Yogurt Fresa 1L',
    category: 'Yogures',
    unit: 'unidad',
    currentStock: 24,
    minStock: 10,
    initialStock: 30,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_9',
    name: 'Crema de Leche Pastelera',
    category: 'Crema de leche',
    unit: 'l',
    currentStock: 14.5,
    minStock: 6.0,
    initialStock: 18.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_10',
    name: 'Leche Entera UHT',
    category: 'Lácteos',
    unit: 'l',
    currentStock: 60.0,
    minStock: 20.0,
    initialStock: 80.0,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_11',
    name: 'Aceite Vegetal 5L',
    category: 'Otros',
    unit: 'unidad',
    currentStock: 12,
    minStock: 4,
    initialStock: 15,
    companyId: DEFAULT_COMPANY_ID,
    createdAt: new Date().toISOString()
  }
];

export const productService = {
  // Suscripción en tiempo real a productos
  subscribe(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
      if (!stored) {
        localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(INITIAL_DEMO_PRODUCTS));
        stored = JSON.stringify(INITIAL_DEMO_PRODUCTS);
      }
      callback(JSON.parse(stored));

      const handleStorage = () => {
        const data = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
        callback(data);
      };
      window.addEventListener('demo_products_updated', handleStorage);
      return () => window.removeEventListener('demo_products_updated', handleStorage);
    }

    const q = query(
      collection(db, 'products'),
      where('companyId', '==', companyId),
      orderBy('name', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(products);
    }, (error) => {
      console.error("Error subscribing to products:", error);
    });
  },

  // Crear producto
  async create(productData, user) {
    const currentStock = Number(productData.currentStock ?? productData.initialStock ?? 0);
    const initialStock = Number(productData.initialStock ?? 0);
    const minStock = Number(productData.minStock ?? 0);

    const newProduct = {
      name: productData.name.trim(),
      category: productData.category,
      unit: productData.unit,
      currentStock,
      initialStock,
      minStock,
      notes: productData.notes || '',
      companyId: user?.companyId || DEFAULT_COMPANY_ID,
      createdBy: user?.uid || 'anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (isDemoMode) {
      const items = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      const createdItem = {
        ...newProduct,
        id: 'prod_' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(createdItem);
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('demo_products_updated'));
      return createdItem.id;
    }

    const docRef = await addDoc(collection(db, 'products'), newProduct);
    return docRef.id;
  },

  // Actualizar producto
  async update(productId, updates) {
    const cleanUpdates = {
      ...updates,
      updatedAt: isDemoMode ? new Date().toISOString() : serverTimestamp()
    };

    if (updates.name) cleanUpdates.name = updates.name.trim();
    if (updates.minStock !== undefined) cleanUpdates.minStock = Number(updates.minStock);
    if (updates.currentStock !== undefined) cleanUpdates.currentStock = Number(updates.currentStock);

    if (isDemoMode) {
      const items = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      const index = items.findIndex(p => p.id === productId);
      if (index !== -1) {
        items[index] = { ...items[index], ...cleanUpdates };
        localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(items));
        window.dispatchEvent(new Event('demo_products_updated'));
      }
      return;
    }

    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, cleanUpdates);
  },

  // Eliminar producto
  async delete(productId) {
    if (isDemoMode) {
      let items = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      items = items.filter(p => p.id !== productId);
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('demo_products_updated'));
      return;
    }

    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  }
};
