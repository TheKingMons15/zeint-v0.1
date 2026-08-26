import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles, blockWaiters = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage label="Verificando sesión..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isWaiter = user.role === 'MESERO' || user.role === 'mesero';

  // Si es mesero y la ruta no es para meseros (rutas de administración/inventario/costos)
  if (isWaiter && (blockWaiters || location.pathname === '/')) {
    return <Navigate to="/mesero" replace />;
  }

  // Si se especificaron roles permitidos y el usuario no lo tiene
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (isWaiter) return <Navigate to="/mesero" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};
