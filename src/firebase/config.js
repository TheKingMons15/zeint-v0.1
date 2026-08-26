import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración oficial de Firebase Online de Zenit
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDmsy4pvHef8hftz_LcFstcps1R8dexFuw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zenit-1bbc3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zenit-1bbc3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zenit-1bbc3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1084151887776",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1084151887776:web:7ad06eaa8f2b9cebdad6c5"
};

export const isDemoMode = false;

// Inicialización de Firebase
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
  db = getFirestore(app);
}

export { db };

// Inicializar Storage
export const storage = getStorage(app);

export const DEFAULT_COMPANY_ID = import.meta.env.VITE_DEFAULT_COMPANY_ID || 'default_company';

export default app;
