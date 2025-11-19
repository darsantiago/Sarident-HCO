# 📋 Código para Copiar y Pegar en Supabase Edge Function Editor

## Pasos:

1. **Click en "Open Editor"** en Supabase Dashboard
2. **Function name:** `metrosalud-sync`
3. **Copiar TODO el código de abajo** y pegarlo en el editor
4. Click **"Deploy"**

---

## 📝 CÓDIGO (Copiar desde aquí ↓)

```typescript
// Supabase Edge Function para sincronizar pacientes desde Metrosalud Google Sheets
// Reemplaza completamente la necesidad de Google Apps Script

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const METROSALUD_SHEET_ID = '16GW84zwQlxSWn99PHefQt-jseHce4NdxK4AOD1v3-tY'
const SHEET_NAME = 'Seguimiento2025'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'sync'

    // Get Google API key from environment
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY')
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_SHEETS_API_KEY no está configurada')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    switch (action) {
      case 'sync':
        return await syncPacientes(GOOGLE_API_KEY, supabase)

      case 'status':
        return await getSyncStatus(supabase)

      default:
        return new Response(
          JSON.stringify({ ok: false, error: `Acción no reconocida: ${action}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error en Edge Function:', error)
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Sincronizar pacientes desde Google Sheets a Supabase
 */
