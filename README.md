# Sarident HC - Sistema de Historias Clínicas Odontológicas

Sistema web multiplataforma (PC + Android) profesional para gestión de historias clínicas odontológicas con capacidades offline completas.

## 📚 Documentación Rápida

- **[🚀 Guía de Deployment Completa](./DEPLOYMENT.md)** - Instrucciones paso a paso para poner en producción en 30 minutos
- **[💰 Análisis de Costos y ROI](./COSTOS-Y-ROI.md)** - Comparativa de opciones, proyecciones y modelos de monetización
- **[🗄️ Schema de Base de Datos](./supabase-schema.sql)** - Script SQL completo para Supabase

**¿Primera vez?** → Lee [DEPLOYMENT.md](./DEPLOYMENT.md) y sigue los pasos.

## 🚀 Características Principales

### ✅ Gestión Integral
- **Gestión completa de pacientes** con búsqueda en tiempo real (debounced)
- **Historias clínicas digitales** con apertura y seguimiento completo
- **7 tipos de procedimientos odontológicos predefinidos**:
  1. Evaluación de Aptitud
  2. Toma de Impresiones
  3. Prueba de Rodetes
  4. Prueba de Dientes
  5. Instalación de Prótesis
  6. Controles Post-Instalación
  7. Garantías

### 📸 Sistema de Fotos Clínicas
- **Captura desde cámara** (frontal/trasera) con controles profesionales
- **Upload con drag & drop** y compresión automática
- **6 tipos de fotos**: Frontal, Lateral, Oclusal, Panorámica, Intraoral, Extraoral
- **Galería visual** con visor full-screen
- **Compresión inteligente** antes de subir (ahorro de espacio y ancho de banda)

### 🔄 Funcionalidad Offline
- **PWA completo** instalable en Android y desktop
- **IndexedDB** para almacenamiento local
- **Sincronización automática** cuando se recupera conexión
- **Operaciones pendientes** guardadas y ejecutadas al reconectar

### 📤 Exportación
- **PDF profesional** con jsPDF
- **Texto plano** para respaldos
- **Impresión directa** desde el navegador

### 🎨 UI/UX Profesional
- **Diseño moderno** con Tailwind CSS y shadcn/ui
- **Responsive design** (móvil, tablet, desktop)
- **Dark mode ready** (infraestructura preparada)
- **Timeline visual** de procedimientos
- **Lazy loading** de rutas para performance óptima

### 🔐 Seguridad
- **Autenticación con Supabase**
- **Row Level Security (RLS)** en base de datos
- **Protección de rutas**
- **Headers de seguridad** configurados

## 📋 Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** para build ultra-rápido
- **React Router v6** con lazy loading
- **Zustand** para state management
- **React Hook Form** + **Zod** para validaciones
- **Tailwind CSS** + **shadcn/ui** para UI
- **Vite PWA Plugin** para Progressive Web App

### Backend & Database
- **Supabase**:
  - PostgreSQL con Row Level Security
  - Authentication
  - Storage para fotos clínicas
- **IndexedDB** (Dexie.js) para offline

### Librerías Clave
- `browser-image-compression` - Compresión de imágenes
- `jspdf` - Generación de PDFs

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Sarident-HCO.git
cd Sarident-HCO
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1. Crear Proyecto en Supabase

**Plan Recomendado para Producción: Pro ($25/mes)**

✅ **¿Por qué Pro y no Free?**
- 🔄 **Backups automáticos diarios** (plan gratuito NO tiene backups)
- 🚀 **Sin pausa por inactividad** (plan gratuito se pausa después de 7 días sin uso)
- 📞 **Soporte prioritario**
- 📊 **8 GB de base de datos** (vs 500 MB gratis)
- 💾 **100 GB de storage** para fotos (vs 1 GB gratis)

**⚠️ Importante:** Para datos médicos de pacientes, los backups automáticos son **OBLIGATORIOS**. Perder datos = perder negocio.

**Setup:**
1. Ir a [supabase.com](https://supabase.com) y crear cuenta
2. Crear nuevo proyecto
3. **Para producción:** Upgrade a Pro en Settings → Billing
4. Esperar a que el proyecto esté listo

#### 3.2. Ejecutar Schema SQL
1. Ir al **SQL Editor** en Supabase
2. Copiar todo el contenido de `supabase-schema.sql`
3. Ejecutar el script

#### 3.3. Configurar Storage
1. Ir a **Storage** en Supabase
2. Crear un nuevo bucket llamado `fotos-clinicas`
3. Configurar como **Private**

#### 3.4. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Desarrollo Local

```bash
npm run dev
```

## 📦 Build para Producción

```bash
npm run build
```

## 🚀 Deployment en Producción

### Opción Recomendada: Cloudflare Pages (Gratis, Uso Comercial)

**Ventajas:**
- ✅ **100% gratis** para uso comercial
- ✅ **Bandwidth ilimitado**
- ✅ **CDN global ultra-rápido**
- ✅ **HTTPS automático**
- ✅ **Sin tarjeta de crédito requerida**

#### Pasos para Cloudflare Pages:

1. **Push código a GitHub** (ya está hecho)

2. **Crear cuenta en Cloudflare**
   - Ir a [pages.cloudflare.com](https://pages.cloudflare.com)
   - Crear cuenta gratuita

3. **Conectar repositorio**
   - Click en "Create a project"
   - Conectar con GitHub
   - Seleccionar repositorio `Sarident-HCO`

4. **Configurar build**
   ```
   Build command:     npm run build
   Build directory:   dist
   Framework preset:  Vite
   ```

5. **Configurar variables de entorno**
   - En "Environment variables":
   ```
   VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY = tu-anon-key-aqui
   ```

6. **Deploy**
   - Click "Save and Deploy"
   - ⏱️ Listo en 2-3 minutos

7. **Configurar dominio personalizado (opcional)**
   - Settings → Custom domains
   - Añadir tu dominio de GoDaddy
   - Seguir instrucciones de DNS

---

### Alternativa: Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Import repository desde GitHub
3. Configurar variables de entorno (igual que arriba)
4. Deploy

**Nota:** Plan gratuito de Vercel es solo para uso NO comercial. Para comercial necesitas Pro ($20/mes).

## 📖 Guía Rápida de Uso

1. **Login** → Usar credenciales de Supabase
2. **Crear Paciente** → Menú Pacientes
3. **Abrir Historia Clínica** → Click en paciente
4. **Registrar Procedimiento** → Seleccionar tipo y llenar formulario
5. **Capturar Fotos** → Desde cámara o subir archivo
6. **Exportar** → PDF o texto plano

## 📊 Estructura del Proyecto

```
src/
├── components/       # Componentes React
│   ├── auth/        # Autenticación
│   ├── fotos/       # Sistema de fotos
│   ├── pacientes/   # Gestión de pacientes
│   └── procedimientos/ # 7 formularios
├── hooks/           # Custom hooks
├── lib/             # Utilidades y DB
├── pages/           # Páginas (lazy loaded)
├── services/        # Servicios de negocio
└── stores/          # Zustand stores
```

## 🐛 Troubleshooting

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Fotos no se suben**
- Verificar bucket `fotos-clinicas` existe
- Verificar políticas de Storage

**PWA no se instala**
- Debe estar en HTTPS (producción)
- Verificar iconos existen

## 📄 Licencia

Todos los derechos reservados © 2024

---

**Desarrollado para profesionales odontológicos** 🦷
