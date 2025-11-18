# 🎨 Guía de UI/UX - Sarident HCO

## 📊 Resumen

Este proyecto implementa las mejores prácticas modernas de UI/UX para ofrecer una experiencia de usuario excepcional en un sistema de historias clínicas odontológicas.

---

## ✨ Componentes UI Modernos Implementados

### 1. Componentes Base (shadcn/ui)

Todos los componentes están basados en Radix UI con estilos de Tailwind CSS:

#### Componentes de Interacción
- ✅ **Button** - 6 variantes (default, destructive, outline, secondary, ghost, link)
- ✅ **Input** - Con focus states y validación
- ✅ **Textarea** - Para texto multilínea
- ✅ **Select** - Menús desplegables accesibles
- ✅ **Checkbox** - Con estados indeterminados
- ✅ **Switch** - Toggle moderno
- ✅ **Dialog** - Modales con backdrop
- ✅ **Dropdown Menu** - Menús contextuales

#### Componentes de Feedback
- ✅ **Toast** - Notificaciones temporales
- ✅ **Alert** - Alertas con 5 variantes (default, destructive, success, warning, info)
- ✅ **Progress** - Barras de progreso animadas
- ✅ **Spinner** - Indicadores de carga
- ✅ **Loading Overlay** - Overlay de carga full-screen
- ✅ **Badge** - 6 variantes (default, secondary, destructive, outline, success, warning, info)

#### Componentes de Visualización
- ✅ **Card** - Contenedores con sombra
- ✅ **Avatar** - Imágenes de perfil con fallback
- ✅ **Tabs** - Navegación por pestañas
- ✅ **Skeleton** - Placeholders de carga
- ✅ **Empty State** - Estados vacíos con iconos y acciones

#### Componentes de Layout
- ✅ **Scroll Area** - Áreas de scroll personalizadas
- ✅ **Sheet** - Paneles laterales deslizantes (mobile)
- ✅ **Label** - Etiquetas accesibles

---

## 🎭 Animaciones y Transiciones

### Animaciones Implementadas

```css
/* Fade */
animate-fade-in          /* Aparición suave (0.3s) */

/* Scale */
animate-scale-in         /* Zoom in (0.2s) */
animate-scale-out        /* Zoom out (0.2s) */

/* Slide */
animate-slide-in-from-bottom  /* Deslizar desde abajo (0.3s) */

/* Shimmer */
animate-shimmer          /* Efecto shimmer para skeleton (2s) */

/* Spin */
animate-spin             /* Rotación continua */
animate-spin-slow        /* Rotación lenta (3s) */

/* Pulse */
animate-pulse            /* Pulsación estándar */
animate-pulse-slow       /* Pulsación lenta (3s) */

/* Accordion */
animate-accordion-down   /* Expansión de accordion (0.2s) */
animate-accordion-up     /* Colapso de accordion (0.2s) */
```

### Cuándo Usar Cada Animación

- **fade-in**: Aparición de modales, overlays, nuevos elementos
- **scale-in**: Apertura de popups, menús contextuales
- **slide-in**: Aparición de sidebars, notificaciones
- **shimmer**: Skeleton loaders durante carga de datos
- **spin**: Indicadores de carga activos
- **pulse**: Llamar atención a elementos importantes

---

## 🎨 Sistema de Colores

### Paleta Semántica

```css
/* Colores Primarios */
--primary          /* Acción principal (azul/verde) */
--secondary        /* Acciones secundarias (gris) */
--accent           /* Acentos y highlights */

/* Estados */
--destructive      /* Errores y acciones peligrosas (rojo) */
--success          /* Éxito (verde) */
--warning          /* Advertencias (amarillo) */
--info             /* Información (azul) */

/* UI */
--background       /* Fondo de la app */
--foreground       /* Texto principal */
--muted            /* Texto secundario */
--border           /* Bordes */
--ring             /* Focus rings */

/* Componentes */
--card             /* Fondos de tarjetas */
--popover          /* Fondos de popovers */
```

### Dark Mode

El proyecto soporta dark mode automático:
- Detecta preferencia del sistema
- Toggle manual disponible
- Todos los componentes adaptan sus colores
- Transiciones suaves entre temas

---

## 📱 Diseño Responsivo

### Breakpoints

```css
sm:   640px   /* Teléfonos grandes */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Pantallas grandes */
```

### Estrategia Mobile-First

1. **Layout adaptativo**
   - Sidebar colapsable en móvil (Sheet)
   - Grid responsivo (1→2→3 columnas)
   - Stack vertical en mobile

2. **Touch-friendly**
   - Áreas táctiles mínimas de 44x44px
   - Espaciado generoso en mobile
   - Gestos intuitivos (swipe, tap)

3. **Performance**
   - Lazy loading de rutas
   - Code splitting automático
   - Imágenes optimizadas

---

## ♿ Accesibilidad (a11y)

### Implementado

✅ **ARIA Labels** - Todos los componentes interactivos
✅ **Roles Semánticos** - button, link, alert, status, etc.
✅ **Focus Visible** - Indicadores de teclado claros
✅ **Color Contrast** - WCAG AA compliant
✅ **Screen Reader** - Textos alternativos y descripciones
✅ **Keyboard Navigation** - Tab, Enter, Escape, flechas
✅ **Error Handling** - Mensajes descriptivos y útiles

### Estándares

- **WCAG 2.1 Level AA** compliance
- **ARIA 1.2** patterns
- **Semantic HTML5**

---

## 🚀 Optimizaciones de Performance

### Renderizado

