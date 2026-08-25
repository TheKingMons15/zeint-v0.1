import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { USER_ROLES } from '../utils/constants';

// Local storage key para sesión demo
const DEMO_USER_KEY = 'inventario_demo_user';

export const authService = {
  // Suscripción al estado de autenticación
  onAuthChange(callback) {
    if (isDemoMode) {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        try {
          const user = JSON.parse(stored);
          callback(user);
        } catch {
          callback(null);
        }
      } else {
        // Usuario demo inicial por defecto para pruebas
        const defaultUser = {
          uid: 'demo_user_1',
          email: 'admin@inventario.com',
          displayName: 'Administrador Demo',
          role: USER_ROLES.ADMIN,
          companyId: DEFAULT_COMPANY_ID
        };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultUser));
        callback(defaultUser);
      }
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let profileData = {};
          if (userDoc.exists()) {
            profileData = userDoc.data();
          }

          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || profileData.displayName || 'Usuario',
            role: profileData.role || USER_ROLES.OPERATOR,
            companyId: profileData.companyId || DEFAULT_COMPANY_ID,
            photoURL: firebaseUser.photoURL
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Usuario',
            role: USER_ROLES.OPERATOR,
            companyId: DEFAULT_COMPANY_ID
          });
        }
      } else {
        callback(null);
      }
    });
  },

  // Iniciar Sesión
  async login(email, password) {
    if (isDemoMode) {
      const demoUser = {
        uid: 'demo_user_' + Date.now(),
        email: email || 'admin@inventario.com',
        displayName: email.split('@')[0] || 'Administrador Demo',
        role: USER_ROLES.ADMIN,
        companyId: DEFAULT_COMPANY_ID
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Registro de Nuevo Usuario
  async register(email, password, displayName, role = USER_ROLES.OPERATOR) {
    if (isDemoMode) {
      const demoUser = {
        uid: 'demo_user_' + Date.now(),
        email,
        displayName: displayName || 'Nuevo Usuario',
        role: role || USER_ROLES.OPERATOR,
        companyId: DEFAULT_COMPANY_ID
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    // Guardar documento del usuario en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role,
      companyId: DEFAULT_COMPANY_ID,
      createdAt: serverTimestamp(),
      active: true
    });

    return user;
  },

  // Cerrar Sesión
  async logout() {
    if (isDemoMode) {
      localStorage.removeItem(DEMO_USER_KEY);
      return;
    }
    await signOut(auth);
  },

  // Recuperar Contraseña
  async resetPassword(email) {
    if (isDemoMode) {
      return true;
    }
    await sendPasswordResetEmail(auth, email);
  }
};
