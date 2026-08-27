import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

function generateProductSlug(name) {
  return 'prod_' + name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const NEW_PRODUCTS_TO_ADD = [
  { name: 'Crema de leche', category: 'Lácteos', unit: 'litro', currentStock: 1, minStock: 2 },
  { name: 'Morcilla', category: 'Proteínas', unit: 'UND', currentStock: 20, minStock: 10 },
  { name: 'Cocoa', category: 'Secos y condimentos', unit: 'kg', currentStock: 0.4, minStock: 0.2 },
  { name: 'Tomates cherry', category: 'Verduras', unit: 'kg', currentStock: 0.5, minStock: 0.5 },
  { name: 'Cobertura de chocolate', category: 'Secos y condimentos', unit: 'kg', currentStock: 0.9, minStock: 0.5 },
  { name: 'Jarabe de frutilla', category: 'Salsas', unit: 'kg', currentStock: 0.6, minStock: 0.3 },
  { name: 'Zanahoria', category: 'Verduras', unit: 'kg', currentStock: 0.4, minStock: 1 },
  { name: 'Cebolla larga', category: 'Verduras', unit: 'kg', currentStock: 0.3, minStock: 1 },
  { name: 'Manzana verde', category: 'Frutas', unit: 'kg', currentStock: 1.0, minStock: 1 },
  { name: 'Champiñones', category: 'Verduras', unit: 'paquete', currentStock: 2, minStock: 2 }
];

const NEW_WAITERS_TO_CREATE = [
  {
    email: 'issac@zenitmesero.com',
    password: 'IssacZenit2026!',
    displayName: 'Issac (Mesero)',
    role: 'MESERO'
  },
  {
    email: 'david@zenitmesero.com',
    password: 'DavidZenit2026!',
    displayName: 'David (Mesero)',
    role: 'MESERO'
  }
];

async function addMissingItemsAndUsers() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("🔑 Autenticando como Super Admin...");
  const userCredential = await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  const adminUser = userCredential.user;
  console.log("✅ Autenticado exitosamente con UID:", adminUser.uid);

  // 1. Insertar los nuevos productos preservando todos los existentes
  console.log(`📦 Insertando ${NEW_PRODUCTS_TO_ADD.length} productos nuevos...`);
  for (const item of NEW_PRODUCTS_TO_ADD) {
    const slug = generateProductSlug(item.name);
    const docRef = doc(db, 'products', slug);
    await setDoc(docRef, {
      id_producto: slug,
      name: item.name.trim(),
      normalized_name: item.name.toLowerCase().trim(),
      category: item.category,
      unit: item.unit,
      currentStock: Number(item.currentStock),
      initialStock: Number(item.currentStock),
      minStock: Number(item.minStock || 0),
      supplier: 'Proveedor Central Zénit',
      location: 'Cocina / Bodega Central',
      status: 'ACTIVE',
      notes: 'Agregado al catálogo de insumos',
      companyId: 'default_company',
      createdBy: adminUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log(`   ✓ Agregado: ${item.name} (${item.currentStock} ${item.unit}) -> ID: ${slug}`);
  }

  // 2. Crear los dos nuevos usuarios Meseros (Issac y David)
  console.log("\n👤 Creando cuentas de meseros (Issac y David)...");
  for (const w of NEW_WAITERS_TO_CREATE) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, w.email, w.password);
      await updateProfile(cred.user, { displayName: w.displayName });

      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: w.email,
        displayName: w.displayName,
        role: w.role,
        isSuperAdmin: false,
        companyId: 'default_company',
        createdAt: serverTimestamp(),
        active: true
      });
      console.log(`   ✅ Mesero creado: ${w.displayName} (${w.email})`);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        console.log(`   ℹ️ El mesero ${w.email} ya existe en Firebase.`);
      } else {
        console.error(`   ❌ Error al crear ${w.email}:`, err.message);
      }
    }
  }

  console.log("\n🎉 ¡Proceso completado con éxito!");
  process.exit(0);
}

addMissingItemsAndUsers().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
