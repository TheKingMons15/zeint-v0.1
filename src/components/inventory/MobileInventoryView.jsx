import React from 'react';
import { ProductCard } from '../products/ProductCard';
import { CategoryFilterBar } from '../products/CategoryFilterBar';
import { EmptyState } from '../common/EmptyState';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';

export const MobileInventoryView = ({
  products = [],
  selectedCategory,
  onSelectCategory,
  categories,
  onEditProduct,
  onDeleteProduct,
  onQuickEntry,
  onQuickExit,
  onAddProduct
}) => {
  return (
    <div className="space-y-4">
      {/* Category selector slider */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        categories={categories}
      />

      {/* Product Card List */}
      {products.length === 0 ? (
        <EmptyState
          title="No hay productos en esta vista"
          description="Intenta cambiar la categoría o registrar un nuevo producto en el catálogo."
          actionLabel="+ Crear Producto"
          onAction={onAddProduct}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onQuickEntry={onQuickEntry}
              onQuickExit={onQuickExit}
            />
          ))}
        </div>
      )}
    </div>
  );
};
