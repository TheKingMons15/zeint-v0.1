import React, { useState, useEffect } from 'react';
import { 
  Wine, 
  Plus, 
  X, 
  Check, 
  DollarSign, 
  Package, 
  Layers, 
  Tag, 
  Calendar, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getTodayDateString } from '../../utils/formatters';

const BAR_CATEGORIES = [
  'Licores & Destilados',
  'Vinos & Cervezas',
  'Jarabes & Mixers',
  'Frutas & Cítricos Bar',
  'Cristalería & Accesorios',
  'Insumos Bar & Coctelería'
];

const BAR_UNITS = [
  { value: 'botella', label: 'Botella(s)' },
  { value: 'litro', label: 'Litro(s) (L)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'oz', label: 'Onzas (oz)' },
  { value: 'u', label: 'Unidad(es) / Pack' },
  { value: 'kg', label: 'Kilogramos (kg)' }
];

export const BarProductModal = ({
  isOpen,
  onClose,
  product = null,
  onSave,
  loading = false
}) => {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    category: BAR_CATEGORIES[0],
    brand: '',
    presentation: '750ml',
    currentStock: 10,
    unit: 'botella',
    minStock: 2,
    cost: 0,
    entryDate: getTodayDateString(),
    location: 'Bar',
    notes: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || BAR_CATEGORIES[0],
        brand: product.brand || '',
        presentation: product.presentation || '750ml',
        currentStock: Number(product.currentStock ?? 10),
        unit: product.unit || 'botella',
        minStock: Number(product.minStock ?? 2),
        cost: Number(product.cost ?? 0),
        entryDate: product.entryDate || getTodayDateString(),
        location: 'Bar',
        notes: product.notes || ''
      });
    } else {
      setFormData({
        name: '',
        category: BAR_CATEGORIES[0],
        brand: '',
        presentation: '750ml',
        currentStock: 10,
        unit: 'botella',
        minStock: 2,
        cost: 0,
        entryDate: getTodayDateString(),
        location: 'Bar',
        notes: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      id: product?.id,
      currentStock: Number(formData.currentStock),
      minStock: Number(formData.minStock),
      cost: Number(formData.cost)
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Producto de Bar - ${product?.name}` : '+ Registrar Nueva Botella / Insumo de Bar'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nombre y Marca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Nombre de la Botella / Insumo: *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Ron Zénit Añejo, Gin Tanqueray..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Marca / Proveedor:
            </label>
            <input
              type="text"
              placeholder="Ej: Bacardi, Absolut, Monin..."
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Categoría y Presentación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Categoría de Barra:
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 font-bold"
            >
              {BAR_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Presentación / Tamaño:
            </label>
            <input
              type="text"
              placeholder="Ej: 750ml, 1 Litro, Pack 6..."
              value={formData.presentation}
              onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Stock Actual, Unidad y Stock Mínimo */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Cantidad Disponible:
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-black focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Unidad de Medida:
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 font-bold"
            >
              {BAR_UNITS.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Stock Mínimo (Alerta):
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-black focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Costo y Fecha de Ingreso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Costo Unitario ($ USD):
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Fecha de Ingreso:
            </label>
            <input
              type="date"
              value={formData.entryDate}
              onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Observaciones */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-300">
            Observaciones / Ubicación en Barra:
          </label>
          <input
            type="text"
            placeholder="Ej: Estante superior barra principal, mantener refrigerado..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            loading={loading}
            icon={Check}
            className="bg-purple-600 hover:bg-purple-500 text-white font-black"
          >
            {isEditing ? 'Guardar Cambios' : 'Registrar en Inventario de Bar'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
