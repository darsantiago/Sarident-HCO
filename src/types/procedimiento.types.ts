import type { FotoClinica } from './foto.types';

export type TipoProcedimiento =
  | 'EVALUACION_APTITUD'
  | 'APERTURA_HC'
  | 'IMPRESIONES'
  | 'PRUEBA_RODETES'
  | 'PRUEBA_DIENTES'
  | 'INSTALACION'
  | 'CONTROL'
  | 'GARANTIA';

export interface Procedimiento {
  id: string;
  historia_clinica_id: string;
  tipo: string;
  fecha: string;
  notas?: string;
  created_at: string;
  updated_at: string;

  fotos?: FotoClinica[];
}

export type ProcedimientoFormData = Omit<
  Procedimiento,
  'id' | 'created_at' | 'updated_at' | 'fotos'
>;
export type ProcedimientoCreate = Omit<Procedimiento, 'id' | 'created_at' | 'updated_at'>;

// Tipos específicos para cada procedimiento

export interface EvaluacionAptitudData {
  sin_enf_periodontal: boolean;
  sin_caries_activas: boolean;
  higiene_adecuada: boolean;
  espacio_interoclusal?: boolean;
  rebordes_adecuados?: boolean;
  sin_contraindicaciones: boolean;
  paciente_colaborador?: boolean;
  radiografia_tomada: boolean;
  resultado_evaluacion: 'APTO' | 'NO APTO - Requiere tratamiento previo' | 'PENDIENTE - Evaluación adicional';
  tratamiento_previo?: string;
  observaciones?: string;
  firma_profesional: string;
}

export interface AperturaHCData {
  motivo_consulta: string;
  enfermedad_actual: string;
  antecedentes?: string;
  examen_fisico?: string;
  diagnostico: string;
  plan_tratamiento: string;
  firma_profesional: string;
}

export interface ImpresionesData {
  tipo_impresion: 'Alginato' | 'Silicona' | 'Otro';
  arcada: 'Superior' | 'Inferior' | 'Ambas';
  observaciones?: string;
  firma_profesional: string;
}

export interface PruebaRodetesData {
  dimension_vertical_correcta: boolean;
  relacion_centrica_correcta: boolean;
  linea_media_correcta: boolean;
  observaciones?: string;
}

export interface PruebaDientesData {
  estetica_aprobada: boolean;
  oclusion_correcta: boolean;
  ajustes_realizados?: string;
}

export interface InstalacionData {
  tipo_protesis: string[]; // Array: ['Total superior', 'Total inferior', etc]
  ajustes_instalacion?: string;
  observaciones?: string;
  instrucciones_paciente: string;
  control_programado?: string;
  firma_profesional: string;
}

export interface ControlData {
  numero_control: 'Control 1 (15 días)' | 'Control 2 (1 mes)' | 'Control adicional';
  adaptacion_correcta: boolean;
  sin_molestias: boolean;
  ajustes_realizados?: string;
  paciente_satisfecho?: boolean;
}

export interface GarantiaData {
  motivo_garantia: 'Fractura de prótesis' | 'Desajuste' | 'Molestias persistentes' | 'Diente(s) suelto(s)' | 'Otro';
  descripcion_problema: string;
  solucion_aplicada: 'Reparación' | 'Rebase' | 'Ajuste' | 'Reemplazo completo' | 'Otro';
  detalles_solucion?: string;
  problema_resuelto?: boolean;
}
