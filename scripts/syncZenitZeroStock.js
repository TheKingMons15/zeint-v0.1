import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, writeBatch, doc, getDocs, serverTimestamp } from 'firebase/firestore';
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

async function syncZeroStockInventory() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("🔑 Autenticando como Super Admin (master@zenit.com)...");
  const userCredential = await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  const user = userCredential.user;
  console.log("✅ Autenticado con UID:", user.uid);

  // 1. Limpiar colección de productos anteriores
  console.log("🧹 Limpiando productos anteriores de Firestore...");
  const productsSnap = await getDocs(collection(db, 'products'));
  const deleteBatch = writeBatch(db);
  productsSnap.forEach(docSnap => {
    deleteBatch.delete(docSnap.ref);
  });
  await deleteBatch.commit();
  console.log(`✅ ${productsSnap.size} productos anteriores eliminados.`);

  // 2. Limpiar movimientos de prueba anteriores si existieran
  const movementsSnap = await getDocs(collection(db, 'movements'));
  if (movementsSnap.size > 0) {
    console.log(`🧹 Limpiando ${movementsSnap.size} movimientos antiguos...`);
    const movBatch = writeBatch(db);
    movementsSnap.forEach(docSnap => {
      movBatch.delete(docSnap.ref);
    });
    await movBatch.commit();
    console.log("✅ Movimientos reseteados a cero.");
  }

  // 3. Insertar los 55 productos oficiales con Stock = 0
  console.log(`📦 Insertando ${ZENIT_INITIAL_PRODUCTS.length} productos oficiales con STOCK = 0...`);
  const insertBatch = writeBatch(db);
  const productsRef = collection(db, 'products');

  ZENIT_INITIAL_PRODUCTS.forEach((p) => {
    const newDoc = doc(productsRef);
    insertBatch.set(newDoc, {
      name: p.name.trim(),
      category: p.category,
      unit: p.unit,
      initialStock: 0,
      currentStock: 0,
      minStock: Number(p.minStock || 0),
      notes: '',
      companyId: 'default_company',
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await insertBatch.commit();
  console.log(`🎉 ¡ÉXITO! Los ${ZENIT_INITIAL_PRODUCTS.length} productos verificados están en Firestore con STOCK EN CERO (0).`);
  process.exit(0);
}

syncZeroStockInventory().catch((err) => {
  console.error("❌ Error en la sincronización:", err);
  process.exit(1);
});
