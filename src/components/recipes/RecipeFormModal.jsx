import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChefHat, 
  Wine, 
  DollarSign, 
  Sparkles, 
  AlertTriangle, 
  Utensils 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MENU_CATEGORIES } from '../../data/zenitRecipes';

const ALLERGEN_OPTIONS = [
  'Mariscos / Pescados',
  'Lácteos / Lactosa',
  'Gluten / Trigo',
  'Huevos',
  'Frutos Secos / Maní',
  'Soja',
  'Sulfitos'
];

export const RecipeFormModal = ({
  isOpen,
  onClose,
  recipe = null,
  products = [],
  onSave,
  loading = false
}) => {
  const isEditing = Boolean(recipe);

  const [formData, setFormData] = useState({
    name: '',
    category: MENU_CATEGORIES[0],
    destination: 'KITCHEN',
    persons: 1,
    price: 0,
    description: '',
    ingredients: [{ productName: '', grams: 100, allowedSubstitutions: [] }],
    accompaniments: ['Papa salteada', 'Ensalada fresca'],
    allergens: [],
    instructions: ''
  });

  const [newAccompaniment, setNewAccompaniment] = useState('');

  useEffect(() => {
    if (recipe) {
      setFormData({
        id: recipe.id,
        name: recipe.name || '',
        category: recipe.category || MENU_CATEGORIES[0],
        destination: recipe.destination || 'KITCHEN',
        persons: Number(recipe.persons || 1),
        price: Number(recipe.price || 0),
        description: recipe.description || '',
        ingredients: recipe.ingredients?.length > 0 
          ? recipe.ingredients.map(i => ({ productName: i.productName || '', grams: Number(i.grams || 0), allowedSubstitutions: i.allowedSubstitutions || [] }))
          : [{ productName: '', grams: 100, allowedSubstitutions: [] }],
        accompaniments: recipe.accompaniments || [],
        allergens: recipe.allergens || [],
        instructions: recipe.instructions || ''
      });
    } else {
      setFormData({
        name: '',
        category: MENU_CATEGORIES[0],
        destination: 'KITCHEN',
        persons: 1,
        price: 0,
        description: '',
        ingredients: [{ productName: '', grams: 100, allowedSubstitutions: [] }],
        accompaniments: ['Papa salteada', 'Ensalada'],
        allergens: [],
        instructions: ''
      });
    }
  }, [recipe, isOpen]);

  // Manejo dinámico de ingredientes
  const handleAddIngredientRow = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { productName: '', grams: 100, allowedSubstitutions: [] }]
    }));
  };

  const handleRemoveIngredientRow = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== index)
    }));
  };

  const handleUpdateIngredient = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.ingredients];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ingredients: updated };
    });
  };

  // Manejo de guarniciones
  const handleAddAccompaniment = () => {
    if (newAccompaniment.trim()) {
      setFormData(prev => ({
        ...prev,
        accompaniments: [...prev.accompaniments, newAccompaniment.trim()]
      }));
      setNewAccompaniment('');
    }
  };

  const handleRemoveAccompaniment = (index) => {
    setFormData(prev => ({
      ...prev,
      accompaniments: prev.accompaniments.filter((_, idx) => idx !== index)
    }));
  };

  // Manejo de alérgenos
  const handleToggleAllergen = (allergen) => {
    setFormData(prev => {
      const exists = prev.allergens.includes(allergen);
      return {
        ...prev,
        allergens: exists ? prev.allergens.filter(a => a !== allergen) : [...prev.allergens, allergen]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      price: Number(formData.price),
      persons: Number(formData.persons),
      ingredients: formData.ingredients.filter(i => i.productName?.trim())
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Ficha Técnica - ${recipe?.name}` : '+ Crear Nueva Receta / Ficha Técnica'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        
        {/* Nombre y Categoría */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Nombre del Plato / Cóctel: *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Picada Estrella Fugaz, Mojito..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Categoría del Menú:
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const cat = e.target.value;
                const isBar = cat === 'Bebidas' || cat === 'Cócteles de Altura' || cat === 'Cócteles';
                setFormData({ 
                  ...formData, 
                  category: cat,
                  destination: isBar ? 'BAR' : 'KITCHEN'
                });
              }}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
            >
              {MENU_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Estación, Personas y Precio */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Estación KDS:
            </label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="KITCHEN">🍳 Cocina & Parrilla</option>
              <option value="BAR">🍸 Bar & Barra</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Porción / PAX:
            </label>
            <input
              type="number"
              min="1"
              value={formData.persons}
              onChange={(e) => setFormData({ ...formData, persons: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">
              Precio Venta ($ USD):
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-black focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-300">
            Descripción en Carta:
          </label>
          <input
            type="text"
            placeholder="Breve descripción para meseros y comensales..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* INGREDIENTES Y GRAMAJES (DEDUCCIÓN DE INVENTARIO) */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-200 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              Ingredientes Requeridos & Gramajes:
            </label>
            <button
              type="button"
              onClick={handleAddIngredientRow}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              + Agregar Ingrediente
            </button>
          </div>

          <div className="space-y-2">
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                {/* Nombre de Insumo o selector de catálogo */}
                <input
                  type="text"
                  placeholder="Nombre de insumo (ej: Res, Aguacate, Ron)..."
                  value={ing.productName}
                  onChange={(e) => handleUpdateIngredient(idx, 'productName', e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                {/* Gramaje */}
                <div className="flex items-center gap-1 w-28">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    placeholder="Gramos"
                    value={ing.grams}
                    onChange={(e) => handleUpdateIngredient(idx, 'grams', e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-center focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-slate-400">g</span>
                </div>

                {/* Eliminar fila */}
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredientRow(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* GUARNICIONES / ACOMPAÑAMIENTOS */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-black uppercase text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Guarniciones & Salsas Incluidas:
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nueva guarnición (ej: Arepas, Maduro frito, Chimichurri)..."
              value={newAccompaniment}
              onChange={(e) => setNewAccompaniment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAccompaniment();
                }
              }}
              className="flex-1 text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleAddAccompaniment}
              className="text-xs"
            >
              + Agregar
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.accompaniments.map((acc, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5"
              >
                <span>{acc}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAccompaniment(idx)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ALÉRGENOS */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-black uppercase text-slate-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Alérgenos a Advertir:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALLERGEN_OPTIONS.map((alg, idx) => {
              const isSelected = formData.allergens.includes(alg);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleAllergen(alg)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {alg}
                </button>
              );
            })}
          </div>
        </div>

        {/* INSTRUCCIONES DE PREPARACIÓN */}
        <div className="space-y-1 pt-2 border-t border-slate-800">
          <label className="text-xs font-black uppercase text-slate-200 flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            Instrucciones de Preparación & Emplatado (Para Cocina / Barra):
          </label>
          <textarea
            rows="3"
            placeholder="Paso a paso de cocción, emplatado, copas, decoración..."
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className="w-full text-xs p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
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
            className="bg-emerald-600 hover:bg-emerald-500 font-black text-xs"
          >
            {isEditing ? 'Guardar Cambios de Receta' : 'Crear Receta en el Sistema'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
