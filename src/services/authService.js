import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, DEFAULT_COMPANY_ID } from '../firebase/config';
import { USER_ROLES } from '../utils/constants';
import { auditService } from './auditService';

export const authService = {
  // Suscripción estricta al estado de autenticación real de Firebase
  onAuthChange(callback) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          let profileData = {};

          if (userDoc.exists()) {
            profileData = userDoc.data();
          } else {
            const isSuper = firebaseUser.email === 'master@zenit.com';
            const isAdmin = firebaseUser.email?.includes('admin') || firebaseUser.email?.startsWith('karen');
            profileData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || (isSuper ? 'Director General' : isAdmin ? 'Karen (Administrador)' : 'Operador'),
              role: isSuper ? 'superadmin' : isAdmin ? USER_ROLES.ADMIN : USER_ROLES.OPERATOR,
              isSuperAdmin: isSuper,
              companyId: DEFAULT_COMPANY_ID,
              createdAt: serverTimestamp(),
              active: true
            };
            await setDoc(userDocRef, profileData, { merge: true });
          }

          const emailLower = (firebaseUser.email || '').toLowerCase();
          let calculatedRole = profileData.role || USER_ROLES.OPERATOR;
          
          if (emailLower === 'marlon@zenit.com' || calculatedRole.toUpperCase() === 'BAR') {
            calculatedRole = 'BAR';
          } else if (emailLower === 'hernan@zenit.com' || emailLower.startsWith('diana') || calculatedRole.toUpperCase() === 'COCINA') {
            calculatedRole = 'COCINA';
          } else if (emailLower.includes('mesero') || calculatedRole.toUpperCase() === 'MESERO') {
            calculatedRole = 'MESERO';
          } else if (emailLower === 'master@zenit.com' || calculatedRole === 'superadmin') {
            calculatedRole = 'superadmin';
          } else if (emailLower === 'karenadmin@zenit.com' || calculatedRole === 'admin') {
            calculatedRole = 'admin';
          } else if (emailLower === 'wladimir@zenit.com' || calculatedRole === 'supervisor') {
            calculatedRole = 'supervisor';
          }

          const userObj = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || profileData.displayName || (
              calculatedRole === 'BAR' ? 'Marlon (Bar & Coctelería)' :
              emailLower.startsWith('diana') ? 'Diana (Cocina & Inventario)' :
              calculatedRole === 'COCINA' ? 'Hernán (Cocina)' :
              calculatedRole === 'MESERO' ? 'Mesero (Sala)' : 'Usuario'
            ),
            role: calculatedRole,
            isSuperAdmin: Boolean(profileData.isSuperAdmin || calculatedRole === 'superadmin' || emailLower === 'master@zenit.com'),
            companyId: profileData.companyId || DEFAULT_COMPANY_ID,
            photoURL: firebaseUser.photoURL,
            lastLoginAt: profileData.lastLoginAt
          };

          callback(userObj);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          const emailLower = (firebaseUser.email || '').toLowerCase();
          const fallbackRole = (
            emailLower === 'marlon@zenit.com' ? 'BAR' :
            (emailLower === 'hernan@zenit.com' || emailLower.startsWith('diana')) ? 'COCINA' :
            emailLower.includes('mesero') ? 'MESERO' : USER_ROLES.OPERATOR
          );

          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || (emailLower.startsWith('diana') ? 'Diana (Cocina)' : 'Usuario'),
            role: fallbackRole,
            companyId: DEFAULT_COMPANY_ID
          });
        }
      } else {
        // Ningún usuario autenticado -> Redirige al login de inmediato
        callback(null);
      }
    });
  },

  // Iniciar Sesión con Firebase Authentication
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
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
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: displayName.trim() });

    const isSuper = email.trim() === 'master@zenit.com' || role === 'superadmin';

    // Guardar documento del usuario en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName.trim(),
      role: role || USER_ROLES.OPERATOR,
      isSuperAdmin: isSuper,
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
    if (user) {
      try {
        await auditService.logAction(user, 'LOGOUT', { message: 'Cierre de sesión' });
      } catch (e) {
        console.warn("Logout log failed:", e);
      }
    }
    // Limpiar cualquier residuo de almacenamiento local
    localStorage.removeItem('inventario_demo_user');
    await signOut(auth);
  },

  // Recuperar Contraseña
  async resetPassword(email) {
    await sendPasswordResetEmail(auth, email.trim());
  }
};