async function syncPacientes(apiKey: string, supabase: any) {
  const startTime = Date.now()

  try {
    console.log('🔄 Iniciando sincronización desde Metrosalud...')

    // 1. Leer datos de Google Sheets usando Google Sheets API
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${METROSALUD_SHEET_ID}/values/${SHEET_NAME}?key=${apiKey}`

    const response = await fetch(sheetUrl)
    if (!response.ok) {
      throw new Error(`Error leyendo Google Sheets: ${response.statusText}`)
    }

    const data = await response.json()
    const rows = data.values || []

    if (rows.length < 4) {
      throw new Error('No hay datos en la hoja de Metrosalud')
    }

    // Los headers están en la fila 3 (índice 2)
    // Los datos comienzan en la fila 4 (índice 3)
    const headers = rows[2]
    const dataRows = rows.slice(3)

    console.log(`📊 Filas leídas: ${dataRows.length}`)

    // 2. Transformar datos a formato de pacientes
    const pacientes = dataRows
      .map((row, index) => transformRowToPaciente(row, index))
      .filter(p => p !== null)

    console.log(`✅ Pacientes válidos: ${pacientes.length}`)

    // 3. Insertar/actualizar en Supabase
    for (const paciente of pacientes) {
      const { error } = await supabase
        .from('pacientes')
        .upsert({
          ...paciente,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'documento'
        })

      if (error) {
        console.error(`Error insertando paciente ${paciente.documento}:`, error)
      }
    }

    // 4. Guardar metadata de sincronización
    const duration = Math.round((Date.now() - startTime) / 1000)

    await supabase.from('sync_metadata').insert({
      sync_type: 'metrosalud',
      pacientes_sincronizados: pacientes.length,
      estado: 'exitoso',
      duracion_segundos: duration
    })

    return new Response(
      JSON.stringify({
        ok: true,
        pacientes_sincronizados: pacientes.length,
        duracion_segundos: duration,
        fecha: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000)

    // Guardar metadata de error
    await supabase.from('sync_metadata').insert({
      sync_type: 'metrosalud',
      pacientes_sincronizados: 0,
      estado: 'error',
      error_mensaje: error.message,
      duracion_segundos: duration
    })

    throw error
  }
}

/**
 * Obtener estado de última sincronización
 */
async function getSyncStatus(supabase: any) {
  try {
    // Obtener última sincronización
    const { data: lastSync, error } = await supabase
      .from('sync_metadata')
      .select('*')
      .eq('sync_type', 'metrosalud')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const now = new Date()
    const lastSyncDate = lastSync?.created_at ? new Date(lastSync.created_at) : null
    const hoursSinceSync = lastSyncDate
      ? (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60)
      : null

    const needsSync = !lastSyncDate || hoursSinceSync > 24

    return new Response(
      JSON.stringify({
        ultima_sincronizacion: {
          fecha: lastSyncDate,
          pacientes: lastSync?.pacientes_sincronizados || 0,
          estado: lastSync?.estado || 'nunca_sincronizado',
          duracion: lastSync?.duracion_segundos,
          error: lastSync?.error_mensaje || null,
          mensaje: lastSync ? 'Última sincronización completada' : 'Nunca sincronizado'
        },
        necesita_sincronizar: {
          necesita: needsSync,
          razon: needsSync
            ? (lastSyncDate
                ? `Pasaron ${Math.round(hoursSinceSync)}h desde última sync (máx: 24h)`
                : 'Nunca se ha sincronizado')
            : `Última sync hace ${Math.round(hoursSinceSync)}h (OK)`
        },
        config: {
          configurado: true,
          max_horas_sin_sync: 24
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw error
  }
}

/**
 * Transformar fila de Google Sheets a objeto Paciente
 */
function transformRowToPaciente(row: any[], index: number) {
  try {
    // Construcción del nombre completo
    const primerNombre = row[4] || ''
    const segundoNombre = row[5] || ''
    const primerApellido = row[6] || ''
    const segundoApellido = row[7] || ''
    const nombreCompleto = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.trim()

    if (!nombreCompleto || !row[3]) {
      return null
    }

    return {
      // Información básica
      documento: String(row[3]),
      nombre: nombreCompleto,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      tipo_documento: 'CC',
      telefono: String(row[8] || ''),
      celular: String(row[10] || ''),
      eps: 'METROSALUD',

      // Metadata de Metrosalud (guardar como JSONB)
      metrosalud_data: {
        numero: row[1] || '',
        telefono_2: String(row[9] || ''),
        revision_sisplan: row[0] || '',
        paciente_moravia: row[11] || '',
        seleccion_consulta_evaluacion: row[12] || '',
        radiografia_panoramica: row[13] || '',
        paciente_apto_programa: row[14] || '',
        observaciones_adicionales: row[15] || '',
        numero_protesis: row[16] || '',
        tipo_evaluacion_superior: row[17] || '',
        tipo_evaluacion_inferior: row[18] || '',
      }
    }
  } catch (error) {
    console.error(`Error transformando fila ${index}:`, error)
    return null
  }
}
```

---

## ⚙️ Después de Pegar el Código:

### 1. Configurar el Secret (Google API Key)

**Opción A - Via UI:**
1. En el Dashboard → **Project Settings** → **Edge Functions**
2. Buscar "Secrets" o "Environment Variables"
3. Click **"Add secret"**
4. Name: `GOOGLE_SHEETS_API_KEY`
5. Value: Tu API Key
6. Save

**Opción B - En el editor mismo:**
Algunos editores tienen un panel de "Secrets" en la parte inferior.

### 2. Deploy

Click en el botón **"Deploy"** o **"Save"**

### 3. Hacer Público el Google Sheet

1. Abrir: https://docs.google.com/spreadsheets/d/16GW84zwQlxSWn99PHefQt-jseHce4NdxK4AOD1v3-tY/edit
2. Click **"Share"** (Compartir)
3. Cambiar a: **"Anyone with the link"** → **"Viewer"**
4. Copy link y verificar que funciona en incógnito

---

## ✅ Verificar que Funciona

Una vez desplegado, puedes probarlo abriendo en tu navegador:

```
https://iddmxktttzivoujywzgg.supabase.co/functions/v1/metrosalud-sync?action=status
```

Deberías ver un JSON con el estado de sincronización.

---

¡Listo! Una vez que veas que funciona el endpoint, la app de Vercel automáticamente empezará a usar esta función.
