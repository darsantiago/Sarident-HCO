/**
 * METROSALUD SYNC SERVICE
 * Servicio para sincronizar datos con Google Sheets de Metrosalud
 * Conecta con Google Apps Script Web App
 */

const METROSALUD_API_URL = import.meta.env.VITE_METROSALUD_API_URL || '';

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
    archivo_local_id: string | null;
    configurado: boolean;
    trigger_hora: number;
    max_horas_sin_sync: number;
  };
}

/**
 * Sincronizar pacientes desde Metrosalud manualmente
 */
export async function sincronizarPacientesMetrosalud(): Promise<MetrosaludSyncResult> {
  if (!METROSALUD_API_URL) {
    throw new Error('VITE_METROSALUD_API_URL no está configurada en las variables de entorno');
  }

  try {
    const response = await fetch(`${METROSALUD_API_URL}?action=sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sincronizando con Metrosalud:', error);
    throw error;
  }
}

/**
 * Obtener estado de la última sincronización
 */
export async function obtenerEstadoSincronizacion(): Promise<MetrosaludSyncStatus> {
  if (!METROSALUD_API_URL) {
    return {
      ultima_sincronizacion: {
        fecha: null,
        pacientes: 0,
        estado: 'no_configurado',
        mensaje: 'API de Metrosalud no configurada',
      },
      necesita_sincronizar: {
        necesita: false,
        razon: 'API no configurada',
      },
      config: {
        archivo_local_id: null,
        configurado: false,
        trigger_hora: 6,
        max_horas_sin_sync: 24,
      },
    };
  }

  try {
    const response = await fetch(`${METROSALUD_API_URL}?action=status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const status = await response.json();

    // Convertir fecha string a Date object
    if (status.ultima_sincronizacion?.fecha) {
      status.ultima_sincronizacion.fecha = new Date(status.ultima_sincronizacion.fecha);
    }

    return status;
  } catch (error) {
    console.error('Error obteniendo estado de sincronización:', error);
    throw error;
  }
}

/**
 * Configurar sincronización automática
 */
export async function configurarSyncAutomatica(): Promise<{ ok: boolean; mensaje: string }> {
  if (!METROSALUD_API_URL) {
    throw new Error('VITE_METROSALUD_API_URL no está configurada');
  }

  try {
    const response = await fetch(`${METROSALUD_API_URL}?action=configTrigger`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error configurando sync automática:', error);
    throw error;
  }
}

/**
 * Eliminar sincronización automática
 */
export async function eliminarSyncAutomatica(): Promise<{ ok: boolean; mensaje: string }> {
  if (!METROSALUD_API_URL) {
    throw new Error('VITE_METROSALUD_API_URL no está configurada');
  }

  try {
    const response = await fetch(`${METROSALUD_API_URL}?action=removeTrigger`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error eliminando sync automática:', error);
    throw error;
  }
}
