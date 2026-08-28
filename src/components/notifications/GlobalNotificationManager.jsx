import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  ChefHat, 
  Wine, 
  CheckCircle2, 
  X, 
  UtensilsCrossed, 
  MessageSquare,
  Sparkles,
  Volume2,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService, ORDER_STATUS } from '../../services/orderService';
import { chatService } from '../../services/chatService';
import { playSound } from '../../utils/audioAlerts';
import { 
  sendNativeNotification, 
  requestNativeNotificationPermission, 
  getNotificationPermission,
  isNotificationSupported 
} from '../../utils/nativeNotifications';
import { StaffChatDrawer } from '../chat/StaffChatDrawer';

export const GlobalNotificationManager = () => {
  const { user } = useAuth();
  const [activePopup, setActivePopup] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [permissionState, setPermissionState] = useState('default');
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

  const prevOrdersRef = useRef(new Map());
  const initialLoadRef = useRef(true);
  const prevChatCountRef = useRef(0);

  const companyId = user?.companyId || 'default_company';
  const role = (user?.role || '').toUpperCase();

  // Verificar estado de permisos de notificación nativa del teléfono
  useEffect(() => {
    const perm = getNotificationPermission();
    setPermissionState(perm);
    if (perm === 'default' && isNotificationSupported()) {
      setShowPermissionBanner(true);
    }
  }, []);

  const handleEnableDeviceNotifications = async () => {
    const result = await requestNativeNotificationPermission();
    setPermissionState(result);
    setShowPermissionBanner(false);
    if (result === 'granted') {
      sendNativeNotification({
        title: '🔔 ¡Notificaciones Zénit Activadas!',
        body: 'Recibirás avisos de comandas y platos listos directamente en la pantalla de tu celular.',
        tag: 'welcome-notification'
      });
      playSound('NEW_ORDER');
    }
  };

  // Suscripción a pedidos en vivo para alertas pop-up y nativas de Cocina, Bar y Meseros
  useEffect(() => {
    if (!user) return;

    const unsub = orderService.subscribeOrders(companyId, (liveOrders) => {
      if (initialLoadRef.current) {
        liveOrders.forEach(o => prevOrdersRef.current.set(o.id, o.status));
        initialLoadRef.current = false;
        return;
      }

      liveOrders.forEach(order => {
        const prevStatus = prevOrdersRef.current.get(order.id);

        // 1. NUEVA COMANDA DETECTADA (Estado PENDING recién creado)
        if (!prevStatus && order.status === ORDER_STATUS.PENDING) {
          const hasKitchenItems = order.items?.some(i => {
            const cat = (i.category || '').toLowerCase();
            return i.destination === 'KITCHEN' || (!cat.includes('bebida') && !cat.includes('coctel') && !cat.includes('bar'));
          });
          const hasBarItems = order.items?.some(i => {
            const cat = (i.category || '').toLowerCase();
            return i.destination === 'BAR' || cat.includes('bebida') || cat.includes('coctel') || cat.includes('bar');
          });

          // Notificar a Cocina (Pop-up + Audio + Notificación Nativa Celular)
          if ((role === 'COCINA' || role === 'ADMIN' || role === 'SUPERADMIN') && hasKitchenItems) {
            playSound('NEW_ORDER');
            sendNativeNotification({
              title: `🍳 ¡Nueva Comanda en Cocina! (${order.table})`,
              body: `Mesero: ${order.waiterName || 'Sala'} • ${order.items?.map(i => `${i.quantity}x ${i.name}`).slice(0, 2).join(', ')}`,
              tag: `kitchen-order-${order.id}`
            });

            setActivePopup({
              id: 'new_kitchen_' + order.id,
              type: 'KITCHEN_NEW',
              title: `🍳 ¡Nueva Comanda en Cocina! (${order.table})`,
              description: `Mesero: ${order.waiterName || 'Sala'} • ${order.items?.length || 0} platos`,
              items: order.items?.map(i => `${i.quantity}x ${i.name}`).slice(0, 3).join(', '),
              color: 'amber'
            });
          }

          // Notificar a Bar (Pop-up + Audio + Notificación Nativa Celular)
          if ((role === 'BAR' || role === 'ADMIN' || role === 'SUPERADMIN') && hasBarItems) {
            playSound('NEW_ORDER');
            sendNativeNotification({
              title: `🍸 ¡Nueva Comanda en Bar! (${order.table})`,
              body: `Mesero: ${order.waiterName || 'Sala'} • ${order.items?.map(i => `${i.quantity}x ${i.name}`).slice(0, 2).join(', ')}`,
              tag: `bar-order-${order.id}`
            });

            setActivePopup({
              id: 'new_bar_' + order.id,
              type: 'BAR_NEW',
              title: `🍸 ¡Nueva Comanda en Bar! (${order.table})`,
              description: `Mesero: ${order.waiterName || 'Sala'} • Tragos y bebidas`,
              items: order.items?.map(i => `${i.quantity}x ${i.name}`).slice(0, 3).join(', '),
              color: 'purple'
            });
          }
        }

        // 2. COMANDA MARCADA COMO LISTA (Estado READY) ➔ Notificar a MESEROS
        if (prevStatus && prevStatus !== ORDER_STATUS.READY && order.status === ORDER_STATUS.READY) {
          if (role === 'MESERO' || role === 'ADMIN' || role === 'SUPERADMIN') {
            playSound('ORDER_READY');
            sendNativeNotification({
              title: `✅ ¡Pedido LISTO para Servir! (${order.table})`,
              body: `La comanda de ${order.table} ya está lista en barra / cocina para retirar.`,
              tag: `ready-order-${order.id}`
            });

            setActivePopup({
              id: 'ready_' + order.id,
              type: 'ORDER_READY',
              title: `✅ ¡Pedido LISTO para Servir! (${order.table})`,
              description: `La comanda de ${order.table} está lista en barra / cocina para retirar y llevar a la mesa.`,
              items: order.items?.map(i => `${i.quantity}x ${i.name}`).slice(0, 3).join(', '),
              color: 'emerald'
            });
          }
        }

        // 3. COMANDA O PLATO CANCELADO ➔ Notificar a Cocina, Bar y Administradores
        if (prevStatus && prevStatus !== ORDER_STATUS.CANCELLED && order.status === ORDER_STATUS.CANCELLED) {
          if (role === 'COCINA' || role === 'BAR' || role === 'ADMIN' || role === 'SUPERADMIN') {
            playSound('ORDER_CANCELLED');
            sendNativeNotification({
              title: `🚫 ¡Comanda Anulada en Sala! (${order.table})`,
              body: `La comanda de ${order.table} fue cancelada por ${order.cancelledBy || 'Sala'}. Motivo: ${order.cancelReason || 'Por cliente'}`,
              tag: `cancel-order-${order.id}`
            });

            setActivePopup({
              id: 'cancelled_' + order.id,
              type: 'ORDER_CANCELLED',
              title: `🚫 ¡Comanda Anulada! (${order.table})`,
              description: `Cancelada por ${order.cancelledBy || 'Sala'} • Motivo: ${order.cancelReason || 'Cliente canceló'}`,
              items: 'No preparar ningún plato de esta mesa',
              color: 'rose'
            });
          }
        }

        // Actualizar mapa
        prevOrdersRef.current.set(order.id, order.status);
      });
    });

    return () => unsub();
  }, [companyId, user, role]);

  // Suscripción al chat para contador de no leídos y notificación nativa
  useEffect(() => {
    if (!user) return;

    const unsub = chatService.subscribeMessages(companyId, (liveMessages) => {
      if (liveMessages.length > prevChatCountRef.current) {
        if (!isChatOpen && prevChatCountRef.current > 0) {
          setUnreadChatCount(prev => prev + 1);

          const lastMsg = liveMessages[liveMessages.length - 1];
          if (lastMsg.senderId !== user?.uid) {
            sendNativeNotification({
              title: `💬 Chat Zénit: ${lastMsg.senderName} (${lastMsg.roleBadge || 'Personal'})`,
              body: lastMsg.text,
              tag: 'chat-message'
            });
          }
        }
      }
      prevChatCountRef.current = liveMessages.length;
    });

    return () => unsub();
  }, [companyId, user, isChatOpen]);

  // Auto-cerrar pop-up a los 7 segundos si no se interactúa
  useEffect(() => {
    if (activePopup) {
      const timer = setTimeout(() => {
        setActivePopup(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [activePopup]);

  if (!user) return null;

  return (
    <>
      {/* Banner de Solicitud de Permiso Nativo Móvil (Android & iOS) */}
      {showPermissionBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] animate-slide-down">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
                <Smartphone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white leading-tight">
                  Activar Avisos en este Celular
                </h5>
                <p className="text-[10px] text-slate-300">
                  Recibe alertas de comandas y platos listos en Android e iOS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleEnableDeviceNotifications}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition-all whitespace-nowrap"
              >
                Activar
              </button>
              <button
                onClick={() => setShowPermissionBanner(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up flotante de Notificación In-App */}
      {activePopup && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-slide-down pointer-events-auto px-4">
          <div className={`p-4 rounded-3xl bg-slate-900/95 border shadow-2xl backdrop-blur-xl flex items-start gap-3.5 ring-2 ${
            activePopup.color === 'amber'
              ? 'border-amber-500/50 shadow-amber-950/60 ring-amber-500/30'
              : activePopup.color === 'purple'
              ? 'border-purple-500/50 shadow-purple-950/60 ring-purple-500/30'
              : activePopup.color === 'rose'
              ? 'border-rose-500/50 shadow-rose-950/60 ring-rose-500/30'
              : 'border-emerald-500/50 shadow-emerald-950/60 ring-emerald-500/30'
          }`}>
            
            <div className={`p-3 rounded-2xl shrink-0 ${
              activePopup.color === 'amber'
                ? 'bg-amber-500/20 text-amber-300'
                : activePopup.color === 'purple'
                ? 'bg-purple-500/20 text-purple-300'
                : activePopup.color === 'rose'
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {activePopup.color === 'amber' ? <ChefHat className="w-6 h-6 animate-bounce" /> :
               activePopup.color === 'purple' ? <Wine className="w-6 h-6 animate-bounce" /> :
               activePopup.color === 'rose' ? <AlertTriangle className="w-6 h-6 animate-bounce" /> :
               <CheckCircle2 className="w-6 h-6 animate-pulse" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-white leading-tight">
                {activePopup.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {activePopup.description}
              </p>
              {activePopup.items && (
                <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">
                  {activePopup.items}
                </p>
              )}
            </div>

            <button
              onClick={() => setActivePopup(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

      {/* Botón Flotante de Chat para todo el personal */}
      <div className="fixed bottom-20 right-5 lg:bottom-6 lg:right-6 z-40">
        <button
          onClick={() => {
            setIsChatOpen(true);
            setUnreadChatCount(0);
          }}
          className="relative p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 shadow-2xl shadow-emerald-950/80 active:scale-95 transition-all border-2 border-slate-950 hover:scale-105 group"
          title="Abrir Chat de Personal Zénit"
        >
          <MessageSquare className="w-6 h-6 stroke-[2.5]" />

          {/* Badge de No Leídos */}
          {unreadChatCount > 0 && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full border-2 border-slate-950 animate-bounce">
              {unreadChatCount}
            </span>
          )}

          {/* Tooltip táctil */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            💬 Chat Interno
          </span>
        </button>
      </div>

      {/* Drawer / Modal del Chat */}
      <StaffChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};
