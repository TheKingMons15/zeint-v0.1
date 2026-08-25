import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de variables de entorno de Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "inventario-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "inventario-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "inventario-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// Validar si las credenciales de Firebase son reales o están en modo demo
export const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
  import.meta.env.VITE_FIREBASE_API_KEY === "tu_api_key_aqui" ||
  import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key";

// Inicialización de la aplicación Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Inicializar Firestore con soporte de caché persistente para PWA Offline
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  // Fallback si ya fue inicializado o en entornos limitados
  db = getFirestore(app);
}

export { db };

// Inicializar Storage
export const storage = getStorage(app);

export const DEFAULT_COMPANY_ID = import.meta.env.VITE_DEFAULT_COMPANY_ID || 'default_company';

export default app;
