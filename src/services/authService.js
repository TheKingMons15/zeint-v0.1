import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { USER_ROLES } from '../utils/constants';
import { auditService } from './auditService';

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
        const defaultUser = {
          uid: 'karen_admin',
          email: 'karenadmin@zenit.com',
          displayName: 'Karen (Administrador)',
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
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          let profileData = {};

          if (userDoc.exists()) {
            profileData = userDoc.data();
          } else {
            // Asignar rol admin por defecto a Karen o según prefijo
            const isAdmin = firebaseUser.email?.includes('admin') || firebaseUser.email?.startsWith('karen');
            profileData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || (isAdmin ? 'Karen (Administrador)' : 'Usuario'),
              role: isAdmin ? USER_ROLES.ADMIN : USER_ROLES.SUPERVISOR,
              companyId: DEFAULT_COMPANY_ID,
              createdAt: serverTimestamp(),
              active: true
            };
            await setDoc(userDocRef, profileData, { merge: true });
          }

          const userObj = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || profileData.displayName || 'Usuario',
            role: profileData.role || USER_ROLES.OPERATOR,
            companyId: profileData.companyId || DEFAULT_COMPANY_ID,
            photoURL: firebaseUser.photoURL,
            lastLoginAt: profileData.lastLoginAt
          };

          callback(userObj);
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
      let displayName = 'Usuario';
      let role = USER_ROLES.OPERATOR;

      if (email.includes('karen')) {
        displayName = 'Karen (Administrador)';
        role = USER_ROLES.ADMIN;
      } else if (email.includes('wladimir')) {
        displayName = 'Wladimir (Supervisor)';
        role = USER_ROLES.SUPERVISOR;
      } else if (email.includes('hernan')) {
        displayName = 'Hernán (Operador)';
        role = USER_ROLES.OPERATOR;
      }

      const demoUser = {
        uid: 'demo_' + email.split('@')[0],
        email,
        displayName,
        role,
        companyId: DEFAULT_COMPANY_ID,
        lastLoginAt: new Date().toISOString()
      };

      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      await auditService.logAction(demoUser, 'LOGIN', { message: `Ingreso al sistema como ${role}` });
      return demoUser;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar última fecha de ingreso y registrar auditoría
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
      await auditService.logAction(
        { uid: user.uid, email: user.email, displayName: user.displayName || email },
        'LOGIN',
        { message: 'Ingreso al sistema exitoso' }
      );
    } catch (e) {
      console.warn("Could not log login event:", e);
    }

    return user;
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
      await auditService.logAction(demoUser, 'LOGIN', { message: 'Registro e ingreso de nuevo usuario' });
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
      lastLoginAt: serverTimestamp(),
      active: true
    });

    await auditService.logAction(
      { uid: user.uid, email: user.email, displayName, role },
      'REGISTER',
      { message: `Usuario creado con rol: ${role}` }
    );

    return user;
  },

  // Cerrar Sesión
  async logout(user) {
    if (isDemoMode) {
      if (user) {
        await auditService.logAction(user, 'LOGOUT', { message: 'Cierre de sesión' });
      }
      localStorage.removeItem(DEMO_USER_KEY);
      return;
    }

    if (user) {
      try {
        await auditService.logAction(user, 'LOGOUT', { message: 'Cierre de sesión' });
      } catch (e) {
        console.warn("Logout log failed:", e);
      }
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
