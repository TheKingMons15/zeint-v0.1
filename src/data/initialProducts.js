// Lista completa de productos iniciales para el negocio
export const ZENIT_INITIAL_PRODUCTS = [
  // 1. Proteínas
  { name: 'Filete de pollo', category: 'Proteínas', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Filete de res', category: 'Proteínas', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Filete de cerdo', category: 'Proteínas', unit: 'kg', initialStock: 12, minStock: 5 },
  { name: 'Porcion Picaña', category: 'Proteínas', unit: 'kg', initialStock: 10, minStock: 3 },
  { name: 'Matambre', category: 'Proteínas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Tomahawk', category: 'Proteínas', unit: 'UND', initialStock: 10, minStock: 4 },
  { name: 'Costilla', category: 'Proteínas', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Chuletón', category: 'Proteínas', unit: 'kg', initialStock: 10, minStock: 4 },
  { name: 'Chinchulines', category: 'Proteínas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Cuerito', category: 'Proteínas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Chorizo Rojo', category: 'Proteínas', unit: 'kg', initialStock: 10, minStock: 3 },
  { name: 'Chorizo Blanco', category: 'Proteínas', unit: 'kg', initialStock: 10, minStock: 3 },
  { name: 'Morcilla', category: 'Proteínas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Camarón', category: 'Proteínas', unit: 'kg', initialStock: 10, minStock: 3 },
  { name: 'Cuy entero', category: 'Proteínas', unit: 'kg', initialStock: 6, minStock: 2 },

  // 2. Lácteos
  { name: 'Queso mozzarella', category: 'Lácteos', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Queso amasado', category: 'Lácteos', unit: 'kg', initialStock: 10, minStock: 4 },
  { name: 'Crema de leche', category: 'Lácteos', unit: 'litro', initialStock: 10, minStock: 3 },
  { name: 'Leche', category: 'Lácteos', unit: 'litro', initialStock: 20, minStock: 6 },
  { name: 'Helado vainilla', category: 'Lácteos', unit: 'kg', initialStock: 6, minStock: 2 },

  // 3. Embutidos
  { name: 'Tocino', category: 'Embutidos', unit: 'kg', initialStock: 8, minStock: 3 },

  // 4. Verduras
  { name: 'Tomate riñón', category: 'Verduras', unit: 'UND', initialStock: 40, minStock: 15 },
  { name: 'Tomate cherry/tomatillo', category: 'Verduras', unit: 'UND', initialStock: 50, minStock: 20 },
  { name: 'Cebolla blanca', category: 'Verduras', unit: 'UND', initialStock: 35, minStock: 15 },
  { name: 'Cebolla paiteña', category: 'Verduras', unit: 'UND', initialStock: 35, minStock: 15 },
  { name: 'Cebolla larga', category: 'Verduras', unit: 'UND', initialStock: 25, minStock: 10 },
  { name: 'Ajo', category: 'Verduras', unit: 'UND', initialStock: 30, minStock: 10 },
  { name: 'Pimiento verde', category: 'Verduras', unit: 'UND', initialStock: 25, minStock: 10 },
  { name: 'Lechuga', category: 'Verduras', unit: 'UND', initialStock: 20, minStock: 8 },
  { name: 'Repollo', category: 'Verduras', unit: 'UND', initialStock: 15, minStock: 5 },
  { name: 'Zanahoria', category: 'Verduras', unit: 'UND', initialStock: 30, minStock: 10 },
  { name: 'Apio', category: 'Verduras', unit: 'UND', initialStock: 15, minStock: 5 },
  { name: 'Perejil', category: 'Verduras', unit: 'UND', initialStock: 15, minStock: 5 },
  { name: 'Romero', category: 'Verduras', unit: 'kg', initialStock: 3, minStock: 1 },
  { name: 'Champiñones', category: 'Verduras', unit: 'UND', initialStock: 25, minStock: 10 },

  // 5. Papas y carbohidratos
  { name: 'Papa amarilla', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 30, minStock: 10 },
  { name: 'Papa chola', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 40, minStock: 15 },
  { name: 'Papa criolla', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 25, minStock: 10 },
  { name: 'Maduro', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 20, minStock: 8 },
  { name: 'VERDE', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 20, minStock: 8 },
  { name: 'Arroz', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 40, minStock: 15 },
  { name: 'Fréjol', category: 'Papas y carbohidratos', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Arepas', category: 'Papas y carbohidratos', unit: 'unidad', initialStock: 50, minStock: 20 },
  { name: 'Pan francés', category: 'Papas y carbohidratos', unit: 'unidad', initialStock: 60, minStock: 25 },
  { name: 'Pan hamburguesa', category: 'Papas y carbohidratos', unit: 'unidad', initialStock: 50, minStock: 20 },

  // 6. Frutas
  { name: 'Aguacate', category: 'Frutas', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Limón', category: 'Frutas', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Manzana verde', category: 'Frutas', unit: 'kg', initialStock: 10, minStock: 3 },
  { name: 'Piña', category: 'Frutas', unit: 'kg', initialStock: 12, minStock: 4 },

  // 7. Salsas
  { name: 'Chimichurri', category: 'Salsas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Salsa de ajo', category: 'Salsas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Mayonesa', category: 'Salsas', unit: 'kg', initialStock: 10, minStock: 3 },
  { name: 'Salsa de queso', category: 'Salsas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Salsa de piña', category: 'Salsas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Ají', category: 'Salsas', unit: 'kg', initialStock: 8, minStock: 3 },
  { name: 'Vinagretas', category: 'Salsas', unit: 'kg', initialStock: 8, minStock: 3 },

  // 8. Secos y condimentos
  { name: 'Aliño completo en polvo', category: 'Secos y condimentos', unit: 'kg', initialStock: 5, minStock: 2 },
  { name: 'Sal', category: 'Secos y condimentos', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Pimienta', category: 'Secos y condimentos', unit: 'kg', initialStock: 3, minStock: 1 },
  { name: 'Orégano', category: 'Secos y condimentos', unit: 'kg', initialStock: 3, minStock: 1 },
  { name: 'Azúcar', category: 'Secos y condimentos', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Harina', category: 'Secos y condimentos', unit: 'kg', initialStock: 15, minStock: 5 },
  { name: 'Panko', category: 'Secos y condimentos', unit: 'kg', initialStock: 6, minStock: 2 },
  { name: 'Nueces', category: 'Secos y condimentos', unit: 'kg', initialStock: 3, minStock: 1 },

  // 9. Aceites y grasas
  { name: 'Aceite vegetal', category: 'Aceites y grasas', unit: 'litro', initialStock: 15, minStock: 5 },
  { name: 'Aceite de oliva', category: 'Aceites y grasas', unit: 'litro', initialStock: 6, minStock: 2 },
  { name: 'Mantequilla', category: 'Aceites y grasas', unit: 'kg', initialStock: 8, minStock: 3 },

  // 10. Bebidas
  { name: 'Café', category: 'Bebidas', unit: 'kg', initialStock: 6, minStock: 2 },

  // 11. Otros
  { name: 'Huevos', category: 'Otros', unit: 'UND', initialStock: 90, minStock: 30 }
];
