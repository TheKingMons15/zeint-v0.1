import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para recarga automática controlada y segura al cambiar de submenú.
 * Garantiza una sola recarga por cada transición de ruta distinta,
 * evitando bucles infinitos y respetando el estado de la aplicación.
 */
export const useSafeNavigationReload = (hasUnsavedChanges = false) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isInitialMount = useRef(true);

  useEffect(() => {
    // En la primera carga de la app en la ruta actual, marcamos la ruta como cargada
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const lastRoute = sessionStorage.getItem('zenit_active_submenu');
      if (!lastRoute) {
        sessionStorage.setItem('zenit_active_submenu', currentPath);
      }
      return;
    }

    const previousRoute = sessionStorage.getItem('zenit_active_submenu');

    // Detectar si el usuario cambió a un submenú o ruta distinta
    if (previousRoute && previousRoute !== currentPath) {
      // Si hay un formulario con cambios sin guardar en pantalla, consultar antes
      if (hasUnsavedChanges) {
        const proceed = window.confirm('Tienes cambios sin guardar. ¿Deseas recargar y cambiar de sección?');
        if (!proceed) return;
      }

      // Guardar la nueva ruta en sessionStorage ANTES de recargar para evitar bucles infinitos
      sessionStorage.setItem('zenit_active_submenu', currentPath);
      sessionStorage.setItem('zenit_last_reload_time', Date.now().toString());

      // Ejecutar recarga controlada de una sola vez
      window.location.reload();
    }
  }, [currentPath, hasUnsavedChanges]);
};
