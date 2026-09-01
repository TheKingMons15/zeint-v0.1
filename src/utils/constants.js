// Categorías exclusivas de Cocina (Alimentos, Insumos, Proteínas, Verduras)
export const KITCHEN_CATEGORIES = [
  'Proteínas',
  'Lácteos',
  'Embutidos',
  'Verduras',
  'Papas y carbohidratos',
  'Frutas',
  'Salsas',
  'Secos y condimentos',
  'Aceites y grasas',
  'Otros'
];

// Categorías exclusivas de Bar (Licores, Vinos, Cervezas, Aguas, Gaseosas, Coctelería)
export const BAR_CATEGORIES = [
  'Licores & Destilados',
  'Vinos & Cervezas',
  'Aguas, Gaseosas & Bebidas',
  'Cócteles & Jarabes',
  'Bebidas'
];

// Catálogo completo de categorías para selector general
export const FOOD_CATEGORIES = [
  ...KITCHEN_CATEGORIES,
  ...BAR_CATEGORIES
];

// Metadatos de categorías (colores y badges)
export const CATEGORY_META = {
  // Cocina
  'Proteínas': {
    color: 'rose',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    icon: 'Beef',
    area: 'COCINA'
  },
  'Lácteos': {
    color: 'blue',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400',
    icon: 'Milk',
    area: 'COCINA'
  },
  'Embutidos': {
    color: 'orange',
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    dotClass: 'bg-orange-400',
    icon: 'Flame',
    area: 'COCINA'
  },
  'Verduras': {
    color: 'emerald',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    icon: 'Carrot',
    area: 'COCINA'
  },
  'Papas y carbohidratos': {
    color: 'amber',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
    icon: 'Wheat',
    area: 'COCINA'
  },
  'Frutas': {
    color: 'lime',
    bgClass: 'bg-lime-500/10 text-lime-400 border-lime-500/30',
    dotClass: 'bg-lime-400',
    icon: 'Apple',
    area: 'COCINA'
  },
  'Salsas': {
    color: 'red',
    bgClass: 'bg-red-500/10 text-red-400 border-red-500/30',
    dotClass: 'bg-red-400',
    icon: 'Soup',
    area: 'COCINA'
  },
  'Secos y condimentos': {
    color: 'yellow',
    bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    dotClass: 'bg-yellow-400',
    icon: 'Sparkles',
    area: 'COCINA'
  },
  'Aceites y grasas': {
    color: 'teal',
    bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    dotClass: 'bg-teal-400',
    icon: 'Droplet',
    area: 'COCINA'
  },
  'Otros': {
    color: 'slate',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    dotClass: 'bg-slate-400',
    icon: 'Box',
    area: 'COCINA'
  },
  // Bar
  'Licores & Destilados': {
    color: 'purple',
    bgClass: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    dotClass: 'bg-purple-400',
    icon: 'Wine',
    area: 'BAR'
  },
  'Vinos & Cervezas': {
    color: 'amber',
    bgClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    dotClass: 'bg-amber-400',
    icon: 'Beer',
    area: 'BAR'
  },
  'Aguas, Gaseosas & Bebidas': {
    color: 'sky',
    bgClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    dotClass: 'bg-sky-400',
    icon: 'Droplets',
    area: 'BAR'
  },
  'Cócteles & Jarabes': {
    color: 'pink',
    bgClass: 'bg-pink-500/15 text-pink-300 border-pink-500/40',
    dotClass: 'bg-pink-400',
    icon: 'Sparkles',
    area: 'BAR'
  },
  'Bebidas': {
    color: 'purple',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    dotClass: 'bg-purple-400',
    icon: 'Coffee',
    area: 'BAR'
  }
};

