# 🚀 Deploy Supabase Edge Functions - Metrosalud Sync

## 📋 Resumen

Esta guía te ayudará a desplegar la Supabase Edge Function que reemplaza completamente a Google Apps Script para la sincronización con Metrosalud.

## ✅ Beneficios de Esta Solución

- ✅ **Sin CORS issues** - Supabase maneja CORS automáticamente
- ✅ **100% TypeScript** - Type-safe end-to-end
- ✅ **Sin dependencias externas** - Todo en Supabase
- ✅ **Más rápido** - Edge Functions son más rápidas que Apps Script
- ✅ **Mejor seguridad** - Autenticación integrada con Supabase Auth
- ✅ **Más fácil de mantener** - Todo el código en un solo repositorio

---

## 🔧 Prerequisitos

1. **Supabase CLI** instalado
2. **Google Sheets API Key**
3. **Acceso al proyecto de Supabase**

---

## 📝 Paso 1: Instalar Supabase CLI

Si no lo tienes instalado:

```bash
npm install -g supabase
```

Verificar instalación:
```bash
supabase --version
```

---

## 📝 Paso 2: Login a Supabase

```bash
cd /home/dsantiago/apps/Sarident-HCO
supabase login
```

Esto abrirá tu navegador para autenticarte.

---

## 📝 Paso 3: Link al Proyecto de Supabase

```bash
supabase link --project-ref iddmxktttzivoujywzgg
```

Esto conectará tu proyecto local con el proyecto de Supabase en la nube.

---

## 📝 Paso 4: Crear Google Sheets API Key

### 4.1 Ir a Google Cloud Console

1. Abrir: https://console.cloud.google.com/
2. Crear un nuevo proyecto o seleccionar uno existente
3. Ir a: **APIs & Services** → **Credentials**

### 4.2 Habilitar Google Sheets API

1. Click en **"Enable APIs and Services"**
2. Buscar: **"Google Sheets API"**
3. Click en **"Enable"**

### 4.3 Crear API Key

1. **Credentials** → **Create Credentials** → **API Key**
2. Copiar el API Key generado
3. (Opcional) Restringir el key:
   - **Application restrictions:** None o HTTP referrers
   - **API restrictions:** Solo Google Sheets API

---

## 📝 Paso 5: Configurar Variables de Entorno en Supabase

### 5.1 Crear archivo de secrets

```bash
cd /home/dsantiago/apps/Sarident-HCO
```

### 5.2 Agregar el Google Sheets API Key

```bash
supabase secrets set GOOGLE_SHEETS_API_KEY=TU_API_KEY_AQUI
```

Reemplaza `TU_API_KEY_AQUI` con el API Key que copiaste.

### 5.3 Verificar secrets

```bash
supabase secrets list
```

Deberías ver `GOOGLE_SHEETS_API_KEY` en la lista.

---

## 📝 Paso 6: Ejecutar Migraciones de Base de Datos

Crear las tablas necesarias en Supabase:

```bash
supabase db push
```

Esto ejecutará la migración `20251119000001_add_metrosalud_sync.sql` que crea:
- Tabla `sync_metadata`
- Columna `metrosalud_data` en `pacientes`
- Índices necesarios

---

## 📝 Paso 7: Desplegar la Edge Function

```bash
supabase functions deploy metrosalud-sync
```

Esto desplegará la función a Supabase Edge Network.

---

## 📝 Paso 8: Verificar el Deployment

### 8.1 Ver logs de la función

```bash
supabase functions logs metrosalud-sync
```

### 8.2 Invocar la función manualmente (test)

```bash
supabase functions invoke metrosalud-sync --query action=status
```

Deberías ver un JSON response con el estado de sincronización.

---

## 📝 Paso 9: Actualizar Variables de Entorno en Vercel

Ya NO necesitas la variable `VITE_METROSALUD_API_URL`.

El servicio ahora usa automáticamente `VITE_SUPABASE_URL` que ya está configurada.

**Opcional:** Si quieres limpiar, puedes eliminar `VITE_METROSALUD_API_URL` de Vercel.

---

## 📝 Paso 10: Commit y Deploy

```bash
git add .
git commit -m "feat: Replace Google Apps Script with Supabase Edge Function

Migrated Metrosalud sync from Google Apps Script to Supabase Edge Function:
- Created metrosalud-sync Edge Function
- Added sync_metadata table and migration
- Updated metrosalud-sync.service.ts to use Supabase Functions
- Eliminated CORS issues
- Improved security with Supabase Auth
- 100% TypeScript end-to-end

Benefits:
✅ No CORS issues
✅ Better performance
✅ Integrated auth
✅ Easier maintenance
✅ All code in one repo

🤖 Generated with Claude Code
https://claude.com/claude-code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

Vercel hará auto-deploy en ~2 minutos.

---

## ✅ Verificación Final

### Test 1: Verificar en Supabase Dashboard

1. Ir a: https://supabase.com/dashboard/project/iddmxktttzivoujywzgg
2. **Edge Functions** → Deberías ver `metrosalud-sync`
3. Click en la función → Ver logs

### Test 2: Probar en la App

1. Ir a: https://sarident-hco.vercel.app/
2. Login
3. **Sincronización** → **"Sincronizar Ahora"**
4. Deberías ver: ✅ "X pacientes sincronizados"
5. **NO** deberías ver errores de CORS

---

## 🔄 Configurar Sincronización Automática (Opcional)

Para sincronización automática diaria a las 6:00 AM, usa pg_cron en Supabase:

```sql
-- En Supabase SQL Editor
SELECT cron.schedule(
  'metrosalud-daily-sync',
  '0 6 * * *', -- Diario a las 6:00 AM
  $$
  SELECT
    net.http_post(
      url := 'https://iddmxktttzivoujywzgg.supabase.co/functions/v1/metrosalud-sync?action=sync',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
    );
  $$
);
```

---

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
supabase functions logs metrosalud-sync --follow
```

### Ver sincronizaciones en la base de datos

```sql
SELECT * FROM sync_metadata
ORDER BY created_at DESC
LIMIT 10;
```

---

## ❌ Troubleshooting

### Error: "GOOGLE_SHEETS_API_KEY no está configurada"

**Solución:**
```bash
supabase secrets set GOOGLE_SHEETS_API_KEY=TU_API_KEY
```

### Error: "Permission denied for table pacientes"

**Solución:** Verificar RLS policies en Supabase.

### Error: "Function not found"

**Solución:**
```bash
supabase functions deploy metrosalud-sync
```

### La sincronización es lenta

**Normal:** Primera sincronización puede tomar 15-30 segundos para ~150 pacientes.

---

## 🎉 ¡Listo!

Ahora tienes una solución completa sin dependencias de Google Apps Script:

- ✅ Sin CORS issues
- ✅ Más rápido
- ✅ Más seguro
- ✅ Más fácil de mantener
- ✅ Todo en TypeScript
- ✅ Todo en Supabase

---

**Resumen de Comandos:**

```bash
# 1. Login
supabase login

# 2. Link proyecto
supabase link --project-ref iddmxktttzivoujywzgg

# 3. Configurar secret
supabase secrets set GOOGLE_SHEETS_API_KEY=TU_API_KEY

# 4. Migrar DB
supabase db push

# 5. Deploy función
supabase functions deploy metrosalud-sync

# 6. Verificar
supabase functions invoke metrosalud-sync --query action=status

# 7. Commit y push
git add . && git commit -m "..." && git push
```

**Tiempo total estimado:** 20-30 minutos
