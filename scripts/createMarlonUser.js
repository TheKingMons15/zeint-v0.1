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

async function createMarlon() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const marlonUser = {
    email: 'marlon@zenit.com',
    password: 'MarlonZenit2026!',
    displayName: 'Marlon (Bar & Coctelería)',
    role: 'operator' // Mismo perfil que Hernán
  };

  try {
    console.log(`👤 Creando cuenta para ${marlonUser.displayName} (${marlonUser.email})...`);
    const cred = await createUserWithEmailAndPassword(auth, marlonUser.email, marlonUser.password);
    await updateProfile(cred.user, { displayName: marlonUser.displayName });

    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email: marlonUser.email,
      displayName: marlonUser.displayName,
      role: marlonUser.role,
      isSuperAdmin: false,
      companyId: 'default_company',
      createdAt: serverTimestamp(),
      active: true
    });
    console.log(`✅ Usuario creado exitosamente: ${marlonUser.displayName}`);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`ℹ️ El usuario ${marlonUser.email} ya existe en Firebase.`);
    } else {
      console.error(`❌ Error al crear usuario:`, err.message);
    }
  }

  process.exit(0);
}

createMarlon().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
