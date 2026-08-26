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
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { ZENIT_INITIAL_PRODUCTS } from '../data/initialProducts';

const DEMO_PRODUCTS_KEY = 'inventario_demo_products';

export const productService = {
  // Suscripción en tiempo real a productos
  subscribe(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
      if (!stored) {
        localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(ZENIT_INITIAL_PRODUCTS.map((p, idx) => ({
          ...p,
          id: 'prod_' + (idx + 1),
          currentStock: p.initialStock,
          companyId: DEFAULT_COMPANY_ID,
          createdAt: new Date().toISOString()
        }))));
        stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
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
  },

  // Carga masiva de los 69 productos de Zenit a Firestore Online
  async importZenitCatalog(user) {
    const companyId = user?.companyId || DEFAULT_COMPANY_ID;

    if (isDemoMode) {
      const demoList = ZENIT_INITIAL_PRODUCTS.map((p, idx) => ({
        ...p,
        id: 'prod_' + (idx + 1),
        currentStock: p.initialStock,
        companyId,
        createdAt: new Date().toISOString()
      }));
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(demoList));
      window.dispatchEvent(new Event('demo_products_updated'));
      return demoList.length;
    }

    // Firestore Batch import (hasta 500 operaciones en 1 commit)
    const batch = writeBatch(db);
    const productsRef = collection(db, 'products');

    ZENIT_INITIAL_PRODUCTS.forEach((item) => {
      const newDocRef = doc(productsRef);
      batch.set(newDocRef, {
        name: item.name.trim(),
        category: item.category,
        unit: item.unit,
        initialStock: Number(item.initialStock),
        currentStock: Number(item.initialStock),
        minStock: Number(item.minStock),
        notes: '',
        companyId: companyId,
        createdBy: user?.uid || 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();
    return ZENIT_INITIAL_PRODUCTS.length;
  }
};
