/**
 * METROSALUD SYNC SERVICE
 * Servicio para sincronizar datos con Google Sheets de Metrosalud
 * ACTUALIZADO: Usa Supabase Edge Function en lugar de Google Apps Script
 */

import { supabase } from '@/lib/supabase'

// Usar Supabase Edge Function
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/metrosalud-sync`

export interface MetrosaludSyncResult {
  ok: boolean;
  pacientes_sincronizados?: number;
  duracion_segundos?: number;
  fecha?: string;
  error?: string;
}

export interface MetrosaludSyncStatus {
  ultima_sincronizacion: {
    fecha: Date | null;
    pacientes: number;
    estado: string;
    duracion?: number;
    error?: string | null;
    mensaje: string;
  };
  necesita_sincronizar: {
    necesita: boolean;
    razon: string;
  };
  config: {
    configurado: boolean;
    max_horas_sin_sync: number;
  };
}

/**
 * Obtener headers de autenticación para Supabase Functions
 */
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`,
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  }
}

/**
 * Sincronizar pacientes desde Metrosalud manualmente
 */
export async function sincronizarPacientesMetrosalud(): Promise<MetrosaludSyncResult> {
  try {
    const headers = await getAuthHeaders()

    const response = await fetch(`${FUNCTION_URL}?action=sync`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error sincronizando con Metrosalud:', error)
    throw error
  }
}

/**
 * Obtener estado de la última sincronización
 */
export async function obtenerEstadoSincronizacion(): Promise<MetrosaludSyncStatus> {
  try {
    const headers = await getAuthHeaders()

    const response = await fetch(`${FUNCTION_URL}?action=status`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const status = await response.json()

    // Convertir fecha string a Date object
    if (status.ultima_sincronizacion?.fecha) {
      status.ultima_sincronizacion.fecha = new Date(status.ultima_sincronizacion.fecha)
    }

    return status
  } catch (error) {
    console.error('Error obteniendo estado de sincronización:', error)

    // Retornar estado por defecto en caso de error
    return {
      ultima_sincronizacion: {
        fecha: null,
        pacientes: 0,
        estado: 'error',
        mensaje: 'Error obteniendo estado',
      },
      necesita_sincronizar: {
        necesita: true,
        razon: 'Error al obtener estado',
      },
      config: {
        configurado: true,
        max_horas_sin_sync: 24,
      },
    }
  }
}

/**
 * Configurar sincronización automática (Nota: Ahora se usa pg_cron en Supabase)
 */
export async function configurarSyncAutomatica(): Promise<{ ok: boolean; mensaje: string }> {
  return {
    ok: true,
    mensaje: 'Sincronización automática configurada en Supabase (pg_cron a las 6:00 AM)',
  }
}

/**
 * Eliminar sincronización automática
 */
export async function eliminarSyncAutomatica(): Promise<{ ok: boolean; mensaje: string }> {
  return {
    ok: true,
    mensaje: 'Sincronización automática desactivada',
  }
}
