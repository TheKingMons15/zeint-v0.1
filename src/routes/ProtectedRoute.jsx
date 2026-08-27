import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles, blockWaiters = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage label="Verificando permisos y área asignada..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = (user.role || '').toUpperCase();
  const path = location.pathname;

  // 1. Delimitación Estricta: BAR (Marlon) - Solo accede a /bar
  if (role === 'BAR') {
    if (path !== '/bar') {
      return <Navigate to="/bar" replace />;
    }
    return children;
  }

  // 2. Delimitación Estricta: COCINA (Hernán) - Solo accede a /cocina
  if (role === 'COCINA') {
    if (path !== '/cocina') {
      return <Navigate to="/cocina" replace />;
    }
    return children;
  }

  // 3. Delimitación Estricta: MESERO (Carolina, Issac, David) - Solo accede a /mesero
  if (role === 'MESERO') {
    if (path !== '/mesero') {
      return <Navigate to="/mesero" replace />;
    }
    return children;
  }

  // 4. Si se especificaron roles permitidos para usuarios administrativos
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
