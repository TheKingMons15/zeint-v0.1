// =========================================================================
// MENÚ OFICIAL Y FICHAS TÉCNICAS (RECETAS) DE RESTAURANTE ZÉNIT
// Basado en el recetario maestro oficial con deducción exacta de gramajes
// =========================================================================

export const MENU_CATEGORIES = [
  'Entradas Nubes',
  'Picadas Parrilla',
  'Picadas Premium',
  'Cortes de carne',
  'De las Alturas',
  'Bajo reserva',
  'Bandeja Paisa',
  'Pequeños Astros',
  'Postres',
  'Cócteles de Altura',
  'Bebidas'
];

export const ZENIT_RECIPES = [
  // -------------------------------------------------------------
  // 1. ENTRADAS NUBES
  // -------------------------------------------------------------
  {
    id: 'ent_coctel_camaron',
    name: 'Cóctel de camarón',
    category: 'Entradas Nubes',
    persons: 1,
    price: 6.50,
    description: 'Camarones frescos en salsa cóctel de la casa con toques cítricos.',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Camarón limpio (Porciones)', grams: 100 },
      { productName: 'Salsa de tomate', grams: 50 },
      { productName: 'Limón sutil', grams: 20 },
      { productName: 'Aceite', grams: 20 }
    ],
    accompaniments: ['Galletas o chips de plátano', 'Salsa cóctel artesanal']
  },
  {
    id: 'ent_pan_carbonara',
    name: 'Pan francés con carbonara',
    category: 'Entradas Nubes',
    persons: 1,
    price: 5.00,
    description: 'Pan francés crujiente bañado en cremosa salsa carbonara y tocino ahumado.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Queso mozzarella', grams: 50 },
      { productName: 'Leche', grams: 40 },
      { productName: 'Mantequilla', grams: 20 }
    ],
    accompaniments: ['Pan francés horneado', 'Queso gratinado']
  },
  {
    id: 'ent_canastillas_patacon',
    name: 'Canastillas de patacón con chorizo, guacamole y pico de gallo',
    category: 'Entradas Nubes',
    persons: 1,
    price: 6.00,
    description: 'Canastillas crocantes de plátano verde rellenas de chorizo, guacamole y pico de gallo.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Plátano Verde', grams: 105 },
      { productName: 'Chorizo Rojo', grams: 90 },
      { productName: 'Aguacate', grams: 40 },
      { productName: 'Tomate riñón', grams: 15 },
      { productName: 'Cebolla colorada', grams: 10 }
    ],
    accompaniments: ['Guacamole fresco', 'Pico de gallo']
  },
  {
    id: 'ent_chinchulines_maiz',
    name: 'Maíz tostado con chinchulines y papas',
    category: 'Entradas Nubes',
    persons: 1,
    price: 5.50,
    description: 'Chinchulines dorados a la parrilla servidos sobre maíz tostado y papitas.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Chinchulines', grams: 80 },
      { productName: 'Maíz', grams: 60 },
      { productName: 'Papa super chola', grams: 45 },
      { productName: 'Limón sutil', grams: 20 }
    ],
    accompaniments: ['Maíz tostado crocante', 'Papas doradas', 'Salsa de la casa']
  },

  // -------------------------------------------------------------
  // 2. PICADAS PARRILLA
  // -------------------------------------------------------------
  {
    id: 'pic_estrella_fugaz',
    name: 'Estrella Fugaz',
    category: 'Picadas Parrilla',
    persons: 1,
    price: 14.50,
    description: 'Combinación individual de filete de res, pollo, chorizos y chinchulines con ensalada Waldorf.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 120 },
      { productName: 'Filete de pechuga de pollo', grams: 120 },
      { productName: 'Chorizo Rojo', grams: 40 },
      { productName: 'Chorizo Blanco', grams: 40 },
      { productName: 'Chinchulines', grams: 40 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Tomate riñón', grams: 40 }
    ],
    accompaniments: ['Papa salteada', 'Ensalada Waldorf', 'Chimichurri y mayonesa']
  },
  {
    id: 'pic_constelacion_sabores',
    name: 'Constelación de Sabores',
    category: 'Picadas Parrilla',
    persons: 2,
    price: 26.00,
    description: 'Picada para 2 personas con 3 carnes, chorizos, cuerito, papas salteadas y arepas.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 120 },
      { productName: 'Filete de pechuga de pollo', grams: 120 },
      { productName: 'Filete de cerdo', grams: 120 },
      { productName: 'Chorizo Rojo', grams: 50 },
      { productName: 'Chorizo Blanco', grams: 50 },
      { productName: 'Cuerito', grams: 50 },
      { productName: 'Papa super chola', grams: 250 },
      { productName: 'Arepas pequeñas', grams: 50 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Tomate riñón', grams: 40 }
    ],
    accompaniments: ['Papa salteada', '2 Arepas', 'Ensalada Waldorf', 'Trío de salsas']
  },
  {
    id: 'pic_fuego_horizonte',
    name: 'Fuego del Horizonte',
    category: 'Picadas Parrilla',
    persons: 4,
    price: 48.00,
    description: 'Gran parrillada para 4 personas con 3 carnes, chinchulines, cuerito, maduro y papas.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 120 },
      { productName: 'Filete de pechuga de pollo', grams: 120 },
      { productName: 'Filete de cerdo', grams: 120 },
      { productName: 'Chorizo Rojo', grams: 80 },
      { productName: 'Chorizo Blanco', grams: 80 },
      { productName: 'Chinchulines', grams: 80 },
      { productName: 'Cuerito', grams: 80 },
      { productName: 'Papa super chola', grams: 450 },
      { productName: 'Plátano maduro', grams: 150 },
      { productName: 'Arepas pequeñas', grams: 100 },
      { productName: 'Lechuga crespa', grams: 100 },
      { productName: 'Tomate riñón', grams: 60 }
    ],
    accompaniments: ['Papas salteadas', 'Maduro asado', 'Arepas', 'Ensalada Waldorf', 'Trío de salsas']
  },
  {
    id: 'pic_cumbre_andina',
    name: 'Cumbre Andina Sky Grill',
    category: 'Picadas Parrilla',
    persons: 8,
    price: 95.00,
    description: 'El festín supremo para 8 a 10 personas. Gran variedad de carnes, chorizos, queso amasado y guarniciones.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 250 },
      { productName: 'Filete de pechuga de pollo', grams: 250 },
      { productName: 'Filete de cerdo', grams: 250 },
      { productName: 'Chorizo Rojo', grams: 200 },
      { productName: 'Chorizo Blanco', grams: 200 },
      { productName: 'Chinchulines', grams: 150 },
      { productName: 'Cuerito', grams: 150 },
      { productName: 'Queso amasado', grams: 150 },
      { productName: 'Papa super chola', grams: 800 },
      { productName: 'Plátano maduro', grams: 350 },
      { productName: 'Arepas pequeñas', grams: 200 },
      { productName: 'Lechuga crespa', grams: 200 },
      { productName: 'Tomate riñón', grams: 100 }
    ],
    accompaniments: ['Papas salteadas', 'Queso amasado', 'Arepas', 'Maduro asado', 'Salsas variadas']
  },

  // -------------------------------------------------------------
  // 3. PICADAS PREMIUM
  // -------------------------------------------------------------
  {
    id: 'pic_zenit_prime',
    name: 'Zenit Prime',
    category: 'Picadas Premium',
    persons: 3,
    price: 42.00,
    description: 'Picaña, Matambre y Costilla al barril acompañados de papas salteadas, arepas y maduro.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Carne de res suave', grams: 200 },
      { productName: 'Carne molida de res', grams: 180 },
      { productName: 'Costilla de cerdo', grams: 280 },
      { productName: 'Papa super chola', grams: 300 },
      { productName: 'Plátano maduro', grams: 100 },
      { productName: 'Arepas pequeñas', grams: 50 },
      { productName: 'Lechuga crespa', grams: 100 }
    ],
    accompaniments: ['Papa salteada', '3 Arepas', 'Maduro asado', 'Ensalada Waldorf', 'Trío de salsas']
  },

  // -------------------------------------------------------------
  // 4. CORTES DE CARNE
  // -------------------------------------------------------------
  {
    id: 'cor_picanha_suprema',
    name: 'Picaña Suprema del Horizonte',
    category: 'Cortes de carne',
    persons: 1,
    price: 18.50,
    description: 'Corte premium de 200g a la parrilla, con papas francesas o gratinadas y ensalada Waldorf.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Carne de res suave', grams: 200 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Tomate riñón', grams: 40 },
      { productName: 'Aceite', grams: 20 }
    ],
    accompaniments: ['Papa francesa o gratinada', 'Ensalada Waldorf', 'Salsa chimichurri']
  },
  {
    id: 'cor_matambre',
    name: 'Matambre',
    category: 'Cortes de carne',
    persons: 1,
    price: 16.00,
    description: '180g de matambre dorado con hierbas finas y papas a elección.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 180 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Tomate riñón', grams: 40 }
    ],
    accompaniments: ['Papa francesa o gratinada', 'Ensalada Waldorf', 'Salsa de la casa']
  },
  {
    id: 'cor_tomahawk',
    name: 'Tomahawk',
    category: 'Cortes de carne',
    persons: 1,
    price: 24.00,
    description: '300g de corte Tomahawk con hueso a la leña, papas gratinadas y ensalada.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Tomahawk', grams: 300 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Romero', grams: 5 },
      { productName: 'Lechuga crespa', grams: 60 }
    ],
    accompaniments: ['Papa francesa o gratinada', 'Ensalada Waldorf', 'Salsa parrillera']
  },

  // -------------------------------------------------------------
  // 5. DE LAS ALTURAS
  // -------------------------------------------------------------
  {
    id: 'alt_chicharron',
    name: 'Chicharrón',
    category: 'De las Alturas',
    persons: 1,
    price: 11.50,
    description: '180g de chicharrón crocante con papa salteada, maduro frito, pico de gallo y guacamole.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Cuerito', grams: 180 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Plátano maduro', grams: 100 },
      { productName: 'Aguacate', grams: 40 },
      { productName: 'Tomate riñón', grams: 40 },
      { productName: 'Cebolla colorada', grams: 40 }
    ],
    accompaniments: ['Papa salteada', 'Maduro frito', 'Pico de gallo', 'Guacamole']
  },
  {
    id: 'alt_costilla_barril',
    name: 'Costilla al barril',
    category: 'De las Alturas',
    persons: 1,
    price: 15.00,
    description: '500g de costilla tierna ahumada al barril con papas francesas y ají.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Costilla de cerdo', grams: 500 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Ají rocoto', grams: 25 }
    ],
    accompaniments: ['Papa francesa o salteada', 'Ensalada fresca', 'Ají de la casa']
  },
  {
    id: 'alt_pollo_chorizo_barril',
    name: 'Filete pollo y chorizo al barril',
    category: 'De las Alturas',
    persons: 1,
    price: 12.50,
    description: '200g de filete de pechuga con 90g de chorizo artesanal al barril.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 200 },
      { productName: 'Chorizo Rojo', grams: 90 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 }
    ],
    accompaniments: ['Papa francesa o salteada', 'Ensalada', 'Salsa BBQ/ajo']
  },
  {
    id: 'alt_res_chorizo_barril',
    name: 'Filete res y chorizo al barril',
    category: 'De las Alturas',
    persons: 1,
    price: 13.50,
    description: '220g de filete de res jugoso con 90g de chorizo ahumado.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 220 },
      { productName: 'Chorizo Rojo', grams: 90 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 }
    ],
    accompaniments: ['Papa francesa o salteada', 'Ensalada', 'Salsa']
  },
  {
    id: 'alt_chuleton_chorizo',
    name: 'Chuletón y chorizo',
    category: 'De las Alturas',
    persons: 1,
    price: 14.00,
    description: '300g de chuletón con hueso a la brasa y chorizo parrillero.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de cerdo', grams: 300 },
      { productName: 'Chorizo Rojo', grams: 90 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 }
    ],
    accompaniments: ['Papas doradas', 'Ensalada', 'Salsa parrillera']
  },
  {
    id: 'alt_brochetas_cielo',
    name: 'Brochetas del cielo',
    category: 'De las Alturas',
    persons: 1,
    price: 13.00,
    description: '220g de carnes mixtas en brocheta con papas cocidas y salsa de queso.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 80 },
      { productName: 'Filete de pechuga de pollo', grams: 70 },
      { productName: 'Filete de cerdo', grams: 70 },
      { productName: 'Papa super chola', grams: 170 },
      { productName: 'Queso mozzarella', grams: 40 },
      { productName: 'Lechuga crespa', grams: 80 }
    ],
    accompaniments: ['Papa cocida bañada en salsa de queso', 'Doble ensalada', 'Mayonesa verde']
  },
  {
    id: 'alt_pollo_salsa_pina',
    name: 'Filete pollo salsa piña',
    category: 'De las Alturas',
    persons: 1,
    price: 11.50,
    description: '200g de pechuga de pollo marinada en reducción dulce de piña y papas francesas.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 200 },
      { productName: 'Papa super chola', grams: 160 }
    ],
    accompaniments: ['Papas francesas', 'Salsa de piña artesanal']
  },

  // -------------------------------------------------------------
  // 6. BAJO RESERVA (CUY)
  // -------------------------------------------------------------
  {
    id: 'res_cuy_entero',
    name: 'Cuy Zénit crocante entero',
    category: 'Bajo reserva',
    persons: 1,
    price: 32.00,
    description: 'Cuy tradicional entero asado a la brasa con papas cocidas, ensalada y sarsa.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Cuy', grams: 600 },
      { productName: 'Papa super chola', grams: 200 },
      { productName: 'Lechuga crespa', grams: 80 },
      { productName: 'Ají rocoto', grams: 25 }
    ],
    accompaniments: ['Papas cocidas', 'Ensalada clásica', 'Ají/Sarsa criolla']
  },
  {
    id: 'res_cuarto_cuy',
    name: 'Cuarto de cuy',
    category: 'Bajo reserva',
    persons: 1,
    price: 12.00,
    description: 'Porción individual de cuy crocante con papas cocidas y ensalada.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Cuy', grams: 160 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Lechuga crespa', grams: 70 },
      { productName: 'Ají rocoto', grams: 20 }
    ],
    accompaniments: ['Papas cocidas', 'Ensalada', 'Sarsa criolla']
  },

  // -------------------------------------------------------------
  // 7. BANDEJA PAISA
  // -------------------------------------------------------------
  {
    id: 'ban_bandeja_paisa',
    name: 'Bandeja Paisa Zénit',
    category: 'Bandeja Paisa',
    persons: 1,
    price: 13.50,
    description: 'La reina de la casa: carne, chicharrón, chorizo, fréjol, arroz, arepa, maduro y aguacate.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Carne molida de res', grams: 90 },
      { productName: 'Cuerito', grams: 70 },
      { productName: 'Chorizo Rojo', grams: 55 },
      { productName: 'Fréjol rojo seco', grams: 100 },
      { productName: 'Arroz', grams: 90 },
      { productName: 'Plátano maduro', grams: 70 },
      { productName: 'Arepas pequeñas', grams: 50 },
      { productName: 'Aguacate', grams: 45 },
      { productName: 'Huevos', grams: 50 }
    ],
    accompaniments: ['Arroz blanco', 'Fréjoles guisados', 'Aguacate', 'Huevo frito']
  },

  // -------------------------------------------------------------
  // 8. PEQUEÑOS ASTROS (MENÚ INFANTIL)
  // -------------------------------------------------------------
  {
    id: 'ast_hamburguesa',
    name: 'Hamburguesa',
    category: 'Pequeños Astros',
    persons: 1,
    price: 6.50,
    description: 'Hamburguesa casera de 100g con queso derretido, vegetales y papas francesas.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Carne molida de res', grams: 100 },
      { productName: 'Papa super chola', grams: 120 },
      { productName: 'Queso mozzarella', grams: 30 },
      { productName: 'Tomate riñón', grams: 15 },
      { productName: 'Lechuga crespa', grams: 10 }
    ],
    accompaniments: ['Papas francesas', 'Salsas']
  },
  {
    id: 'ast_choripapa',
    name: 'Choripapa orbital',
    category: 'Pequeños Astros',
    persons: 1,
    price: 5.50,
    description: 'Papas fritas crocantes con trozos de chorizo parrillero y queso fundido.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Chorizo Rojo', grams: 100 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Queso mozzarella', grams: 40 }
    ],
    accompaniments: ['Papas fritas', 'Queso fundido o guacamole']
  },
  {
    id: 'ast_deditos_pollo',
    name: 'Deditos de pollo galácticos',
    category: 'Pequeños Astros',
    persons: 1,
    price: 6.00,
    description: 'Tiras crocantes de pechuga de pollo apanadas con papas francesas.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 120 },
      { productName: 'Papa super chola', grams: 100 },
      { productName: 'Aceite', grams: 25 }
    ],
    accompaniments: ['Papas francesas', 'Salsa golf/tomate']
  },
  {
    id: 'ast_mini_brochetas',
    name: 'Mini brochetas del cielo',
    category: 'Pequeños Astros',
    persons: 1,
    price: 6.00,
    description: 'Brochetas suaves de res o pollo con papitas fritas.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 110 },
      { productName: 'Papa super chola', grams: 100 }
    ],
    accompaniments: ['Papas francesas', 'Salsa suave']
  },
  {
    id: 'ast_sanduche_pollo',
    name: 'Sánduche de pollo',
    category: 'Pequeños Astros',
    persons: 1,
    price: 5.50,
    description: 'Sánduche de pollo desmenuzado con vegetales y papas.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 90 },
      { productName: 'Papa super chola', grams: 100 },
      { productName: 'Lechuga crespa', grams: 20 },
      { productName: 'Tomate riñón', grams: 10 }
    ],
    accompaniments: ['Pan artesanal', 'Papas fritas']
  },
  {
    id: 'ast_maduro_gratinado',
    name: 'Maduro gratinado',
    category: 'Pequeños Astros',
    persons: 1,
    price: 5.50,
    description: 'Plátano maduro horneado con carne, chorizo y abundante queso gratinado.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Plátano maduro', grams: 155 },
      { productName: 'Carne molida de res', grams: 60 },
      { productName: 'Chorizo Rojo', grams: 50 },
      { productName: 'Queso mozzarella', grams: 40 }
    ],
    accompaniments: ['Maduro al horno', 'Queso gratinado']
  },

  // -------------------------------------------------------------
  // 9. POSTRES
  // -------------------------------------------------------------
  {
    id: 'pos_cheesecake',
    name: 'Cheesecake del cielo',
    category: 'Postres',
    persons: 1,
    price: 4.50,
    description: 'Cremoso cheesecake horneado con coulis de frutos rojos (170g).',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Queso mozzarella', grams: 70 },
      { productName: 'Leche', grams: 50 },
      { productName: 'Mantequilla', grams: 30 }
    ],
    accompaniments: ['Coulis de frutos rojos']
  },
  {
    id: 'pos_brownie_volcanico',
    name: 'Brownie volcánico con helado',
    category: 'Postres',
    persons: 1,
    price: 5.00,
    description: 'Brownie de chocolate tibio con centro fundente y bola de helado de vainilla.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Mantequilla', grams: 40 },
      { productName: 'Huevos', grams: 50 },
      { productName: 'Leche', grams: 30 }
    ],
    accompaniments: ['Helado de vainilla', 'Sirope de chocolate']
  },
  {
    id: 'pos_miel_quesillo',
    name: 'Postre típico andino miel con quesillo',
    category: 'Postres',
    persons: 1,
    price: 4.00,
    description: 'Quesillo fresco andino bañado en miel de panela aromatizada.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Queso amasado', grams: 120 }
    ],
    accompaniments: ['Miel de caña aromatizada', 'Quesillo andino']
  },

  // -------------------------------------------------------------
  // 10. CÓCTELES DE ALTURA (BAR & COCTELERÍA)
  // -------------------------------------------------------------
  {
    id: 'bar_paramo_zenit',
    name: 'Páramo Zénit',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 7.00,
    description: 'Cóctel insignia Zénit. Destilado artesanal macerado con cítricos de montaña, infusión de hierbas andinas y toque ahumado de romero.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 50 },
      { productName: 'Romero', grams: 5 },
      { productName: 'Jarabe de frutilla', grams: 25 }
    ],
    accompaniments: ['Copa de cristal ahumada', 'Romero flameado', 'Cítrico deshidratado']
  },
  {
    id: 'bar_mojito_cima',
    name: 'Mojito de la cima',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 4.99,
    description: 'Refrescante mojito clásico con ron blanco, hierbabuena fresca macerada, limón sutil y soda burbujeante.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 60 }
    ],
    accompaniments: ['Vaso alto con hielo picado', 'Ramita de hierbabuena', 'Rodaja de limón sutil']
  },
  {
    id: 'bar_mojito_sabores',
    name: 'Mojito de sabores',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.50,
    description: 'Mojito artesanal a elección con pulpa de frutas naturales (Frutilla, Maracuyá o Frutos Rojos), ron y toques de menta.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Jarabe de frutilla', grams: 40 },
      { productName: 'Limón sutil', grams: 40 }
    ],
    accompaniments: ['Vaso alto escarchado', 'Fruta natural macerada', 'Hielo frappé']
  },
  {
    id: 'bar_margarita_horizonte',
    name: 'Margarita del horizonte',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.99,
    description: 'Tequila reposado, triple sec y zumo de limón sutil recién exprimido con borde escarchado de sal marina.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 60 },
      { productName: 'Sal', grams: 5 }
    ],
    accompaniments: ['Copa margarita escarchada', 'Media luna de limón']
  },
  {
    id: 'bar_padrino_cielo_nocturno',
    name: 'Padrino cielo nocturno',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 6.50,
    description: 'Elegante fusión de whisky escocés y licor de amaretto con piel de naranja aromatizada.',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Naranja', grams: 40 }
    ],
    accompaniments: ['Vaso Old Fashioned', 'Hielo esfera cristalino', 'Twist de naranja']
  },
  {
    id: 'bar_ruso_cielo_negro',
    name: 'Ruso cielo negro',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.50,
    description: 'Vodka premium combinado con licor de café artesanal sobre rocas de hielo puro.',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Leche', grams: 30 },
      { productName: 'Cocoa', grams: 10 }
    ],
    accompaniments: ['Vaso corto en las rocas', 'Granos de café tostado']
  },
  {
    id: 'bar_caipirina_bosque',
    name: 'Caipiriña niña del bosque',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.99,
    description: 'Cachaça brasileña macerada con gajos de limón sutil, azúcar morena y toques de frutos del bosque.',
    image: 'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 70 },
      { productName: 'Jarabe de frutilla', grams: 25 }
    ],
    accompaniments: ['Vaso bajo de boca ancha', 'Gajos de limón macerados', 'Hielo frappé']
  },
  {
    id: 'bar_pina_colada',
    name: 'Piña colada',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 6.50,
    description: 'Cremosa mezcla caribeña de ron blanco, crema de coco y zumo natural de piña con cereza marrasquino.',
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Crema de leche', grams: 40 },
      { productName: 'Leche', grams: 40 }
    ],
    accompaniments: ['Copa Huracán', 'Triángulo de piña', 'Cereza al marrasquino']
  },
  {
    id: 'bar_daiquiri',
    name: 'Daiquiri',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.99,
    description: 'Ron blanco, zumo de limón sutil fresco y pulpa de fruta batido frozen a punto de nieve.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 50 },
      { productName: 'Jarabe de frutilla', grams: 35 }
    ],
    accompaniments: ['Copa Coupé helada', 'Borde escarchado', 'Rodaja cítrica']
  },
  {
    id: 'bar_gin_tonic',
    name: 'Gin Tonic',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 6.50,
    description: 'Ginebra aromática premium, agua tónica botánica, bayas de enebro y rodaja de limón sutil.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 40 },
      { productName: 'Romero', grams: 5 }
    ],
    accompaniments: ['Copa Balón con abundante hielo', 'Botánicos de enebro', 'Twist de limón']
  },
  {
    id: 'bar_whisky_rocas',
    name: 'Whisky en las rocas',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.99,
    description: 'Doble medida de whisky seleccionado servido sobre esfera o rocas de hielo puro.',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Naranja', grams: 20 }
    ],
    accompaniments: ['Vaso Old Fashioned de cristal', 'Hielo cristalino']
  },
  {
    id: 'bar_orgasmo',
    name: 'Orgasmo',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.99,
    description: 'Suave y seductor cóctel a base de licor de café, amaretto, crema irlandesa y crema de leche fresca.',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Crema de leche', grams: 50 },
      { productName: 'Leche', grams: 40 },
      { productName: 'Cobertura de chocolate', grams: 15 }
    ],
    accompaniments: ['Copa de cóctel decorada con hilo de chocolate']
  },
  {
    id: 'bar_saltamontes',
    name: 'Saltamontes',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 5.99,
    description: 'Clásico Grasshopper: crema de menta verde, crema de cacao blanca y crema de leche batida.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Crema de leche', grams: 50 },
      { productName: 'Leche', grams: 40 },
      { productName: 'Cocoa', grams: 10 }
    ],
    accompaniments: ['Copa Martini fría', 'Hojas de menta', 'Ralladura de chocolate']
  },
  {
    id: 'bar_martini',
    name: 'Martini',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 7.99,
    description: 'El rey de los cócteles: Ginebra o Vodka dry, vermouth extra dry servido glacial con aceitunas o twist de limón.',
    image: 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 30 }
    ],
    accompaniments: ['Copa Martini helada', 'Aceituna verde sevillana o twist de limón']
  },
  {
    id: 'bar_moscow_mule',
    name: 'Moscow Mule',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 6.50,
    description: 'Vodka, cerveza de jengibre (ginger beer), zumo de limón sutil y menta fresca servido en taza de cobre tradicional.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 50 }
    ],
    accompaniments: ['Taza artesanal de cobre (Mule Mug)', 'Rodaja de limón', 'Menta fresca']
  },
  {
    id: 'bar_negroni',
    name: 'Negroni',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 7.99,
    description: 'El icónico aperitivo italiano: partes iguales de Ginebra, Campari bitter y Vermouth dulce rosso con media luna de naranja.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Naranja', grams: 40 }
    ],
    accompaniments: ['Vaso Old Fashioned', 'Hielo macizo', 'Media luna de naranja fresca']
  },

  // -------------------------------------------------------------
  // 11. BEBIDAS Y JUGOS NATURALES
  // -------------------------------------------------------------
  {
    id: 'beb_jugo_natural',
    name: 'Jugo Natural de Fruta',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 2.50,
    description: 'Jugo natural preparado al instante (Tomate de árbol, Naranja o Limón).',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Tomate de árbol', grams: 100 }
    ],
    accompaniments: ['En agua o leche']
  },
  {
    id: 'beb_limonada_imperial',
    name: 'Limonada Imperial',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 2.50,
    description: 'Limonada refrescante con limón sutil recién exprimido.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 80 }
    ],
    accompaniments: ['Hielo picado', 'Hierbabuena']
  }
];
