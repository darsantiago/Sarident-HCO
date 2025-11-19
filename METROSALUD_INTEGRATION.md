# Integración con Metrosalud - Google Apps Script

## Descripción General

Esta aplicación está integrada con el sistema de Google Apps Script del proyecto **Sarident-HCO-MS** que sincroniza datos de pacientes desde Google Sheets de Metrosalud.

## Arquitectura

```
Metrosalud Google Sheet (Remoto)
         ↓
Google Apps Script (sync.gs)
         ↓
API REST (doGet/doPost)
         ↓
React App (metrosalud-sync.service.ts)
         ↓
Supabase Database (Local)
```

## Configuración Requerida

### 1. Desplegar Google Apps Script Web App

El código de Google Apps Script está en el repositorio: `https://github.com/darsantiago/Sarident-HCO-MS`

**Pasos:**

1. Abrir Google Apps Script del proyecto Sarident-HCO-MS
2. Ir a **Implementar** → **Nueva implementación**
3. Tipo: **Aplicación web**
4. Configuración:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier persona
5. Copiar la **URL de implementación**
   - Ejemplo: `https://script.google.com/macros/s/AKfycby.../exec`

### 2. Configurar Variable de Entorno

#### En desarrollo (local):

Crear o editar archivo `.env.local`:

```bash
VITE_METROSALUD_API_URL=https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec
```

#### En producción (Vercel):

1. Ir a Vercel Dashboard → Proyecto Sarident-HCO
2. Settings → Environment Variables
3. Agregar nueva variable:
   - **Name:** `VITE_METROSALUD_API_URL`
   - **Value:** URL de implementación de Google Apps Script
   - **Environments:** Production, Preview, Development

4. Hacer un nuevo deployment para aplicar los cambios

## Endpoints Disponibles

El servicio de Google Apps Script expone los siguientes endpoints:

### 1. Sincronizar Pacientes

```
GET https://script.google.com/macros/s/.../exec?action=sync
```

**Respuesta:**
```json
{
  "ok": true,
  "pacientes_sincronizados": 150,
  "duracion_segundos": 12,
  "fecha": "2025-11-19T10:30:00.000Z"
}
```

### 2. Obtener Estado de Sincronización

```
GET https://script.google.com/macros/s/.../exec?action=status
```

**Respuesta:**
```json
{
  "ultima_sincronizacion": {
    "fecha": "2025-11-19T06:00:00.000Z",
    "pacientes": 150,
    "estado": "exitoso",
    "duracion": 12,
    "error": null,
    "mensaje": "Última sincronización exitosa"
  },
  "necesita_sincronizar": {
    "necesita": false,
    "razon": "Última sync hace 4h (OK)"
  },
  "config": {
    "archivo_local_id": "1Do7fMSxHkFMNnLHd0rQFXXf2uj6B6qWZLlrunEhb72M",
    "configurado": true,
    "trigger_hora": 6,
    "max_horas_sin_sync": 24
  }
}
```

### 3. Configurar Sincronización Automática

```
GET https://script.google.com/macros/s/.../exec?action=configTrigger
```

Configura un trigger diario a las 6:00 AM para sincronización automática.

**Respuesta:**
```json
{
  "ok": true,
  "mensaje": "Sincronización automática configurada a las 6:00 AM"
}
```

### 4. Eliminar Sincronización Automática

```
GET https://script.google.com/macros/s/.../exec?action=removeTrigger
```

**Respuesta:**
```json
{
  "ok": true,
  "mensaje": "1 trigger(s) de sincronización eliminado(s)"
}
```

## Uso en la Aplicación

### Página de Sincronización

Navegar a **Sincronización** en el menú lateral.

**Funcionalidades:**

1. **Ver Estado**: Muestra última sincronización, pacientes sincronizados, duración
2. **Sincronizar Ahora**: Botón para ejecutar sincronización manual
3. **Activar/Desactivar Sync Automática**: Configura trigger diario en Google Apps Script
4. **Alertas**: Muestra si hace más de 24h desde última sincronización

### Integración con Supabase

Los pacientes sincronizados desde Metrosalud se guardarán en la tabla `pacientes` de Supabase, permitiendo:

- Búsqueda offline
- Creación de historias clínicas
- Gestión local de datos
- Sincronización bidireccional (futura mejora)

## Estructura de Datos

El Google Apps Script sincroniza **88 columnas** de datos de pacientes, incluyendo:

- Información básica (nombre, documento, teléfono, EPS)
- Fechas de evaluación y procedimientos
- Tipo de prótesis (superior/inferior)
- Fechas de impresiones, laboratorio, enfilado
- Instalación y controles
- Facturación y garantías
- Estado final del paciente

Ver `sync.gs:112-258` para el mapeo completo de columnas.

## Normalización de Fechas

El sistema incluye normalización automática de fechas para corregir:
- Años problemáticos (1900, 1901, 1902, 205)
- Formato DD/MM/YYYY
- Valores inválidos o nulos

Ver `sync.gs:599-683` para la lógica de normalización.

## Troubleshooting

### Error: "VITE_METROSALUD_API_URL no está configurada"

**Solución:** Agregar la variable de entorno en `.env.local` o Vercel.

### Error: "HTTP 403: Forbidden"

**Solución:** Verificar que el Google Apps Script esté desplegado con acceso "Cualquier persona".

### Error: "No se pudieron leer pacientes de Metrosalud"

**Solución:**
1. Verificar que el Google Sheet ID en `config.gs` sea correcto
2. Verificar permisos de acceso al Google Sheet
3. Revisar logs de Google Apps Script (Ver > Registros)

### Sincronización lenta o timeout

**Solución:**
- El sistema procesa datos en batch para optimizar rendimiento
- Tiempos normales: 10-15 segundos para ~150 pacientes
- Si supera los 30 segundos, verificar la conexión con Google Sheets

## Desarrollo

### Servicio TypeScript

El servicio está en: `src/services/metrosalud-sync.service.ts`

**Funciones exportadas:**

```typescript
// Sincronizar manualmente
await sincronizarPacientesMetrosalud()

// Obtener estado
const status = await obtenerEstadoSincronizacion()

// Configurar auto-sync
await configurarSyncAutomatica()

// Eliminar auto-sync
await eliminarSyncAutomatica()
```

### Página de Sincronización

El componente está en: `src/pages/SincronizacionPage.tsx`

Características:
- Estado en tiempo real de sincronización
- Indicadores visuales (verde=exitoso, rojo=error, ámbar=atención)
- Botones para sincronización manual y configuración
- Información contextual sobre sincronización automática

## Seguridad

- La API de Google Apps Script está configurada para acceso público
- No requiere autenticación porque ya está protegida por:
  - Permisos de Google Sheet (solo cuentas autorizadas)
  - Deployment ID único y difícil de adivinar
  - Solo expone endpoints de lectura (no escritura desde React app)

## Próximas Mejoras

1. **Sincronización bidireccional**: Enviar cambios locales a Google Sheets
2. **Sincronización selectiva**: Sincronizar solo pacientes modificados
3. **Notificaciones**: Alertas cuando hay nuevos pacientes
4. **Logs detallados**: Historial de sincronizaciones en la UI
5. **Resolución de conflictos**: Manejo de cambios simultáneos
6. **Webhook**: Sincronización automática cuando cambia el Google Sheet

## Referencias

- Repositorio Google Apps Script: https://github.com/darsantiago/Sarident-HCO-MS
- Documentación de optimizaciones: `Sarident-HCO-MS/OPTIMIZACIONES.md`
- Google Apps Script Docs: https://developers.google.com/apps-script
