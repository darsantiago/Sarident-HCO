# DIAGRAMAS Y DOCUMENTACIÓN VISUAL - SARIDENT-HCO

## 1. FLUJO DE DATOS DEL SISTEMA

```
┌──────────────────────────────────────────────────────────────────────┐
│                          APLICACIÓN REACT                            │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    Componentes UI (shadcn)                      │ │
│  │  Button, Input, Card, Dialog, Toast, Label, etc.               │ │
│  └────────────────────────────┬────────────────────────────────────┘ │
│                               │                                       │
│  ┌────────────────────────────▼────────────────────────────────────┐ │
│  │              Lógica de Negocio (Pendiente)                      │ │
│  │  - useAuth, usePacientes, useHistoriaClinica, etc.             │ │
│  └────────────────────────────┬────────────────────────────────────┘ │
│                               │                                       │
│  ┌────────────────────────────▼────────────────────────────────────┐ │
│  │              Estado Global (Zustand - Listo)                    │ │
│  │  - auth.store, paciente.store, ui.store                        │ │
│  └────────────────────────────┬────────────────────────────────────┘ │
│                               │                                       │
│  ┌────────────────────────────▼────────────────────────────────────┐ │
│  │                 Capa de Datos Dual                              │ │
│  │  ┌─────────────────────┬─────────────────────┐                 │ │
│  │  │   ONLINE            │    OFFLINE          │                 │ │
│  │  │                     │                     │                 │ │
│  │  │  Supabase Client    │  Dexie (IndexedDB)  │                 │ │
│  │  │  ├─ Auth            │  ├─ pacientes       │                 │ │
│  │  │  ├─ pacientes       │  ├─ historias_...   │                 │ │
│  │  │  ├─ historias_...   │  ├─ procedimientos  │                 │ │
│  │  │  ├─ procedimientos  │  ├─ fotos_clinicas  │                 │ │
│  │  │  ├─ fotos_clinicas  │  └─ operaciones_... │                 │ │
│  │  │  └─ Storage (fotos) │                     │                 │ │
│  │  └──────────┬──────────┴──────────┬──────────┘                 │ │
│  │             │                     │                            │ │
│  │  ┌──────────▼──────────────────────▼──────────┐                │ │
│  │  │      SyncManager (Auto-sync cada 5 min)    │                │ │
│  │  │  - Detecta conexión                        │                │ │
│  │  │  - Procesa operaciones_pendientes          │                │ │
│  │  │  - Sincroniza hacia Supabase               │                │ │
│  │  └──────────┬─────────────────────────────────┘                │ │
│  │             │                                                   │ │
│  └─────────────┼───────────────────────────────────────────────────┘ │
│                │                                                     │
└────────────────┼─────────────────────────────────────────────────────┘
                 │
        ┌────────▼──────────────┐
        │   SUPABASE BACKEND    │
        │  ┌──────────────────┐ │
        │  │  PostgreSQL DB   │ │
        │  │  - pacientes     │ │
        │  │  - historias_... │ │
        │  │  - procedimientos│ │
        │  │  - fotos_...     │ │
        │  │  - sync_metros..│ │
        │  └──────────────────┘ │
        │  ┌──────────────────┐ │
        │  │ Storage Bucket   │ │
        │  │ fotos-clinicas   │ │
        │  └──────────────────┘ │
        │  ┌──────────────────┐ │
        │  │ Auth & RLS       │ │
        │  │ (Seguridad)      │ │
        │  └──────────────────┘ │
        └───────────────────────┘
```

---

## 2. MODELO ENTIDAD-RELACIÓN (MER)

