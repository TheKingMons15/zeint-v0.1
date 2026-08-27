// Catálogo oficial verificado de alimentos e insumos para Inventario Zenit, Cocina y Bar
// Todos los productos inician en stock 0.0 para ingreso real diario
export const ZENIT_INITIAL_PRODUCTS = [
  // 1. Proteínas (Carnes, Aves, Mariscos, Embutidos)
  { name: 'Carne molida de res', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Filete de res', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Tomahawk', category: 'Proteínas', unit: 'UND', initialStock: 0, minStock: 3 },
  { name: 'Filete de cerdo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Costilla de cerdo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 4 },
  { name: 'Filete de pechuga de pollo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Chinchulines', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Camarón limpio (Porciones)', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Chorizo Rojo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Chorizo Blanco', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Morcilla', category: 'Proteínas', unit: 'UND', initialStock: 0, minStock: 10 },
  { name: 'Cuy', category: 'Proteínas', unit: 'UND', initialStock: 0, minStock: 2 },
  { name: 'Cuerito', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3 },

  // 2. Papas y carbohidratos
  { name: 'Papa super chola', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 10 },
  { name: 'Papa amarilla', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 10 },
  { name: 'Plátano maduro', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Maíz', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Arroz', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 10 },
  { name: 'Fréjol rojo seco', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Arepas pequeñas', category: 'Papas y carbohidratos', unit: 'unidad', initialStock: 0, minStock: 15 },

  // 3. Verduras y Legumbres
  { name: 'Plátano Verde', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 8 },
  { name: 'Tomate riñón', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 15 },
  { name: 'Tomates cherry', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 0.5 },
  { name: 'Cebolla blanca/perla', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 15 },
  { name: 'Cebolla colorada', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 15 },
  { name: 'Cebolla larga', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 1 },
  { name: 'Zanahoria', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 1 },
  { name: 'Pimiento', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 10 },
  { name: 'Lechuga crespa', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 6 },
  { name: 'Pepinillo', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 6 },
  { name: 'Champiñones', category: 'Verduras', unit: 'paquete', initialStock: 0, minStock: 2 },
  { name: 'Ají rocoto', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 2 },
  { name: 'Ajo pelado', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 2 },
  { name: 'Cilantro', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 3 },
  { name: 'Perejil', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 3 },
  { name: 'Romero', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 1 },

  // 4. Frutas
  { name: 'Aguacate', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 4 },
  { name: 'Tomate de árbol', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Limón sutil', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Naranja', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Manzana verde', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 1 },

  // 5. Lácteos
  { name: 'Queso mozzarella', category: 'Lácteos', unit: 'kg', initialStock: 0, minStock: 4 },
  { name: 'Queso amasado', category: 'Lácteos', unit: 'kg', initialStock: 0, minStock: 4 },
  { name: 'Crema de leche', category: 'Lácteos', unit: 'litro', initialStock: 0, minStock: 2 },
  { name: 'Leche', category: 'Lácteos', unit: 'litro', initialStock: 0, minStock: 5 },

  // 6. Aceites y Grasas
  { name: 'Mantequilla', category: 'Aceites y grasas', unit: 'kg', initialStock: 0, minStock: 2 },
  { name: 'Manteca de cerdo', category: 'Aceites y grasas', unit: 'kg', initialStock: 0, minStock: 2 },
  { name: 'Aceite', category: 'Aceites y grasas', unit: 'litro', initialStock: 0, minStock: 5 },

  // 7. Salsas y Aderezos
  { name: 'Vinagre', category: 'Salsas', unit: 'litro', initialStock: 0, minStock: 2 },
  { name: 'Salsa de tomate', category: 'Salsas', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Mostaza', category: 'Salsas', unit: 'kg', initialStock: 0, minStock: 2 },
  { name: 'Jarabe de frutilla', category: 'Salsas', unit: 'kg', initialStock: 0, minStock: 1 },

  // 8. Secos y Condimentos
  { name: 'Aliño completo en polvo', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 2 },
  { name: 'Cocoa', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 0.5 },
  { name: 'Cobertura de chocolate', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1 },
  { name: 'Maní en pasta', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Achiote', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 2 },
  { name: 'Sal', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 5 },
  { name: 'Sal gruesa', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 3 },
  { name: 'Pimienta negra', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1 },
  { name: 'Comino', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1 },
  { name: 'Orégano', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1 },
  { name: 'Ají seco', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1 },

  // 9. Otros e Insumos Operativos
  { name: 'Huevos', category: 'Otros', unit: 'UND', initialStock: 0, minStock: 30 },
  { name: 'Carbón', category: 'Otros', unit: 'bolsa', initialStock: 0, minStock: 5 },
  { name: 'Alcohol', category: 'Otros', unit: 'litro', initialStock: 0, minStock: 2 },
  { name: 'Algodón', category: 'Otros', unit: 'paquete', initialStock: 0, minStock: 2 },
  { name: 'Papel aluminio', category: 'Otros', unit: 'rollo', initialStock: 0, minStock: 2 },
  { name: 'Hojas de achira', category: 'Otros', unit: 'paquete', initialStock: 0, minStock: 3 }
];
