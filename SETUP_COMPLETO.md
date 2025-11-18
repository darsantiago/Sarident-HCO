# 🚀 Guía de Setup Completo - Sarident HCO

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Configuración Local](#configuración-local)
4. [Deployment a Vercel](#deployment-a-vercel)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 1. Requisitos Previos

### Software Necesario
- Node.js 18+ ([Descargar](https://nodejs.org/))
- npm o yarn
- Git
- Cuenta de Supabase (gratis) ([Registrarse](https://supabase.com))
- Cuenta de Vercel (gratis) ([Registrarse](https://vercel.com))

---

## 2. Configuración de Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Click en "New Project"
3. Completa los datos:
   - **Organization:** Selecciona o crea una
   - **Name:** `sarident-hco` (o el que prefieras)
   - **Database Password:** Guarda esta contraseña en un lugar seguro
   - **Region:** Selecciona la más cercana (ej: South America - São Paulo)
4. Click en "Create new project"
5. Espera 2-3 minutos mientras se crea

### Paso 2: Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor** (menú lateral izquierdo)
2. Click en "+ New query"
3. Copia todo el contenido del archivo `supabase-schema.sql` del proyecto
4. Pega el código en el editor
5. Click en "Run" (o presiona Ctrl+Enter)
6. Verifica que aparezca "Success. No rows returned"

### Paso 3: Configurar Storage

1. Ve a **Storage** en el menú lateral
2. Click en "Create a new bucket"
3. Configuración del bucket:
   - **Name:** `fotos-clinicas`
   - **Public bucket:** OFF (desactivado)
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp`
4. Click en "Create bucket"

### Paso 4: Configurar Políticas de Storage

1. Click en el bucket `fotos-clinicas`
2. Ve a la pestaña "Policies"
3. Click en "New policy"
4. Selecciona "For full customization"
5. Crea las siguientes políticas:

**Política 1: Upload de fotos**
```sql
CREATE POLICY "Usuarios autenticados pueden subir fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fotos-clinicas');
```

**Política 2: Lectura de fotos**
```sql
CREATE POLICY "Usuarios autenticados pueden ver fotos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'fotos-clinicas');
```

**Política 3: Eliminar fotos**
```sql
CREATE POLICY "Usuarios autenticados pueden eliminar fotos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fotos-clinicas');
```

### Paso 5: Configurar Autenticación

1. Ve a **Authentication** → **Providers**
2. Habilita **Email** (ya debe estar habilitado)
3. (Opcional) Habilita **Google**:
   - Click en "Google"
   - Sigue las instrucciones para crear OAuth credentials en Google Cloud
   - Pega el Client ID y Client Secret
   - Guarda los cambios

### Paso 6: Obtener las Credenciales

1. Ve a **Settings** → **API**
2. Copia los siguientes valores (los necesitarás más adelante):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbG...` (una clave larga)

---

## 3. Configuración Local

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/darsantiago/Sarident-HCO.git
cd Sarident-HCO
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus credenciales de Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...tu-anon-key-aqui

# Optional: Metrosalud Google Sheets Sync
VITE_METROSALUD_SHEETS_ID=
VITE_METROSALUD_API_KEY=
```

**Importante:** Reemplaza `xxxxx.supabase.co` y el `VITE_SUPABASE_ANON_KEY` con tus valores reales de Supabase.

### Paso 4: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Paso 5: Crear tu Primer Usuario

1. Abre `http://localhost:5173` en tu navegador
2. Ve a la página de registro
3. Crea una cuenta con email y contraseña
4. Verifica tu email (revisa spam si no llega)
5. Inicia sesión

---

## 4. Deployment a Vercel

### Opción A: Deployment Automático desde GitHub

1. Ve a [https://vercel.com](https://vercel.com)
2. Click en "Add New" → "Project"
3. Importa tu repositorio `Sarident-HCO`
4. Configura las variables de entorno:
   - Click en "Environment Variables"
   - Agrega las mismas variables que en `.env.local`:
     ```
     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbG...
     ```
5. Click en "Deploy"
6. Espera 2-3 minutos
7. ¡Tu app estará en vivo en `https://sarident-hco.vercel.app`!

### Opción B: Deployment desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Deployar
vercel --prod

# Configurar variables de entorno
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Re-deployar con las variables
vercel --prod
```

### Paso Final: Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto
2. Settings → Domains
3. Add domain
4. Sigue las instrucciones para configurar DNS

---

## 5. Testing

### Ejecutar Tests

```bash
# Tests en modo watch
npm test

# Tests con UI visual
npm run test:ui

# Tests con reporte de cobertura
npm run test:coverage
```

### Resultado Esperado
```
✓ 149 tests pasando
  - 53 tests de servicios
  - 45 tests de hooks
  - 30 tests de componentes UI
  - 21 tests adicionales
```

---

## 6. Troubleshooting

### Error: "Invalid API Key"
**Solución:** Verifica que hayas copiado correctamente el `VITE_SUPABASE_ANON_KEY` de Supabase

### Error: "Failed to fetch"
**Solución:**
1. Verifica que el `VITE_SUPABASE_URL` sea correcto
2. Verifica que el proyecto de Supabase esté activo
3. Verifica tu conexión a internet

### Error: "Row Level Security policy violated"
**Solución:**
1. Verifica que hayas ejecutado todo el `supabase-schema.sql`
2. Verifica que las políticas RLS estén habilitadas
3. Asegúrate de estar autenticado

### Error: "Storage bucket not found"
**Solución:**
1. Ve a Supabase → Storage
2. Crea el bucket `fotos-clinicas`
3. Configura las políticas de acceso

### La app no carga después de deployment
**Solución:**
1. Verifica que las variables de entorno estén configuradas en Vercel
2. Revisa los logs en Vercel → Deployments → [tu deployment] → View Function Logs
3. Asegúrate de que el build se completó sin errores

### Tests fallan localmente
**Solución:**
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación del Proyecto](./INDEX_DOCUMENTACION.md)
- [Guía de Inicio Rápido](./COMIENZA_AQUI.md)

---

## 🎉 ¡Listo!

Tu aplicación Sarident HCO está ahora:
- ✅ Configurada localmente
- ✅ Conectada a Supabase
- ✅ Desplegada en Vercel
- ✅ Lista para usar

**Próximos pasos:**
1. Prueba crear pacientes
2. Prueba crear historias clínicas
3. Prueba subir fotos
4. Prueba el modo offline (desconecta internet)
5. Comparte la URL con tu equipo

---

**Desarrollado con** ❤️ **para mejorar la gestión de historias clínicas odontológicas**