```
┌──────────────────┐
│    PACIENTES     │
├──────────────────┤
│ id (PK)          │
│ documento (U)    │◄───┐
│ nombre           │    │
│ fecha_nacimiento │    │
│ edad (G)         │    │
│ telefono         │    │
│ direccion        │    │
│ email            │    │
│ metrosalud_id    │    │
│ metrosalud_sync  │    │
│ estado           │    │
│ created_at       │    │
│ updated_at       │    │
└──────────────────┘    │
         │              │
         │ 1:N          │
         │              │
         ▼              │
┌──────────────────────────────────┐
│    HISTORIAS_CLINICAS            │
├──────────────────────────────────┤
│ id (PK)                          │
│ paciente_id (FK) ─────────────────┘
│ fecha_apertura                   │
│ motivo_consulta                  │
│ enfermedad_actual                │
│ antecedentes                     │
│ examen_fisico                    │
│ diagnostico                      │
│ plan_tratamiento                 │
│ profesional_apertura             │
│ estado (U con paciente_id)       │
│ created_at                       │
│ updated_at                       │
└──────────────────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────────────────┐
│     PROCEDIMIENTOS               │
├──────────────────────────────────┤
│ id (PK)                          │
│ historia_clinica_id (FK)         │
│ tipo (ENUM: 8 valores)           │
│ titulo                           │
│ fecha                            │
│ datos (JSONB - flexible)         │
│ profesional                      │
│ observaciones                    │
│ created_at                       │
│ updated_at                       │
└──────────────────────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────────────────┐
│     FOTOS_CLINICAS               │
├──────────────────────────────────┤
│ id (PK)                          │
│ procedimiento_id (FK)            │
│ nombre                           │
│ descripcion                      │
│ url                              │
│ thumbnail_url                    │
│ mime_type                        │
│ size_bytes                       │
│ width, height                    │
│ tipo (foto: frontal, etc)        │
│ created_at                       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│   SINCRONIZACION_METROSALUD      │
├──────────────────────────────────┤
│ id (PK)                          │
│ ultima_sync                      │
│ pacientes_sincronizados          │
│ pacientes_nuevos                 │
│ pacientes_actualizados           │
│ errores                          │
│ duracion_ms                      │
│ estado                           │
│ created_at                       │
└──────────────────────────────────┘

Leyenda:
PK = Primary Key
FK = Foreign Key
U = Unique
G = Generated
(N:M) = Relación uno a muchos
```

---

## 3. TIPOS DE PROCEDIMIENTOS ODONTOLÓGICOS

```
PROCEDIMIENTO
├── EVALUACION_APTITUD
│   ├── sin_enf_periodontal (bool)
│   ├── sin_caries_activas (bool)
│   ├── higiene_adecuada (bool)
│   ├── espacio_interoclusal (bool)
│   ├── rebordes_adecuados (bool)
│   ├── sin_contraindicaciones (bool)
│   ├── paciente_colaborador (bool)
│   ├── radiografia_tomada (bool)
│   ├── resultado_evaluacion (enum: APTO | NO APTO | PENDIENTE)
│   ├── tratamiento_previo (text)
│   ├── observaciones (text)
│   └── firma_profesional (string)
│
├── APERTURA_HC (*)
│   ├── motivo_consulta (string)
│   ├── enfermedad_actual (string)
│   ├── antecedentes (text)
│   ├── examen_fisico (text)
│   ├── diagnostico (string)
│   ├── plan_tratamiento (string)
│   └── firma_profesional (string)
│
├── IMPRESIONES
│   ├── tipo_impresion (Alginato | Silicona | Otro)
│   ├── arcada (Superior | Inferior | Ambas)
│   ├── observaciones (text)
│   └── firma_profesional (string)
│
├── PRUEBA_RODETES
│   ├── dimension_vertical_correcta (bool)
│   ├── relacion_centrica_correcta (bool)
│   ├── linea_media_correcta (bool)
│   └── observaciones (text)
│
├── PRUEBA_DIENTES
│   ├── estetica_aprobada (bool)
│   ├── oclusion_correcta (bool)
│   └── ajustes_realizados (text)
│
├── INSTALACION
│   ├── tipo_protesis (array: protesis_superior | etc)
│   ├── ajustes_instalacion (text)
│   ├── observaciones (text)
│   ├── instrucciones_paciente (string)
│   ├── control_programado (date)
│   └── firma_profesional (string)
│
├── CONTROL
│   ├── numero_control (1|2|adicional)
│   ├── adaptacion_correcta (bool)
│   ├── sin_molestias (bool)
│   ├── ajustes_realizados (text)
│   └── paciente_satisfecho (bool)
│
└── GARANTIA
    ├── motivo_garantia (enum)
    ├── descripcion_problema (string)
    ├── solucion_aplicada (enum)
    ├── detalles_solucion (text)
    └── problema_resuelto (bool)

(*) = Se duplica en historias_clinicas (datos de apertura)
```

