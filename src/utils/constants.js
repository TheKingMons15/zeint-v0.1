// Categorías de alimentos configuradas para el negocio
export const FOOD_CATEGORIES = [
  'Proteínas',
  'Lácteos',
  'Embutidos',
  'Verduras',
  'Papas y carbohidratos',
  'Frutas',
  'Salsas',
  'Secos y condimentos',
  'Aceites y grasas',
  'Bebidas',
  'Otros'
];

// Metadatos de categorías (colores y badges)
export const CATEGORY_META = {
  'Proteínas': {
    color: 'rose',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    icon: 'Beef'
  },
  'Lácteos': {
    color: 'blue',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400',
    icon: 'Milk'
  },
  'Embutidos': {
    color: 'orange',
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    dotClass: 'bg-orange-400',
    icon: 'Flame'
  },
  'Verduras': {
    color: 'emerald',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    icon: 'Carrot'
  },
  'Papas y carbohidratos': {
    color: 'amber',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
    icon: 'Wheat'
  },
  'Frutas': {
    color: 'lime',
    bgClass: 'bg-lime-500/10 text-lime-400 border-lime-500/30',
    dotClass: 'bg-lime-400',
    icon: 'Apple'
  },
  'Salsas': {
    color: 'red',
    bgClass: 'bg-red-500/10 text-red-400 border-red-500/30',
    dotClass: 'bg-red-400',
    icon: 'Soup'
  },
  'Secos y condimentos': {
    color: 'yellow',
    bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    dotClass: 'bg-yellow-400',
    icon: 'Sparkles'
  },
  'Aceites y grasas': {
    color: 'teal',
    bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    dotClass: 'bg-teal-400',
    icon: 'Droplet'
  },
  'Bebidas': {
    color: 'purple',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    dotClass: 'bg-purple-400',
    icon: 'Coffee'
  },
  'Otros': {
    color: 'slate',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    dotClass: 'bg-slate-400',
    icon: 'Box'
  }
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

// Roles de usuario (Preparado para V2)
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  OPERATOR: 'operator'
};
