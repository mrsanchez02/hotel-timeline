# Hotel Timeline - Sistema de Gestión de Reservas

Una aplicación moderna de gestión de reservas hoteleras construida con React, Bootstrap 5 y DayPilot Scheduler.

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Legend.jsx       # Leyenda de estados de reservas
│   ├── ReservationModal.jsx  # Modal para crear/editar/ver reservas
│   ├── Toolbar.jsx      # Barra de herramientas con botones de acción
│   └── index.js         # Exportaciones de componentes
├── data/
│   └── constants.js     # Datos estáticos (habitaciones, estados, reservas iniciales)
├── hooks/
│   └── useReservations.js  # Hook personalizado para gestión de reservas
├── utils/
│   └── helpers.js       # Funciones auxiliares
├── App.jsx              # Componente principal
├── App.css              # Estilos personalizados
└── main.jsx             # Punto de entrada
```

## 📦 Componentes

### 🏷️ Legend
- **Ubicación**: `src/components/Legend.jsx`
- **Propósito**: Muestra la leyenda con los diferentes estados de las reservas
- **Props**: `statuses` - Objeto con las definiciones de estados

### 🔧 Toolbar
- **Ubicación**: `src/components/Toolbar.jsx`
- **Propósito**: Barra de herramientas con selector de vista y botones de acción
- **Props**: 
  - `view` - Vista actual
  - `onViewChange` - Función para cambiar vista
  - `onNewReservation` - Función para nueva reserva
  - `selectedReservation` - Reserva seleccionada
  - `onViewReservation` - Función para ver reserva
  - `onEditReservation` - Función para editar reserva

### 📝 ReservationModal
- **Ubicación**: `src/components/ReservationModal.jsx`
- **Propósito**: Modal multifuncional para crear, editar y ver reservas
- **Modos**: `'new'`, `'edit'`, `'view'`
- **Características**:
  - Formulario responsivo con Bootstrap
  - Validación de fechas con hora fija (3PM)
  - Estados de solo lectura
  - Badges de estado visual

## 🎣 Hook Personalizado

### useReservations
- **Ubicación**: `src/hooks/useReservations.js`
- **Propósito**: Gestiona todo el estado y lógica de las reservas
- **Funcionalidades**:
  - Estado de reservas (bookings)
  - Gestión de modales
  - Operaciones CRUD
  - Manejo de eventos del scheduler

## 🛠️ Utilidades

### helpers.js
- **Ubicación**: `src/utils/helpers.js`
- **Funcionalidades**:
  - `getStatusVariant()` - Convierte estados a variantes de Bootstrap
  - `formatDateForInput()` - Formatea fechas para inputs HTML

## 📊 Datos

### constants.js
- **Ubicación**: `src/data/constants.js`
- **Contenido**:
  - `rooms` - Definición de habitaciones
  - `statuses` - Estados de reservas con colores
  - `initialBookings` - Datos de ejemplo

## 🎨 Tecnologías Utilizadas

- **React 18** - Framework principal
- **Bootstrap 5** - Sistema de diseño
- **React Bootstrap** - Componentes Bootstrap para React
- **Bootstrap Icons** - Iconografía
- **DayPilot Lite** - Componente de timeline/scheduler
- **Vite** - Herramienta de build

## ✨ Características

- 📱 **Responsive Design** - Adaptable a dispositivos móviles
- 🎯 **Componentes Reutilizables** - Arquitectura modular
- 🎨 **UI Moderna** - Interfaz con Bootstrap 5
- ⚡ **Performance Optimizada** - Hooks personalizados y componentes eficientes
- 🔄 **Estado Centralizado** - Gestión de estado con hooks
- 📅 **Timeline Interactivo** - Drag & drop, resize, y navegación
- 🏷️ **Estados Visuales** - Colores y badges para diferentes estados
- 📝 **CRUD Completo** - Crear, leer, actualizar, eliminar reservas

## 🚀 Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Construir para producción
pnpm build
```

## 📝 Próximas Mejoras

- [ ] Integración con backend/API
- [ ] Autenticación y autorización
- [ ] Filtros avanzados
- [ ] Exportación de datos
- [ ] Notificaciones en tiempo real
- [ ] Tema oscuro/claro
- [ ] Tests unitarios e integración