---

## 4. CICLO DE VIDA DE UNA OPERACIÓN (OFFLINE)

```
                    ┌─────────────────┐
                    │   Usuario usa    │
                    │   la aplicación  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  ¿Hay conexión?  │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────┐          ┌────────┐          ┌────────────┐
    │ ONLINE │          │ OFFLINE│          │ SIN DATOS  │
    └────────┘          └────────┘          │ CACHED     │
        │                    │              └────────────┘
        │                    │
        ▼                    ▼
    ┌──────────┐         ┌──────────────────────┐
    │ Escribe  │         │ 1. Guarda en local   │
    │ a        │         │    IndexedDB         │
    │ Supabase │         │ 2. Crea registro en  │
    │ directo  │         │    operaciones_pend  │
    └────────┬─┘         │ 3. Notifica al user  │
             │           └────────┬─────────────┘
             │                    │
             ├────────────────────┤
             │                    │
             │            ┌───────▼──────────┐
             │            │ Recupera conexión│
             │            └───────┬──────────┘
             │                    │
             │            ┌───────▼──────────────┐
             │            │ SyncManager detecta │
             │            │ conexión restaurada │
             │            └───────┬──────────────┘
             │                    │
             ▼                    ▼
        ┌──────────────────────────────────┐
        │   SyncManager procesa queue:      │
        │   1. Lee operaciones_pendientes   │
        │   2. Las ejecuta en Supabase      │
        │   3. Elimina de tabla local       │
        │   4. Notifica éxito/error        │
        └─────────────┬────────────────────┘
                      │
             ┌────────▼────────┐
             │  SINCRONIZADO   │
             │  (Estado final) │
             └─────────────────┘
```

---

## 5. ESTRUCTURA DE COMPONENTES PENDIENTE

```
App (Router)
├── Layout (PENDIENTE)
│   ├── Navbar
│   │   ├── Logo
│   │   ├── Indicador Online/Offline
│   │   ├── Usuario actual
│   │   └── Menú
│   ├── Sidebar (PENDIENTE)
│   │   ├── Pacientes
│   │   ├── Historias Clínicas
│   │   ├── Procedimientos
│   │   ├── Sincronización
│   │   └── Configuración
│   └── Main Content
│       └── Routes
│
└── Páginas (TODAS PENDIENTE)
    ├── LoginPage
    ├── HomePage (Dashboard)
    ├── PacientesPage
    │   ├── PacientesList
    │   ├── PacienteCard (para cada paciente)
    │   └── PacienteForm (crear/editar)
    ├── PacienteDetailPage
    │   ├── PacienteInfo
    │   ├── HistoriasClinicasList
    │   └── Acciones
    ├── HistoriaClinicaPage
    │   ├── HistoriaClinicaView
    │   ├── AperturaHCForm
    │   ├── TimelineHC (cronológico)
    │   ├── ProcedimientosList
    │   └── FotosGallery
    ├── NuevoProcedimientoPage
    │   ├── Selector de tipo
    │   ├── ProcedimientoForm (genérico)
    │   ├── Formularios específicos:
    │   │   ├── EvaluacionAptitudForm
    │   │   ├── ImpresionesForm
    │   │   ├── PruebaRodetesForm
    │   │   ├── PruebaDientesForm
    │   │   ├── InstalacionForm
    │   │   ├── ControlForm
    │   │   └── GarantiaForm
    │   ├── FotoUpload (drag & drop)
    │   ├── CameraCapture
    │   └── FotoViewer
    ├── ExportarPage
    │   ├── ExportarPDF
    │   ├── ExportarTexto
    │   └── Impresión
    ├── SincronizacionPage
    │   ├── Estado de sync
    │   ├── Logs de sincronización
    │   └── Integración Metrosalud
    └── ConfiguracionPage
        ├── Tema
        ├── Notificaciones
        ├── Perfil
        └── Logout

Componentes Reutilizables (PENDIENTE)
├── Forms/
│   ├── PacienteForm
│   ├── AperturaHCForm
│   ├── ProcedimientoForm (genérico)
│   └── Formularios específicos
├── Modals/
│   ├── ConfirmDialog
│   ├── FormDialog
│   └── AlertDialog
├── Galería/
│   ├── FotosGallery
│   ├── FotoUpload
│   ├── FotoViewer
│   ├── CameraCapture
│   └── FotoGuide
├── Notificaciones/
│   ├── LoadingSpinner
│   ├── EmptyState
│   ├── ErrorBoundary
│   └── Toaster (YA EXISTE)
└── Indicators/
    ├── OnlineOfflineIndicator
    ├── SyncIndicator
    └── LoadingBar
```

