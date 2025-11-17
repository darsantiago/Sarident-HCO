# Progreso del Proyecto Sarident HC

## ✅ Completado

### 1. Configuración Base del Proyecto
- [x] Proyecto Vite + React + TypeScript inicializado
- [x] Todas las dependencias instaladas (React Router, Zustand, Supabase, Dexie, etc.)
- [x] Tailwind CSS configurado con tema personalizado
- [x] PostCSS configurado
- [x] Estructura de carpetas completa según especificación

### 2. Configuración de Base de Datos
- [x] Schema SQL completo en `supabase-schema.sql`
- [x] Cliente de Supabase configurado en `src/lib/db/supabase-client.ts`
- [x] Tipos de base de datos definidos
- [x] Row Level Security (RLS) configurado en el schema
- [x] Triggers para updated_at implementados

### 3. Sistema Offline (IndexedDB)
- [x] Cliente de IndexedDB con Dexie en `src/lib/db/indexeddb-client.ts`
- [x] Gestor de sincronización en `src/lib/db/sync-manager.ts`
- [x] Manejo de operaciones pendientes
- [x] Auto-sync cuando se recupera conexión

### 4. Tipos TypeScript
- [x] `paciente.types.ts` - Tipos para pacientes
- [x] `historia-clinica.types.ts` - Tipos para historias clínicas
- [x] `procedimiento.types.ts` - Tipos para 7 tipos de procedimientos
- [x] `foto.types.ts` - Tipos para fotos clínicas
- [x] `sync.types.ts` - Tipos para sincronización
- [x] `ui.types.ts` - Tipos para UI y notificaciones

### 5. Componentes UI Base (shadcn/ui)
- [x] Button
- [x] Input
- [x] Label
- [x] Card
- [x] Dialog
- [x] Toast/Toaster

### 6. Sistema de Notificaciones
- [x] Hook `useToast` implementado
- [x] Componente Toaster integrado
- [x] Sistema de notificaciones toast funcional

### 7. Configuración
- [x] Constantes de la app en `src/config/constants.ts`
- [x] Función utilidad `cn()` para clases de Tailwind
- [x] Archivo `.env.example` con variables necesarias
- [x] Archivo `.gitignore` configurado

### 8. PWA
- [x] `manifest.json` creado
- [x] Carpetas para iconos y screenshots

### 9. Documentación
- [x] README.md con instrucciones
- [x] Schema SQL documentado
- [x] Variables de entorno documentadas

## 🚧 Pendiente de Implementar

### 1. Componentes UI Adicionales
- [ ] Select
- [ ] Textarea
- [ ] Checkbox
- [ ] Switch
- [ ] Tabs
- [ ] Dropdown Menu
- [ ] Loading Spinner

### 2. Sistema de Autenticación
- [ ] Página de Login
- [ ] Hook `useAuth`
- [ ] Store de autenticación con Zustand
- [ ] Protección de rutas
- [ ] Manejo de sesión
- [ ] Logout

### 3. Layout Principal
- [ ] Navbar (con logo, usuario, estado online/offline)
- [ ] Sidebar (navegación principal)
- [ ] AppLayout (contenedor principal)
- [ ] Footer
- [ ] Indicador de conexión

### 4. Gestión de Pacientes
- [ ] Lista de pacientes con paginación
- [ ] Tarjetas de paciente (PacienteCard)
- [ ] Formulario de creación/edición (PacienteForm)
- [ ] Página de detalle del paciente
- [ ] Búsqueda en tiempo real
- [ ] Filtros por estado
- [ ] Servicio `pacientes.service.ts`
- [ ] Hook `usePacientes`

### 5. Historias Clínicas
- [ ] Formulario de apertura de HC (AperturaHCForm)
- [ ] Vista completa de HC (HistoriaClinicaView)
- [ ] Timeline cronológico de procedimientos (TimelineHC)
- [ ] Lista de procedimientos (ProcedimientosList)
- [ ] Servicio `historias.service.ts`
- [ ] Hook `useHistoriaClinica`

### 6. Procedimientos Odontológicos
- [ ] Formulario dinámico genérico (ProcedimientoForm)
- [ ] EvaluacionAptitudForm
- [ ] ImpresionesForm
- [ ] PruebaRodetesForm
- [ ] PruebaDientesForm
- [ ] InstalacionForm
- [ ] ControlForm
- [ ] GarantiaForm
- [ ] Servicio `procedimientos.service.ts`
- [ ] Hook `useProcedimientos`
- [ ] Schemas de validación con Zod

### 7. Gestión de Fotos Clínicas
- [ ] Componente de galería (FotosGallery)
- [ ] Upload con drag & drop (FotoUpload)
- [ ] Captura desde cámara (CameraCapture)
- [ ] Visor full screen (FotoViewer)
- [ ] Guías visuales (FotoGuide)
- [ ] Compresión de imágenes (con browser-image-compression)
- [ ] Generación de thumbnails
- [ ] Servicio `fotos.service.ts`
- [ ] Hook `useFotos`
- [ ] Hook `useCamera`

