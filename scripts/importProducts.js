/**
 * Script de importación masiva directa a Firestore
 * Uso: node scripts/importProducts.js
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey) {
  console.error("❌ Error: No se encontraron las variables de Firebase en el archivo .env");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function importProductsList(productsList, companyId = 'default_company') {
  console.log(`🚀 Iniciando importación de ${productsList.length} productos a Firestore online...`);
  
  const batch = writeBatch(db);
  const productsRef = collection(db, 'products');

  productsList.forEach(item => {
    const newDocRef = doc(productsRef);
    batch.set(newDocRef, {
      name: item.name.trim(),
      category: item.category || 'Otros',
      unit: item.unit || 'kg',
      initialStock: Number(item.initialStock ?? item.currentStock ?? 0),
      currentStock: Number(item.currentStock ?? item.initialStock ?? 0),
      minStock: Number(item.minStock ?? 0),
      notes: item.notes || '',
      companyId: companyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  console.log("✅ ¡Importación masiva completada exitosamente en Firebase Firestore!");
}
