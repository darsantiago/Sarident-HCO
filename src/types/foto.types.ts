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
  nombre: string;
  descripcion?: string;
  url: string;
  thumbnail_url?: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  tipo?: TipoFoto;
  created_at: string;
}

export type FotoClinicaFormData = Omit<FotoClinica, 'id' | 'created_at'>;
