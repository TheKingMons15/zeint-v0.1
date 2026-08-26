import { 
  collection, 
  doc, 
  setDoc,
  getDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { ZENIT_INITIAL_PRODUCTS } from '../data/initialProducts';
import { auditService } from './auditService';

const DEMO_PRODUCTS_KEY = 'inventario_demo_products';

// Generador de ID determinista único para evitar duplicados en la base de datos
export function generateProductSlug(name) {
  if (!name) return 'prod_unnamed';
  return 'prod_' + name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export const productService = {
  // Suscripción en tiempo real al Inventario Único Centralizado
  subscribe(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
      if (!stored) {
        localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(ZENIT_INITIAL_PRODUCTS.map((p) => {
          const slug = generateProductSlug(p.name);
          return {
            ...p,
            id: slug,
            id_producto: slug,
            currentStock: p.initialStock,
            supplier: 'Proveedor Central Zénit',
            location: 'Cocina / Bodega Central',
            status: 'ACTIVE',
            companyId: DEFAULT_COMPANY_ID,
            createdAt: new Date().toISOString()
          };
        })));
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

    try {
      const q = query(
        collection(db, 'products'),
        where('companyId', '==', companyId)
      );

      return onSnapshot(q, (snapshot) => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          id_producto: doc.id,
          ...doc.data()
        }));

        // Ordenamiento seguro en memoria por nombre
        products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        callback(products);
      }, (error) => {
        console.error("Error subscribing to products in Firestore:", error);
        callback([]);
      });
    } catch (e) {
      console.error("Exception in productService.subscribe:", e);
      callback([]);
      return () => {};
    }
  },

  // Crear producto con validación estricta anti-duplicados y clave única determinista
  async create(productData, user) {
    const rawName = productData.name.trim();
    if (!rawName) throw new Error("El nombre del producto es obligatorio");

    const slug = generateProductSlug(rawName);
    const currentStock = Number(productData.currentStock ?? productData.initialStock ?? 0);
    const initialStock = Number(productData.initialStock ?? 0);
    const minStock = Number(productData.minStock ?? 0);
    const companyId = user?.companyId || DEFAULT_COMPANY_ID;

    const newProduct = {
      id_producto: slug,
      name: rawName,
      normalized_name: rawName.toLowerCase(),
      category: productData.category || 'Otros',
      unit: productData.unit || 'kg',
      currentStock,
      initialStock,
      minStock,
      supplier: productData.supplier?.trim() || 'Proveedor Central Zénit',
      location: 'Cocina / Bodega Central',
      status: 'ACTIVE',
      notes: productData.notes || '',
      companyId,
      createdBy: user?.uid || 'anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (isDemoMode) {
      const items = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      
      // Validación en demo
      const exists = items.some(p => p.id === slug || p.name.toLowerCase() === rawName.toLowerCase());
      if (exists) {
        throw new Error(`El producto "${rawName}" ya existe en la base de datos central. Seleccione el producto existente para modificar su stock.`);
      }

      const createdItem = {
        ...newProduct,
        id: slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(createdItem);
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('demo_products_updated'));

      await auditService.logAction(user, 'CREATE_PRODUCT', {
        product: newProduct.name,
        category: newProduct.category,
        initialStock: `${newProduct.initialStock} ${newProduct.unit}`,
        minStock: `${newProduct.minStock} ${newProduct.unit}`
      });

      return slug;
    }

    // Validación en Cloud Firestore: verificar si el ID determinista ya existe
    const docRef = doc(db, 'products', slug);
    const existingSnap = await getDoc(docRef);

    if (existingSnap.exists()) {
      throw new Error(`El producto "${rawName}" ya existe en el inventario general del restaurante (ID: ${slug}). No se permiten registros duplicados.`);
    }

    // Búsqueda secundaria por coincidencia de nombre exacto
    const q = query(
      collection(db, 'products'),
      where('companyId', '==', companyId),
      where('normalized_name', '==', rawName.toLowerCase())
    );
    const duplicateQuery = await getDocs(q);
    if (!duplicateQuery.empty) {
      throw new Error(`El producto "${rawName}" ya existe en la base de datos. Seleccione el producto existente.`);
    }

    // Insertar con clave primaria determinista fija
    await setDoc(docRef, newProduct);

    await auditService.logAction(user, 'CREATE_PRODUCT', {
      product: newProduct.name,
      category: newProduct.category,
      initialStock: `${newProduct.initialStock} ${newProduct.unit}`,
      minStock: `${newProduct.minStock} ${newProduct.unit}`
    });

    return slug;
  },

  // Actualizar producto
  async update(productId, updates, user) {
    const cleanUpdates = {
      ...updates,
      updatedAt: isDemoMode ? new Date().toISOString() : serverTimestamp()
    };

    if (updates.name) {
      cleanUpdates.name = updates.name.trim();
      cleanUpdates.normalized_name = cleanUpdates.name.toLowerCase();
    }
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

      await auditService.logAction(user, 'UPDATE_PRODUCT', {
        product: updates.name || productId,
        changes: cleanUpdates
      });
      return;
    }

    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, cleanUpdates);

    await auditService.logAction(user, 'UPDATE_PRODUCT', {
      product: updates.name || productId,
      changes: cleanUpdates
    });
  },

  // Eliminar producto
  async delete(productId, productName, user) {
    if (isDemoMode) {
      let items = JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      items = items.filter(p => p.id !== productId);
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('demo_products_updated'));

      await auditService.logAction(user, 'DELETE_PRODUCT', {
        product: productName || productId,
        message: `Producto eliminado del catálogo central`
      });
      return;
    }

    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);

    await auditService.logAction(user, 'DELETE_PRODUCT', {
      product: productName || productId,
      message: `Producto eliminado del catálogo central`
    });
  },

  // Carga masiva de los productos oficiales con IDs deterministas (Idempotente: nunca duplica)
  async importZenitCatalog(user) {
    const companyId = user?.companyId || DEFAULT_COMPANY_ID;

    if (isDemoMode) {
      const demoList = ZENIT_INITIAL_PRODUCTS.map((p) => {
        const slug = generateProductSlug(p.name);
        return {
          ...p,
          id: slug,
          id_producto: slug,
          currentStock: p.initialStock,
          supplier: 'Proveedor Central Zénit',
          location: 'Cocina / Bodega Central',
          status: 'ACTIVE',
          companyId,
          createdAt: new Date().toISOString()
        };
      });
      localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(demoList));
      window.dispatchEvent(new Event('demo_products_updated'));

      await auditService.logAction(user, 'IMPORT_CATALOG', {
        count: demoList.length,
        message: 'Importación del catálogo centralizado de productos únicos'
      });

      return demoList.length;
    }

    // Firestore Batch import usando IDs deterministas fijos
    const batch = writeBatch(db);
    const productsRef = collection(db, 'products');

    ZENIT_INITIAL_PRODUCTS.forEach((item) => {
      const slug = generateProductSlug(item.name);
      const docRef = doc(productsRef, slug); // ID determinista fijo
      batch.set(docRef, {
        id_producto: slug,
        name: item.name.trim(),
        normalized_name: item.name.toLowerCase().trim(),
        category: item.category,
        unit: item.unit,
        initialStock: Number(item.initialStock || 0),
        currentStock: Number(item.initialStock || 0),
        minStock: Number(item.minStock || 0),
        supplier: 'Proveedor Central Zénit',
        location: 'Cocina / Bodega Central',
        status: 'ACTIVE',
        notes: '',
        companyId: companyId,
        createdBy: user?.uid || 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    });

    await batch.commit();

    await auditService.logAction(user, 'IMPORT_CATALOG', {
      count: ZENIT_INITIAL_PRODUCTS.length,
      message: 'Sincronización de catálogo maestro normalizado en Firestore'
    });

    return ZENIT_INITIAL_PRODUCTS.length;
  }
};
