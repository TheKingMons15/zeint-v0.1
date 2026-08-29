import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';

function loadEnv() {
  const envConfig = {};
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        envConfig[match[1]] = val;
      }
    });
  }
  return envConfig;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDmsy4pvHef8hftz_LcFstcps1R8dexFuw",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "zenit-1bbc3.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "zenit-1bbc3",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "zenit-1bbc3.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1084151887776",
  appId: env.VITE_FIREBASE_APP_ID || "1:1084151887776:web:7ad06eaa8f2b9cebdad6c5"
};

const BEERS_DATA = [
  {
    id: 'prod_white_ipa_500',
    name: 'WHITE IPA 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 10,
    initialStock: 10,
    minStock: 12,
    cost: 2.20,
    price: 4.50,
    abv: '5.50%',
    description: 'Cerveza rubia con base de trigo, estilo IPA por su extra lúpulo en aroma.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_ginger_blonde_500',
    name: 'GINGER BLONDE 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 8,
    initialStock: 8,
    minStock: 12,
    cost: 2.20,
    price: 4.50,
    abv: '4.70%',
    description: 'Cerveza rubia ligera con un toque exótico a jengibre.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_ruby_ale_500',
    name: 'RUBY ALE 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 10,
    initialStock: 10,
    minStock: 12,
    cost: 2.20,
    price: 4.50,
    abv: '5.00%',
    description: 'Cerveza roja, las maltas acarameladas le dan un toque único.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_extra_sout_500',
    name: 'EXTRA SOUT 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 12,
    initialStock: 12,
    minStock: 12,
    cost: 2.20,
    price: 4.50,
    abv: '6.00%',
    description: 'Cerveza negra estilo extra stout cuerpo medio con tonos a café.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_mocca_500',
    name: 'MOCCA 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 7,
    initialStock: 7,
    minStock: 12,
    cost: 2.20,
    price: 4.50,
    abv: '6.10%',
    description: 'Sweet stout, cerveza negra cremosa con cuerpo ligero y notas intensas a cacao y café.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_honey_strong_500',
    name: 'HONEY STRONG 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 0,
    initialStock: 0,
    minStock: 12,
    cost: 2.50,
    price: 5.00,
    abv: '10.00%',
    description: 'Cerveza rubia refrescante, con toques de miel de abeja.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_midninght_stout_500',
    name: 'MIDNINGHT STOUT 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 22,
    initialStock: 22,
    minStock: 12,
    cost: 2.50,
    price: 5.00,
    abv: '9.00%',
    description: 'Imperial stout cerveza negra con maltas tostadas y frambuesa.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_zen_ipa_500',
    name: 'ZEN IPA 500ML',
    category: 'Vinos & Cervezas',
    unit: 'botella',
    currentStock: 12,
    initialStock: 12,
    minStock: 12,
    cost: 2.20,
    price: 4.50,
    abv: '4.90%',
    description: 'Session IPA +9 mg de CBD hidrosoluble refrescante y relajante.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  },
  {
    id: 'prod_barril_honey_strong_30l',
    name: 'BARRIL HONEY STRONG 30 LITROS',
    category: 'Vinos & Cervezas',
    unit: 'litro',
    currentStock: 30,
    initialStock: 30,
    minStock: 5,
    cost: 1.80,
    price: 5.00, // Precio por 500ml base
    abv: '10.00%',
    description: 'Barril de 30 Litros de Cerveza Artesanal Honey Strong (10.00% ABV) para servicio en vaso de 500ml y jarra de 1 Litro.',
    location: 'Bar / Coctelería',
    supplier: 'Cervecería Artesanal Zénit',
    status: 'ACTIVE'
  }
];

const BEER_RECIPES = [
  {
    id: 'cer_white_ipa',
    name: 'WHITE IPA 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 4.50,
    abv: '5.50%',
    description: 'Cerveza rubia con base de trigo, estilo IPA por su extra lúpulo en aroma (5.50% ABV).',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'WHITE IPA 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_ginger_blonde',
    name: 'GINGER BLONDE 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 4.50,
    abv: '4.70%',
    description: 'Cerveza rubia ligera con un toque exótico a jengibre (4.70% ABV).',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'GINGER BLONDE 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_ruby_ale',
    name: 'RUBY ALE 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 4.50,
    abv: '5.00%',
    description: 'Cerveza roja, las maltas acarameladas le dan un toque único (5.00% ABV).',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'RUBY ALE 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_extra_sout',
    name: 'EXTRA SOUT 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 4.50,
    abv: '6.00%',
    description: 'Cerveza negra estilo extra stout cuerpo medio con tonos a café (6.00% ABV).',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'EXTRA SOUT 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_mocca',
    name: 'MOCCA 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 4.50,
    abv: '6.10%',
    description: 'Sweet stout, cerveza negra cremosa con cuerpo ligero y notas intensas a cacao y café (6.10% ABV).',
    image: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'MOCCA 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_honey_strong',
    name: 'HONEY STRONG 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 5.00,
    abv: '10.00%',
    description: 'Cerveza rubia refrescante, con toques de miel de abeja (10.00% ABV).',
    image: 'https://images.unsplash.com/photo-1584225065849-5561a0b3bfa3?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'HONEY STRONG 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_midninght_stout',
    name: 'MIDNINGHT STOUT 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 5.00,
    abv: '9.00%',
    description: 'Imperial stout cerveza negra con maltas tostadas y frambuesa (9.00% ABV).',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'MIDNINGHT STOUT 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_zen_ipa',
    name: 'ZEN IPA 500ML',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 4.50,
    abv: '4.90%',
    description: 'Session IPA +9 mg de CBD hidrosoluble refrescante y relajante (4.90% ABV).',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'ZEN IPA 500ML', grams: 1, unit: 'botella' }
    ],
    accompaniments: ['Vaso cervecero frío', 'Botella 500ml']
  },
  {
    id: 'cer_honey_strong_barril_500',
    name: 'HONEY STRONG BARRIL (500ML)',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 5.00,
    abv: '10.00%',
    description: 'Barril 30 Litros: Cerveza artesanal Honey Strong servida fresca en vaso de 500ml (10.00% ABV).',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'BARRIL HONEY STRONG 30 LITROS', grams: 0.5, unit: 'litro' }
    ],
    accompaniments: ['Vaso cervecero 500ml']
  },
  {
    id: 'cer_honey_strong_barril_1000',
    name: 'HONEY STRONG BARRIL (1 LITRO)',
    category: 'Cervezas Artesanales',
    destination: 'BAR',
    persons: 1,
    price: 7.00,
    abv: '10.00%',
    description: 'Barril 30 Litros: Cerveza artesanal Honey Strong servida fresca en jarra de 1 Litro (10.00% ABV).',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'BARRIL HONEY STRONG 30 LITROS', grams: 1.0, unit: 'litro' }
    ],
    accompaniments: ['Jarra cervecera 1 Litro']
  }
];

