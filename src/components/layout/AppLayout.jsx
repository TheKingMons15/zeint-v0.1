import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MovementModal } from '../movements/MovementModal';
import { ProductFormModal } from '../products/ProductFormModal';
import { GlobalNotificationManager } from '../notifications/GlobalNotificationManager';
import { useInventory } from '../../hooks/useInventory';
import { useSafeNavigationReload } from '../../hooks/useSafeNavigationReload';

export const AppLayout = () => {
  const { products, registerMovement, addProduct } = useInventory();

  // Modales Globales
  const [movementModalState, setMovementModalState] = useState({
    isOpen: false,
    type: 'ENTRY',
    defaultProductId: ''
  });

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [movementLoading, setMovementLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  // Recarga automática controlada y segura al cambiar de submenú
  useSafeNavigationReload(movementModalState.isOpen || productModalOpen);

  const handleOpenMovementModal = (type = 'ENTRY', defaultProductId = '') => {
    setMovementModalState({
      isOpen: true,
      type,
      defaultProductId
    });
  };

  const handleCloseMovementModal = () => {
    setMovementModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleMovementSubmit = async (data) => {
    setMovementLoading(true);
    try {
      await registerMovement(data);
      handleCloseMovementModal();
      // Recarga automática de una sola vez para sincronizar inmediatamente el stock actualizado
      setTimeout(() => {
        window.location.reload();
      }, 350);
    } finally {
      setMovementLoading(false);
    }
  };

  const handleProductSubmit = async (data) => {
    setProductLoading(true);
    try {
      await addProduct(data);
      setProductModalOpen(false);
      // Recarga controlada para mostrar el nuevo producto de inmediato
      setTimeout(() => {
        window.location.reload();
      }, 350);
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar Superior */}
      <Navbar 
        onOpenMovementModal={handleOpenMovementModal}
        onOpenProductModal={() => setProductModalOpen(true)}
      />

      {/* Main Container con Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar de Escritorio */}
        <Sidebar />

        {/* Contenido Principal de la Ruta */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          <Outlet context={{ handleOpenMovementModal, setProductModalOpen }} />
        </main>
      </div>

      {/* Navegación Inferior para Móvil */}
      <BottomNav onOpenMovementModal={handleOpenMovementModal} />

      {/* Modal Global de Movimiento (Entrada/Salida) */}
      <MovementModal
        isOpen={movementModalState.isOpen}
        onClose={handleCloseMovementModal}
        onSubmit={handleMovementSubmit}
        products={products}
        initialType={movementModalState.type}
        defaultProductId={movementModalState.defaultProductId}
        loading={movementLoading}
      />

      {/* Modal Global de Creación de Producto */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        loading={productLoading}
      />

      {/* Gestor Global de Notificaciones Pop-up y Chat Interno de Personal */}
      <GlobalNotificationManager />
    </div>
  );
};
