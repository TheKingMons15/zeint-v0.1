import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';

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

// Productos de Bar y Coctelería para poner stock a Full
const BAR_PRODUCTS_SLUGS = [
  'prod_limon_sutil',
  'prod_naranja',
  'prod_tomate_de_arbol',
  'prod_jarabe_de_frutilla',
  'prod_romero',
  'prod_leche',
  'prod_crema_de_leche',
  'prod_cocoa',
  'prod_cobertura_de_chocolate',
  'prod_sal',
  'prod_azucar'
];

async function setBarStockFull() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  console.log("✅ Autenticado exitosamente.");

  console.log("🍸 Ajustando stock de Bar a Full (9999)...");
  
  for (const slug of BAR_PRODUCTS_SLUGS) {
    const docRef = doc(db, 'products', slug);
    await setDoc(docRef, {
      currentStock: 999,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log(`   ✓ Stock Full asignado a: ${slug} -> 999`);
  }

  console.log("🎉 ¡Stock de Bar y Coctelería actualizado a Full!");
  process.exit(0);
}

setBarStockFull().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
