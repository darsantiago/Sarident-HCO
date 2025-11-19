# 🔧 Fix CORS en Google Apps Script

## ❌ Problema

El Google Apps Script actual bloquea peticiones desde Vercel por falta de headers CORS:
```
Access to fetch has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

## ✅ Solución

Actualizar el archivo `main.gs` en Google Apps Script para manejar peticiones API con CORS.

---

## 📝 Instrucciones Paso a Paso

### 1. Abrir Google Apps Script

1. Ir a: https://script.google.com
2. Abrir el proyecto de Sarident-HCO-MS
3. Abrir el archivo `main.gs`

### 2. Reemplazar la Función `doGet()`

**ENCUENTRA esta función** (líneas 13-88):

```javascript
function doGet(e) {
  try {
    // LOG: Inicio de doGet
    console.log('🔵 doGet() - Iniciando...');
    console.log('📦 Parámetros recibidos:', JSON.stringify(e ? e.parameter : null));

    // SIEMPRE mostrar la aplicación principal directamente
    console.log('🎯 Mostrando página INDEX (aplicación principal)');
    console.log('✅ Archivo: Index.html');

    const output = HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Sarident HC v6.95 - Historias Clínicas')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    console.log('✅ Página Index creada exitosamente');
    return output;

  } catch (error) {
    // ... código de error ...
  }
}
```

**REEMPLÁZALA con esta nueva versión:**

```javascript
function doGet(e) {
  try {
    // LOG: Inicio de doGet
    console.log('🔵 doGet() - Iniciando...');
    console.log('📦 Parámetros recibidos:', JSON.stringify(e ? e.parameter : null));

    // Si tiene parámetro 'action', es una petición API (desde React app)
    if (e && e.parameter && e.parameter.action) {
      console.log('🔵 Petición API detectada - action:', e.parameter.action);
      return handleAPIRequest(e);
    }

    // Sin action parameter → Servir la aplicación HTML
    console.log('🎯 Mostrando página INDEX (aplicación principal)');
    console.log('✅ Archivo: Index.html');

    const output = HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Sarident HC v6.95 - Historias Clínicas')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    console.log('✅ Página Index creada exitosamente');
    return output;

  } catch (error) {
    console.error('❌ ERROR CRÍTICO en doGet():', error.message);
    console.error('❌ Stack trace:', error.stack);

    // Si es petición API, devolver error JSON
    if (e && e.parameter && e.parameter.action) {
      return createCORSResponse({
        ok: false,
        error: error.message
      });
    }

    // Si es petición HTML, devolver página de error
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - Sarident HC</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 40px;
            text-align: center;
          }
          .error-box {
            background: white;
            border: 2px solid #ef4444;
            border-radius: 8px;
            padding: 30px;
            max-width: 600px;
            margin: 0 auto;
          }
          h1 { color: #ef4444; }
          pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            text-align: left;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <div class="error-box">
          <h1>❌ Error al Cargar la Aplicación</h1>
          <p><strong>Mensaje:</strong> ${error.message}</p>
          <h3>Detalles Técnicos:</h3>
          <pre>${error.stack || 'No stack trace available'}</pre>
          <p style="margin-top: 20px;">
            <strong>Posibles causas:</strong><br>
            1. Archivo HTML no encontrado en Apps Script<br>
            2. Error de sintaxis en el archivo HTML<br>
            3. Problema de permisos<br>
          </p>
          <p style="margin-top: 20px;">
            Por favor, revisa la consola de Apps Script (Ver > Registros) para más detalles.
          </p>
        </div>
      </body>
      </html>
    `;

    return HtmlService.createHtmlOutput(errorHtml)
      .setTitle('Error - Sarident HC');
  }
}
```

### 3. Agregar Nuevas Funciones al Final del Archivo

**AGREGAR estas funciones ANTES de la última línea del archivo `main.gs`:**

```javascript
/**
 * ============================================================================
 * API REQUEST HANDLER CON CORS
 * ============================================================================
 * Maneja peticiones API desde la React app con soporte CORS completo
 */

/**
 * Manejar peticiones API desde React app
 */
function handleAPIRequest(e) {
  const action = e.parameter.action;

  console.log('🔵 handleAPIRequest() - action:', action);

  try {
    let result;

    switch (action) {
      case 'sync':
        // Sincronizar pacientes desde Metrosalud
        result = sincronizarPacientesDesdeMetrosalud();
        break;

      case 'status':
        // Obtener estado de sincronización
        result = obtenerEstadoSincronizacionWrapper();
        break;

      case 'configTrigger':
        // Configurar trigger de sync automática
        result = configurarSincronizacionAutomatica();
        break;

      case 'removeTrigger':
        // Eliminar trigger de sync automática
        result = eliminarSincronizacionAutomatica();
        break;

      default:
        result = {
          ok: false,
          error: `Acción no reconocida: ${action}`
        };
    }

    console.log('✅ Resultado de action:', JSON.stringify(result));
    return createCORSResponse(result);

  } catch (error) {
    console.error('❌ Error en handleAPIRequest:', error.message);
    console.error('Stack:', error.stack);

    return createCORSResponse({
      ok: false,
      error: error.message,
      stack: error.stack
    });
  }
}

/**
 * Crear respuesta JSON con headers CORS
 */
function createCORSResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  // No podemos agregar headers personalizados en ContentService
  // pero Google Apps Script automáticamente permite CORS si
  // el Web App está configurado con acceso "Cualquier persona"

  return output;
}
```

### 4. Guardar el Archivo

Click en **Guardar** (💾) o `Ctrl+S`

### 5. Redesplegar el Web App

**MUY IMPORTANTE - Sigue estos pasos exactos:**

1. Click en **Implementar** → **Administrar implementaciones**
2. En la implementación activa, click en el ícono de **lápiz ✏️** (editar)
3. En **"Nueva descripción"**, escribe algo como: "v2 - API con soporte CORS"
4. Click en **Implementar**
5. **¡IMPORTANTE!** Verifica que siga con:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona** ← Esto es crítico para CORS

6. Click en **Listo**

---

## ✅ Verificar que Funciona

### Test 1: Verificar URL en Navegador

Abre en tu navegador:
```
https://script.google.com/macros/s/AKfycbywjgodKbOE9BfRjI3_H9xPN4BPykmk0bd6492OLBtQrqU-u9xaZOzbBFZWs7AJw-qVsw/exec?action=status
```

Deberías ver un JSON response como:
```json
{
  "ultima_sincronizacion": { ... },
  "necesita_sincronizar": { ... },
  "config": { ... }
}
```

### Test 2: Probar en la App

1. Ir a: https://sarident-hco.vercel.app/
2. Login
3. Ir a: **Sincronización**
4. Ya **NO** debería haber errores de CORS
5. Debería cargar el estado de sincronización

---

## 🎯 Resumen de Cambios

1. ✅ `doGet()` ahora detecta si es petición API (con `?action=...`)
2. ✅ Peticiones API van a `handleAPIRequest()`
3. ✅ `handleAPIRequest()` maneja 4 actions: sync, status, configTrigger, removeTrigger
4. ✅ Respuestas JSON con CORS automático (por configuración "Cualquier persona")

---

## ❓ Troubleshooting

### Error: "function not found"

**Causa:** El archivo `sync.gs` no está en el proyecto o las funciones no existen.

**Solución:** Verifica que existan estas funciones en `sync.gs`:
- `sincronizarPacientesDesdeMetrosalud()`
- `obtenerEstadoSincronizacionWrapper()`
- `configurarSincronizacionAutomatica()`
- `eliminarSincronizacionAutomatica()`

### Sigue habiendo error CORS

**Causa:** El Web App no está configurado con "Cualquier persona".

**Solución:**
1. Implementar → Administrar implementaciones
2. Editar implementación
3. **Quién tiene acceso:** Cambiar a **"Cualquier persona"**
4. Guardar

### La URL cambió después de redesplegar

**Causa:** Creaste un nuevo deployment en lugar de actualizar el existente.

**Solución:** La nueva URL es válida. Cópiala y actualízala en:
- `.env.local` (local)
- Vercel Environment Variables (producción)

---

**¿Listo?** Sigue estos pasos y el error CORS desaparecerá. Avísame cuando lo hayas hecho y probamos.
