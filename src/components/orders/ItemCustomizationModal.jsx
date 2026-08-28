import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  X, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Flame, 
  Wine, 
  Utensils, 
  Plus, 
  Minus, 
  RotateCcw 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

// Chips rápidos organizados por categoría
const QUICK_CHIPS = {
  DONENESS: [
    '🥩 Término Medio',
    '🥩 Tres Cuartos (3/4)',
    '🥩 Bien Cocido',
    '🥩 Término Azul / Sellado'
  ],
  REMOVALS: [
    '🚫 Sin cebolla',
    '🚫 Sin tomate',
    '🚫 Sin picante / ají',
    '🚫 Sin mayonesa',
    '🚫 Sin sal añadida',
    '🚫 Sin ajo'
  ],
  SUBSTITUTIONS: [
    '🔄 Cambio papas por ensalada Waldorf',
    '🔄 Cambio papas por maduro frito',
    '🔄 Cambio ensalada por papas a la francesa',
    '🔄 Cambio arroz por arepas'
  ],
  ADDITIONS: [
    '➕ Extra chimichurri artesanal',
    '➕ Extra salsa de ajo',
    '➕ Extra queso fundido',
    '➕ Extra porción de maduro'
  ],
  DRINKS: [
    '🧊 Sin hielo',
    '🧊 Poco hielo',
    '🍯 Poco dulce / Sin azúcar',
    '❄️ Servir extra frío',
    '🧂 Escarchado con sal marina'
  ],
  ALLERGIES: [
    '⚠️ ALERGIA: Mariscos / Camarón',
    '⚠️ ALERGIA: Lactosa / Lácteos',
    '⚠️ ALERGIA: Gluten / Harinas',
    '⚠️ ALERGIA: Frutos secos / Maní'
  ]
};

export const ItemCustomizationModal = ({
  isOpen,
  onClose,
  item,
  onSave
}) => {
  const [notes, setNotes] = useState('');
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [substitutions, setSubstitutions] = useState([]);
  const [additions, setAdditions] = useState([]);
  const [allergens, setAllergens] = useState([]);

  useEffect(() => {
    if (item) {
      setNotes(item.notes || '');
      setRemovedIngredients(item.customizations?.removedIngredients || []);
      setSubstitutions(item.customizations?.substitutions || []);
      setAdditions(item.customizations?.additions || []);
      setAllergens(item.customizations?.allergens || []);
    }
  }, [item, isOpen]);

  if (!item) return null;

  const isDrink = item.destination === 'BAR' || item.category === 'Bebidas' || item.category === 'Cócteles de Altura';
  const standardIngredients = item.recipe?.ingredients || item.ingredients || [];

  // Toggle de chip rápido
  const handleToggleChip = (chipText) => {
    if (notes.includes(chipText)) {
      setNotes(prev => prev.replace(chipText, '').replace(/,\s*,/g, ',').trim().replace(/^,\s*|,\s*$/g, ''));
    } else {
      setNotes(prev => prev ? `${prev}, ${chipText}` : chipText);
    }
  };

  // Toggle de ingrediente estándar (marcar como retirado)
  const handleToggleStandardIngredient = (ingredientName) => {
    setRemovedIngredients(prev => {
      const exists = prev.some(name => name.toLowerCase() === ingredientName.toLowerCase());
      if (exists) {
        return prev.filter(name => name.toLowerCase() !== ingredientName.toLowerCase());
      } else {
        return [...prev, ingredientName];
      }
    });
  };

  const handleSave = () => {
    // Generar resumen consolidado de notas
    const parts = [];
    if (removedIngredients.length > 0) {
      parts.push(`SIN: ${removedIngredients.join(', ')}`);
    }
    if (notes.trim()) {
      parts.push(notes.trim());
    }

    const consolidatedNotes = parts.join(' | ');

    onSave({
      notes: consolidatedNotes,
      customizations: {
        removedIngredients,
        substitutions,
        additions,
        allergens,
        isCustomized: removedIngredients.length > 0 || notes.trim().length > 0
      }
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Notas & Modificaciones - ${item.name}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        
        {/* Cabecera del Plato */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">{item.name}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${
                isDrink ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {isDrink ? '🍸 Destino: Bar' : '🍳 Destino: Cocina'}
              </span>
            </div>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              ${Number(item.price || 0).toFixed(2)} c/u
            </p>
          </div>
        </div>

        {/* 1. Ingredientes de la Receta (Tocar para retirar) */}
        {standardIngredients.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              Ingredientes incluidos (Toca para retirar):
            </label>
            <div className="flex flex-wrap gap-2">
              {standardIngredients.map((ing, idx) => {
                const isRemoved = removedIngredients.some(name => name.toLowerCase() === ing.productName.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleStandardIngredient(ing.productName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isRemoved
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 line-through'
                        : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span>{isRemoved ? '✕ Sin' : '✓ Con'} {ing.productName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Chips Rápidos de Términos, Modificaciones y Alergias */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Opciones Rápidas de Sala:
          </label>

          {/* Si es comida: Términos de carne */}
          {!isDrink && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400">Término de Carnes:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CHIPS.DONENESS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleChip(chip)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      notes.includes(chip)
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Si es bebida: Opciones de bar */}
          {isDrink && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-purple-400">Preferencias de Bar:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CHIPS.DRINKS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleChip(chip)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      notes.includes(chip)
                        ? 'bg-purple-500 text-white font-black shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cambios de Guarnición & Salsas */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-sky-400">Cambios de Guarnición & Salsas:</span>
            <div className="flex flex-wrap gap-1.5">
              {[...QUICK_CHIPS.SUBSTITUTIONS, ...QUICK_CHIPS.ADDITIONS].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleChip(chip)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    notes.includes(chip)
                      ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Alertas de Alergias */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-rose-400">Advertencias de Alergias:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CHIPS.ALLERGIES.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleChip(chip)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                    notes.includes(chip)
                      ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300'
                      : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-500/30'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Campo de Texto Libre para Instrucción Especial */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase text-slate-300 flex items-center justify-between">
            <span>Instrucción Personalizada del Cliente:</span>
            {notes && (
              <button
                type="button"
                onClick={() => setNotes('')}
                className="text-[11px] text-slate-400 hover:text-rose-400 underline"
              >
                Limpiar notas
              </button>
            )}
          </label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escribe cualquier detalle específico del cliente (ej: muy dorado, cortar en trozos para niño, salsa aparte)..."
            className="w-full text-xs p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} icon={Check}>
            Guardar Modificación
          </Button>
        </div>

      </div>
    </Modal>
  );
};
