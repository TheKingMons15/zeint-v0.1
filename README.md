# Control Diario de Inventario - Versión 1 (PWA Responsive)

Sistema integral y responsive para el **control diario de entradas, salidas y existencias de alimentos** (Vegetales, Carnes, Quesos, Yogures, Crema de leche, Lácteos, Otros) diseñado con arquitectura moderna **Mobile First**, soporte completo **PWA** (instalable en Android, iOS y Computadora), **React + Vite**, **Tailwind CSS**, **Firebase** y despliegue continuo en **Netlify**.

---

## 🌟 Características Principales

1. **Diseño Responsive Adaptativo con 3 Vistas**:
   - 📱 **Móvil (320px - 768px)**: Tarjetas interactivas con barra de navegación inferior táctil, chips de categorías y acciones rápidas (+ Entrada / - Salida con 1 toque).
   - 📲 **Tablet (768px - 1200px)**: Cuadrícula dinámica combinada de 2 a 3 columnas con selector de filtros.
   - 💻 **Computadora (1200px+)**: Tabla administrativa completa con ordenamiento por columnas, filtros instantáneos y acciones directas.
2. **Autenticación y Seguridad (Firebase Auth)**:
   - Login, Registro y Recuperación de contraseña.
   - Perfil de usuario con roles (`admin`, `supervisor`, `operator`) y soporte multi-tenant (`companyId`).
   - Modo demostración sin configuración para pruebas inmediatas en 1 clic.
3. **Control Diario de Movimientos (Transacciones Atómicas)**:
   - Registro de **Entradas** (compras, devoluciones, sobrantes) y **Salidas** (ventas, cocina, mermas).
   - Actualización atómica en tiempo real del stock en Firestore (sin inconsistencias de concurrencia).
   - Validación y aviso automático de stock crítico o insuficiente.
4. **Dashboard de Monitoreo en Tiempo Real**:
   - KPIs: Total de productos, Ingresos del día, Salidas del día y Alertas de bajo stock.
   - Feed en vivo de movimientos recientes.
5. **Generador de Reporte Diario Oficial en PDF**:
   - Exportación profesional con **jsPDF** y **AutoTable**.
   - Incluye encabezado institucional, fecha, resumen ejecutivo, tabla detallada de entradas/salidas del día, balance final disponible y líneas de firma para supervisión.
6. **Soporte PWA Offline & Instalable**:
   - Service Worker con Workbox y Web App Manifest.
   - Instalación nativa en cualquier dispositivo.
7. **Preparado para Versión 2**:
   - Arquitectura lista para integración con WhatsApp API, multi-empresa y reportes avanzados.

---

## 📂 Estructura del Proyecto

```
INVENTARIO/
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── maskable-icon-512x512.png
│   ├── apple-touch-icon.png
│   └── _redirects                # Soporte SPA para Netlify
├── src/
│   ├── components/
│   │   ├── common/               # Button, Input, Select, Modal, Badge, Card, StatCard, LoadingSpinner
│   │   ├── layout/               # Navbar, Sidebar, BottomNav, AppLayout
│   │   ├── products/             # ProductFormModal, ProductCard, CategoryFilterBar
│   │   ├── movements/            # MovementModal, MovementHistoryTable
│   │   └── inventory/            # MobileInventoryView, TabletInventoryView, DesktopInventoryView
│   ├── context/
│   │   ├── AuthContext.jsx       # Manejo de sesión y roles
│   │   ├── InventoryContext.jsx  # Sincronización reactiva con Firestore
│   │   └── ToastContext.jsx      # Notificaciones en tiempo real
│   ├── firebase/
│   │   └── config.js             # Configuración modular SDK v10/v11
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useInventory.js
│   │   ├── useResponsive.js      # Detección de breakpoints (Mobile/Tablet/Desktop)
│   │   └── useToast.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── MovementsPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── movementService.js    # Transacciones atómicas de Firestore
│   ├── utils/
│   │   ├── constants.js          # Categorías, unidades y motivos
│   │   ├── formatters.js         # Fechas, horas, cantidades
│   │   └── pdfGenerator.js       # Motor de reportes PDF diarios
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── firestore.rules               # Reglas de seguridad de Firestore
├── firestore.indexes.json        # Índices compuestos de base de datos
├── netlify.toml                  # Configuración de despliegue en Netlify
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Instalación y Puesta en Marcha Local

### 1. Clonar o acceder al proyecto
```bash
cd INVENTARIO
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz (puedes basarte en `.env.example`):
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

VITE_DEFAULT_COMPANY_ID=default_company
VITE_COMPANY_NAME="Control Diario de Inventario"
```

> **Nota**: Si no configuras las credenciales de Firebase, la aplicación entra automáticamente en **Modo Demostración / Offline Local**, permitiéndote probar todas las funciones, crear productos, movimientos y reportes PDF inmediatamente.

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 5. Compilar para producción
```bash
npm run build
```

---

## 🔒 Reglas de Seguridad de Firebase Firestore

Despliega el archivo `firestore.rules` en tu consola de Firebase:
```bash
firebase deploy --only firestore:rules
```

---

## 🌐 Despliegue en Netlify

1. Sube tu código a un repositorio en **GitHub**.
2. Ingresa a [Netlify](https://www.netlify.com/) y selecciona **Add new site** > **Import an existing project** > **GitHub**.
3. Selecciona tu repositorio `INVENTARIO`.
4. La configuración se detectará automáticamente gracias a `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. En **Site configuration** > **Environment variables**, agrega las variables de Firebase (`VITE_FIREBASE_*`).
6. Haz clic en **Deploy Site**. Tu PWA estará en línea con HTTPS y caché optimizado.

---

## 📱 Instalación PWA en Dispositivos

- **Android (Chrome)**: Toca el menú (tres puntos) y presiona **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
- **iOS (Safari)**: Toca el botón **Compartir** y selecciona **"Añadir a pantalla de inicio"**.
- **Computadora (Chrome/Edge)**: Haz clic en el ícono de instalación en la barra de direcciones superior derecha.