// Helper: Determinar si un producto o insumo pertenece a la Barra / Licores
export const isBarProduct = (product) => {
  if (!product) return false;
  const loc = (product.location || '').toLowerCase();
  if (loc.includes('bar') || loc.includes('barra')) return true;
  const cat = (product.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return (
    cat.includes('licor') ||
    cat.includes('destilado') ||
    cat.includes('vino') ||
    cat.includes('cerveza') ||
    cat.includes('coctel') ||
    cat.includes('cocktail') ||
    cat.includes('bebida') ||
    cat.includes('agua') ||
    cat.includes('gaseosa') ||
    cat.includes('refresco') ||
    cat.includes('jarabe')
  );
};

// Helper: Determinar si un producto o insumo pertenece a la Cocina / Comida
export const isKitchenProduct = (product) => {
  return !isBarProduct(product);
};

// Unidades de medida estándar para el negocio
export const MEASUREMENT_UNITS = [
  { value: 'kg', label: 'Kilogramos (kg)', isDecimal: true },
  { value: 'UND', label: 'Unidades (UND)', isDecimal: false },
  { value: 'litro', label: 'Litros (litro)', isDecimal: true },
  { value: 'g', label: 'Gramos (g)', isDecimal: false },
  { value: 'ml', label: 'Mililitros (ml)', isDecimal: false },
  { value: 'unidad', label: 'Unidades (und)', isDecimal: false },
  { value: 'paquete', label: 'Paquetes (paq)', isDecimal: false },
  { value: 'caja', label: 'Cajas (cj)', isDecimal: false }
];

// Tipos de movimiento y motivos estándar
export const MOVEMENT_TYPES = {
  ENTRY: {
    value: 'ENTRY',
    label: 'Entrada',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: 'ArrowDownLeft'
  },
  EXIT: {
    value: 'EXIT',
    label: 'Salida',
    color: 'rose',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: 'ArrowUpRight'
  }
};

export const MOVEMENT_REASONS = {
  ENTRY: [
    'Compra a Proveedor',
    'Devolución de Cliente',
    'Ajuste de Inventario (Sobrante)',
    'Producción Interna / Cocina',
    'Otro Ingreso'
  ],
  EXIT: [
    'Venta / Despacho a Mesa',
    'Consumo en Cocina / Preparación',
    'Merma / Vencimiento',
    'Producto Dañado / Devolución',
    'Ajuste de Inventario (Faltante)',
    'Otra Salida'
  ]
};

// Roles de usuario del Restaurante Zénit
export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  OPERATOR: 'operator',
  MESERO: 'MESERO'
};

// Lista oficial de mesas y estaciones de atención en Sala Zénit (21 Mesas + Barras + Terrazas)
export const ALL_RESTAURANT_TABLES = [
  'Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5',
  'Mesa 6', 'Mesa 7', 'Mesa 8', 'Mesa 9', 'Mesa 10',
  'Mesa 11', 'Mesa 12', 'Mesa 13', 'Mesa 14', 'Mesa 15',
  'Mesa 16', 'Mesa 17', 'Mesa 18', 'Mesa 19', 'Mesa 20',
  'Mesa 21', 'Barra 1', 'Barra 2', 'Terraza 1', 'Terraza 2'
];

// Helper de Autorización Estricta: Exclusivo Wladimir y Karen (y Administración)
export const isAuthorizedBillingUser = (user) => {
  if (!user) return true; // Por defecto en entorno activo permite acceso administrativo
  const emailLower = (user.email || '').toLowerCase().trim();
  const nameLower = (user.displayName || '').toLowerCase().trim();
  const roleLower = (user.role || '').toLowerCase().trim();

  // Wladimir
  if (emailLower.includes('wladimir') || nameLower.includes('wladimir') || emailLower === 'wladimir@zenit.com') {
    return true;
  }
  // Karen
  if (emailLower.includes('karen') || nameLower.includes('karen') || emailLower === 'karenadmin@zenit.com') {
    return true;
  }
  // Master / Superadmin / Administrador / Supervisor
  if (user.isSuperAdmin || roleLower === 'superadmin' || emailLower === 'master@zenit.com' || roleLower === 'admin' || roleLower === 'supervisor') {
    return true;
  }
  // Si no es mesero, cocina o bar exclusivo, se considera usuario administrativo
  if (roleLower !== 'mesero' && roleLower !== 'cocina' && roleLower !== 'bar') {
    return true;
  }
  return false;
};

