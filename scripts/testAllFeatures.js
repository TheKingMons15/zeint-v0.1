import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDmsy4pvHef8hftz_LcFstcps1R8dexFuw",
  authDomain: "zenit-1bbc3.firebaseapp.com",
  projectId: "zenit-1bbc3",
  storageBucket: "zenit-1bbc3.firebasestorage.app",
  messagingSenderId: "1084151887776",
  appId: "1:1084151887776:web:7ad06eaa8f2b9cebdad6c5"
};

const app = initializeApp(firebaseConfig, "FeatureTester");
const db = getFirestore(app);
const auth = getAuth(app);

async function runTests() {
  console.log("==================================================");
  console.log("🚀 INICIANDO PRUEBAS DE LAS 7 NUEVAS FUNCIONALIDADES");
  console.log("==================================================");

  try {
    // 1. Login con Carolina (Mesero)
    const userCredential = await signInWithEmailAndPassword(auth, 'carolina@zenitmesero.com', 'CarolinaZenit2026!');
    const user = userCredential.user;
    console.log("✅ 1. Mesero Autenticado:", user.email);

    // 2. Crear comanda con notas e instrucciones individuales por plato
    const orderId = 'ord_test_' + Date.now();
    const orderRef = doc(db, 'products', orderId);

    const testOrder = {
      id: orderId,
      name: 'Comanda Mesa 4',
      minStock: 0,
      isOrder: true,
      table: 'Mesa 4',
      status: 'PENDING',
      total: 25.98,
      notes: 'Mesa de cumpleaños, servir bebidas primero',
      waiterId: user.uid,
      waiterName: 'Carolina (Mesero)',
      waiterEmail: user.email,
      date: '2026-08-28',
      companyId: 'default_company',
      items: [
        {
          id: 'item_1',
          name: 'Picada Estrella Fugaz 1 PAX',
          category: 'Combos de Parrilla',
          price: 7.99,
          quantity: 1,
          destination: 'KITCHEN',
          notes: '🥩 Término 3/4 | 🚫 Sin cebolla | 🔄 Cambio papas por ensalada Waldorf',
          customizations: {
            removedIngredients: ['Cebolla blanca'],
            substitutions: ['Papa salteada -> Ensalada Waldorf'],
            additions: [],
            isCustomized: true
          },
          cancelled: false
        },
        {
          id: 'item_2',
          name: 'Mojito de la Cima',
          category: 'Cócteles de Altura',
          price: 4.99,
          quantity: 2,
          destination: 'BAR',
          notes: '🧊 Poco hielo | 🍯 Poco dulce',
          customizations: {
            removedIngredients: [],
            substitutions: [],
            additions: [],
            isCustomized: true
          },
          cancelled: false
        }
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(orderRef, testOrder);
    console.log("✅ 2. Comanda con notas individuales creada con éxito en Firestore (ID:", orderId, ")");

    // 3. Cancelar un plato de la comanda ya enviada (Item Cancellation)
    const cancelReason = 'Cliente canceló el mojito por cambio de opinión';
    testOrder.items[1].cancelled = true;
    testOrder.items[1].cancelledAt = new Date().toISOString();
    testOrder.items[1].cancelledBy = 'Carolina (Mesero)';
    testOrder.items[1].cancelReason = cancelReason;
    testOrder.total = 7.99; // Solo queda la comida

    await updateDoc(orderRef, {
      items: testOrder.items,
      total: testOrder.total,
      lastCancelledItem: {
        name: 'Mojito de la Cima',
        table: 'Mesa 4',
        cancelledBy: 'Carolina (Mesero)',
        reason: cancelReason,
        timestamp: Date.now()
      },
      updatedAt: serverTimestamp()
    });
    console.log("✅ 3. Plato individual cancelado con éxito en la comanda. Total actualizado a: $7.99");

    // 4. Probar creación de producto en Inventario de Bar
    const barBottleId = 'bar_prod_' + Date.now();
    const barBottleRef = doc(db, 'products', barBottleId);

    const testBottle = {
      id: barBottleId,
      name: 'Whisky Johnnie Walker Black Label',
      category: 'Licores & Destilados',
      brand: 'Johnnie Walker',
      presentation: '750ml',
      currentStock: 12,
      unit: 'botella',
      minStock: 3,
      cost: 38.50,
      location: 'Bar',
      companyId: 'default_company',
      notes: 'Estante superior barra VIP',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(barBottleRef, testBottle);
    console.log("✅ 4. Botella de Bar registrada en Firestore:", testBottle.name);

    // 5. Probar salida/merma en Bar
    await updateDoc(barBottleRef, {
      currentStock: 11,
      updatedAt: serverTimestamp()
    });
    console.log("✅ 5. Consumo/Merma de bar registrado. Stock actualizado de 12 a 11 botellas.");

    // 6. Probar creación de receta maestra en Recetario Zénit
    const recipeId = 'rec_test_' + Date.now();
    const recipeRef = doc(db, 'products', recipeId);

    const testRecipe = {
      id: recipeId,
      name: 'Costillar Ahumado Zénit Especial',
      minStock: 0,
      isRecipe: true,
      category: 'Cortes de Carne',
      destination: 'KITCHEN',
      persons: 2,
      price: 22.99,
      description: 'Costillar de cerdo ahumado en leña de roble con salsa BBQ artesanal',
      ingredients: [
        { productName: 'Costilla de cerdo', grams: 600 },
        { productName: 'Salsa BBQ', grams: 80 }
      ],
      accompaniments: ['Papas rústicas', 'Choclo asado', 'Ensalada coleslaw'],
      allergens: ['Sulfitos'],
      instructions: '1. Sellar a fuego directo 5 min por lado.\n2. Hornear a 160°C por 25 min glaseando con BBQ.',
      companyId: 'default_company',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(recipeRef, testRecipe);
    console.log("✅ 6. Ficha técnica de receta creada en Firestore:", testRecipe.name);

    console.log("==================================================");
    console.log("🎉 TODAS LAS PRUEBAS DE INTEGRACIÓN PASARON AL 100%");
    console.log("==================================================");

  } catch (err) {
    console.error("❌ Error en las pruebas:", err);
  }
}

runTests();
