import React from 'react';
import { ProductCard } from '../products/ProductCard';
import { CategoryFilterBar } from '../products/CategoryFilterBar';
import { EmptyState } from '../common/EmptyState';
import { Badge } from '../common/Badge';
import { formatNumber } from '../../utils/formatters';
import { Layers, AlertTriangle } from 'lucide-react';

export const TabletInventoryView = ({
  products = [],
  allProducts = [],
  selectedCategory,
  onSelectCategory,
  onEditProduct,
  onDeleteProduct,
  onQuickEntry,
  onQuickExit,
  onAddProduct
}) => {
  return (
    <div className="space-y-5">
      {/* Category selector slider */}
      <div className="flex items-center justify-between gap-4">
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Grid of Product Cards for Tablets */}
      {products.length === 0 ? (
        <EmptyState
          title="No hay productos disponibles"
          description="Selecciona otra categoría o agrega nuevos productos al inventario."
          actionLabel="+ Crear Producto"
          onAction={onAddProduct}
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
