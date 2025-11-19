# 🎯 Próximos Pasos - Activar Sincronización con Metrosalud

## ✅ Lo que Ya Está Hecho

- ✅ Código de React completo con UI de sincronización
- ✅ Servicio TypeScript para comunicarse con Google Apps Script
- ✅ Página de Sincronización funcional con estado en tiempo real
- ✅ Documentación completa (3 guías)
- ✅ Script automatizado de configuración
- ✅ Todo commiteado y pusheado a GitHub
- ✅ Vercel hará auto-deploy de los cambios

## ⏳ Lo que Falta (Tu Parte)

### Paso 1: Desplegar Google Apps Script como Web App

**Tiempo estimado: 5-10 minutos**

1. **Abrir Google Apps Script:**
   - Ir a: https://script.google.com
   - Buscar el proyecto **"Sarident HC v6.37"**
   - O el que tenga los archivos de: https://github.com/darsantiago/Sarident-HCO-MS

2. **Verificar que tenga estos archivos:**
   - ✅ config.gs
   - ✅ main.gs (con función `doGet()`)
   - ✅ sync.gs
   - ✅ pacientes.gs
   - ✅ utils.gs

3. **Desplegar:**
   - Click en **Implementar** → **Nueva implementación**
   - Seleccionar tipo: **Aplicación web**
   - Configurar:
     - **Descripción:** "API REST para Sarident HCO"
     - **Ejecutar como:** **Yo** (tu cuenta)
     - **Quién tiene acceso:** **Cualquier persona** ⚠️ Importante!
   - Click **Implementar**

4. **Autorizar:**
   - Aparecerá popup pidiendo permisos
   - Click en tu cuenta
   - Click "Avanzado" → "Ir a [proyecto] (no seguro)"
   - Click "Permitir"

5. **Copiar la URL:**
   - Aparecerá algo como:
   ```
   https://script.google.com/macros/s/AKfycby...LARGO.../exec
   ```
   - **COPIA TODA LA URL** (hasta `/exec`)

### Paso 2: Configurar en tu Computadora (Desarrollo)

**Opción A - Usando el script automatizado (recomendado):**

```bash
cd /home/dsantiago/apps/Sarident-HCO
./scripts/setup-metrosalud.sh "https://script.google.com/macros/s/TU_URL_AQUI/exec"
```

**Opción B - Manual:**

Editar `.env.local` y descomentar/actualizar:
```bash
VITE_METROSALUD_API_URL=https://script.google.com/macros/s/TU_URL_AQUI/exec
```

**Reiniciar el servidor:**
```bash
npm run dev
```

**Probar:**
1. Abrir http://localhost:5173
2. Ir a **Sincronización**
3. Click **"Sincronizar Ahora"**
4. Deberías ver: "X pacientes sincronizados en Y segundos"

### Paso 3: Configurar en Vercel (Producción)

**Tiempo estimado: 3-5 minutos**

1. **Ir a Vercel:**
   - https://vercel.com/dashboard
   - Seleccionar proyecto **Sarident-HCO**

2. **Agregar Variable de Entorno:**
   - **Settings** → **Environment Variables**
   - Click **"Add New"**
   - Configurar:
     - **Name:** `VITE_METROSALUD_API_URL`
     - **Value:** La URL completa que copiaste
     - **Environments:** Marcar TODO (Production, Preview, Development)
   - Click **Save**

3. **Redeploy:**
   - Ir a **Deployments**
   - Click en los **...** del último deployment
   - Click **"Redeploy"**
   - Esperar ~2 minutos

4. **Verificar:**
   - Abrir: https://sarident-hco-nltq.vercel.app/
   - Ir a **Sincronización**
   - Click **"Sincronizar Ahora"**
   - ✅ Debe funcionar!

## 🧪 Cómo Probar que Funciona

### Test 1: Endpoint de Status

Abre en el navegador (reemplaza con tu URL):
```
https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec?action=status
```

Debe responder con JSON:
```json
{
  "ultima_sincronizacion": {
    "fecha": "...",
    "pacientes": 150,
    "estado": "exitoso"
  },
  ...
}
```

### Test 2: Sincronización Manual

1. En la app, ir a **Sincronización**
2. Click **"Sincronizar Ahora"**
3. Ver toast de éxito con número de pacientes
4. Ver estado actualizado en la página

### Test 3: Sincronización Automática

1. Click **"Activar Sync Automática"**
2. Ver toast confirmando activación
3. Ver en la UI: "La sincronización automática está programada para las 6:00 AM diariamente"

## 📚 Documentación de Referencia

Si tienes problemas, consulta estas guías:

1. **[CONFIGURAR_METROSALUD.md](./CONFIGURAR_METROSALUD.md)** - Guía paso a paso con troubleshooting
2. **[METROSALUD_INTEGRATION.md](./METROSALUD_INTEGRATION.md)** - Documentación técnica completa
3. **[README.md](./README.md)** - Overview del proyecto

## ❌ Problemas Comunes

### Error: "VITE_METROSALUD_API_URL no está configurada"

**Causa:** La variable de entorno no está configurada o el servidor no se reinició.

**Solución:**
- Desarrollo: Verificar `.env.local` y reiniciar `npm run dev`
- Producción: Verificar variable en Vercel y hacer redeploy

### Error: "HTTP 403: Forbidden"

**Causa:** El Google Apps Script no tiene acceso público.

**Solución:**
1. Google Apps Script → **Implementar → Administrar implementaciones**
2. Click ✏️ en la implementación
3. "Quién tiene acceso" → **"Cualquier persona"**
4. Click **Actualizar**

### Error: "Cannot read properties of undefined"

**Causa:** Los IDs de Google Sheets en `config.gs` son incorrectos.

**Solución:**
Verificar en `config.gs`:
```javascript
SPREADSHEET_ID: '1Do7fMSxHkFMNnLHd0rQFXXf2uj6B6qWZLlrunEhb72M',
METROSALUD_PACIENTES_ID: '16GW84zwQlxSWn99PHefQt-jseHce4NdxK4AOD1v3-tY',
```

### La sincronización es muy lenta

**Normal:** 10-20 segundos para ~150 pacientes.

**Si toma >30 segundos:**
- Verificar conexión a internet
- Revisar logs de Google Apps Script (Ver > Registros)

## 🎉 Una Vez Configurado

La aplicación podrá:

- ✅ Sincronizar pacientes desde Metrosalud Google Sheets
- ✅ Mostrar estado de sincronización en tiempo real
- ✅ Configurar sincronización automática diaria (6:00 AM)
- ✅ Alertar si hace más de 24h sin sincronizar
- ✅ Normalizar fechas automáticamente
- ✅ Manejar 88 columnas de datos de pacientes
- ✅ Mostrar duración y número de pacientes sincronizados

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Revisar logs de Google Apps Script:**
   - En el editor → **Ver > Registros** (View > Logs)
   - Ejecutar función `testSincronizacion()` manualmente

2. **Revisar consola del navegador:**
   - F12 → Console
   - Buscar errores rojos

3. **Consultar troubleshooting:**
   - [CONFIGURAR_METROSALUD.md](./CONFIGURAR_METROSALUD.md) tiene sección completa

---

**Resumen Ultra-Rápido:**

1. Desplegar Google Apps Script como Web App → Copiar URL
2. Ejecutar: `./scripts/setup-metrosalud.sh "LA_URL"`
3. En Vercel: Settings → Environment Variables → Agregar `VITE_METROSALUD_API_URL`
4. Redeploy en Vercel
5. ✅ ¡Listo!
