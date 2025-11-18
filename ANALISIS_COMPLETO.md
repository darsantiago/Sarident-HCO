# ANÁLISIS COMPLETO DEL PROYECTO SARIDENT-HCO

## 1. ARQUITECTURA DEL PROYECTO

### Patrones Arquitectónicos

**Arquitectura en Capas:**
- **Frontend (Presentación)**: React 19 con TypeScript
- **UI Components**: shadcn/ui basado en Radix UI
- **Gestión de Estado**: Zustand (instalado, no implementado aún)
- **Persistencia**: Dual-layer (Supabase + IndexedDB)
- **Sincronización**: SyncManager para operaciones offline

### Arquitectura de Datos

```
┌─────────────────────────────────────┐
│      Cliente Navegador (PWA)        │
│  React + TypeScript + IndexedDB     │
└────────────┬────────────────────────┘
             │
      ┌──────▼────────┐
      │  SyncManager  │
      │ (Auto-sync)   │
      └──────┬────────┘
             │
      ┌──────▼──────────────┐
      │   Supabase Backend  │
      │  PostgreSQL + Auth  │
      │ + Storage (Fotos)   │
      └──────────────────────┘
```

### Flujo de Datos

1. **Modo Online**: Lectura/escritura directa a Supabase
2. **Modo Offline**: 
   - Escritura a IndexedDB localmente
   - Registro en tabla `operaciones_pendientes`
   - Sincronización automática cuando hay conexión
3. **Sincronización**: Cada 5 minutos (si online) o al recuperar conexión

---

## 2. TECNOLOGÍAS UTILIZADAS

### Frontend
- **React**: 19.2.0 (framework UI)
- **TypeScript**: ~5.9.3 (tipado estático)
- **Vite**: 7.2.2 (build tool)
- **React Router**: 7.9.6 (routing)
- **Tailwind CSS**: 4.1.17 (estilos)

### UI & Componentes
- **shadcn/ui**: Componentes basados en Radix UI
- **Radix UI**: 
  - Checkbox, Dialog, Dropdown Menu
  - Label, Select, Separator, Slot
  - Switch, Tabs, Toast
- **Lucide React**: 0.554.0 (iconografía)
- **Class Variance Authority**: 0.7.1 (variantes de componentes)
- **clsx**: 2.1.1 (utilidades de clases)
- **Tailwind Merge**: 3.4.0 (merge de clases)

### Datos & Base de Datos
- **Supabase**: 2.81.1 (PostgreSQL + Auth + Storage)
- **Dexie**: 4.2.1 (IndexedDB wrapper)
- **Dexie React Hooks**: 4.2.0 (hooks para Dexie)

### Validación & Formularios
- **React Hook Form**: 7.66.0 (gestión de formularios)
- **@hookform/resolvers**: 5.2.2 (resolvers para validación)
- **Zod**: 4.1.12 (validación de esquemas)

### Gestión de Estado
- **Zustand**: 5.0.8 (state management - instalado, no usado aún)

### Funcionalidades Especializadas
- **jsPDF**: 3.0.3 (generación de PDFs)
- **jsPDF AutoTable**: 5.0.2 (tablas en PDFs)
- **browser-image-compression**: 2.0.2 (compresión de imágenes)
- **date-fns**: 4.1.0 (manipulación de fechas)

### PWA & Offline
- **vite-plugin-pwa**: 1.1.0 (configuración PWA)
- **workbox-window**: 7.3.0 (service worker)

### Herramientas de Desarrollo
- **ESLint**: 9.39.1 (linting)
- **TypeScript ESLint**: 8.46.3 (ESLint para TS)
- **Autoprefixer**: 10.4.22 (prefijos CSS)
- **PostCSS**: 8.5.6 (procesamiento CSS)

---

## 3. FUNCIONALIDADES IMPLEMENTADAS (Fase Base)

### Implementadas (25% completado)

✅ **Infraestructura Base**
- Proyecto Vite + React + TypeScript
- Todas las dependencias configuradas
- Build pipeline configurado

