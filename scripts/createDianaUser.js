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

async function createDiana() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const dianaUser = {
    email: 'diana@zenit.com',
    password: 'DianaZenit2026!',
    displayName: 'Diana (Cocina & Inventario)',
    role: 'COCINA'
  };

  try {
    console.log(`👤 Creando cuenta para ${dianaUser.displayName} (${dianaUser.email})...`);
    let uid = '';
    try {
      const cred = await createUserWithEmailAndPassword(auth, dianaUser.email, dianaUser.password);
      uid = cred.user.uid;
      await updateProfile(cred.user, { displayName: dianaUser.displayName });
      console.log(`✅ Usuario creado exitosamente con UID: ${uid}`);
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ El usuario ${dianaUser.email} ya existe en Auth, iniciando sesión para actualizar Firestore...`);
        const cred = await signInWithEmailAndPassword(auth, dianaUser.email, dianaUser.password);
        uid = cred.user.uid;
        await updateProfile(cred.user, { displayName: dianaUser.displayName });
      } else {
        throw authErr;
      }
    }

    await setDoc(doc(db, 'users', uid), {
      uid: uid,
      email: dianaUser.email,
      displayName: dianaUser.displayName,
      role: 'COCINA',
      isSuperAdmin: false,
      companyId: 'default_company',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true
    }, { merge: true });

    console.log(`🎉 ¡Perfil de Diana en Firestore configurado con rol COCINA e Inventario!`);
  } catch (error) {
    console.error("❌ Error creando usuario de Diana:", error);
  }
}

createDiana().then(() => {
  console.log("🏁 Proceso de creación de Diana finalizado.");
  process.exit(0);
});
