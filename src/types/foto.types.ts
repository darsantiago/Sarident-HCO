export type TipoFoto =
  | 'frontal'
  | 'lateral'
  | 'oclusal'
  | 'panoramica'
  | 'intraoral'
  | 'extraoral';

export interface FotoClinica {
  id: string;
  procedimiento_id: string;
  tipo: TipoFoto;
  url: string;
  storage_path: string;
  created_at: string;
}

export type FotoClinicaFormData = Omit<FotoClinica, 'id' | 'created_at'>;
export type FotoClinicaCreate = Omit<FotoClinica, 'id' | 'created_at'>;