✅ **Base de Datos**
- Schema SQL completo en Supabase
- 5 tablas principales con índices y triggers
- Row Level Security (RLS) configurado
- Relaciones Foreign Key correctamente definidas

✅ **Sistema Offline**
- Cliente IndexedDB con Dexie
- SyncManager con auto-sync cada 5 minutos
- Tabla de operaciones pendientes
- Sincronización automática al recuperar conexión

✅ **Tipos TypeScript Completos**
- Pacientes (con datos de Metrosalud)
- Historias Clínicas
- Procedimientos (8 tipos específicos)
- Fotos Clínicas
- Sincronización y UI

✅ **Componentes UI Base**
- Button, Input, Label, Card
- Dialog, Toast/Toaster
- 457 líneas de código UI

✅ **Sistema de Notificaciones**
- Hook useToast implementado
- Sistema de toasts con límite de 3 máximo
- Auto-dismiss en 5 segundos

✅ **Configuración PWA**
- Manifest.json configurado
- Estructura de iconos para múltiples tamaños
- Display standalone
- Orientación portrait

✅ **Estilos y Temas**
- Tailwind CSS con tema personalizado
- Variables CSS para tema claro/oscuro
- Sistema de colores HSL completo

---

## 4. ESTRUCTURA DE CARPETAS Y ARCHIVOS PRINCIPALES

```
sarident-hco/
├── src/
│   ├── assets/                          # Activos estáticos
│   │
│   ├── components/
│   │   └── ui/                          # Componentes shadcn/ui
│   │       ├── button.tsx               # Botón con variantes
│   │       ├── input.tsx                # Input de texto
│   │       ├── label.tsx                # Etiqueta form
│   │       ├── card.tsx                 # Contenedor tarjeta
│   │       ├── dialog.tsx               # Modal/diálogo
│   │       ├── toast.tsx                # Toast individual
│   │       └── toaster.tsx              # Contenedor toasts
│   │
│   ├── config/
│   │   └── constants.ts                 # Constantes de app
│   │                                    # - URLs Supabase
│   │                                    # - Límites de archivos
│   │                                    # - Dimensiones de imagen
│   │                                    # - Paginación
│   │
│   ├── hooks/
│   │   └── use-toast.ts                 # Hook para notificaciones
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── supabase-client.ts       # Cliente Supabase
│   │   │   │                            # - Inicialización
│   │   │   │                            # - Types de BD
│   │   │   ├── indexeddb-client.ts      # Cliente IndexedDB (Dexie)
│   │   │   │                            # - Esquema de BD local
│   │   │   │                            # - Helper functions
│   │   │   └── sync-manager.ts          # Gestor de sincronización
│   │   │                                # - Auto-sync cada 5 min
│   │   │                                # - Sincronización manual
│   │   │
│   │   └── utils/
│   │       └── cn.ts                    # Merge de clases Tailwind
│   │
│   ├── types/
│   │   ├── paciente.types.ts            # Interface Paciente
│   │   ├── historia-clinica.types.ts    # Interface HistoriaClinica
│   │   ├── procedimiento.types.ts       # 8 tipos de procedimientos
│   │   │                                # - EvaluacionAptitud
│   │   │                                # - AperturaHC
│   │   │                                # - Impresiones
│   │   │                                # - PruebaRodetes
│   │   │                                # - PruebaDientes
│   │   │                                # - Instalacion
│   │   │                                # - Control
│   │   │                                # - Garantia
│   │   ├── foto.types.ts                # Interface FotoClinica
│   │   ├── sync.types.ts                # Tipos de sincronización
│   │   └── ui.types.ts                  # Tipos para notificaciones
│   │
│   ├── App.tsx                          # Componente raíz (BrowserRouter)
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Estilos globales (Tailwind)
│
├── public/
│   ├── manifest.json                    # PWA manifest
│   └── vite.svg                         # Favicon
│
├── .env.example                         # Variables de entorno
├── package.json                         # Dependencias (61 paquetes)
├── tsconfig.json                        # Config TypeScript
├── tsconfig.app.json                    # Config TS para app
├── tsconfig.node.json                   # Config TS para node
├── vite.config.ts                       # Config Vite (simple, PWA pendiente)
├── tailwind.config.js                   # Config Tailwind
├── postcss.config.js                    # Config PostCSS
├── eslint.config.js                     # Config ESLint
├── index.html                           # HTML principal
├── supabase-schema.sql                  # Schema completo de BD
├── PROGRESO.md                          # Tracking de desarrollo
└── README.md                            # Documentación básica
```

