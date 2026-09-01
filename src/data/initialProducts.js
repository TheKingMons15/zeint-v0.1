// Catálogo oficial verificado de alimentos e insumos para Inventario Zenit, Cocina y Bar
// Separación estricta entre Cocina y Bar / Coctelería
export const ZENIT_INITIAL_PRODUCTS = [
  // =========================================================================
  // 1. STOCK DE COCINA - PROTEÍNAS (Carnes, Aves, Cerdo, Mariscos, Embutidos)
  // =========================================================================
  { name: 'Carne de hamburguesa', category: 'Proteínas', unit: 'UND', initialStock: 0, minStock: 10, location: 'Cocina' },
  { name: 'Carne para bandeja paisa', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 4, location: 'Cocina' },
  { name: 'Camarón limpio (Porciones)', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Chinchulines', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Chicharrón', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 4, location: 'Cocina' },
  { name: 'Costilla de cerdo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 4, location: 'Cocina' },
  { name: 'Cuerito', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Filete de res', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Tomahawk', category: 'Proteínas', unit: 'UND', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Filete de cerdo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Filete de pechuga de pollo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Chorizo Rojo', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Chorizo Blanco', category: 'Proteínas', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Morcilla', category: 'Proteínas', unit: 'UND', initialStock: 0, minStock: 10, location: 'Cocina' },
  { name: 'Cuy', category: 'Proteínas', unit: 'UND', initialStock: 0, minStock: 2, location: 'Cocina' },

  // =========================================================================
  // 2. STOCK DE COCINA - PAPAS Y CARBOHIDRATOS
  // =========================================================================
  { name: 'Papa super chola', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 10, location: 'Cocina' },
  { name: 'Papa amarilla', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 10, location: 'Cocina' },
  { name: 'Plátano maduro', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Maíz', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Arroz', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 10, location: 'Cocina' },
  { name: 'Fréjol rojo seco', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Arepas pequeñas', category: 'Papas y carbohidratos', unit: 'unidad', initialStock: 0, minStock: 15, location: 'Cocina' },

  // =========================================================================
  // 3. STOCK DE COCINA - VERDURAS Y LEGUMBRES
  // =========================================================================
  { name: 'Plátano Verde', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 8, location: 'Cocina' },
  { name: 'Tomate riñón', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 15, location: 'Cocina' },
  { name: 'Tomates cherry', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 0.5, location: 'Cocina' },
  { name: 'Cebolla blanca/perla', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 15, location: 'Cocina' },
  { name: 'Cebolla colorada', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 15, location: 'Cocina' },
  { name: 'Cebolla larga', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },
  { name: 'Zanahoria', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },
  { name: 'Pimiento', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 10, location: 'Cocina' },
  { name: 'Lechuga crespa', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 6, location: 'Cocina' },
  { name: 'Pepinillo', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 6, location: 'Cocina' },
  { name: 'Champiñones', category: 'Verduras', unit: 'paquete', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Ají rocoto', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Ajo pelado', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Cilantro', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Perejil', category: 'Verduras', unit: 'UND', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Romero', category: 'Verduras', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },

  // =========================================================================
  // 4. STOCK DE COCINA - FRUTAS
  // =========================================================================
  { name: 'Aguacate', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 4, location: 'Cocina' },
  { name: 'Tomate de árbol', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Limón sutil', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Naranja', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Manzana verde', category: 'Frutas', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },

  // =========================================================================
  // 5. STOCK DE COCINA - LÁCTEOS
  // =========================================================================
  { name: 'Queso mozzarella', category: 'Lácteos', unit: 'kg', initialStock: 0, minStock: 4, location: 'Cocina' },
  { name: 'Queso amasado', category: 'Lácteos', unit: 'kg', initialStock: 0, minStock: 4, location: 'Cocina' },
  { name: 'Crema de leche', category: 'Lácteos', unit: 'litro', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Leche', category: 'Lácteos', unit: 'litro', initialStock: 0, minStock: 5, location: 'Cocina' },

  // =========================================================================
  // 6. STOCK DE COCINA - ACEITES Y GRASAS
  // =========================================================================
  { name: 'Mantequilla', category: 'Aceites y grasas', unit: 'kg', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Manteca de cerdo', category: 'Aceites y grasas', unit: 'kg', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Aceite', category: 'Aceites y grasas', unit: 'litro', initialStock: 0, minStock: 5, location: 'Cocina' },

  // =========================================================================
  // 7. STOCK DE COCINA - SALSAS Y ADEREZOS
  // =========================================================================
  { name: 'Vinagre', category: 'Salsas', unit: 'litro', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Salsa de tomate', category: 'Salsas', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Mostaza', category: 'Salsas', unit: 'kg', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Jarabe de frutilla', category: 'Salsas', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },

  // =========================================================================
  // 8. STOCK DE COCINA - SECOS Y CONDIMENTOS
  // =========================================================================
  { name: 'Aliño completo en polvo', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Cocoa', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 0.5, location: 'Cocina' },
  { name: 'Cobertura de chocolate', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },
  { name: 'Maní en pasta', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Achiote', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Sal', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Sal gruesa', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 3, location: 'Cocina' },
  { name: 'Pimienta negra', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },
  { name: 'Comino', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },
  { name: 'Orégano', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },
  { name: 'Ají seco', category: 'Secos y condimentos', unit: 'kg', initialStock: 0, minStock: 1, location: 'Cocina' },

  // =========================================================================
  // 9. STOCK DE COCINA - OTROS / OPERATIVOS
  // =========================================================================
  { name: 'Huevos', category: 'Otros', unit: 'UND', initialStock: 0, minStock: 30, location: 'Cocina' },
  { name: 'Carbón', category: 'Otros', unit: 'bolsa', initialStock: 0, minStock: 5, location: 'Cocina' },
  { name: 'Alcohol', category: 'Otros', unit: 'litro', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Algodón', category: 'Otros', unit: 'paquete', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Papel aluminio', category: 'Otros', unit: 'rollo', initialStock: 0, minStock: 2, location: 'Cocina' },
  { name: 'Hojas de achira', category: 'Otros', unit: 'paquete', initialStock: 0, minStock: 3, location: 'Cocina' },

  // =========================================================================
  // 10. STOCK DE BAR - CERVEZAS ARTESANALES
  // =========================================================================
  { 
    name: 'WHITE IPA 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 10, 
    minStock: 12, 
    cost: 2.20,
    price: 4.50, 
    abv: '5.50%', 
    description: 'Cerveza rubia con base de trigo, estilo IPA por su extra lúpulo en aroma.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'GINGER BLONDE 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 8, 
    minStock: 12, 
    cost: 2.20,
    price: 4.50, 
    abv: '4.70%', 
    description: 'Cerveza rubia ligera con un toque exótico a jengibre.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'RUBY ALE 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 10, 
    minStock: 12, 
    cost: 2.20,
    price: 4.50, 
    abv: '5.00%', 
    description: 'Cerveza roja, las maltas acarameladas le dan un toque único.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'EXTRA SOUT 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 12, 
    minStock: 12, 
    cost: 2.20,
    price: 4.50, 
    abv: '6.00%', 
    description: 'Cerveza negra estilo extra stout cuerpo medio con tonos a café.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'MOCCA 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 7, 
    minStock: 12, 
    cost: 2.20,
    price: 4.50, 
    abv: '6.10%', 
    description: 'Sweet stout, cerveza negra cremosa con cuerpo ligero y notas intensas a cacao y café.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'HONEY STRONG 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 0, 
    minStock: 12, 
    cost: 2.50,
    price: 5.00, 
    abv: '10.00%', 
    description: 'Cerveza rubia refrescante, con toques de miel de abeja.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'MIDNINGHT STOUT 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 22, 
    minStock: 12, 
    cost: 2.50,
    price: 5.00, 
    abv: '9.00%', 
    description: 'Imperial stout cerveza negra con maltas tostadas y frambuesa.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'ZEN IPA 500ML', 
    category: 'Vinos & Cervezas', 
    unit: 'botella', 
    initialStock: 12, 
    minStock: 12, 
    cost: 2.20,
    price: 4.50, 
    abv: '4.90%', 
    description: 'Session IPA +9 mg de CBD hidrosoluble refrescante y relajante.',
    location: 'Bar / Coctelería',
    presentation: '500ml'
  },
  { 
    name: 'BARRIL HONEY STRONG 30 LITROS', 
    category: 'Vinos & Cervezas', 
    unit: 'litro', 
    initialStock: 30, 
    minStock: 5, 
    cost: 1.80,
    price: 5.00, 
    abv: '10.00%', 
    description: 'Barril 30 Litros de cerveza Honey Strong artesanal (Servicio en Vaso 500ml a $5.00 y Jarra 1L a $7.00).',
    location: 'Bar / Coctelería',
    presentation: 'Barril 30 Litros'
  },

  // =========================================================================
  // 11. STOCK DE BAR - AGUAS, GASEOSAS Y REFRESCOS
  // =========================================================================
  { name: 'Agua Mineral con Gas', category: 'Aguas, Gaseosas & Bebidas', unit: 'botella', initialStock: 24, minStock: 12, location: 'Bar / Coctelería', presentation: '500ml', price: 1.50 },
  { name: 'Agua sin Gas', category: 'Aguas, Gaseosas & Bebidas', unit: 'botella', initialStock: 24, minStock: 12, location: 'Bar / Coctelería', presentation: '500ml', price: 1.50 },
  { name: 'Coca Cola Original 300ml', category: 'Aguas, Gaseosas & Bebidas', unit: 'botella', initialStock: 24, minStock: 12, location: 'Bar / Coctelería', presentation: '300ml', price: 2.00 },
  { name: 'Coca Cola Sin Azúcar 300ml', category: 'Aguas, Gaseosas & Bebidas', unit: 'botella', initialStock: 12, minStock: 6, location: 'Bar / Coctelería', presentation: '300ml', price: 2.00 },
  { name: 'Sprite 300ml', category: 'Aguas, Gaseosas & Bebidas', unit: 'botella', initialStock: 12, minStock: 6, location: 'Bar / Coctelería', presentation: '300ml', price: 2.00 },
  { name: 'Agua Tónica 300ml', category: 'Aguas, Gaseosas & Bebidas', unit: 'botella', initialStock: 12, minStock: 6, location: 'Bar / Coctelería', presentation: '300ml', price: 2.50 },
  { name: 'Ginger Ale 300ml', category: 'Aguas, Gaseosas & Bebidas', unit: 'botella', initialStock: 12, minStock: 6, location: 'Bar / Coctelería', presentation: '300ml', price: 2.50 },
  { name: 'Red Bull Energy Drink', category: 'Aguas, Gaseosas & Bebidas', unit: 'lata', initialStock: 12, minStock: 6, location: 'Bar / Coctelería', presentation: '250ml', price: 3.50 },

  // =========================================================================
  // 12. STOCK DE BAR - LICORES, DESTILADOS Y VINOS
  // =========================================================================
  { name: 'Whisky Johnnie Walker Black Label', category: 'Licores & Destilados', unit: 'botella', initialStock: 3, minStock: 2, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Whisky Old Parr 12 Años', category: 'Licores & Destilados', unit: 'botella', initialStock: 2, minStock: 1, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Ron Abuelo Añejo', category: 'Licores & Destilados', unit: 'botella', initialStock: 4, minStock: 2, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Gin Tanqueray', category: 'Licores & Destilados', unit: 'botella', initialStock: 3, minStock: 1, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Vodka Absolut', category: 'Licores & Destilados', unit: 'botella', initialStock: 3, minStock: 1, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Tequila José Cuervo Especial', category: 'Licores & Destilados', unit: 'botella', initialStock: 3, minStock: 1, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Aguardiente Antioqueño', category: 'Licores & Destilados', unit: 'botella', initialStock: 4, minStock: 2, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Vino Tinto Cabernet Sauvignon', category: 'Vinos & Cervezas', unit: 'botella', initialStock: 6, minStock: 3, location: 'Bar / Coctelería', presentation: '750ml' },
  { name: 'Vino Blanco Sauvignon Blanc', category: 'Vinos & Cervezas', unit: 'botella', initialStock: 4, minStock: 2, location: 'Bar / Coctelería', presentation: '750ml' }
];

