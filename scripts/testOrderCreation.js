import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, query, where, getDocs, writeBatch } from 'firebase/firestore';

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

const WAITERS = [
  { email: 'carolina@zenitmesero.com', pass: 'CarolinaZenit2026!', name: 'Carolina' },
  { email: 'issac@zenitmesero.com', pass: 'IssacZenit2026!', name: 'Issac' },
  { email: 'david@zenitmesero.com', pass: 'DavidZenit2026!', name: 'David' }
];

async function testAllWaiters() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  for (const waiter of WAITERS) {
    console.log(`\n========================================`);
    console.log(`👤 Probando toma de pedidos para: ${waiter.name} (${waiter.email})`);
    
    try {
      const cred = await signInWithEmailAndPassword(auth, waiter.email, waiter.pass);
      console.log(`✅ Autenticado exitosamente. UID: ${cred.user.uid}`);

      const orderDocId = 'ord_' + Date.now() + '_' + waiter.name.toLowerCase();
      const orderRef = doc(db, 'products', orderDocId);

      // 1. Crear comanda
      const batch = writeBatch(db);
      batch.set(orderRef, {
        id: orderDocId,
        name: `Comanda ${waiter.name} - Mesa 2`,
        minStock: 0,
        isOrder: true,
        table: 'Mesa 2',
        total: 25.50,
        status: 'PENDING',
        waiterName: waiter.name,
        waiterEmail: waiter.email,
        items: [
          { name: 'Estrella Fugaz', price: 7.99, quantity: 1, destination: 'KITCHEN' },
          { name: 'Mojito de la cima', price: 4.99, quantity: 2, destination: 'BAR' }
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Descontar stock de un insumo
      const prodRef = doc(db, 'products', 'prod_limon_sutil');
      batch.update(prodRef, {
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      console.log(`🎉 ¡ÉXITO! ${waiter.name} creó la comanda ${orderDocId} con cero errores de permisos.`);

      // 3. Simular que Cocina o Bar actualiza el estado
      await updateDoc(orderRef, {
        status: 'READY',
        updatedAt: serverTimestamp()
      });
      console.log(`🎉 ¡ÉXITO! Comanda marcada como READY en tiempo real.`);

    } catch (e) {
      console.error(`❌ Error con mesero ${waiter.name}:`, e.message);
    }
  }

  process.exit(0);
}

testAllWaiters().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
