import Dexie, { Table } from 'dexie';
import { Paciente } from '../../types/paciente.types';
import { HistoriaClinica } from '../../types/historia-clinica.types';
import { Procedimiento } from '../../types/procedimiento.types';
import { FotoClinica } from '../../types/foto.types';
import { OperacionPendiente } from '../../types/sync.types';

export class SaridentDB extends Dexie {
  pacientes!: Table<Paciente, string>;
  historias_clinicas!: Table<HistoriaClinica, string>;
  procedimientos!: Table<Procedimiento, string>;
  fotos_clinicas!: Table<FotoClinica, string>;
  operaciones_pendientes!: Table<OperacionPendiente, string>;

  constructor() {
    super('SaridentDB');
    
    this.version(1).stores({
      pacientes: 'id, documento, nombre, estado, created_at',
      historias_clinicas: 'id, paciente_id, estado, fecha_apertura',
      procedimientos: 'id, historia_clinica_id, tipo, fecha',
      fotos_clinicas: 'id, procedimiento_id, tipo, created_at',
      operaciones_pendientes: '++id, tipo, tabla, created_at',
    });
  }
}

export const db = new SaridentDB();

// Helper functions for offline operations
export const addOperacionPendiente = async (
  tipo: 'create' | 'update' | 'delete',
  tabla: OperacionPendiente['tabla'],
  datos: Record<string, any>
) => {
  await db.operaciones_pendientes.add({
    id: crypto.randomUUID(),
    tipo,
    tabla,
    datos,
    created_at: new Date().toISOString(),
  });
};

export const getOperacionesPendientes = async () => {
  return await db.operaciones_pendientes.toArray();
};

export const clearOperacionesPendientes = async () => {
  await db.operaciones_pendientes.clear();
};

export const deleteOperacionPendiente = async (id: string) => {
  await db.operaciones_pendientes.delete(id);
};
