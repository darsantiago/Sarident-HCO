import { Paciente } from './paciente.types';
import { Procedimiento } from './procedimiento.types';

export interface HistoriaClinica {
  id: string;
  paciente_id: string;
  fecha_apertura: string;
  motivo_consulta: string;
  enfermedad_actual: string;
  antecedentes?: string;
  examen_fisico?: string;
  diagnostico: string;
  plan_tratamiento: string;
  profesional_apertura: string;
  estado: 'activa' | 'finalizada' | 'archivada';
  created_at: string;
  updated_at: string;
  
  // Relaciones populadas
  paciente?: Paciente;
  procedimientos?: Procedimiento[];
}

export type HistoriaClinicaFormData = Omit<
  HistoriaClinica, 
  'id' | 'created_at' | 'updated_at' | 'paciente' | 'procedimientos' | 'fecha_apertura' | 'estado'
>;
