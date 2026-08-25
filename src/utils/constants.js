// Categorías de alimentos para la Versión 1
export const FOOD_CATEGORIES = [
  'Vegetales',
  'Carnes',
  'Quesos',
  'Yogures',
  'Crema de leche',
  'Lácteos',
  'Otros'
];

// Metadatos de categorías (colores y estilos para badges)
export const CATEGORY_META = {
  'Vegetales': {
    color: 'emerald',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    icon: 'Carrot'
  },
  'Carnes': {
    color: 'rose',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    icon: 'Beef'
  },
  'Quesos': {
    color: 'amber',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
    icon: 'Cookie'
  },
  'Yogures': {
    color: 'purple',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    dotClass: 'bg-purple-400',
    icon: 'Milk'
  },
  'Crema de leche': {
    color: 'sky',
    bgClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    dotClass: 'bg-sky-400',
    icon: 'IceCream'
  },
  'Lácteos': {
    color: 'blue',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400',
    icon: 'Milk'
  },
  'Otros': {
    color: 'slate',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    dotClass: 'bg-slate-400',
    icon: 'Box'
  }
};

// Unidades de medida estándar para alimentos
export const MEASUREMENT_UNITS = [
  { value: 'kg', label: 'Kilogramos (kg)', isDecimal: true },
  { value: 'g', label: 'Gramos (g)', isDecimal: false },
  { value: 'l', label: 'Litros (L)', isDecimal: true },
  { value: 'ml', label: 'Mililitros (ml)', isDecimal: false },
  { value: 'unidad', label: 'Unidades (und)', isDecimal: false },
  { value: 'paquete', label: 'Paquetes (paq)', isDecimal: false },
  { value: 'caja', label: 'Cajas (cj)', isDecimal: false },
  { value: 'bolsa', label: 'Bolsas (bls)', isDecimal: false }
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
    'Producción Interna',
    'Otro Ingreso'
  ],
  EXIT: [
    'Venta / Despacho',
    'Consumo en Cocina / Preparación',
    'Merma / Vencimiento',
    'Producto Dañado / Devolución a Proveedor',
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
