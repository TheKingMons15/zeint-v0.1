import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Boxes, 
  ChefHat,
  Wine,
  Smartphone, 
  Tablet, 
  Monitor, 
  Plus,
  Search,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useResponsive } from '../hooks/useResponsive';
import { MobileInventoryView } from '../components/inventory/MobileInventoryView';
import { TabletInventoryView } from '../components/inventory/TabletInventoryView';
import { DesktopInventoryView } from '../components/inventory/DesktopInventoryView';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { 
  KITCHEN_CATEGORIES, 
  BAR_CATEGORIES, 
  FOOD_CATEGORIES, 
  isBarProduct, 
  isKitchenProduct 
} from '../utils/constants';

export const InventoryPage = () => {
  const { user } = useAuth();
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery,
    setSearchQuery,
    loading,
    updateProduct,
    deleteProduct,
    addProduct
  } = useInventory();

  const { handleOpenMovementModal, setProductModalOpen } = useOutletContext();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const role = (user?.role || '').toUpperCase();

  // Filtro de Área: 'KITCHEN' (Cocina) | 'BAR' (Bar y Licores) | 'ALL' (Todo)
  const [areaFilter, setAreaFilter] = useState(
    role === 'BAR' ? 'BAR' : 'KITCHEN'
  );

  // Opción de forzar vista manual si el usuario lo desea
  const [viewModeOverride, setViewModeOverride] = useState('auto'); // 'auto' | 'mobile' | 'tablet' | 'desktop'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const activeView = viewModeOverride === 'auto'
    ? (isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop')
    : viewModeOverride;

  // Separación estricta de productos por área
  const kitchenProducts = useMemo(() => products.filter(isKitchenProduct), [products]);
  const barProducts = useMemo(() => products.filter(isBarProduct), [products]);

  // Lista de productos del área activa
  const currentAreaProducts = useMemo(() => {
    if (areaFilter === 'KITCHEN') return kitchenProducts;
    if (areaFilter === 'BAR') return barProducts;
    return products;
  }, [areaFilter, kitchenProducts, barProducts, products]);

  // Categorías del área activa
  const activeCategories = useMemo(() => {
    if (areaFilter === 'KITCHEN') return KITCHEN_CATEGORIES;
    if (areaFilter === 'BAR') return BAR_CATEGORIES;
    return FOOD_CATEGORIES;
  }, [areaFilter]);

  // Productos finales filtrados por categoría y búsqueda
  const finalFilteredProducts = useMemo(() => {
    return currentAreaProducts.filter(p => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const q = (searchQuery || '').toLowerCase().trim();
      const matchSearch = !q || 
        p.name?.toLowerCase().includes(q) || 
        p.category?.toLowerCase().includes(q) ||
        p.unit?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.supplier?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [currentAreaProducts, selectedCategory, searchQuery]);

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

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando inventario general..." />;
  }

  const areaOptions = [
    { 
      value: 'KITCHEN', 
      label: 'Stock de Cocina', 
      icon: ChefHat, 
      count: kitchenProducts.length 
    },
    { 
      value: 'BAR', 
      label: 'Stock de Bar & Licores', 
      icon: Wine, 
      count: barProducts.length 
    },
    { 
      value: 'ALL', 
      label: 'Todo el Stock', 
      icon: Boxes, 
      count: products.length 
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header Principal con Conmutador de Áreas (Cocina vs Bar) y Vistas */}
      <div className="p-5 sm:p-6 rounded-3xl apple-glass-sheet border border-white/15 shadow-apple-lg flex flex-col gap-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-apple-glow-emerald">
                <Boxes className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Control de Existencias e Inventario
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Separación estricta entre insumos de Cocina y licores/bebidas de Bar
                </p>
              </div>
            </div>
          </div>

          {/* View Mode Selector (Auto / Mobile / Tablet / Desktop) */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
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
        </div>

        {/* SELECTOR DE ÁREA PRINCIPAL: COCINA VS BAR VS TODO */}
        <div className="pt-2 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SegmentedControl
            options={areaOptions}
            value={areaFilter}
            onChange={(val) => {
              setAreaFilter(val);
              setSelectedCategory('ALL');
            }}
            size="md"
          />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={areaFilter === 'BAR' ? 'primary' : 'success'}
              onClick={handleOpenAddModal}
              icon={Plus}
              className="text-xs font-black shadow-md whitespace-nowrap py-2 px-3.5"
            >
              {areaFilter === 'BAR' ? '+ Nueva Botella / Bebida' : '+ Agregar Insumo Cocina'}
            </Button>
          </div>
        </div>

      </div>

      {/* BARRA DE BÚSQUEDA RÁPIDA & ACCESO INSTANTÁNEO AL STOCK */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder={
            areaFilter === 'KITCHEN'
              ? '🔍 Buscar insumo de cocina (ej: camarón, costilla, carne de hamburguesa, chinchulines, queso)...'
              : areaFilter === 'BAR'
              ? '🔍 Buscar en barra (ej: whisky, ron, cerveza, vino, coca cola, agua mineral)...'
              : '🔍 Buscar en todo el inventario por nombre, categoría o proveedor...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')} 
            className="p-1 text-slate-400 hover:text-white rounded-full bg-white/10"
            title="Limpiar búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Renderizado Condicional según la Vista Activa */}
      {activeView === 'mobile' && (
        <MobileInventoryView
          products={finalFilteredProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={activeCategories}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
          onQuickEntry={(p) => handleOpenMovementModal('ENTRY', p.id)}
          onQuickExit={(p) => handleOpenMovementModal('EXIT', p.id)}
          onAddProduct={handleOpenAddModal}
        />
      )}

      {activeView === 'tablet' && (
        <TabletInventoryView
          products={finalFilteredProducts}
          allProducts={currentAreaProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={activeCategories}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
          onQuickEntry={(p) => handleOpenMovementModal('ENTRY', p.id)}
          onQuickExit={(p) => handleOpenMovementModal('EXIT', p.id)}
          onAddProduct={handleOpenAddModal}
        />
      )}

      {activeView === 'desktop' && (
        <DesktopInventoryView
          products={finalFilteredProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={activeCategories}
          areaFilter={areaFilter}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
          onQuickEntry={(p) => handleOpenMovementModal('ENTRY', p.id)}
          onQuickExit={(p) => handleOpenMovementModal('EXIT', p.id)}
          onAddProduct={handleOpenAddModal}
        />
      )}

      {/* Modal de Creación / Edición con Ubicación Inteligente */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={editingProduct}
        defaultLocation={areaFilter === 'BAR' ? 'Bar / Coctelería' : 'Cocina'}
        loading={editLoading}
      />

    </div>
  );
};
