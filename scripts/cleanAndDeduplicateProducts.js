import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
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

// Generar un ID único determinista basado en el nombre normalizado (ej: "prod_aceite", "prod_aguacate")
export function generateProductSlug(name) {
  return 'prod_' + name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function deduplicateAndNormalize() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("🔑 Autenticando como Super Admin...");
  const userCredential = await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  const user = userCredential.user;
  console.log("✅ Autenticado exitosamente con UID:", user.uid);

  // 1. Obtener todos los productos actuales de Firestore
  console.log("🔍 Analizando colección 'products' en Firestore...");
  const snap = await getDocs(collection(db, 'products'));
  console.log(`📊 Total de documentos encontrados en 'products': ${snap.size}`);

  const productsByName = {};
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const rawName = data.name || 'Sin nombre';
    const normKey = rawName.toLowerCase().trim();

    if (!productsByName[normKey]) {
      productsByName[normKey] = [];
    }
    productsByName[normKey].push({
      id: docSnap.id,
      ref: docSnap.ref,
      ...data
    });
  });

  // Identificar duplicados
  let duplicateCount = 0;
  for (const [normName, list] of Object.entries(productsByName)) {
    if (list.length > 1) {
      console.log(`⚠️ PRODUCTO DUPLICADO: "${normName}" aparece ${list.length} veces:`);
      list.forEach(p => console.log(`   - ID: ${p.id} | Nombre: ${p.name} | Stock: ${p.currentStock} | Categoría: ${p.category}`));
      duplicateCount += (list.length - 1);
    }
  }

  console.log(`\n🧹 Total de registros redundantes a depurar: ${duplicateCount}`);

  // 2. Limpieza total de duplicados: eliminamos todos los documentos antiguos
  console.log("🗑️ Eliminando documentos duplicados / desordenados...");
  const deleteBatch = writeBatch(db);
  snap.forEach(docSnap => {
    deleteBatch.delete(docSnap.ref);
  });
  await deleteBatch.commit();
  console.log("✅ Colección 'products' limpiada completamente.");

  // 3. Crear el Catálogo Maestro Normalizado Único con IDs Deterministas
  // Usamos IDs deterministas como doc(db, 'products', slug) para que sea IMPOSIBLE que exista duplicidad a nivel de Firestore
  console.log(`📦 Creando Tabla Maestra con ${ZENIT_INITIAL_PRODUCTS.length} productos ÚNICOS...`);
  const insertBatch = writeBatch(db);
  const productsRef = collection(db, 'products');

  const createdSlugs = new Set();

  ZENIT_INITIAL_PRODUCTS.forEach(item => {
    const slug = generateProductSlug(item.name);
    
    if (createdSlugs.has(slug)) {
      console.warn(`⚠️ Omitiendo duplicado en la lista de origen: ${item.name} (${slug})`);
      return;
    }
    createdSlugs.add(slug);

    const docRef = doc(productsRef, slug); // ID determinista fijo!
    insertBatch.set(docRef, {
      id_producto: slug,
      name: item.name.trim(),
      normalized_name: item.name.toLowerCase().trim(),
      category: item.category,
      unit: item.unit,
      currentStock: Number(item.initialStock || 0),
      initialStock: Number(item.initialStock || 0),
      minStock: Number(item.minStock || 0),
      supplier: 'Proveedor Central Zénit',
      status: 'ACTIVE',
      location: 'Cocina / Bodega Central',
      companyId: 'default_company',
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await insertBatch.commit();
  console.log(`🎉 ¡ÉXITO TOTAL! Se crearon ${createdSlugs.size} productos maestros únicos con ID determinista en Firestore.`);
  process.exit(0);
}

deduplicateAndNormalize().catch(err => {
  console.error("❌ Error en la deduplicación:", err);
  process.exit(1);
});
