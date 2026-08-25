import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Boxes, 
  LayoutGrid, 
  Table as TableIcon, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Plus 
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useResponsive } from '../hooks/useResponsive';
import { MobileInventoryView } from '../components/inventory/MobileInventoryView';
import { TabletInventoryView } from '../components/inventory/TabletInventoryView';
import { DesktopInventoryView } from '../components/inventory/DesktopInventoryView';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';

export const InventoryPage = () => {
  const { 
    products, 
    filteredProducts, 
    selectedCategory, 
    setSelectedCategory, 
    loading,
    updateProduct,
    deleteProduct,
    addProduct
  } = useInventory();

  const { handleOpenMovementModal, setProductModalOpen } = useOutletContext();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Opción de forzar vista manual si el usuario lo desea
  const [viewModeOverride, setViewModeOverride] = useState('auto'); // 'auto' | 'mobile' | 'tablet' | 'desktop'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const activeView = viewModeOverride === 'auto'
    ? (isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop')
    : viewModeOverride;

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`¿Eliminar "${product.name}" del inventario?`)) {
      await deleteProduct(product.id, product.name);
    }
  };

  const handleEditSubmit = async (data) => {
    setEditLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await addProduct(data);
      }
      setIsEditModalOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando inventario general..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header con Conmutador de Vistas Responsivas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-emerald-400" />
            Control de Existencias e Inventario
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Vista adaptativa en tiempo real para Móvil (Tarjetas), Tablet (Combinada) y Escritorio (Tabla)
          </p>
        </div>

        {/* View Mode Selector (Auto / Mobile / Tablet / Desktop) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewModeOverride('auto')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewModeOverride === 'auto'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Adaptación Automática según Dispositivo"
          >
            Auto
          </button>

          <button
            onClick={() => setViewModeOverride('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'mobile' && viewModeOverride !== 'auto'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vista Móvil (Tarjetas)"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewModeOverride('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'tablet' && viewModeOverride !== 'auto'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vista Tablet (Cuadrícula Combinada)"
          >
            <Tablet className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewModeOverride('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'desktop' && viewModeOverride !== 'auto'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vista Computadora (Tabla Administrativa)"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Renderizado Condicional según la Vista Activa */}
      {activeView === 'mobile' && (
        <MobileInventoryView
          products={filteredProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
          onQuickEntry={(p) => handleOpenMovementModal('ENTRY', p.id)}
          onQuickExit={(p) => handleOpenMovementModal('EXIT', p.id)}
          onAddProduct={() => setProductModalOpen(true)}
        />
      )}

      {activeView === 'tablet' && (
        <TabletInventoryView
          products={filteredProducts}
          allProducts={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
          onQuickEntry={(p) => handleOpenMovementModal('ENTRY', p.id)}
          onQuickExit={(p) => handleOpenMovementModal('EXIT', p.id)}
          onAddProduct={() => setProductModalOpen(true)}
        />
      )}

      {activeView === 'desktop' && (
        <DesktopInventoryView
          products={filteredProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
          onQuickEntry={(p) => handleOpenMovementModal('ENTRY', p.id)}
          onQuickExit={(p) => handleOpenMovementModal('EXIT', p.id)}
          onAddProduct={() => setProductModalOpen(true)}
        />
      )}

      {/* Modal de Edición */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={editingProduct}
        loading={editLoading}
      />

    </div>
  );
};