---

## 6. MATRIZ DE COMPARACIÓN SUGERIDA

Cuando compares con otro sistema, evalúa estos aspectos:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ASPECTO                 │ SARIDENT-HCO     │ OTRO SISTEMA    │ GANADOR │
├─────────────────────────────────────────────────────────────────────────┤
│ ARQUITECTURA            │                  │                 │         │
│ - Offline-first         │ Si (IndexedDB)   │ ?               │ ?       │
│ - PWA                   │ Si (Vite PWA)    │ ?               │ ?       │
│ - Tipado estático       │ Si (TypeScript)  │ ?               │ ?       │
│ - Validación            │ Si (Zod)         │ ?               │ ?       │
│                         │                  │                 │         │
│ FRONTEND                │                  │                 │         │
│ - Framework             │ React 19         │ ?               │ ?       │
│ - UI Library            │ shadcn/ui        │ ?               │ ?       │
│ - Estado                │ Zustand (listo)  │ ?               │ ?       │
│ - Routing               │ React Router     │ ?               │ ?       │
│                         │                  │                 │         │
│ BACKEND                 │                  │                 │         │
│ - BD                    │ PostgreSQL (SB)  │ ?               │ ?       │
│ - RLS                   │ Si               │ ?               │ ?       │
│ - Auditoría             │ Si (triggers)    │ ?               │ ?       │
│ - Auth                  │ Supabase Auth    │ ?               │ ?       │
│                         │                  │                 │         │
│ DATOS                   │                  │                 │         │
│ - Tablas                │ 5 (completo)     │ ?               │ ?       │
│ - Índices               │ Si               │ ?               │ ?       │
│ - Relaciones            │ Si (FK)          │ ?               │ ?       │
│ - Escalabilidad         │ Media-Alta       │ ?               │ ?       │
│                         │                  │                 │         │
│ SEGURIDAD               │                  │                 │         │
│ - Autenticación         │ Supabase         │ ?               │ ?       │
│ - Row-level             │ Si (RLS)         │ ?               │ ?       │
│ - Encriptación          │ Por HTTPS        │ ?               │ ?       │
│ - GDPR-ready            │ Probable         │ ?               │ ?       │
│                         │                  │                 │         │
│ ESPECIALIZACIÓN         │                  │                 │         │
│ - Odontología           │ Si (8 tipos)     │ ?               │ ?       │
│ - Fotos clínicas        │ Si (preparado)   │ ?               │ ?       │
│ - Procedimientos        │ Si (JSONB)       │ ?               │ ?       │
│ - Exportación           │ PDF + Texto      │ ?               │ ?       │
│                         │                  │                 │         │
│ INTEGRACIÓN             │                  │                 │         │
│ - Google Sheets         │ Preparado        │ ?               │ ?       │
│ - APIs externas         │ Abierto          │ ?               │ ?       │
│ - Webhooks              │ Soportados       │ ?               │ ?       │
│                         │                  │                 │         │
│ PERFORMANCE             │                  │                 │         │
│ - Build time            │ Rápido (Vite)    │ ?               │ ?       │
│ - Bundle size           │ Pequeño          │ ?               │ ?       │
│ - Lazy loading          │ Soportado        │ ?               │ ?       │
│ - Caché                 │ PWA (Workbox)    │ ?               │ ?       │
│                         │                  │                 │         │
│ DEPLOYMENT              │                  │                 │         │
│ - Hosting               │ Vercel (free)    │ ?               │ ?       │
│ - BD hosting            │ Supabase (free)  │ ?               │ ?       │
│ - Storage               │ S3-compatible    │ ?               │ ?       │
│ - Costo base            │ 0 (para <1000)   │ ?               │ ?       │
│                         │                  │                 │         │
│ DOCUMENTACIÓN           │                  │                 │         │
│ - README                │ Si               │ ?               │ ?       │
│ - Schema                │ Si (SQL)         │ ?               │ ?       │
│ - Tipos                 │ Si (TS)          │ ?               │ ?       │
│ - Comentarios código    │ Si               │ ?               │ ?       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. ROADMAP DE DESARROLLO

