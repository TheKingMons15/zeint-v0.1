import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Users, 
  ChefHat, 
  Wine, 
  UtensilsCrossed, 
  Crown, 
  Sparkles,
  Volume2,
  Minimize2,
  Maximize2,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { chatService, CHAT_CHANNELS, QUICK_MESSAGES } from '../../services/chatService';
import { playSound } from '../../utils/audioAlerts';
import { formatTime } from '../../utils/formatters';

export const StaffChatDrawer = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [activeChannel, setActiveChannel] = useState('GENERAL');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showQuickChips, setShowQuickChips] = useState(false);

  const messagesEndRef = useRef(null);
  const prevCountRef = useRef(0);

  const companyId = user?.companyId || 'default_company';

  // Suscripción a mensajes en tiempo real
  useEffect(() => {
    const unsub = chatService.subscribeMessages(companyId, (liveMessages) => {
      // Reproducir sonido si hay mensaje nuevo de otro usuario
      if (liveMessages.length > prevCountRef.current && prevCountRef.current > 0) {
        const lastMsg = liveMessages[liveMessages.length - 1];
        if (lastMsg.senderId !== user?.uid) {
          playSound('CHAT_MESSAGE');
        }
      }
      prevCountRef.current = liveMessages.length;
      setMessages(liveMessages);
    });

    return () => unsub();
  }, [companyId, user?.uid]);

  // Auto-scroll al final al recibir o enviar mensajes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChannel, isOpen]);

  const filteredMessages = messages.filter(m => m.channel === activeChannel || (!m.channel && activeChannel === 'GENERAL'));

  const handleSend = async (textToSend) => {
    const content = textToSend || inputText;
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage({
        text: content,
        channel: activeChannel,
        user,
        companyId
      });
      setInputText('');
      setShowQuickChips(false);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera del Chat */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                Chat Interno Zénit
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-400">
                Comunicación en vivo entre Cocina, Bar y Sala
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Canales */}
        <div className="p-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CHAT_CHANNELS.map(chan => {
            const isActive = activeChannel === chan.id;
            return (
              <button
                key={chan.id}
                onClick={() => setActiveChannel(chan.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{chan.name}</span>
              </button>
            );
          })}
        </div>

        {/* Feed de Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <MessageSquare className="w-10 h-10 stroke-[1.5] text-slate-700" />
              <p className="text-xs font-medium">No hay mensajes en este canal aún.</p>
              <p className="text-[11px] text-slate-600">Sé el primero en enviar un aviso a tus compañeros de turno.</p>
            </div>
          ) : (
            filteredMessages.map(msg => {
              const isMe = msg.senderId === user?.uid;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {/* Encabezado del mensaje */}
                  <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300">
                      {isMe ? 'Tú' : msg.senderName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-slate-800 text-emerald-400 border border-slate-700">
                      {msg.roleBadge || msg.senderRole}
                    </span>
                    <span className="font-mono text-slate-500">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>

                  {/* Burbuja del mensaje */}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-md ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                        : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none font-normal'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Frases Rápidas Desplegables (One-Tap Sending) */}
        {showQuickChips && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 animate-slide-up space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>⚡ Frases Rápidas (1 Toque):</span>
              <button 
                onClick={() => setShowQuickChips(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                Cerrar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {QUICK_MESSAGES.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(phrase)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition-colors text-left"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input para redactar mensaje */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQuickChips(!showQuickChips)}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 text-xs font-bold transition-all shrink-0"
              title="Frases Rápidas"
            >
              ⚡ Rápidas
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Escribir en ${CHAT_CHANNELS.find(c => c.id === activeChannel)?.name}...`}
              className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />

            <button
              type="button"
              disabled={!inputText.trim() || sending}
              onClick={() => handleSend()}
              className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 rounded-xl font-bold transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-500">
            {user?.displayName || 'Usuario'} • Canal activo: <strong className="text-slate-400">{activeChannel}</strong>
          </p>
        </div>

      </div>
    </div>
  );
};
