import type { Paciente } from './paciente.types';
import type { Procedimiento } from './procedimiento.types';

export interface HistoriaClinica {
  id: string;
  paciente_id: string;
  motivo_consulta: string;
  antecedentes_medicos?: string;
  antecedentes_odontologicos?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;

  // Relaciones populadas
  paciente?: Paciente;
  procedimientos?: Procedimiento[];
}

export type HistoriaClinicaFormData = Omit<
  HistoriaClinica,
  'id' | 'created_at' | 'updated_at' | 'paciente' | 'procedimientos'
>;
export type HistoriaClinicaCreate = Omit<HistoriaClinica, 'id' | 'created_at' | 'updated_at'>;
