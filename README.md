# Sarident HC - Sistema de Historias Clínicas Odontológicas

Sistema web multiplataforma (PC + Android) para gestión de historias clínicas odontológicas con capacidades offline.

## Características

- ✅ Gestión completa de pacientes
- ✅ Historias clínicas digitales
- ✅ 7 tipos de procedimientos odontológicos predefinidos
- ✅ Galería de fotos clínicas con captura desde cámara
- ✅ Funcionamiento offline completo (PWA)
- ✅ Sincronización automática
- ✅ Exportación a PDF y texto plano
- ✅ Instalable como app nativa en Android
- ✅ 100% gratuito para <1000 pacientes

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Offline**: IndexedDB (Dexie.js)
- **PWA**: Vite PWA Plugin
- **Deployment**: Vercel

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## Configuración de Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar el schema SQL en el editor de Supabase
3. Copiar URL y ANON KEY al archivo .env.local
4. Configurar políticas de Row Level Security (RLS)

## Licencia

MIT
