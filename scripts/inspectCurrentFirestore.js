import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function inspect() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  console.log("✅ Conectado a Firestore.");

  const snap = await getDocs(collection(db, 'products'));
  console.log(`📊 Total de productos actuales en Firestore: ${snap.size}`);
  
  const productsWithStock = [];
  snap.forEach(docSnap => {
    const data = docSnap.data();
    if (data.currentStock > 0) {
      productsWithStock.push({ id: docSnap.id, name: data.name, stock: data.currentStock, unit: data.unit });
    }
  });

  console.log(`📦 Productos con stock > 0 ingresados por el usuario (${productsWithStock.length}):`);
  productsWithStock.forEach(p => console.log(`   - ${p.name}: ${p.stock} ${p.unit} (ID: ${p.id})`));

  process.exit(0);
}

inspect().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
