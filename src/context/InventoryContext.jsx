import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import { movementService } from '../services/movementService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getTodayDateString } from '../utils/formatters';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const companyId = user?.companyId || 'default_company';

  // Suscripción en tiempo real a Productos y Movimientos
  useEffect(() => {
    setLoading(true);
    let unsubProducts = () => {};
    let unsubMovements = () => {};

    // Temporizador de seguridad: Si Firestore tarda, liberar loading tras 1.5 segundos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    try {
      unsubProducts = productService.subscribe(companyId, (items) => {
        setProducts(items);
        setLoading(false);
        clearTimeout(timer);
      });

      unsubMovements = movementService.subscribe(companyId, (items) => {
        setMovements(items);
      });
    } catch (error) {
      console.error("Error setting up Firestore subscriptions:", error);
      setLoading(false);
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
      unsubProducts();
      unsubMovements();
    };
  }, [companyId]);

  // Movimientos del día actual
  const todayDateStr = getTodayDateString();
  const todayMovements = useMemo(() => {
    return movements.filter(m => {
      if (!m.date && !m.createdAt) return false;
      if (m.date === todayDateStr) return true;
      if (typeof m.createdAt === 'string' && m.createdAt.startsWith(todayDateStr)) return true;
      return false;
    });
  }, [movements, todayDateStr]);

  // Productos con bajo stock (Stock actual <= Stock mínimo)
  const lowStockProducts = useMemo(() => {
    return products.filter(p => Number(p.currentStock || 0) <= Number(p.minStock || 0));
  }, [products]);

  // Métricas y Estadísticas del Dashboard
  const stats = useMemo(() => {
    const totalProducts = products.length;
    
    const todayEntriesQty = todayMovements
      .filter(m => m.type === 'ENTRY')
      .reduce((sum, m) => sum + Number(m.quantity || 0), 0);
    
    const todayExitsQty = todayMovements
      .filter(m => m.type === 'EXIT')
      .reduce((sum, m) => sum + Number(m.quantity || 0), 0);

    const todayEntriesCount = todayMovements.filter(m => m.type === 'ENTRY').length;
    const todayExitsCount = todayMovements.filter(m => m.type === 'EXIT').length;

    const criticalCount = lowStockProducts.length;

    return {
      totalProducts,
      todayEntriesQty,
      todayExitsQty,
      todayEntriesCount,
      todayExitsCount,
      criticalCount
    };
  }, [products, todayMovements, lowStockProducts]);

  // Lista filtrada de productos según categoría y texto de búsqueda
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        p.name.toLowerCase().includes(query) || 
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.unit && p.unit.toLowerCase().includes(query));
      
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Acciones CRUD de Productos
  const addProduct = async (productData) => {
    try {
      const id = await productService.create(productData, user);
      showToast(`Producto "${productData.name}" creado con éxito`, 'success');
      return id;
    } catch (error) {
      console.error("Error adding product:", error);
      showToast(error.message || 'Error al crear producto', 'error');
      throw error;
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      await productService.update(productId, updates);
      showToast('Producto actualizado correctamente', 'success');
    } catch (error) {
      console.error("Error updating product:", error);
      showToast(error.message || 'Error al actualizar producto', 'error');
      throw error;
    }
  };

  const deleteProduct = async (productId, productName) => {
    try {
      await productService.delete(productId);
      showToast(`Producto "${productName || ''}" eliminado`, 'info');
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast(error.message || 'Error al eliminar producto', 'error');
      throw error;
    }
  };

  // Registro de Movimientos de Entrada / Salida con actualización inmediata
  const registerMovement = async (movementData) => {
    try {
      const result = await movementService.registerMovement(movementData, user);
      
      // Actualización inmediata del stock en memoria para reflejo instantáneo en pantalla
      setProducts(prevProducts => prevProducts.map(p => {
        if (p.id === movementData.productId || p.id_producto === movementData.productId) {
          const prev = Number(p.currentStock || 0);
          const qty = Number(movementData.quantity || 0);
          const delta = movementData.type === 'ENTRY' ? qty : -qty;
          return { ...p, currentStock: Math.max(0, prev + delta) };
        }
        return p;
      }));

      const isEntry = movementData.type === 'ENTRY';
      showToast(
        `${isEntry ? 'Entrada' : 'Salida'} de ${movementData.quantity} ${movementData.unit || 'und'} registrada exitosamente`,
        'success'
      );
      return result;
    } catch (error) {
      console.error("Error registering movement:", error);
      showToast(error.message || 'Error al registrar movimiento', 'error');
      throw error;
    }
  };

  // Importar catálogo completo de alimentos a Firestore
  const importInitialProducts = async () => {
    try {
      const count = await productService.importZenitCatalog(user);
      showToast(`¡${count} productos importados exitosamente a Firebase!`, 'success');
      return count;
    } catch (error) {
      console.error("Error importing initial catalog:", error);
      showToast(error.message || 'Error al importar productos iniciales', 'error');
      throw error;
    }
  };

  const value = {
    products,
    filteredProducts,
    movements,
    todayMovements,
    lowStockProducts,
    stats,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addProduct,
    updateProduct,
    deleteProduct,
    registerMovement,
    importInitialProducts
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory debe usarse dentro de un InventoryProvider');
  }
  return context;
};
