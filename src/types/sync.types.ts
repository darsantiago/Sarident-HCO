export interface SincronizacionLog {
  id: string;
  ultima_sync: string;
  pacientes_sincronizados: number;
  pacientes_nuevos: number;
  pacientes_actualizados: number;
  errores?: string;
  duracion_ms: number;
  estado: 'exitosa' | 'fallida' | 'parcial';
  created_at: string;
}

export interface OperacionPendiente {
  id: string;
  tipo: 'create' | 'update' | 'delete';
  tabla: 'pacientes' | 'historias_clinicas' | 'procedimientos' | 'fotos_clinicas';
  datos: Record<string, any>;
  created_at: string;
}

export interface EstadoConexion {
  online: boolean;
  operacionesPendientes: number;
}
