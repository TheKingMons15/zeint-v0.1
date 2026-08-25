import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Package, Search, Filter } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { CategoryFilterBar } from '../components/products/CategoryFilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProductsPage = () => {
  const { 
    filteredProducts, 
    loading, 
    selectedCategory, 
    setSelectedCategory,
    updateProduct,
    deleteProduct,
    addProduct
  } = useInventory();

  const { handleOpenMovementModal } = useOutletContext();

  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`)) {
      await deleteProduct(product.id, product.name);
    }
  };

  const handleFormSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando catálogo de productos..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-400" />
            Catálogo de Productos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Administra los alimentos, unidades de medida y niveles de stock mínimo
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleCreate}
          icon={Plus}
        >
          Crear Nuevo Alimento
        </Button>
      </div>

      {/* Category Chips Bar */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No hay productos disponibles"
          description="Comienza creando tu primer producto para iniciar el control de inventario."
          actionLabel="+ Crear Producto"
          onAction={handleCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onQuickEntry={(p) => handleOpenMovementModal('ENTRY', p.id)}
              onQuickExit={(p) => handleOpenMovementModal('EXIT', p.id)}
            />
          ))}
        </div>
      )}

      {/* Modal de Crear / Editar */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        loading={modalLoading}
      />

    </div>
  );
};
