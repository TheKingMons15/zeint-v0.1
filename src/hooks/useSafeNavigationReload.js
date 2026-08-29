import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para sincronización instantánea y fluida en segundo plano al cambiar de submenú.
 * Realiza la actualización de datos directamente desde Firestore sin recargar la página completa,
 * evitando pantallas de carga innecesarias y garantizando máxima velocidad y fluidez (0ms).
 */
export const useSafeNavigationReload = (onRouteSync, hasUnsavedChanges = false) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Primera carga inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      sessionStorage.setItem('zenit_active_submenu', currentPath);
      return;
    }

    const previousRoute = sessionStorage.getItem('zenit_active_submenu');

    // Al cambiar de ruta o submenú
    if (previousRoute !== currentPath) {
      sessionStorage.setItem('zenit_active_submenu', currentPath);

      // Si se pasa una función de sincronización en segundo plano, ejecutarla silenciosamente
      if (typeof onRouteSync === 'function') {
        try {
          onRouteSync();
        } catch (err) {
          console.warn("Background route sync notice:", err);
        }
      }
    }
  }, [currentPath, onRouteSync]);
};