```
FASE 1: INFRAESTRUCTURA BASE (COMPLETADO ✅)
  ├─ Proyecto Vite + React + TypeScript ✅
  ├─ Dependencias instaladas ✅
  ├─ BD schema en Supabase ✅
  ├─ Dexie + IndexedDB ✅
  ├─ SyncManager ✅
  └─ Componentes base ✅

FASE 2: AUTENTICACIÓN (CRÍTICA - 2-3 días)
  ├─ LoginPage
  ├─ useAuth hook
  ├─ Protected routes
  ├─ Logout
  └─ Session persistence

FASE 3: LAYOUT (1-2 días)
  ├─ AppLayout
  ├─ Navbar
  ├─ Sidebar
  ├─ Online/Offline indicator
  └─ Theme toggle

FASE 4: GESTIÓN DE PACIENTES (3-5 días)
  ├─ CRUD de pacientes
  ├─ PacientesList
  ├─ PacienteForm
  ├─ Search & filter
  └─ Paginación

FASE 5: HISTORIAS CLÍNICAS (3-5 días)
  ├─ CRUD de HC
  ├─ AperturaHCForm
  ├─ HistoriaClinicaView
  ├─ Timeline
  └─ Índice de procedimientos

FASE 6: PROCEDIMIENTOS (5-7 días)
  ├─ 8 formularios específicos
  ├─ Validación con Zod
  ├─ ProcedimientosList
  └─ Integración con HC

FASE 7: FOTOS (3-5 días)
  ├─ Upload & drag-drop
  ├─ Captura cámara
  ├─ Galería
  ├─ Compresión
  └─ Thumbnails

FASE 8: EXPORTACIÓN (2-3 días)
  ├─ PDF con jsPDF
  ├─ Exportación texto
  ├─ Impresión
  └─ Templates

FASE 9: PWA COMPLETO (1-2 días)
  ├─ Service Worker
  ├─ Workbox config
  ├─ Caché estratégica
  └─ Update prompts

FASE 10: METROSALUD (2-3 días)
  ├─ Google Sheets sync
  ├─ Bidireccional
  ├─ Logs
  └─ Conflictos

FASE 11: TESTING (3-5 días)
  ├─ Unit tests
  ├─ E2E tests
  ├─ PWA testing
  └─ Offline testing

FASE 12: OPTIMIZACIÓN (2-3 días)
  ├─ Bundle size
  ├─ Performance
  ├─ SEO
  └─ Accessibility

TOTAL: ~35-50 días de desarrollo
```

---

## 8. NOTAS TÉCNICAS IMPORTANTES

### Limitaciones Actuales
- Autenticación: No implementada (CRÍTICA)
- UI dinámica: Solo esqueleto
- Gestión estado: Zustand listo pero sin uso
- Servicios: No existen (necesarios)
- Hooks personalizados: No existen

### Oportunidades
- Usar Tanstack Query para caché de datos
- Implementar virtualización para listas grandes
- Agregar soft deletes para auditoría
- WebSocket para actualizaciones en tiempo real
- Service Worker más robusto

### Consideraciones de Rendimiento
- IndexedDB bien indexado para búsquedas rápidas
- Paginación obligatoria en listas
- Lazy loading de imágenes
- Compresión antes de subir
- Caché de estilos con Tailwind

---

**Documento generado**: 2025-11-18
**Para**: Comparación con otro sistema de historias clínicas

