/**
 * Script para sembrar los 69 productos de alimentos directamente en Firebase Firestore
 * Ejecutar con: node scripts/seedZenitInventory.js
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { ZENIT_INITIAL_PRODUCTS } from '../src/data/initialProducts.js';
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

async function seed() {
  console.log("🔥 Conectando con Firebase:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const batch = writeBatch(db);
  const productsRef = collection(db, 'products');

  console.log(`📦 Preparando lote de ${ZENIT_INITIAL_PRODUCTS.length} productos...`);

  ZENIT_INITIAL_PRODUCTS.forEach((p) => {
    const newDoc = doc(productsRef);
    batch.set(newDoc, {
      name: p.name.trim(),
      category: p.category,
      unit: p.unit,
      initialStock: Number(p.initialStock),
      currentStock: Number(p.initialStock),
      minStock: Number(p.minStock),
      notes: '',
      companyId: 'default_company',
      createdBy: 'admin_initial_seed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`🎉 ¡ÉXITO! Los ${ZENIT_INITIAL_PRODUCTS.length} productos han sido insertados en Firebase Firestore.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error al sembrar productos en Firestore:", err);
  process.exit(1);
});
