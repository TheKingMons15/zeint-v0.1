import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  X, 
  ChefHat, 
  Wine, 
  Sparkles, 
  AlertTriangle, 
  Utensils, 
  Edit2, 
  Trash2, 
  Eye, 
  DollarSign, 
  Users 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { MENU_CATEGORIES } from '../data/zenitRecipes';
import { recipeService } from '../services/recipeService';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { RecipeFormModal } from '../components/recipes/RecipeFormModal';
import { DishIngredientsModal } from '../components/orders/DishIngredientsModal';

export const RecipesPage = () => {
  const { user } = useAuth();
  const { products } = useInventory();
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState('ALL'); // 'ALL' | 'KITCHEN' | 'BAR'
  const [search, setSearch] = useState('');
  
  // Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [inspectingRecipe, setInspectingRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const companyId = user?.companyId || 'default_company';
  const role = (user?.role || '').toUpperCase();
  const canEdit = role === 'SUPERADMIN' || role === 'ADMIN' || role === 'SUPERVISOR';

  useEffect(() => {
    const unsub = recipeService.subscribeRecipes(companyId, (liveRecipes) => {
      setRecipes(liveRecipes);
    });
    return () => unsub();
  }, [companyId]);

  // Filtrado de recetas
  const filteredRecipes = useMemo(() => {
    return recipes.filter(rec => {
      if (selectedStation === 'KITCHEN' && rec.destination !== 'KITCHEN') return false;
      if (selectedStation === 'BAR' && rec.destination !== 'BAR') return false;
      if (selectedCategory !== 'ALL' && rec.category !== selectedCategory) return false;

      const q = search.toLowerCase().trim();
      if (!q) return true;

      return (
        rec.name?.toLowerCase().includes(q) ||
        rec.description?.toLowerCase().includes(q) ||
        rec.ingredients?.some(i => i.productName?.toLowerCase().includes(q))
      );
    });
  }, [recipes, selectedStation, selectedCategory, search]);

  // Guardar receta
  const handleSaveRecipe = async (recipeData) => {
    setLoading(true);
    try {
      await recipeService.saveRecipe(recipeData, user);
      showToast(`Ficha técnica de "${recipeData.name}" guardada exitosamente.`, 'success');
      setIsFormModalOpen(false);
      setEditingRecipe(null);
    } catch (err) {
      showToast(err.message || 'Error al guardar receta', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar receta
  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return;
    setLoading(true);
    try {
      await recipeService.deleteRecipe(recipeToDelete.id, user);
      showToast(`Receta "${recipeToDelete.name}" eliminada del sistema.`, 'info');
      setRecipeToDelete(null);
    } catch (err) {
      showToast(err.message || 'Error al eliminar receta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-20">
      
      {/* Header del Recetario */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 shadow-lg">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Recetario Maestro & Fichas Técnicas
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                Zénit Oficial
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control de gramajes, ingredientes de descuento de inventario, guarniciones y alérgenos
            </p>
          </div>
        </div>

        {/* Botón de Nueva Receta (Solo Administradores) */}
        {canEdit && (
          <Button
            variant="primary"
            onClick={() => {
              setEditingRecipe(null);
              setIsFormModalOpen(true);
            }}
            icon={Plus}
            className="bg-emerald-600 hover:bg-emerald-500 text-xs font-black shadow-lg shadow-emerald-950/60"
          >
            + Nueva Ficha Técnica / Receta
          </Button>
        )}
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar receta por nombre, insumo requerido (ej: Res, Pollo, Ron)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          {/* Filtro de Estación */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">Estación:</span>
            <button
              onClick={() => setSelectedStation('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedStation === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todo ({recipes.length})
            </button>
            <button
              onClick={() => setSelectedStation('KITCHEN')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedStation === 'KITCHEN' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              🍳 Cocina
            </button>
            <button
              onClick={() => setSelectedStation('BAR')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedStation === 'BAR' ? 'bg-purple-500 text-white font-black' : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              🍸 Bar
            </button>
          </div>

          {/* Carrusel de Categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                selectedCategory === 'ALL' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Todas
            </button>
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Fichas Técnicas */}
      {filteredRecipes.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="font-bold text-slate-300">No se encontraron recetas con el filtro seleccionado</p>
          <p className="text-[11px] text-slate-500">Prueba ajustando el término de búsqueda o seleccionando otra categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map(recipe => {
            const isBar = recipe.destination === 'BAR';

            return (
              <div
                key={recipe.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between gap-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="space-y-3">
                  
                  {/* Cabecera: Categoría, Estación y Precio */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-950 text-emerald-400 rounded-lg border border-slate-800">
                          {recipe.category}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border ${
                          isBar ? 'bg-purple-950 text-purple-300 border-purple-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
                        }`}>
                          {isBar ? '🍸 Bar' : '🍳 Cocina'}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white mt-1.5 leading-snug">
                        {recipe.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-400 block font-mono">
                        ${Number(recipe.price || 0).toFixed(2)}
                      </span>
                      {recipe.persons > 1 && (
                        <span className="text-[10px] text-slate-400 block font-bold">
                          {recipe.persons} PAX
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  {recipe.description && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  {/* Resumen de Insumos & Gramajes */}
                  <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Ingredientes ({recipe.ingredients?.length || 0}):
                    </span>
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {recipe.ingredients?.map((ing, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 truncate mr-2">• {ing.productName}</span>
                          <span className="font-mono font-bold text-emerald-400 shrink-0">{ing.grams}g</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guarniciones */}
                  {recipe.accompaniments?.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {recipe.accompaniments.map((acc, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                          ✓ {acc}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setInspectingRecipe(recipe)}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver Ficha Completa</span>
                  </button>

                  {canEdit && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingRecipe(recipe);
                          setIsFormModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                        title="Editar Receta"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setRecipeToDelete(recipe)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Eliminar Receta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Crear / Editar Receta */}
      {isFormModalOpen && (
        <RecipeFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingRecipe(null);
          }}
          recipe={editingRecipe}
          products={products}
          onSave={handleSaveRecipe}
          loading={loading}
        />
      )}

      {/* Modal para Inspeccionar Ficha Técnica */}
      {inspectingRecipe && (
        <DishIngredientsModal
          isOpen={Boolean(inspectingRecipe)}
          onClose={() => setInspectingRecipe(null)}
          dish={inspectingRecipe}
        />
      )}

      {/* Modal para Confirmar Eliminación de Receta */}
      {recipeToDelete && (
        <Modal
          isOpen={Boolean(recipeToDelete)}
          onClose={() => setRecipeToDelete(null)}
          title="Eliminar Receta del Sistema"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              ¿Estás seguro de que deseas eliminar permanentemente la ficha técnica de <strong>{recipeToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setRecipeToDelete(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteRecipe} loading={loading} icon={Trash2}>
                Eliminar Permanentemente
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