```typescript
// Lazy loading de rutas
const HomePage = lazy(() => import('@/pages/HomePage'))
const PacientesPage = lazy(() => import('@/pages/PacientesPage'))

// Suspense con fallback
<Suspense fallback={<LoadingPage />}>
  <Outlet />
</Suspense>
```

### Debouncing

```typescript
// Búsqueda optimizada
const debouncedSearch = useDebounce(searchTerm, 300)
```

### Memoization

- Componentes complejos con `React.memo()`
- Callbacks con `useCallback()`
- Valores computados con `useMemo()`

---

## 🎯 Patrones de UX

### 1. Estados de Carga

```tsx
// Skeleton mientras carga
{isLoading ? (
  <PacienteListSkeleton />
) : (
  <PacienteList data={pacientes} />
)}
```

### 2. Estados Vacíos

```tsx
// Empty state con acción
{pacientes.length === 0 && (
  <EmptyState
    title="No hay pacientes"
    description="Comienza agregando tu primer paciente"
    action={{
      label: "Agregar Paciente",
      onClick: handleAdd
    }}
  />
)}
```

### 3. Feedback Inmediato

```tsx
// Toast para acciones
toast({
  title: "Paciente guardado",
  description: "Los cambios se han guardado exitosamente",
})
```

### 4. Confirmaciones

```tsx
// Dialog para acciones destructivas
<AlertDialog>
  <AlertDialogTitle>¿Eliminar paciente?</AlertDialogTitle>
  <AlertDialogDescription>
    Esta acción no se puede deshacer
  </AlertDialogDescription>
</AlertDialog>
```

### 5. Progress Indicators

```tsx
// Barra de progreso para procesos largos
<Progress value={uploadProgress} className="w-full" />
```

---

## 📐 Espaciado y Tipografía

### Sistema de Espaciado (Tailwind)

```css
p-1   /* 0.25rem - 4px */
p-2   /* 0.5rem  - 8px */
p-4   /* 1rem    - 16px */
p-6   /* 1.5rem  - 24px */
p-8   /* 2rem    - 32px */
```

### Jerarquía de Texto

```css
text-xs    /* 0.75rem - 12px */
text-sm    /* 0.875rem - 14px */
text-base  /* 1rem - 16px */
text-lg    /* 1.125rem - 18px */
text-xl    /* 1.25rem - 20px */
text-2xl   /* 1.5rem - 24px */
text-3xl   /* 1.875rem - 30px */
```

---

## 🎪 Microinteracciones

### Hover Effects

```tsx
// Hover suave en botones
className="hover:bg-primary/90 transition-colors"

// Scale en hover
className="hover:scale-105 transition-transform"

// Sombra en hover
className="hover:shadow-lg transition-shadow"
```

### Focus States

```tsx
// Focus ring visible
className="focus-visible:ring-2 focus-visible:ring-ring"
```

### Active States

```tsx
// Press effect
className="active:scale-95 transition-transform"
```

---

## 📋 Componentes Personalizados

### LoadingSpinner

```tsx
<LoadingSpinner size="lg" />
<LoadingPage /> // Full page
<LoadingOverlay message="Guardando..." />
```

### Skeleton Loaders

```tsx
<PacienteCardSkeleton />
<PacienteListSkeleton />
<TableSkeleton rows={10} columns={5} />
```

### Error Boundary

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 🎨 Temas y Personalización

### Variables CSS

Ubicación: `src/index.css`

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... más variables */
}

.dark {
  --primary: 210 40% 98%;
  --secondary: 217.2 32.6% 17.5%;
  /* ... más variables dark */
}
```

### Personalización

Para cambiar colores del tema, edita las variables CSS en `src/index.css`.
Los componentes se adaptarán automáticamente.

---

## 📊 Métricas de UX

### Tiempos de Respuesta

- **Feedback inmediato**: < 100ms
- **Respuesta rápida**: < 1s
- **Carga de página**: < 3s
- **Animaciones**: 200-300ms

### Tamaños Mínimos

- **Touch targets**: 44x44px
- **Texto legible**: 16px+
- **Spacing**: 8px mínimo

---

## 🔧 Herramientas de Desarrollo

### UI Development

```bash
npm run dev          # Desarrollo con hot reload
npm run storybook    # Component explorer (si configurado)
```

### Testing

```bash
npm test             # Tests unitarios con Vitest
npm run test:ui      # UI de testing
```

### Build

```bash
npm run build        # Build optimizado
npm run preview      # Preview del build
```

---

## 📚 Recursos y Referencias

### Librerías Utilizadas

- **Radix UI** - Primitivos accesibles headless
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes pre-diseñados
- **class-variance-authority** - Variantes de componentes
- **Lucide React** - Iconos modernos

### Documentación

- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ✅ Checklist de UI/UX

### Componentes
- [x] Sistema de diseño consistente
- [x] Componentes reutilizables
- [x] Variantes bien definidas
- [x] Props tipadas con TypeScript

### Animaciones
- [x] Transiciones suaves
- [x] Animaciones con propósito
- [x] Performance optimizada
- [x] Reducible (prefers-reduced-motion)

### Accesibilidad
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Focus management
- [x] Color contrast
- [x] ARIA labels

### Responsive
- [x] Mobile-first design
- [x] Touch-friendly
- [x] Breakpoints bien definidos
- [x] Layouts flexibles

### Performance
- [x] Lazy loading
- [x] Code splitting
- [x] Optimized images
- [x] Debouncing/throttling

### UX Patterns
- [x] Loading states
- [x] Empty states
- [x] Error states
- [x] Success feedback
- [x] Confirmations

---

**Desarrollado con ❤️ usando las mejores prácticas de UI/UX moderno**