---

## 5. CONFIGURACIONES Y DEPENDENCIAS

### Variables de Entorno (.env.local)

```
# Requeridas
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Opcionales
VITE_METROSALUD_SHEETS_ID=your-google-sheets-id
VITE_METROSALUD_API_KEY=your-google-api-key
```

### Scripts Disponibles

```bash
npm run dev          # Servidor Vite en dev
npm run build        # Build para producción (tsc + vite)
npm run lint         # ESLint check
npm run preview      # Preview de build
```

### Tamaño del Proyecto

- **Componentes UI**: 457 líneas
- **Tipos**: ~300 líneas
- **Base de datos**: ~186 líneas (SQL)
- **Configuración**: Múltiples archivos
- **Dependencias totales**: 61 paquetes (con transitividad)

### Configuración de Tailwind

**Tema personalizado:**
- Colores HSL: Primary, Secondary, Destructive, Muted, Accent
- Radio de border por defecto: 0.5rem
- Tema oscuro: Completamente implementado
- Animaciones: Accordion-down/up

**Content config:**
- Monitorea `src/**/*.{ts,tsx}`
- Builds dinámicos de clases

---

## 6. ESQUEMA DE BASE DE DATOS

### Tablas Implementadas

#### 1. **pacientes**
```sql
Campos:
- id (UUID, PK)
- documento (VARCHAR UNIQUE)
- nombre, fecha_nacimiento, edad (GENERATED)
- telefono, direccion, email
- metrosalud_id, metrosalud_sync_at (para integración externa)
- estado (activo/inactivo)
- created_at, updated_at (con trigger automático)

Índices:
- documento, nombre, metrosalud_id
- Para búsquedas rápidas
```

#### 2. **historias_clinicas**
```sql
Campos:
- id (UUID, PK)
- paciente_id (FK → pacientes, CASCADE)
- fecha_apertura, motivo_consulta, enfermedad_actual
- antecedentes, examen_fisico, diagnostico, plan_tratamiento
- profesional_apertura, estado (activa/finalizada/archivada)
- created_at, updated_at

Restricciones:
- Solo una HC activa por paciente (UNIQUE INDEX)
- Referencias eliminadas en cascada
```

#### 3. **procedimientos**
```sql
Campos:
- id (UUID, PK)
- historia_clinica_id (FK → historias_clinicas, CASCADE)
- tipo (ENUM virtual: 8 tipos)
- titulo, fecha, datos (JSONB flexible)
- profesional, observaciones
- created_at, updated_at

Índices:
- historia_clinica_id, tipo, fecha
- GIN index en JSONB datos para búsquedas

Flexibilidad:
- Campo datos JSONB permite diferentes estructuras por tipo
```

#### 4. **fotos_clinicas**
```sql
Campos:
- id (UUID, PK)
- procedimiento_id (FK → procedimientos, CASCADE)
- nombre, descripcion, url, thumbnail_url
- mime_type, size_bytes, width, height
- tipo (frontal/lateral/oclusal/etc)
- created_at

Índices:
- procedimiento_id, tipo
```

#### 5. **sincronizacion_metrosalud**
```sql
Campos:
- id (UUID, PK)
- ultima_sync, pacientes_sincronizados
- pacientes_nuevos, pacientes_actualizados
- errores, duracion_ms, estado
- created_at

Propósito:
- Auditoría de sincronización con sistema externo
```

### Características de Seguridad

