// =========================================================================
// SERVICIO DE GESTIÓN DE RECETAS E INGREDIENTES (ZÉNIT RECETARIO MAESTRO)
// Permite a Administradores y Supervisores crear, editar y versionar fichas técnicas
// =========================================================================

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isDemoMode, DEFAULT_COMPANY_ID } from '../firebase/config';
import { ZENIT_RECIPES, MENU_CATEGORIES } from '../data/zenitRecipes';
import { auditService } from './auditService';

const DEMO_RECIPES_KEY = 'zenit_demo_master_recipes';

export const recipeService = {
  // Suscripción en tiempo real a las recetas maestras
  subscribeRecipes(companyId = DEFAULT_COMPANY_ID, callback) {
    if (isDemoMode) {
      let stored = localStorage.getItem(DEMO_RECIPES_KEY);
      if (!stored) {
        localStorage.setItem(DEMO_RECIPES_KEY, JSON.stringify(ZENIT_RECIPES));
        stored = JSON.stringify(ZENIT_RECIPES);
      }
      callback(JSON.parse(stored));

      const handleStorage = () => {
        const data = JSON.parse(localStorage.getItem(DEMO_RECIPES_KEY) || JSON.stringify(ZENIT_RECIPES));
        callback(data);
      };
      window.addEventListener('zenit_recipes_updated', handleStorage);
      return () => window.removeEventListener('zenit_recipes_updated', handleStorage);
    }

    try {
      const q = query(
        collection(db, 'products'),
        where('isRecipe', '==', true)
      );

      return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          // Si no hay recetas personalizadas en Firestore aún, entregamos el recetario oficial inicial
          callback(ZENIT_RECIPES);
          return;
        }

        const customRecipes = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        // Combinar recetas iniciales con las actualizadas de Firestore
        const mergedMap = new Map();
        ZENIT_RECIPES.forEach(r => mergedMap.set(r.id, r));
        customRecipes.forEach(r => mergedMap.set(r.id, r));

        const allRecipes = Array.from(mergedMap.values());
        allRecipes.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        callback(allRecipes);
      }, (error) => {
        console.error("Error subscribing to recipes:", error);
        callback(ZENIT_RECIPES);
      });
    } catch (e) {
      console.error("Exception in recipeService.subscribeRecipes:", e);
      callback(ZENIT_RECIPES);
      return () => {};
    }
  },

  // Guardar o actualizar una receta
  async saveRecipe(recipeData, user) {
    const rawName = (recipeData.name || '').trim();
    if (!rawName) throw new Error("El nombre de la receta es obligatorio");

    const recipeId = recipeData.id || 'rec_' + rawName.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const formattedRecipe = {
      id: recipeId,
      name: rawName,
      minStock: 0,
      isRecipe: true,
      category: recipeData.category || MENU_CATEGORIES[0],
      destination: recipeData.destination || (recipeData.category === 'Bebidas' || recipeData.category === 'Cócteles de Altura' ? 'BAR' : 'KITCHEN'),
      persons: Number(recipeData.persons || 1),
      price: Number(recipeData.price || 0),
      description: recipeData.description || '',
      image: recipeData.image || '',
      ingredients: (recipeData.ingredients || []).map(ing => ({
        productName: ing.productName || '',
        grams: Number(ing.grams || 0),
        allowedSubstitutions: ing.allowedSubstitutions || []
      })),
      accompaniments: recipeData.accompaniments || [],
      allergens: recipeData.allergens || [],
      instructions: recipeData.instructions || '',
      updatedAt: isDemoMode ? new Date().toISOString() : serverTimestamp(),
      lastModifiedBy: user?.displayName || 'Administrador'
    };

    if (isDemoMode) {
      let stored = JSON.parse(localStorage.getItem(DEMO_RECIPES_KEY) || JSON.stringify(ZENIT_RECIPES));
      const idx = stored.findIndex(r => r.id === recipeId);
      if (idx !== -1) {
        stored[idx] = formattedRecipe;
      } else {
        stored.unshift(formattedRecipe);
      }
      localStorage.setItem(DEMO_RECIPES_KEY, JSON.stringify(stored));
      window.dispatchEvent(new Event('zenit_recipes_updated'));

      try {
        await auditService.logAction(user, 'SAVE_RECIPE', {
          recipeName: rawName,
          category: formattedRecipe.category,
          price: formattedRecipe.price
        });
      } catch (e) {}

      return formattedRecipe;
    }

    const docRef = doc(db, 'products', recipeId);
    await setDoc(docRef, formattedRecipe, { merge: true });

    try {
      await auditService.logAction(user, 'SAVE_RECIPE', {
        recipeName: rawName,
        category: formattedRecipe.category,
        price: formattedRecipe.price,
        message: `Ficha técnica de "${rawName}" guardada exitosamente.`
      });
    } catch (e) {
      console.warn("Audit error:", e);
    }

    return formattedRecipe;
  },

  // Eliminar receta
  async deleteRecipe(recipeId, user) {
    if (isDemoMode) {
      let stored = JSON.parse(localStorage.getItem(DEMO_RECIPES_KEY) || JSON.stringify(ZENIT_RECIPES));
      stored = stored.filter(r => r.id !== recipeId);
      localStorage.setItem(DEMO_RECIPES_KEY, JSON.stringify(stored));
      window.dispatchEvent(new Event('zenit_recipes_updated'));
      return;
    }

    const docRef = doc(db, 'products', recipeId);
    await deleteDoc(docRef);

    try {
      await auditService.logAction(user, 'DELETE_RECIPE', {
        recipeId,
        message: `Receta eliminada del sistema`
      });
    } catch (e) {}
  }
};
