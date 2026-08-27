import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs, query, where } from 'firebase/firestore';

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

async function updateStrictRoles() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  console.log("✅ Conectado a Firestore.");

  const usersSnap = await getDocs(collection(db, 'users'));
  console.log(`📊 Actualizando roles estrictos para ${usersSnap.size} usuarios...`);

  usersSnap.forEach(async (docSnap) => {
    const data = docSnap.data();
    const email = data.email?.toLowerCase();

    let newRole = data.role;
    if (email === 'marlon@zenit.com') {
      newRole = 'BAR';
    } else if (email === 'hernan@zenit.com') {
      newRole = 'COCINA';
    } else if (email?.includes('mesero') || email === 'carolina@zenitmesero.com' || email === 'issac@zenitmesero.com' || email === 'david@zenitmesero.com') {
      newRole = 'MESERO';
    }

    if (newRole !== data.role) {
      await setDoc(docSnap.ref, { role: newRole, updatedAt: serverTimestamp() }, { merge: true });
      console.log(`   ✓ Usuario ${email} actualizado a ROL ESTRICTO: [${newRole}]`);
    } else {
      console.log(`   • Usuario ${email} mantiene ROL: [${data.role}]`);
    }
  });

  setTimeout(() => {
    console.log("🎉 ¡Roles estrictos delimitados con éxito!");
    process.exit(0);
  }, 2000);
}

updateStrictRoles().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