- **Row Level Security (RLS)**: Habilitado en todas las tablas
- **Políticas**: `auth.role() = 'authenticated'` para acceso completo
- **Triggers**: `update_updated_at` en pacientes, HC y procedimientos
- **Cascada**: Eliminación de paciente elimina todas sus HC y procedimientos

---

## 7. CARACTERÍSTICAS NOTABLES DEL SISTEMA

### 7.1 Sistema Offline-First

**Capacidades:**
- Funciona completamente sin conexión
- IndexedDB como almacenamiento local completo
- Todas las operaciones quedan registradas en `operaciones_pendientes`
- Sincronización automática y transparente

**Estrategia de Sync:**
```typescript
- Auto-sync cada 5 minutos cuando online
- Sync inmediato al recuperar conexión
- Manejo de errores individuales (no falla todo si uno falla)
- Deduplicated para operaciones repetidas
```

### 7.2 PWA Completo

**Capacidades instalables:**
- Instalable en Android como app nativa
- Instalable en navegadores compatibles (Edge, Chrome)
- Manifest.json con metadata completa
- Tema color: #2563eb (azul principal)
- Orientación: Portrait-primary

**Características PWA:**
- Categorías: medical, health, productivity
- Idioma: es-CO (Español Colombia)
- Display: standalone (parece una app nativa)
- 8 tamaños de iconos (72x72 a 512x512)

### 7.3 Tipado TypeScript Robusto

**Beneficios:**
- Seguridad de tipos en toda la aplicación
- Tipos generados para Supabase
- Validación en tiempo de desarrollo
- IntelliSense completo en IDE
- Zod para validación en runtime

### 7.4 Procedimientos Odontológicos Especializados

**8 tipos de procedimientos con esquemas específicos:**

1. **EVALUACION_APTITUD**: Evaluación previa (sin enf. periodontal, etc)
2. **APERTURA_HC**: Apertura de historia clínica
3. **IMPRESIONES**: Toma de impresiones
4. **PRUEBA_RODETES**: Prueba de rodetes de cera
5. **PRUEBA_DIENTES**: Prueba de dientes
6. **INSTALACION**: Instalación de prótesis
7. **CONTROL**: Controles post-instalación
8. **GARANTIA**: Procedimientos de garantía

**Cada tipo tiene campos específicos validables.**

### 7.5 Gestión de Fotos Clínicas

**Características preparadas:**
- Compresión automática (browser-image-compression)
- 6 tipos de fotos: frontal, lateral, oclusal, panorámica, intraoral, extraoral
- Generación de thumbnails
- Almacenamiento en Supabase Storage
- Metadata de imagen (dimensiones, tamaño)

**Límites configurables:**
- Máximo archivo: 5MB
- Dimensiones máximas: 1920x1080
- Calidad: 80% (compresión)
- Thumbnail: 200px

### 7.6 Sincronización con Metrosalud (Preparada)

**Integración lista para:**
- Google Sheets API
- Sincronización bidireccional
- Logs de sincronización
- Detección de conflictos
- Auditoría de cambios

**Campos para Metrosalud:**
- `metrosalud_id`: ID en sistema externo
- `metrosalud_sync_at`: Timestamp de última sync
- Tabla de logs de sincronización

### 7.7 UI con shadcn/ui & Radix

**Componentes disponibles:**
- Button (6 variantes: default, destructive, outline, secondary, ghost, link)
- Input (para formularios)
- Label (para accesibilidad)
- Card (contenedor semántico)
- Dialog (modales)
- Toast (notificaciones)
- Y más listos para usar...

**Ventajas:**
- Accesibles (WCAG)
- Personalizables
- Consistentes
- Basados en estándares (Radix)

---

## 8. ESTADO ACTUAL DEL PROYECTO

### Completado (~25%)

- Infraestructura base configurada
- Base de datos y tipos completamente diseñados
- Sistema offline funcional
- Componentes UI base
- PWA listo para compilación
- Build pipeline trabajando

### Pendiente de Implementar (~75%)

**Fase 2 - Autenticación (Crítica)**
- Login/Logout
- useAuth hook
- Protección de rutas
- Sesión persistente

