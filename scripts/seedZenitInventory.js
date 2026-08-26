import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { ZENIT_INITIAL_PRODUCTS } from '../src/data/initialProducts.js';

function loadEnv() {
  const envConfig = {};
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        envConfig[match[1]] = val;
      }
    });
  }
  return envConfig;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDmsy4pvHef8hftz_LcFstcps1R8dexFuw",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "zenit-1bbc3.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "zenit-1bbc3",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "zenit-1bbc3.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1084151887776",
  appId: env.VITE_FIREBASE_APP_ID || "1:1084151887776:web:7ad06eaa8f2b9cebdad6c5"
};

async function seed() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("🔑 Autenticando como Super Admin...");
  const userCredential = await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  const user = userCredential.user;
  console.log("✅ Autenticado exitosamente con UID:", user.uid);

  const batch = writeBatch(db);
  const productsRef = collection(db, 'products');

  console.log(`📦 Insertando los ${ZENIT_INITIAL_PRODUCTS.length} productos en Cloud Firestore...`);

  ZENIT_INITIAL_PRODUCTS.forEach((p) => {
    const newDoc = doc(productsRef);
    batch.set(newDoc, {
      name: p.name.trim(),
      category: p.category,
      unit: p.unit,
      initialStock: Number(p.initialStock),
      currentStock: Number(p.initialStock),
      minStock: Number(p.minStock),
      notes: '',
      companyId: 'default_company',
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`🎉 ¡ÉXITO TOTAL! Los ${ZENIT_INITIAL_PRODUCTS.length} productos han sido guardados directamente en tu Firestore Online.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error al sembrar productos en Firestore:", err);
  process.exit(1);
});
