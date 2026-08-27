import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { FOOD_CATEGORIES, MEASUREMENT_UNITS } from '../../utils/constants';

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  defaultLocation = 'Cocina / Bodega Central'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: FOOD_CATEGORIES[0],
    unit: 'kg',
    initialStock: '',
    currentStock: '',
    minStock: '',
    location: defaultLocation,
    supplier: 'Proveedor Central Zénit',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || FOOD_CATEGORIES[0],
        unit: initialData.unit || 'kg',
        initialStock: initialData.initialStock ?? '',
        currentStock: initialData.currentStock ?? '',
        minStock: initialData.minStock ?? '',
        location: initialData.location || defaultLocation,
        supplier: initialData.supplier || 'Proveedor Central Zénit',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        category: FOOD_CATEGORIES[0],
        unit: 'kg',
        initialStock: '',
        currentStock: '',
        minStock: '',
        location: defaultLocation,
        supplier: 'Proveedor Central Zénit',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, defaultLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre del producto es obligatorio';
    if (!formData.category) newErrors.category = 'Seleccione una categoría';
    if (!formData.unit) newErrors.unit = 'Seleccione una unidad de medida';

    if (!initialData) {
      if (formData.initialStock === '' || isNaN(formData.initialStock) || Number(formData.initialStock) < 0) {
        newErrors.initialStock = 'Ingrese un stock inicial válido (>= 0)';
      }
    }

    if (formData.minStock === '' || isNaN(formData.minStock) || Number(formData.minStock) < 0) {
      newErrors.minStock = 'Ingrese un stock mínimo válido (>= 0)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      initialStock: Number(formData.initialStock || 0),
      currentStock: initialData ? Number(formData.currentStock || 0) : Number(formData.initialStock || 0),
      minStock: Number(formData.minStock || 0)
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Producto' : 'Registrar Nuevo Producto'}
      subtitle="Complete los detalles del alimento para el control de inventario"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nombre del Producto */}
        <Input
          label="Nombre del Alimento / Producto *"
          name="name"
          placeholder="Ej: Tomate Chonto, Queso Mozzarella..."
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoFocus
        />

        {/* Categoría y Unidad de Medida */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Categoría *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={FOOD_CATEGORIES}
            error={errors.category}
          />

          <Select
            label="Unidad de Medida *"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            options={MEASUREMENT_UNITS}
            error={errors.unit}
          />
        </div>

        {/* Stock Inicial y Stock Mínimo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!initialData ? (
            <Input
              label="Stock Inicial *"
              name="initialStock"
              type="number"
              step="any"
              min="0"
              placeholder="0.0"
              value={formData.initialStock}
              onChange={handleChange}
              error={errors.initialStock}
              helperText="Cantidad con la que inicia el producto"
            />
          ) : (
            <Input
              label="Stock Actual *"
              name="currentStock"
              type="number"
              step="any"
              min="0"
              placeholder="0.0"
              value={formData.currentStock}
              onChange={handleChange}
              error={errors.currentStock}
              helperText="Modificar solo si es un ajuste directo"
            />
          )}

          <Input
            label="Stock Mínimo (Alerta) *"
            name="minStock"
            type="number"
            step="any"
            min="0"
            placeholder="0.0"
            value={formData.minStock}
            onChange={handleChange}
            error={errors.minStock}
            helperText="Genera aviso cuando el stock sea menor"
          />
        </div>

        {/* Ubicación y Proveedor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ubicación / Área"
            name="location"
            placeholder="Ej: Cocina, Bar, Bodega..."
            value={formData.location}
            onChange={handleChange}
          />

          <Input
            label="Proveedor Habitual"
            name="supplier"
            placeholder="Ej: Proveedor Central Zénit..."
            value={formData.supplier}
            onChange={handleChange}
          />
        </div>

        {/* Notas / Observaciones */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Notas u Observaciones (Opcional)
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Marca, especificaciones de frío, proveedor habitual..."
            className="block w-full rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none text-sm p-3"
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
