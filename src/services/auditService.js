import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';

const DEMO_AUDIT_KEY = 'inventario_demo_audit_logs';

export const auditService = {
  // Registrar una acción en la bitácora de auditoría
  async logAction(user, actionType, details = {}) {
    const logEntry = {
      actionType, // 'LOGIN' | 'LOGOUT' | 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'DELETE_PRODUCT' | 'ENTRY_MOVEMENT' | 'EXIT_MOVEMENT'
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Usuario',
      userEmail: user?.email || 'sin-correo',
      userRole: user?.role || 'operator',
      details,
      companyId: user?.companyId || DEFAULT_COMPANY_ID,
      timestamp: new Date().toISOString()
    };

    if (isDemoMode) {
      const logs = JSON.parse(localStorage.getItem(DEMO_AUDIT_KEY) || '[]');
      const newLog = {
        id: 'log_' + Date.now(),
        ...logEntry,
        createdAt: new Date().toISOString()
      };
      logs.unshift(newLog);
      // Mantener últimos 200 registros en demo
      if (logs.length > 200) logs.pop();
      localStorage.setItem(DEMO_AUDIT_KEY, JSON.stringify(logs));
      window.dispatchEvent(new Event('demo_audit_updated'));
      return newLog;
    }

    try {
      const docRef = await addDoc(collection(db, 'audit_logs'), {
        ...logEntry,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...logEntry };
    } catch (error) {
      console.error("Error writing audit log:", error);
    }
  },

  // Suscribirse al historial de auditoría en tiempo real
  subscribe(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_AUDIT_KEY);
      if (!stored) {
        // Logs iniciales de prueba
        const initialLogs = [
          {
            id: 'log_1',
            actionType: 'LOGIN',
            userName: 'Karen (Administrador)',
            userEmail: 'karenadmin@zenit.com',
            userRole: 'admin',
            details: { message: 'Inicio de sesión exitoso en el sistema' },
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: 'log_2',
            actionType: 'ENTRY_MOVEMENT',
            userName: 'Wladimir (Supervisor)',
            userEmail: 'wladimir@zenit.com',
            userRole: 'supervisor',
            details: { product: 'Filete de pollo', quantity: '15 kg', reason: 'Compra a Proveedor' },
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        localStorage.setItem(DEMO_AUDIT_KEY, JSON.stringify(initialLogs));
        stored = JSON.stringify(initialLogs);
      }
      callback(JSON.parse(stored));

      const handleStorage = () => {
        const data = JSON.parse(localStorage.getItem(DEMO_AUDIT_KEY) || '[]');
        callback(data);
      };
      window.addEventListener('demo_audit_updated', handleStorage);
      return () => window.removeEventListener('demo_audit_updated', handleStorage);
    }

    try {
      const q = query(
        collection(db, 'audit_logs'),
        where('companyId', '==', companyId)
      );

      return onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Ordenamiento seguro en memoria
        logs.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || a.timestamp || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || b.timestamp || 0);
          return dateB - dateA;
        });

        callback(logs);
      }, (error) => {
        console.error("Error subscribing to audit logs in Firestore:", error);
        callback([]);
      });
    } catch (e) {
      console.error("Exception in auditService.subscribe:", e);
      callback([]);
      return () => {};
    }
  }
};
