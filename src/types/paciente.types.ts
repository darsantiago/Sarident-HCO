export interface Paciente {
  id: string;
  documento: string;
  nombre: string;
  fecha_nacimiento: string;
  edad?: number;
  telefono?: string;
  direccion?: string;
  email?: string;
  metrosalud_id?: string;
  metrosalud_sync_at?: string;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at: string;
}

export type PacienteFormData = Omit<Paciente, 'id' | 'created_at' | 'updated_at' | 'edad'>;

export interface PacienteFilters {
  search?: string;
  estado?: 'activo' | 'inactivo' | 'todos';
}