**Fase 3 - Layout & Navegación**
- AppLayout principal
- Navbar con estado online/offline
- Sidebar con menú
- Indicador de sincronización

**Fase 4 - Gestión de Pacientes**
- CRUD de pacientes
- Lista con paginación
- Búsqueda en tiempo real
- Filtros

**Fase 5 - Historias Clínicas**
- CRUD de HC
- Vista cronológica
- Timeline de procedimientos
- Estado management

**Fase 6 - Procedimientos**
- 8 formularios específicos
- Validación con Zod
- Integración con fotos

**Fase 7 - Fotos & Multimedia**
- Galería con drag & drop
- Captura desde cámara
- Visor fullscreen
- Compresión automática

**Fase 8 - Exportación**
- PDF con jsPDF
- Exportación a texto
- Impresión

**Fase 9 - PWA Completo**
- Service Worker con Workbox
- Caché estratégica
- Update prompts

---

## 9. MÉTRICAS DEL PROYECTO

### Análisis de Código

| Aspecto | Valor |
|---------|-------|
| Archivos TS/TSX | 21 archivos |
| Líneas de código (tipos) | ~300 |
| Líneas de SQL | 186 |
| Líneas de componentes UI | 457 |
| Dependencias directas | 37 |
| DevDependencies | 24 |
| Tamaño package.json | 1.78 KB |

### Complejidad

- **Base de Datos**: Baja-Media (5 tablas, relaciones simples)
- **Tipos**: Media (bien estructurados)
- **Componentes**: Baja (base lista, falta lógica)
- **Estado**: Pendiente (Zustand listo pero no usado)

---

## 10. RECOMENDACIONES PARA COMPARACIÓN CON OTRO SISTEMA

### Puntos Clave de Comparación

1. **Arquitectura de Offline**
   - ¿Cómo maneja otro sistema operaciones sin conexión?
   - ¿Usa IndexedDB, SQLite, o algo diferente?
   - ¿Sincronización automática o manual?

2. **Tipado y Validación**
   - ¿Usa TypeScript?
   - ¿Validación en frontend (Zod) y backend?
   - ¿Type safety en queries?

3. **UI & UX**
   - ¿Framework UI (shadcn, Material, etc)?
   - ¿Accesibilidad (WCAG)?
   - ¿Responsive design?

4. **PWA & Mobile**
   - ¿Es una PWA o app nativa?
   - ¿Capacidad offline?
   - ¿Instalable?

5. **Base de Datos**
   - ¿PostgreSQL o NoSQL?
   - ¿RLS (Row Level Security)?
   - ¿Auditoría de cambios?

6. **Escalabilidad**
   - ¿Manejo de grandes datasets?
   - ¿Paginación?
   - ¿Índices y optimizaciones?

7. **Integración Externa**
   - ¿APIs de terceros (Google Sheets)?
   - ¿Sindicación de datos?
   - ¿Webhooks?

---

## 11. DEPENDENCIAS CRÍTICAS

**No removibles:**
- React + React DOM (core)
- Supabase (backend)
- Dexie (offline)
- Tailwind (estilos)
- TypeScript (compilación)

**Opcionales (pueden reemplazarse):**
- Zustand → Redux, Recoil
- shadcn/ui → Material-UI, Chakra
- zod → yup, joi
- date-fns → dayjs, moment

---

## 12. PRÓXIMOS PASOS SUGERIDOS

1. **Implementar autenticación** (sin esto nada funciona)
2. **Crear layout principal** (frame para todas las páginas)
3. **CRUD de pacientes** (funcionalidad básica)
4. **CRUD de historias clínicas** (núcleo del negocio)
5. **Formularios de procedimientos** (lógica especializada)
6. **Gestión de fotos** (multimedia)
7. **Exportación** (valor agregado)
8. **PWA completo** (instalación y caché)

---

**Documento generado**: 2025-11-18
**Proyecto**: Sarident HC - Sistema de Historias Clínicas Odontológicas
**Versión**: 1.0.0
**Estado**: Base arquitectónica completa, pendiente implementación de features

