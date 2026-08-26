import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { MovementsPage } from '../pages/MovementsPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AuditPage } from '../pages/AuditPage';
import { SuperAdminPage } from '../pages/SuperAdminPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta Pública de Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Privadas Protegidas bajo AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="movimientos" element={<MovementsPage />} />
        <Route path="inventario" element={<InventoryPage />} />
        <Route path="reportes" element={<ReportsPage />} />
        <Route path="auditoria" element={<AuditPage />} />
        <Route path="super-admin" element={<SuperAdminPage />} />
        <Route path="configuracion" element={<SettingsPage />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
