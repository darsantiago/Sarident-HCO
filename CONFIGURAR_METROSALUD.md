# 🔧 Guía Rápida: Configurar Sincronización con Metrosalud

## ⚠️ IMPORTANTE

La sincronización con Metrosalud requiere desplegar el Google Apps Script como Web App. Sigue estos pasos exactamente:

## 📋 Pasos para Configurar

### 1. Abrir el Proyecto de Google Apps Script

1. Ve a: https://script.google.com
2. Busca el proyecto **"Sarident HC v6.37"** o el que contiene los archivos del repositorio `Sarident-HCO-MS`
3. Si no existe, debes copiar todos los archivos `.gs` del repositorio a un nuevo proyecto

### 2. Verificar Archivos Necesarios

Asegúrate de que el proyecto tenga estos archivos:

- ✅ `config.gs` - Configuración con IDs de Google Sheets
- ✅ `main.gs` - Entry point con `doGet()` y `doPost()`
- ✅ `sync.gs` - Lógica de sincronización
- ✅ `pacientes.gs` - Gestión de pacientes
- ✅ `utils.gs` - Utilidades
- ✅ `Index.html` - Interfaz web (opcional, solo para ver la webapp directamente)

### 3. Desplegar como Web App

**Pasos en Google Apps Script:**

1. Click en **Implementar** (Deploy) → **Nueva implementación** (New deployment)

2. Click en el ícono de ⚙️ al lado de "Seleccionar tipo" → **Aplicación web** (Web app)

3. Configurar la implementación:
   - **Descripción:** "API REST para Sarident HCO - React App"
   - **Ejecutar como:** **Yo** (tu cuenta de Google)
   - **Quién tiene acceso:** **Cualquier persona** (Anyone)

   > ⚠️ **IMPORTANTE:** Debe ser "Cualquier persona" para que la React app pueda acceder

4. Click en **Implementar** (Deploy)

5. **Autorizar Acceso:**
   - Aparecerá un popup pidiendo permisos
   - Click en tu cuenta de Google
   - Click en "Avanzado" (Advanced)
   - Click en "Ir a [nombre del proyecto] (no seguro)"
   - Click en "Permitir" (Allow)

6. **Copiar la URL de Web App:**
   - Aparecerá una URL como:
   ```
   https://script.google.com/macros/s/AKfycby...CARACTERES_LARGOS.../exec
   ```
   - **COPIA COMPLETA ESTA URL** (incluye todo hasta `/exec`)

### 4. Configurar Variables de Entorno

#### En Desarrollo (tu computadora):

Edita el archivo `.env.local`:

```bash
# Descomentar y pegar la URL que copiaste:
VITE_METROSALUD_API_URL=https://script.google.com/macros/s/AKfycby...TU_URL_AQUI.../exec
```

Reinicia el servidor de desarrollo:
```bash
npm run dev
```

#### En Producción (Vercel):

1. Ir a: https://vercel.com/dashboard
2. Seleccionar el proyecto **Sarident-HCO**
3. **Settings** → **Environment Variables**
4. Click en **Add New**
5. Configurar:
   - **Name:** `VITE_METROSALUD_API_URL`
   - **Value:** La URL completa que copiaste
   - **Environments:** Marcar todos (Production, Preview, Development)
6. Click en **Save**
7. **Redeploy** el proyecto:
   - Ir a **Deployments**
   - Click en los **...** del último deployment
   - Click en **Redeploy**

### 5. Probar la Integración

1. Abrir la aplicación en: https://sarident-hco-nltq.vercel.app/
2. Ir a **Sincronización** en el menú
3. Deberías ver:
   - ✅ Estado de la última sincronización
   - ✅ Botón "Sincronizar Ahora" funcional
   - ✅ Botón para activar/desactivar sync automática

4. Click en **"Sincronizar Ahora"**
5. Si todo está bien, verás:
   - Un mensaje de éxito
   - Número de pacientes sincronizados
   - Tiempo que tomó la sincronización

## 🔍 Verificar que Todo Funciona

### Test Manual en Google Apps Script:

1. En el editor de Apps Script
2. Archivo: `sync.gs`
3. Función: `testSincronizacion`
4. Click en **Ejecutar** (Run)
5. Ver el **Logger** (View > Logs) - debe mostrar pacientes sincronizados

### Test del Endpoint Web:

Abre en tu navegador (reemplaza con tu URL):
```
https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec?action=status
```

Debe responder con JSON como:
```json
{
  "ultima_sincronizacion": {
    "fecha": "2025-11-19T06:00:00.000Z",
    "pacientes": 150,
    "estado": "exitoso",
    ...
  },
  "necesita_sincronizar": { ... },
  "config": { ... }
}
```

## ❌ Problemas Comunes

### Error: "Script function not found: doGet"

**Solución:** Asegúrate de que `main.gs` tenga la función `doGet(e)` y que el archivo esté guardado.

### Error: "Authorization required"

**Solución:**
1. Ve a **Implementar → Administrar implementaciones**
2. Click en el ícono de editar ✏️
3. Cambia "Ejecutar como" a **"Yo"**
4. Cambia "Quién tiene acceso" a **"Cualquier persona"**
5. Click en **Implementar → Actualizar**

### Error: "Cannot read properties of undefined"

**Solución:** Verifica que `config.gs` tenga los IDs correctos de Google Sheets:
```javascript
CONFIG = {
  SPREADSHEET_ID: '1Do7fMSxHkFMNnLHd0rQFXXf2uj6B6qWZLlrunEhb72M',
  METROSALUD_PACIENTES_ID: '16GW84zwQlxSWn99PHefQt-jseHce4NdxK4AOD1v3-tY',
  METROSALUD_SHEET_NAME: 'Seguimiento2025'
}
```

### Error: "VITE_METROSALUD_API_URL no está configurada"

**Solución:**
1. Verifica que `.env.local` tenga la variable descomentada
2. Reinicia `npm run dev`
3. En Vercel, verifica que la variable esté en Environment Variables
4. Haz un redeploy después de agregar la variable

### La sincronización es muy lenta

**Normal:** La primera sincronización puede tomar 15-20 segundos para ~150 pacientes.

**Si toma más de 30 segundos:**
1. Verifica tu conexión a internet
2. Revisa los logs de Google Apps Script
3. Puede que haya demasiados datos - considera optimizar en `sync.gs`

## 📚 Documentación Completa

Para más detalles, consulta:
- [METROSALUD_INTEGRATION.md](./METROSALUD_INTEGRATION.md) - Documentación técnica completa
- Repositorio Google Apps Script: https://github.com/darsantiago/Sarident-HCO-MS

## 🎯 Siguiente Paso

Una vez configurada la URL, la aplicación podrá:
- ✅ Sincronizar pacientes desde Metrosalud
- ✅ Mostrar estado de sincronización en tiempo real
- ✅ Configurar sincronización automática diaria (6:00 AM)
- ✅ Alertar si hace más de 24h sin sincronizar

---

**¿Necesitas ayuda?** Revisa los logs de Google Apps Script en: **Ver > Registros** (View > Logs)
