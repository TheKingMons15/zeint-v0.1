import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

const USERS_TO_CREATE = [
  // SUPER ADMIN SECRETO (DIRECTOR)
  {
    email: 'master@zenit.com',
    password: 'ZenitMaster2026#Secret!',
    displayName: 'Super Administrador (Director)',
    role: 'superadmin',
    isSuperAdmin: true
  },
  // KAREN (ADMINISTRADORA)
  {
    email: 'karenadmin@zenit.com',
    password: 'KarenZenit2026!',
    displayName: 'Karen (Administrador)',
    role: 'admin',
    isSuperAdmin: false
  },
  // WLADIMIR (SUPERVISOR)
  {
    email: 'wladimir@zenit.com',
    password: 'WladimirZenit2026!',
    displayName: 'Wladimir (Supervisor)',
    role: 'supervisor',
    isSuperAdmin: false
  },
  // HERNÁN (OPERADOR)
  {
    email: 'hernan@zenit.com',
    password: 'HernanZenit2026!',
    displayName: 'Hernán (Operador)',
    role: 'operator',
    isSuperAdmin: false
  },
  // CAROLINA (MESERO DE SALA)
  {
    email: 'carolina@zenitmesero.com',
    password: 'CarolinaZenit2026!',
    displayName: 'Carolina (Mesero)',
    role: 'MESERO',
    isSuperAdmin: false
  }
];

async function createAllUsers() {
  console.log("🔥 Conectando con Firebase Auth:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  for (const u of USERS_TO_CREATE) {
    try {
      console.log(`👤 Creando cuenta para ${u.displayName} (${u.email})...`);
      const userCredential = await createUserWithEmailAndPassword(auth, u.email, u.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: u.displayName });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        isSuperAdmin: Boolean(u.isSuperAdmin),
        companyId: 'default_company',
        createdAt: serverTimestamp(),
        active: true
      });

      console.log(`✅ Usuario ${u.displayName} creado exitosamente en Firebase.`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ El usuario ${u.email} ya existe en Firebase Authentication.`);
      } else {
        console.error(`❌ Error al crear ${u.email}:`, error.message);
      }
    }
  }

  console.log("\n🎉 ¡Proceso finalizado! Las cuentas están listas en Firebase.");
  process.exit(0);
}

createAllUsers().catch(console.error);
