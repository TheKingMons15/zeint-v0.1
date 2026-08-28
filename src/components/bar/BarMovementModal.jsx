import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Check, 
  Wine, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Trash2 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getTodayDateString } from '../../utils/formatters';

const ENTRY_REASONS = [
  'Compra / Ingreso de proveedor',
  'Transferencia desde bodega central',
  'Ajuste de inventario positivo (Conteo físico)',
  'Devolución de mesa'
];

const EXIT_REASONS = [
  'Consumo normal de coctelería y barra',
  'Botella rota / Daño accidental',
  'Merma por vencimiento o deterioro',
  'Degustación / Cortesía autorizada',
  'Ajuste de inventario negativo (Conteo físico)'
];

export const BarMovementModal = ({
  isOpen,
  onClose,
  type = 'ENTRY', // 'ENTRY' | 'EXIT'
  products = [],
  defaultProductId = '',
  onSave,
  loading = false
}) => {
  const [movementType, setMovementType] = useState(type);
  const [selectedProductId, setSelectedProductId] = useState(defaultProductId);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState(type === 'ENTRY' ? ENTRY_REASONS[0] : EXIT_REASONS[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setMovementType(type);
    setReason(type === 'ENTRY' ? ENTRY_REASONS[0] : EXIT_REASONS[0]);
  }, [type, isOpen]);

  useEffect(() => {
    if (defaultProductId) {
      setSelectedProductId(defaultProductId);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [defaultProductId, products, isOpen]);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const currentStock = Number(selectedProduct?.currentStock || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;

    onSave({
      type: movementType,
      productId: selectedProductId,
      productName: selectedProduct?.name || 'Insumo Bar',
      category: selectedProduct?.category || 'Bar',
      unit: selectedProduct?.unit || 'botella',
      quantity: Number(quantity),
      previousStock: currentStock,
      newStock: movementType === 'ENTRY' ? currentStock + Number(quantity) : Math.max(0, currentStock - Number(quantity)),
      reason,
      notes,
      date: getTodayDateString(),
      location: 'Bar'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={movementType === 'ENTRY' ? '📥 Registrar Entrada de Botellas / Insumos' : '📤 Registrar Salida, Consumo o Merma'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Selector de Tipo (Entrada vs Salida) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMovementType('ENTRY');
              setReason(ENTRY_REASONS[0]);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              movementType === 'ENTRY'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>+ Entrada de Stock</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMovementType('EXIT');
              setReason(EXIT_REASONS[0]);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              movementType === 'EXIT'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>- Salida / Merma</span>
          </button>
        </div>

        {/* Selección de Producto */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-300">
            Seleccionar Botella / Producto:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-purple-500"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.currentStock} {p.unit || 'botella'}) - {p.category}
              </option>
            ))}
          </select>
        </div>

        {/* Resumen del Stock Actual */}
        {selectedProduct && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Stock actual en barra:</span>
            <span className="font-mono font-black text-emerald-400">
              {currentStock} {selectedProduct.unit || 'botella(s)'}
            </span>
          </div>
        )}

        {/* Cantidad a Mover */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-300">
            Cantidad a {movementType === 'ENTRY' ? 'Ingresar' : 'Descontar'} ({selectedProduct?.unit || 'unidades'}):
          </label>
          <input
            type="number"
            step="any"
            min="0.1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full text-sm font-black px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Motivo */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-300">
            Motivo del Movimiento:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 font-bold"
          >
            {(movementType === 'ENTRY' ? ENTRY_REASONS : EXIT_REASONS).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Observaciones */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-300">
            Observación / Detalle:
          </label>
          <input
            type="text"
            placeholder="Ej: Botella de tequila rota en barra, reposición de whisky..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant={movementType === 'ENTRY' ? 'success' : 'danger'} 
            type="submit" 
            loading={loading}
            icon={Check}
            className="font-black text-xs"
          >
            {movementType === 'ENTRY' ? 'Confirmar Entrada' : 'Confirmar Salida'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
