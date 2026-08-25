import React, { useState, useEffect, useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { MOVEMENT_REASONS } from '../../utils/constants';
import { formatNumber, getTodayDateString } from '../../utils/formatters';

export const MovementModal = ({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  initialType = 'ENTRY',
  defaultProductId = '',
  loading = false
}) => {
  const [movementType, setMovementType] = useState(initialType);
  const [productId, setProductId] = useState(defaultProductId);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setMovementType(initialType || 'ENTRY');
      setProductId(defaultProductId || (products[0]?.id || ''));
      setQuantity('');
      setReason(MOVEMENT_REASONS[initialType || 'ENTRY'][0] || '');
      setNotes('');
      setDate(getTodayDateString());
      setErrors({});
    }
  }, [isOpen, initialType, defaultProductId, products]);

  // Producto seleccionado actualmente
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === productId) || null;
  }, [products, productId]);

  // Opciones de motivos según el tipo
  const reasonsOptions = useMemo(() => {
    return (MOVEMENT_REASONS[movementType] || []).map(r => ({ value: r, label: r }));
  }, [movementType]);

  // Actualizar motivo predeterminado al cambiar tipo
  const handleTypeChange = (type) => {
    setMovementType(type);
    setReason(MOVEMENT_REASONS[type][0] || '');
  };

  // Cálculo en vivo del nuevo stock
  const stockCalculations = useMemo(() => {
    if (!selectedProduct) return null;
    const current = Number(selectedProduct.currentStock || 0);
    const qty = Number(quantity) || 0;
    const isEntry = movementType === 'ENTRY';
    const resulting = isEntry ? current + qty : current - qty;
    const isNegative = resulting < 0;
    const isBelowMin = resulting <= Number(selectedProduct.minStock || 0);

    return {
      current,
      qty,
      resulting,
      isNegative,
      isBelowMin,
      unit: selectedProduct.unit || 'und'
    };
  }, [selectedProduct, quantity, movementType]);

  const validate = () => {
    const newErrors = {};
    if (!productId) newErrors.productId = 'Seleccione un producto';
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      newErrors.quantity = 'Ingrese una cantidad válida mayor a 0';
    }
    if (!date) newErrors.date = 'Seleccione una fecha para el movimiento';

    if (movementType === 'EXIT' && stockCalculations && stockCalculations.resulting < 0) {
      newErrors.quantity = `Stock insuficiente. Disponible: ${stockCalculations.current} ${stockCalculations.unit}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      productId,
      type: movementType,
      quantity: Number(quantity),
      reason,
      notes,
      date,
      unit: selectedProduct?.unit || 'und',
      productName: selectedProduct?.name || 'Producto',
      category: selectedProduct?.category || 'Otros'
    });
  };

  const isEntry = movementType === 'ENTRY';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          {isEntry ? (
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-rose-400" />
          )}
          {isEntry ? 'Registrar Entrada de Alimentos' : 'Registrar Salida de Alimentos'}
        </span>
      }
      subtitle="Actualiza el inventario y audita el movimiento diario"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Selector de Tipo de Movimiento */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('ENTRY')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              isEntry
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            + ENTRADA
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('EXIT')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              !isEntry
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            - SALIDA
          </button>
        </div>

        {/* Selección de Producto */}
        <div>
          <Select
            label="Producto / Alimento *"
            name="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            options={products.map(p => ({
              value: p.id,
              label: `${p.name} (${p.category}) - Stock actual: ${formatNumber(p.currentStock)} ${p.unit}`
            }))}
            error={errors.productId}
          />
        </div>

        {/* Cantidad y Fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Cantidad (${selectedProduct?.unit || 'und'}) *`}
            name="quantity"
            type="number"
            step="any"
            min="0.001"
            placeholder="0.0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={errors.quantity}
            autoFocus
          />

          <Input
            label="Fecha del Movimiento *"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />
        </div>

        {/* Motivo del Movimiento */}
        <Select
          label="Motivo del Registro *"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={reasonsOptions}
        />

        {/* Vista previa en vivo del Stock */}
        {stockCalculations && (
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Stock actual:</span>
              <span className="font-semibold text-slate-200">
                {formatNumber(stockCalculations.current)} {stockCalculations.unit}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400 mt-1">
              <span>Operación:</span>
              <span className={`font-semibold ${isEntry ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isEntry ? '+' : '-'} {formatNumber(stockCalculations.qty)} {stockCalculations.unit}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80">
              <span className="font-bold text-slate-300">Nuevo Stock Resultante:</span>
              <span className={`font-extrabold text-sm ${
                stockCalculations.isNegative 
                  ? 'text-rose-400 animate-pulse' 
                  : stockCalculations.isBelowMin 
                  ? 'text-amber-400' 
                  : 'text-emerald-400'
              }`}>
                {formatNumber(stockCalculations.resulting)} {stockCalculations.unit}
              </span>
            </div>
            {stockCalculations.isBelowMin && !stockCalculations.isNegative && (
              <p className="mt-2 text-[11px] text-amber-400 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Atención: El nuevo stock quedará por debajo del mínimo configurado ({selectedProduct.minStock} {stockCalculations.unit}).
              </p>
            )}
          </div>
        )}

        {/* Notas / Observaciones */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Detalle / Proveedor / Lote (Opcional)
          </label>
          <textarea
            name="notes"
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="N° factura, lote, estado del empaque, responsable..."
            className="block w-full rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none text-sm p-3"
          />
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant={isEntry ? 'primary' : 'danger'} 
            loading={loading}
          >
            {isEntry ? 'Confirmar Entrada' : 'Confirmar Salida'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
