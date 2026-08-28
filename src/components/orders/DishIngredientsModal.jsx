import React from 'react';
import { 
  Utensils, 
  ChefHat, 
  Wine, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileText, 
  X 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const DishIngredientsModal = ({
  isOpen,
  onClose,
  dish,
  orderContext = null
}) => {
  if (!dish) return null;

  const isDrink = dish.destination === 'BAR' || dish.category === 'Bebidas' || dish.category === 'Cócteles de Altura';
  const ingredients = dish.recipe?.ingredients || dish.ingredients || [];
  const accompaniments = dish.recipe?.accompaniments || dish.accompaniments || [];
  const customizations = dish.customizations || {};
  const removedIngredients = customizations.removedIngredients || [];
  const allergens = dish.recipe?.allergens || dish.allergens || [];
  const instructions = dish.recipe?.instructions || dish.instructions || '';
  const specialNotes = dish.notes || '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ficha Técnica & Preparación - ${dish.name}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        
        {/* Cabecera del Plato con Estado en la Comanda */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-black text-white">{dish.name}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black border ${
                isDrink 
                  ? 'bg-purple-950 text-purple-300 border-purple-500/40' 
                  : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}>
                {isDrink ? '🍸 Bar & Barra' : '🍳 Cocina & Parrilla'}
              </span>
            </div>
            {orderContext && (
              <p className="text-xs text-slate-400 mt-1">
                Comanda de <strong className="text-slate-200">{orderContext.table || 'Mesa'}</strong> • Mesero: <strong className="text-slate-300">{orderContext.waiterName || 'Sala'}</strong>
              </p>
            )}
          </div>

          <span className="text-base font-black text-emerald-400 shrink-0">
            ${Number(dish.price || 0).toFixed(2)}
          </span>
        </div>

        {/* ALERTA DE NOTAS Y MODIFICACIONES SOLICITADAS POR EL CLIENTE */}
        {specialNotes && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 shadow-lg shadow-amber-950/40 space-y-1">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 animate-bounce shrink-0" />
              <span>Instrucciones Especiales del Cliente (Atención Cocina/Bar):</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-100 pl-6 leading-relaxed">
              "{specialNotes}"
            </p>
          </div>
        )}

        {/* ALERTA DE INGREDIENTES RETIRADOS (EXCLUIDOS) */}
        {removedIngredients.length > 0 && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 space-y-1">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-black uppercase tracking-wider">
              <X className="w-4 h-4 shrink-0" />
              <span>Ingredientes Retirados por Solicitud del Comensal:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-6 pt-1">
              {removedIngredients.map((ing, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-200 border border-rose-500/40 text-xs font-black line-through"
                >
                  NO INCLUIR: {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ALÉRGENOS */}
        {allergens.length > 0 && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Alérgenos declarados en receta: {allergens.join(', ')}</span>
          </div>
        )}

        {/* LISTA COMPLETA DE INGREDIENTES & GRAMAJES */}
        <div className="space-y-2">
          <h5 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-400" />
            Ingredientes y Gramajes Requeridos:
          </h5>

          {ingredients.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-950/50 rounded-xl">
              No hay ingredientes individuales registrados para este item.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ingredients.map((ing, idx) => {
                const isExcluded = removedIngredients.some(
                  name => name.toLowerCase() === (ing.productName || '').toLowerCase()
                );

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isExcluded
                        ? 'bg-rose-950/20 border-rose-500/30 opacity-40 line-through'
                        : 'bg-slate-950/80 border-slate-800/80'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-200">
                      {isExcluded ? `✕ ${ing.productName}` : ing.productName}
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-400">
                      {ing.grams ? `${ing.grams}g` : '1 porción'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* GUARNICIONES / ACOMPAÑAMIENTOS */}
        {accompaniments.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <h5 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Guarniciones & Acompañamientos Incluidos:
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {accompaniments.map((acc, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 text-xs font-medium"
                >
                  ✓ {acc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* INSTRUCCIONES DE PREPARACIÓN / EMPLATADO */}
        {instructions && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <h5 className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              Instrucciones de Cocina / Barra:
            </h5>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800 leading-relaxed whitespace-pre-line">
              {instructions}
            </p>
          </div>
        )}

        {/* Botón de Cierre */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cerrar Consulta
          </Button>
        </div>

      </div>
    </Modal>
  );
};
