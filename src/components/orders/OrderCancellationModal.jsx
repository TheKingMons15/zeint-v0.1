import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Check, 
  Clock, 
  ChefHat, 
  Wine 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ORDER_STATUS } from '../../services/orderService';

const CANCEL_REASONS = [
  'Cliente cambió de opinión / no desea el plato',
  'Error de digitación del mesero',
  'Mesa canceló el pedido por demora',
  'Reemplazo por otro plato de la carta',
  'Comensal se retiró del restaurante'
];

export const OrderCancellationModal = ({
  isOpen,
  onClose,
  order,
  item = null,
  onConfirm,
  loading = false
}) => {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !order) return null;

  const isItemCancellation = Boolean(item);
  const isPreparingOrReady = order.status === ORDER_STATUS.PREPARING || order.status === ORDER_STATUS.READY;

  const handleConfirm = () => {
    const reason = customReason.trim() || selectedReason;
    onConfirm({
      orderId: order.id,
      itemId: item?.id,
      reason
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isItemCancellation ? `Cancelar Plato - ${item?.name}` : `Anular Comanda - ${order.table}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        
        {/* Advertencia si ya está en preparación o listo */}
        {isPreparingOrReady && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 shadow-lg shadow-rose-950/50 space-y-1 animate-pulse">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-black uppercase">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>¡Advertencia de Cocina / Barra!</span>
            </div>
            <p className="text-xs font-bold text-rose-100 pl-7 leading-relaxed">
              Este pedido se encuentra actualmente <strong>{order.status === ORDER_STATUS.PREPARING ? 'EN PREPARACIÓN' : 'LISTO PARA SERVIR'}</strong>. Si confirmas, se emitirá una alerta inmediata para detener el despacho.
            </p>
          </div>
        )}

        {/* Resumen del Item o Comanda a Cancelar */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Mesa:</span>
            <span className="font-bold text-white">{order.table}</span>
          </div>
          {isItemCancellation ? (
            <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2">
              <span className="text-slate-400">Plato a eliminar:</span>
              <span className="font-black text-rose-400">{item?.quantity}x {item?.name} (${Number(item?.price || 0).toFixed(2)})</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2">
              <span className="text-slate-400">Total comanda:</span>
              <span className="font-black text-rose-400">${Number(order.total || 0).toFixed(2)} ({order.items?.length} items)</span>
            </div>
          )}
        </div>

        {/* Selección de Motivo de Cancelación */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-300">
            Motivo de Cancelación (Requerido para Auditoría):
          </label>
          <div className="space-y-1.5">
            {CANCEL_REASONS.map((reason, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedReason === reason && !customReason
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  checked={selectedReason === reason && !customReason}
                  onChange={() => {
                    setSelectedReason(reason);
                    setCustomReason('');
                  }}
                  className="accent-emerald-500"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          {/* Motivo personalizado */}
          <input
            type="text"
            placeholder="Otro motivo específico..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 mt-2"
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Volver
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm} 
            loading={loading}
            icon={Trash2}
            className="bg-rose-600 hover:bg-rose-500 font-black text-xs"
          >
            Confirmar Cancelación
          </Button>
        </div>

      </div>
    </Modal>
  );
};
