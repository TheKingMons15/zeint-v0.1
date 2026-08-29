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
import { WaiterPage } from '../pages/WaiterPage';
import { KitchenPage } from '../pages/KitchenPage';
import { BarPage } from '../pages/BarPage';
import { RecipesPage } from '../pages/RecipesPage';
import { ConsumptionReportPage } from '../pages/ConsumptionReportPage';
import { InvoiceHistoryPage } from '../pages/InvoiceHistoryPage';
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
        {/* Módulo de Meseros (Sala y Comandas) */}
        <Route path="mesero" element={<WaiterPage />} />

        {/* Módulo de Cocina KDS */}
        <Route path="cocina" element={<KitchenPage />} />

        {/* Módulo de Bar KDS */}
        <Route path="bar" element={<BarPage />} />

        {/* Recetario Maestro & Fichas Técnicas */}
        <Route
          path="recetas"
          element={
            <ProtectedRoute blockWaiters>
              <RecipesPage />
            </ProtectedRoute>
          }
        />

        {/* Reporte de Consumo por Ficha Técnica */}
        <Route
          path="reporte-consumo"
          element={
            <ProtectedRoute blockWaiters>
              <ConsumptionReportPage />
            </ProtectedRoute>
          }
        />

        {/* Histórico de Facturación & Movimientos (Exclusivo Karen y Wladimir) */}
        <Route
          path="historico-facturas"
          element={
            <ProtectedRoute blockWaiters>
              <InvoiceHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Administrativo (Bloqueado para meseros) */}
        <Route
          index
          element={
            <ProtectedRoute blockWaiters>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Gestión de Productos (Bloqueado para meseros) */}
        <Route
          path="productos"
          element={
            <ProtectedRoute blockWaiters>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        {/* Movimientos (Bloqueado para meseros) */}
        <Route
          path="movimientos"
          element={
            <ProtectedRoute blockWaiters>
              <MovementsPage />
            </ProtectedRoute>
          }
        />

        {/* Inventario (Bloqueado para meseros) */}
        <Route
          path="inventario"
          element={
            <ProtectedRoute blockWaiters>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        {/* Reportes Diarios en PDF (Bloqueado para meseros) */}
        <Route
          path="reportes"
          element={
            <ProtectedRoute blockWaiters>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Auditoría (Bloqueado para meseros) */}
        <Route
          path="auditoria"
          element={
            <ProtectedRoute blockWaiters>
              <AuditPage />
            </ProtectedRoute>
          }
        />

        {/* Consola Director (Bloqueado para meseros y operadores) */}
        <Route
          path="super-admin"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminPage />
            </ProtectedRoute>
          }
        />

        {/* Configuración (Bloqueado para meseros) */}
        <Route
          path="configuracion"
          element={
            <ProtectedRoute blockWaiters>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
