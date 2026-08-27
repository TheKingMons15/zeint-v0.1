// =========================================================================
// SERVICIO DE CHAT INTERNO EN TIEMPO REAL (ZÉNIT STAFF CHAT)
// Permite comunicación instantánea entre Cocina, Bar, Meseros y Administración
// =========================================================================

import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { getTodayDateString } from '../utils/formatters';

const DEMO_CHAT_KEY = 'zenit_demo_chat_messages';

export const CHAT_CHANNELS = [
  { id: 'GENERAL', name: '📢 General Zénit', description: 'Todos los colaboradores', color: 'emerald' },
  { id: 'COCINA', name: '🍳 Cocina & Parrilla', description: 'Comandos y pedidos de cocina', color: 'amber' },
  { id: 'BAR', name: '🍸 Bar & Coctelería', description: 'Bebidas, tragos y barra', color: 'purple' },
  { id: 'SALA', name: '🍽️ Sala & Meseros', description: 'Atención a comensales y mesas', color: 'sky' }
];

export const QUICK_MESSAGES = [
  '🔔 ¡Comanda lista para retirar en Cocina!',
  '🍸 ¡Bebidas listas en la Barra!',
  '⚡ ¡Por favor acelerar comanda!',
  '🧊 ¡Se requiere hielo en el Bar!',
  '💵 ¡Mesa solicita la cuenta!',
  '⚠️ ¡Cliente solicita cambio de término de carne!',
  '🍴 ¡Faltan cubiertos y platos en mesa!'
];

export const chatService = {
  // Suscripción a mensajes en tiempo real
  subscribeMessages(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_CHAT_KEY);
      if (!stored) {
        localStorage.setItem(DEMO_CHAT_KEY, JSON.stringify([]));
        stored = '[]';
      }
      callback(JSON.parse(stored));

      const handleStorage = () => {
        const data = JSON.parse(localStorage.getItem(DEMO_CHAT_KEY) || '[]');
        callback(data);
      };
      window.addEventListener('zenit_chat_updated', handleStorage);
      return () => window.removeEventListener('zenit_chat_updated', handleStorage);
    }

    try {
      const q = query(
        collection(db, 'products'),
        where('isChatMessage', '==', true)
      );

      return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        // Ordenar cronológicamente ascendente (antiguos primero, recientes abajo)
        messages.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateA - dateB;
        });

        callback(messages);
      }, (error) => {
        console.error("Error subscribing to chat messages:", error);
        callback([]);
      });
    } catch (e) {
      console.error("Exception in chatService.subscribeMessages:", e);
      callback([]);
      return () => {};
    }
  },

  // Enviar mensaje
  async sendMessage({ text, channel = 'GENERAL', user, companyId = DEFAULT_COMPANY_ID }) {
    const rawText = (text || '').trim();
    if (!rawText) return;

    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const todayStr = getTodayDateString();

    const role = (user?.role || 'OPERATOR').toUpperCase();
    const roleBadge = (
      role === 'BAR' ? '🍸 Barman' :
      role === 'COCINA' ? '🍳 Cocina' :
      role === 'MESERO' ? '🍽️ Mesero' :
      role === 'SUPERADMIN' ? '👑 Director' :
      role === 'ADMIN' ? '⭐ Administrador' : '👨‍🍳 Personal'
    );

    const messageData = {
      id: msgId,
      name: `Mensaje Chat - ${user?.displayName || 'Usuario'}`,
      minStock: 0,
      isChatMessage: true,
      text: rawText,
      channel,
      senderId: user?.uid || 'user_demo',
      senderName: user?.displayName || 'Colaborador Zénit',
      senderEmail: user?.email || '',
      senderRole: role,
      roleBadge,
      date: todayStr,
      companyId,
      createdAt: isDemoMode ? new Date().toISOString() : serverTimestamp()
    };

    if (isDemoMode) {
      const messages = JSON.parse(localStorage.getItem(DEMO_CHAT_KEY) || '[]');
      messages.push(messageData);
      localStorage.setItem(DEMO_CHAT_KEY, JSON.stringify(messages));
      window.dispatchEvent(new Event('zenit_chat_updated'));
      return messageData;
    }

    const docRef = doc(db, 'products', msgId);
    await setDoc(docRef, messageData);
    return messageData;
  }
};