async function syncBeers() {
  console.log("🍺 Conectando a Firebase para registrar Cervezas Artesanales...");
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("🔐 Autenticando con credenciales administrativas...");
  await signInWithEmailAndPassword(auth, 'master@zenit.com', 'ZenitMaster2026#Secret!');
  console.log("   ✅ Autenticación exitosa.");

  const companyId = 'default_company';

  // 1. Guardar Productos de Inventario en Firestore
  console.log("📦 1. Registrando y sincronizando productos en colección 'products'...");
  
  // Obtener todos los productos actuales para evitar duplicados
  const snapshot = await getDocs(collection(db, 'products'));
  const existingDocs = {};
  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data();
    if (data.name) {
      existingDocs[data.name.trim().toUpperCase()] = docSnap.id;
    }
  });

  for (const beer of BEERS_DATA) {
    const key = beer.name.trim().toUpperCase();
    const docId = existingDocs[key] || beer.id;
    const docRef = doc(db, 'products', docId);

    await setDoc(docRef, {
      ...beer,
      id: docId,
      id_producto: docId,
      companyId,
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log(`   ✅ Insumo guardado/actualizado: ${beer.name} (DocID: ${docId}) | Stock: ${beer.currentStock} ${beer.unit} | Min: ${beer.minStock} | Precio: $${beer.price.toFixed(2)}`);
  }

  // 2. Guardar Recetas con isRecipe: true en 'products'
  console.log("\n📜 2. Registrando fichas técnicas y carta de venta...");
  for (const recipe of BEER_RECIPES) {
    const recipeDocId = 'rec_' + recipe.id;
    const docRef = doc(db, 'products', recipeDocId);
    await setDoc(docRef, {
      ...recipe,
      id: recipeDocId,
      isRecipe: true,
      companyId,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log(`   🍻 Carta de Venta lista: ${recipe.name} ($${recipe.price.toFixed(2)}) [${recipe.category}]`);
  }

  console.log("\n🎉 ¡Todas las cervezas del PDF han sido ingresadas con éxito al Inventario, Stock y Carta de Pedidos!");
}

syncBeers().then(() => process.exit(0)).catch(err => {
  console.error("❌ Error registrando cervezas:", err);
  process.exit(1);
});