### 8. Exportación
- [ ] Exportación a PDF (ExportarPDF)
- [ ] Exportación a texto plano (ExportarTexto)
- [ ] Impresión directa
- [ ] Servicio `export.service.ts`
- [ ] Generación de PDF con jsPDF

### 9. Sincronización con Metrosalud
- [ ] Página de sincronización
- [ ] Servicio `metrosalud-sync.service.ts`
- [ ] Integración con Google Sheets API
- [ ] Logs de sincronización
- [ ] Detección de conflictos
- [ ] Notificaciones de resultado

### 10. PWA Completo
- [ ] Configuración de Vite PWA Plugin en `vite.config.ts`
- [ ] Service Worker con Workbox
- [ ] Iconos en todos los tamaños (72, 96, 128, 144, 152, 192, 384, 512)
- [ ] Screenshots para instalación
- [ ] Caché estratégico (App Shell, API, imágenes)
- [ ] Update prompt cuando hay nueva versión

### 11. Páginas
- [ ] LoginPage
- [ ] HomePage (dashboard)
- [ ] PacientesPage
- [ ] PacienteDetailPage
- [ ] HistoriaClinicaPage
- [ ] NuevoProcedimientoPage
- [ ] SincronizacionPage
- [ ] ConfiguracionPage

### 12. Stores con Zustand
- [ ] `auth.store.ts` - Autenticación
- [ ] `paciente.store.ts` - Estado de pacientes
- [ ] `ui.store.ts` - Estado de UI (tema, sidebar, etc.)

### 13. Hooks Personalizados
- [ ] `use-pacientes.ts`
- [ ] `use-historia-clinica.ts`
- [ ] `use-procedimientos.ts`
- [ ] `use-fotos.ts`
- [ ] `use-offline-sync.ts`
- [ ] `use-camera.ts`

### 14. Servicios
- [ ] `pacientes.service.ts`
- [ ] `historias.service.ts`
- [ ] `procedimientos.service.ts`
- [ ] `fotos.service.ts`
- [ ] `metrosalud-sync.service.ts`
- [ ] `export.service.ts`

### 15. Optimizaciones
- [ ] Lazy loading de rutas
- [ ] Code splitting
- [ ] Virtualización de listas largas
- [ ] Debouncing en búsquedas
- [ ] Caché de consultas
- [ ] Compresión de imágenes antes de subir

### 16. Testing y Deployment
- [ ] Configuración de Vercel
- [ ] Archivo `vercel.json` si es necesario
- [ ] Testing de PWA en Android
- [ ] Testing de modo offline
- [ ] Testing de sincronización
- [ ] Optimización de bundle size

## 📝 Instrucciones para Continuar

### 1. Configurar Supabase

1. Crear una cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Ir al SQL Editor y ejecutar todo el contenido de `supabase-schema.sql`
4. Ir a Storage y crear un bucket llamado `fotos-clinicas` (privado)
5. Copiar la URL del proyecto y la ANON KEY
6. Crear archivo `.env.local` con:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

### 2. Ejecutar el Proyecto

```bash
npm install
npm run dev
```

### 3. Próximos Pasos Sugeridos (en orden)

1. **Implementar Autenticación** (crítico para todo lo demás)
   - Crear LoginPage
   - Implementar useAuth hook
   - Configurar protección de rutas

2. **Crear Layout Principal**
   - Navbar con indicador online/offline
   - Sidebar con navegación
   - AppLayout que envuelva las páginas

3. **Implementar Gestión de Pacientes**
   - Servicio de pacientes (CRUD)
   - Lista de pacientes
   - Formulario de creación/edición
   - Búsqueda

4. **Implementar Historias Clínicas**
   - Apertura de HC
   - Visualización de HC
   - Timeline de procedimientos

5. **Implementar Procedimientos**
   - Formularios dinámicos para cada tipo
   - Validación con Zod
   - Guardar en BD

6. **Implementar Gestión de Fotos**
   - Upload de archivos
   - Captura desde cámara
   - Compresión y thumbnails

7. **Configurar PWA**
   - Vite PWA plugin
   - Service Worker
   - Iconos y manifest

8. **Implementar Exportación**
   - PDF con jsPDF
   - Texto plano

9. **Testing y Deploy**

## 🎯 Estado Actual del Proyecto

**Porcentaje completado: ~25%**

Se ha completado toda la infraestructura base:
- ✅ Configuración del proyecto
- ✅ Base de datos y tipos
- ✅ Sistema offline
- ✅ Componentes UI básicos
- ✅ Sistema de notificaciones

Falta implementar la lógica de negocio y las funcionalidades principales.

## 📚 Recursos Útiles

- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com/en/main)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Dexie.js](https://dexie.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite PWA](https://vite-pwa-org.netlify.app/)
