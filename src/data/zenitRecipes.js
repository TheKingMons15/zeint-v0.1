// =========================================================================
// MENÚ OFICIAL Y FICHAS TÉCNICAS (RECETAS) DE RESTAURANTE ZÉNIT
// Precios oficiales corregidos y actualizados según Carta Oficial Zénit
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
  'Cervezas Artesanales',
  'Bebidas',
  'Cócteles de Altura'
];

export const ZENIT_RECIPES = [
  // -------------------------------------------------------------
  // 1. ENTRADAS NUBES
  // -------------------------------------------------------------
  {
    id: 'ent_coctel_camaron',
    name: 'Cóctel de camarón',
    category: 'Entradas Nubes',
    destination: 'KITCHEN',
    persons: 1,
    price: 4.50,
    description: 'Camarones frescos en salsa cóctel artesanal de la casa con toques cítricos y chips.',
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
    destination: 'KITCHEN',
    persons: 1,
    price: 4.00,
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
    destination: 'KITCHEN',
    persons: 1,
    price: 4.50,
    description: 'Canastillas crocantes de plátano verde rellenas de chorizo artesanal, guacamole y pico de gallo.',
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
    destination: 'KITCHEN',
    persons: 1,
    price: 5.50,
    description: 'Chinchulines dorados a la parrilla servidos sobre maíz tostado y papitas (Presentación en plato negro alfarero).',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Chinchulines', grams: 80 },
      { productName: 'Maíz', grams: 60 },
      { productName: 'Papa super chola', grams: 45 },
      { productName: 'Limón sutil', grams: 20 }
    ],
    accompaniments: ['Plato negro alfarero', 'Maíz tostado crocante', 'Papas doradas', 'Salsa de la casa']
  },

  // -------------------------------------------------------------
  // 2. COMBOS / PICADAS PARRILLA (ESPECIALIDAD DE CARNES AHUMADAS)
  // -------------------------------------------------------------
  {
    id: 'pic_estrella_fugaz',
    name: 'Estrella Fugaz (1 PAX)',
    category: 'Picadas Parrilla',
    destination: 'KITCHEN',
    persons: 1,
    price: 7.99,
    description: 'Picada individual: 2 proteínas a elección (Cerdo al barril, Pollo o Res), chorizo 2 clases, chinchulines, papa salteada y ensalada Waldorf.',
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
    accompaniments: ['Papa salteada', 'Ensalada Waldorf', 'Chimichurri, salsa de ajo y mayonesa']
  },
  {
    id: 'pic_constelacion_sabores',
    name: 'Constelación de Sabores (2 PAX)',
    category: 'Picadas Parrilla',
    destination: 'KITCHEN',
    persons: 2,
    price: 12.99,
    description: 'Picada para 2 personas: 3 proteínas (Cerdo al barril, Pollo y Res), chorizo 3 clases, cuerito asado, papa salteada, 2 arepas y ensalada Waldorf.',
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
    name: 'Fuego del Horizonte (4 PAX)',
    category: 'Picadas Parrilla',
    destination: 'KITCHEN',
    persons: 4,
    price: 16.99,
    description: 'Parrillada para 4 personas: 3 proteínas (Cerdo al barril, Pollo y Res), chorizo 3 clases, chinchulines, cuerito asado, papa salteada, 2 arepas, maduro y ensalada Waldorf.',
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
    accompaniments: ['Papas salteadas', '2 Arepas', 'Maduro asado', 'Ensalada Waldorf', 'Trío de salsas']
  },
  {
    id: 'pic_cumbre_andina',
    name: 'Cumbre Andina Sky Grill (8/10 PAX)',
    category: 'Picadas Parrilla',
    destination: 'KITCHEN',
    persons: 8,
    price: 25.99,
    description: 'El festín supremo para 8 a 10 personas: Cerdo al barril, Pollo, Res, muslitos en salsa bechamel o champiñones, 6 chorizos, chinchulines, cuerito asado, queso amasado, papa salteada, 4 arepas, maduro y ensalada Waldorf.',
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
    accompaniments: ['Papas salteadas', '4 Arepas', 'Queso amasado', 'Maduro asado', 'Ensalada Waldorf', 'Salsas variadas']
  },

  // -------------------------------------------------------------
  // 3. PICADAS PREMIUM
  // -------------------------------------------------------------
  {
    id: 'pic_zenit_prime',
    name: 'Zenit Prime (2/3 PAX)',
    category: 'Picadas Premium',
    destination: 'KITCHEN',
    persons: 3,
    price: 45.00,
    description: 'Picada Premium Zénit: 2 proteínas a elección (Picaña a término, Matambre, Costilla al barril), chorizo 3 clases, papa salteada, 3 arepas, maduro y ensalada Waldorf.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 200 },
      { productName: 'Carne molida de res', grams: 180 },
      { productName: 'Costilla de cerdo', grams: 280 },
      { productName: 'Chorizo Rojo', grams: 60 },
      { productName: 'Chorizo Blanco', grams: 60 },
      { productName: 'Papa super chola', grams: 350 },
      { productName: 'Plátano maduro', grams: 120 },
      { productName: 'Arepas pequeñas', grams: 80 },
      { productName: 'Lechuga crespa', grams: 100 }
    ],
    accompaniments: ['Papa salteada', '3 Arepas', 'Maduro asado', 'Ensalada Waldorf', 'Trío de salsas (Chimichurri, ajo, mayonesa)']
  },

  // -------------------------------------------------------------
  // 4. CORTES DE CARNE (INCLUYEN BEBIDA: COPA DE VINO, CERVEZA O GASEOSA)
  // -------------------------------------------------------------
  {
    id: 'cor_picanha_suprema',
    name: 'Picaña Suprema del Horizonte',
    category: 'Cortes de carne',
    destination: 'KITCHEN',
    persons: 1,
    price: 15.99,
    description: 'Picaña a la parrilla con papa francesa o gratinada, ensalada Waldorf y decoración con espárragos, tomatillo y romero. Incluye copa de vino, cerveza o gaseosa.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 200 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Tomate riñón', grams: 40 },
      { productName: 'Romero', grams: 5 }
    ],
    accompaniments: ['Papa francesa o papa gratinada', 'Ensalada Waldorf', 'Espárragos y tomatillo', 'Copa de vino, cerveza o gaseosa']
  },
  {
    id: 'cor_matambre',
    name: 'Matambre a la Brasa',
    category: 'Cortes de carne',
    destination: 'KITCHEN',
    persons: 1,
    price: 12.99,
    description: 'Corte de matambre dorado con hierbas finas, papa francesa o gratinada y ensalada Waldorf. Incluye copa de vino, cerveza o gaseosa.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 180 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Tomate riñón', grams: 40 }
    ],
    accompaniments: ['Papa francesa o gratinada', 'Ensalada Waldorf', 'Copa de vino, cerveza o gaseosa']
  },
  {
    id: 'cor_tomahawk',
    name: 'Tomahawk Steak',
    category: 'Cortes de carne',
    destination: 'KITCHEN',
    persons: 1,
    price: 19.99,
    description: 'Corte Tomahawk con hueso a la leña, papa francesa o gratinada, ensalada Waldorf y decoración con espárragos y romero. Incluye copa de vino, cerveza o gaseosa.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Tomahawk', grams: 300 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Romero', grams: 5 },
      { productName: 'Lechuga crespa', grams: 60 }
    ],
    accompaniments: ['Papa francesa o gratinada', 'Ensalada Waldorf', 'Espárragos y tomatillo', 'Copa de vino, cerveza o gaseosa']
  },

  // -------------------------------------------------------------
  // 5. DE LAS ALTURAS (INDIVIDUAL 1 PAX)
  // -------------------------------------------------------------
  {
    id: 'alt_chicharron',
    name: 'Chicharrón Crocante',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 6.50,
    description: 'Chicharrón crujiente acompañado de papa salteada, guacamole fresco, maduro frito y pico de gallo.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Cuerito', grams: 180 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Plátano maduro', grams: 100 },
      { productName: 'Aguacate', grams: 40 },
      { productName: 'Tomate riñón', grams: 40 },
      { productName: 'Cebolla colorada', grams: 40 }
    ],
    accompaniments: ['Papa salteada', 'Guacamole fresco', 'Maduro frito', 'Pico de gallo']
  },
  {
    id: 'alt_costilla_barril_res',
    name: 'Costilla al barril de res',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 7.99,
    description: 'Costilla de res ahumada tierna al barril con papa a la francesa o papa salteada y ensalada fresca.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Costilla de cerdo', grams: 350 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 }
    ],
    accompaniments: ['Papa francesa o papa salteada', 'Ensalada fresca', 'Ají de la casa']
  },
  {
    id: 'alt_costilla_barril_cerdo',
    name: 'Costilla al barril de cerdo',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 8.50,
    description: 'Costilla de cerdo ahumada al barril con papa a la francesa o papa salteada y ensalada.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Costilla de cerdo', grams: 400 },
      { productName: 'Papa super chola', grams: 180 },
      { productName: 'Lechuga crespa', grams: 60 }
    ],
    accompaniments: ['Papa francesa o papa salteada', 'Ensalada', 'Salsa parrillera']
  },
  {
    id: 'alt_pollo_chorizo_barril',
    name: 'Filete de pollo y chorizo al barril',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 5.50,
    description: 'Filete de pechuga de pollo y chorizo artesanal al barril con papa francesa o salteada y ensalada.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 150 },
      { productName: 'Chorizo Rojo', grams: 70 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Lechuga crespa', grams: 50 }
    ],
    accompaniments: ['Papa francesa o salteada', 'Ensalada', 'Salsa de ajo']
  },
  {
    id: 'alt_res_chorizo_barril',
    name: 'Filete de Res y chorizo al barril',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 5.50,
    description: 'Filete de res jugoso y chorizo ahumado al barril con papa francesa o salteada y ensalada.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 150 },
      { productName: 'Chorizo Rojo', grams: 70 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Lechuga crespa', grams: 50 }
    ],
    accompaniments: ['Papa francesa o salteada', 'Ensalada', 'Chimichurri']
  },
  {
    id: 'alt_chuleton_chorizo',
    name: 'Chuletón y chorizo',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 5.50,
    description: 'Chuletón a la brasa y chorizo parrillero acompañado de papa a la francesa o papa salteada y ensalada.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de cerdo', grams: 200 },
      { productName: 'Chorizo Rojo', grams: 70 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Lechuga crespa', grams: 50 }
    ],
    accompaniments: ['Papa francesa o salteada', 'Ensalada fresca']
  },
  {
    id: 'alt_brochetas_cielo',
    name: 'Brochetas del cielo',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 6.50,
    description: 'Brochetas con 2 clases de carne (res, pollo o cerdo), 2 ensaladas con vinagretas, 3 papas cocidas bañadas en salsa de queso fría y mayonesa verde.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de res', grams: 80 },
      { productName: 'Filete de pechuga de pollo', grams: 70 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Queso mozzarella', grams: 40 },
      { productName: 'Lechuga crespa', grams: 80 }
    ],
    accompaniments: ['3 Papas cocidas en salsa de queso fría', 'Dos ensaladas con vinagreta', 'Mayonesa verde']
  },
  {
    id: 'alt_pollo_salsa_pina',
    name: 'Filete de Pollo salsa piña',
    category: 'De las Alturas',
    destination: 'KITCHEN',
    persons: 1,
    price: 5.50,
    description: 'Filete de pechuga bañado en reducción de salsa de piña artesanal acompañado de papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 180 },
      { productName: 'Papa super chola', grams: 150 }
    ],
    accompaniments: ['Papas a la francesa', 'Salsa de piña']
  },

  // -------------------------------------------------------------
  // 6. BAJO RESERVA (CUY)
  // -------------------------------------------------------------
  {
    id: 'res_cuy_entero',
    name: 'Cuy Zénit crocante entero',
    category: 'Bajo reserva',
    destination: 'KITCHEN',
    persons: 1,
    price: 20.00,
    description: 'Cuy tradicional entero crocante asado a la brasa con 10 papas cocidas, sarsa de cuy, ensalada y ají.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Cuy', grams: 600 },
      { productName: 'Papa super chola', grams: 350 },
      { productName: 'Lechuga crespa', grams: 80 },
      { productName: 'Ají rocoto', grams: 25 }
    ],
    accompaniments: ['10 Papas cocidas', 'Sarsa de cuy', 'Ensalada clásica', 'Ají casero']
  },
  {
    id: 'res_cuarto_cuy',
    name: 'Cuartos de cuy',
    category: 'Bajo reserva',
    destination: 'KITCHEN',
    persons: 1,
    price: 10.00,
    description: 'Porción de cuarto de cuy crocante con 2 papas cocidas, sarsa de cuy, ensalada y ají.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Cuy', grams: 160 },
      { productName: 'Papa super chola', grams: 120 },
      { productName: 'Lechuga crespa', grams: 60 },
      { productName: 'Ají rocoto', grams: 20 }
    ],
    accompaniments: ['2 Papas cocidas', 'Sarsa de cuy', 'Ensalada', 'Ají']
  },

  // -------------------------------------------------------------
  // 7. BANDEJA PAISA
  // -------------------------------------------------------------
  {
    id: 'ban_bandeja_paisa',
    name: 'Bandeja Paisa Zénit',
    category: 'Bandeja Paisa',
    destination: 'KITCHEN',
    persons: 1,
    price: 9.99,
    description: 'Chicharrón, chorizo, carne (molida o lomo al barril res/cerdo/pollo), maduro frito, arroz, huevo frito, aguacate, frijolada y arepa.',
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
    accompaniments: ['Chicharrón', 'Chorizo', 'Arroz blanco', 'Frijolada', 'Huevo frito', 'Aguacate', 'Maduro', 'Arepa']
  },

  // -------------------------------------------------------------
  // 8. PEQUEÑOS ASTROS (MENÚ INFANTIL)
  // -------------------------------------------------------------
  {
    id: 'ast_hamburguesa',
    name: 'Hamburguesa con Mermelada de Tocino',
    category: 'Pequeños Astros',
    destination: 'KITCHEN',
    persons: 1,
    price: 5.50,
    description: 'Hamburguesa casera con mermelada de tocino, champiñones, queso derretido y papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Carne molida de res', grams: 100 },
      { productName: 'Champiñones', grams: 30 },
      { productName: 'Papa super chola', grams: 120 },
      { productName: 'Queso mozzarella', grams: 30 }
    ],
    accompaniments: ['Mermelada de tocino y champiñones', 'Papas a la francesa']
  },
  {
    id: 'ast_choripapa',
    name: 'Choripapa orbitales',
    category: 'Pequeños Astros',
    destination: 'KITCHEN',
    persons: 1,
    price: 4.50,
    description: 'Chorizo parrillero picado con papas a la francesa, guacamole fresco y queso fundido.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Chorizo Rojo', grams: 100 },
      { productName: 'Papa super chola', grams: 150 },
      { productName: 'Aguacate', grams: 30 },
      { productName: 'Queso mozzarella', grams: 30 }
    ],
    accompaniments: ['Papas a la francesa', 'Guacamole', 'Queso fundido']
  },
  {
    id: 'ast_deditos_pollo',
    name: 'Deditos de pollo galácticos',
    category: 'Pequeños Astros',
    destination: 'KITCHEN',
    persons: 1,
    price: 4.50,
    description: 'Tiras de pollo apanadas en panko crocante con papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 120 },
      { productName: 'Papa super chola', grams: 100 }
    ],
    accompaniments: ['Apanado en panko', 'Papas a la francesa', 'Salsas']
  },
  {
    id: 'ast_mini_brochetas',
    name: 'Mini brochetas del cielo',
    category: 'Pequeños Astros',
    destination: 'KITCHEN',
    persons: 1,
    price: 4.50,
    description: 'Mini brochetas de res o pollo con tocino decorativo acompañadas de papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 110 },
      { productName: 'Papa super chola', grams: 100 }
    ],
    accompaniments: ['Papas a la francesa', 'Salsa suave']
  },
  {
    id: 'ast_sanduche_pollo',
    name: 'Sánduche de pollo',
    category: 'Pequeños Astros',
    destination: 'KITCHEN',
    persons: 1,
    price: 3.99,
    description: 'Sánduche artesanal de pollo desmenuzado con vegetales y papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Filete de pechuga de pollo', grams: 90 },
      { productName: 'Papa super chola', grams: 100 },
      { productName: 'Lechuga crespa', grams: 20 }
    ],
    accompaniments: ['Pan artesanal', 'Papas a la francesa']
  },
  {
    id: 'ast_maduro_gratinado',
    name: 'Maduro gratinado',
    category: 'Pequeños Astros',
    destination: 'KITCHEN',
    persons: 1,
    price: 3.50,
    description: 'Plátano maduro al horno con carne al barril (res, pollo o cerdo), chorizos, salsa verde y queso mozzarella derretido.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Plátano maduro', grams: 155 },
      { productName: 'Carne molida de res', grams: 60 },
      { productName: 'Chorizo Rojo', grams: 50 },
      { productName: 'Queso mozzarella', grams: 40 }
    ],
    accompaniments: ['Maduro al horno', 'Salsa verde', 'Queso mozzarella gratinado']
  },

  // -------------------------------------------------------------
  // 9. POSTRES "NUBES DULCES"
  // -------------------------------------------------------------
  {
    id: 'pos_cheesecake',
    name: 'Cheesecake del cielo (Maracuyá o Frutos Rojos)',
    category: 'Postres',
    destination: 'KITCHEN',
    persons: 1,
    price: 3.50,
    description: 'Cremoso cheesecake artesanal con coulis a elección: maracuyá o frutos rojos.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Queso mozzarella', grams: 60 },
      { productName: 'Leche', grams: 40 },
      { productName: 'Jarabe de frutilla', grams: 25 }
    ],
    accompaniments: ['Coulis de maracuyá o frutos rojos']
  },
  {
    id: 'pos_brownie_volcanico',
    name: 'Brownie volcánico con helado de vainilla',
    category: 'Postres',
    destination: 'KITCHEN',
    persons: 1,
    price: 3.50,
    description: 'Brownie de chocolate tibio con centro fundente y bola de helado de vainilla.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Cobertura de chocolate', grams: 35 },
      { productName: 'Mantequilla', grams: 30 },
      { productName: 'Huevos', grams: 50 },
      { productName: 'Leche', grams: 30 }
    ],
    accompaniments: ['Bola de helado de vainilla', 'Sirope de chocolate']
  },
  {
    id: 'pos_miel_quesillo',
    name: 'Postre típico andino miel con quesillo',
    category: 'Postres',
    destination: 'KITCHEN',
    persons: 1,
    price: 2.00,
    description: 'Quesillo fresco andino bañado en miel de panela aromatizada tradicional.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Queso amasado', grams: 120 }
    ],
    accompaniments: ['Miel de caña aromatizada', 'Quesillo andino']
  },

  // -------------------------------------------------------------
  // 10. BEBIDAS DEL CIELO
  // -------------------------------------------------------------
  {
    id: 'beb_limonada_clasica',
    name: 'Limonada Zénit clásica',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 1.50,
    description: 'Limonada refrescante con limón sutil recién exprimido y hielo.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 60 }
    ],
    accompaniments: ['Hielo picado', 'Rodaja de limón']
  },
  {
    id: 'beb_limonada_menta',
    name: 'Limonada de menta y hierbabuena del cielo',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 2.00,
    description: 'Limonada fresca macerada con hojas de menta y hierbabuena de altura.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 60 }
    ],
    accompaniments: ['Hojas de menta y hierbabuena', 'Hielo frappé']
  },
  {
    id: 'beb_limonada_frutos_rojos',
    name: 'Limonada de frutos rojos aurora',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 2.00,
    description: 'Limonada infusionada con pulpa de frutos rojos y sirope artesanal.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Limón sutil', grams: 50 },
      { productName: 'Jarabe de frutilla', grams: 30 }
    ],
    accompaniments: ['Frutos rojos', 'Hielo frappé']
  },
  {
    id: 'beb_jugo_natural_andino',
    name: 'Jugo natural andino (Mora / Naranjilla / Maracuyá / Tomate)',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 2.00,
    description: 'Jugo natural preparado al instante con frutas andinas frescas (en agua o en leche).',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Tomate de árbol', grams: 100 }
    ],
    accompaniments: ['En agua o leche', 'Hielo']
  },
  {
    id: 'beb_gaseosas',
    name: 'Gaseosas Personales',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 1.50,
    description: 'Variedad de gaseosas en presentación personal.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    ingredients: [],
    accompaniments: ['Vaso con hielo y limón']
  },
  {
    id: 'beb_agua_mineral',
    name: 'Agua mineral / Agua con gas',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 1.00,
    description: 'Agua mineral natural o con gas.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    ingredients: [],
    accompaniments: ['Vaso con hielo']
  },
  {
    id: 'beb_chicha_casa',
    name: 'Chicha de la casa',
    category: 'Bebidas',
    destination: 'BAR',
    persons: 1,
    price: 1.50,
    description: 'Chicha tradicional artesanal de maíz fermentada de la casa.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Maíz', grams: 80 }
    ],
    accompaniments: ['Vaso tradicional de barro o cristal']
  },

  // -------------------------------------------------------------
  // 11. CÓCTELES DE ALTURA (BAR & COCTELERÍA)
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
  {
    id: 'bar_tinto_verano',
    name: 'Tinto de Verano',
    category: 'Cócteles de Altura',
    destination: 'BAR',
    persons: 1,
    price: 4.99,
    description: 'Vino tinto joven combinado con gaseosa de limón, rodajas de naranja fresca y abundante hielo.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
    ingredients: [
      { productName: 'Naranja', grams: 40 },
      { productName: 'Limón sutil', grams: 20 }
    ],
    accompaniments: ['Copa de vino con hielo', 'Rodajas de naranja y limón']
  },

  // -------------------------------------------------------------
  // 12. CERVEZAS ARTESANALES & BAR (CARTA OFICIAL ZÉNIT DEL PDF)
  // -------------------------------------------------------------
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

