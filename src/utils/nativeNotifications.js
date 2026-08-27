// =========================================================================
// SERVICIO DE NOTIFICACIONES NATIVAS PARA DISPOSITIVOS MÓVILES (Android & iOS)
// Soporta Web Notifications API, Service Worker Push & Vibration API
// =========================================================================

export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && ('Notification' in window || 'serviceWorker' in navigator);
};

export const getNotificationPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
};

export const requestNativeNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn("Error al solicitar permisos de notificación nativa:", err);
    return 'denied';
  }
};

export const triggerMobileHaptics = (pattern = [200, 100, 200, 100, 300]) => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Algunos navegadores restringen vibración si no hay interacción previa
  }
};

export const sendNativeNotification = async ({
  title,
  body,
  icon = '/pwa-192x192.png',
  badge = '/pwa-192x192.png',
  tag = 'zenit-notification',
  vibrate = [200, 100, 200, 100, 300],
  data = {}
}) => {
  // 1. Ejecutar vibración háptica en el teléfono
  triggerMobileHaptics(vibrate);

  if (!isNotificationSupported() || getNotificationPermission() !== 'granted') {
    return;
  }

  const notificationOptions = {
    body,
    icon,
    badge,
    tag,
    vibrate,
    renotify: true,
    requireInteraction: false,
    data: {
      ...data,
      timestamp: Date.now()
    }
  };

  try {
    // Intentar a través de Service Worker (Formato estándar para Android e iOS PWA)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, notificationOptions);
        return;
      }
    }

    // Fallback a Notification API del navegador
    new Notification(title, notificationOptions);
  } catch (err) {
    console.warn("No se pudo mostrar la notificación nativa del sistema:", err);
  }
};
