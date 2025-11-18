import { z } from 'zod';

// Schema para Evaluación de Aptitud
export const evaluacionAptitudSchema = z.object({
  sin_enf_periodontal: z.boolean(),
  sin_caries_activas: z.boolean(),
  higiene_adecuada: z.boolean(),
  espacio_interoclusal: z.boolean().optional(),
  rebordes_adecuados: z.boolean().optional(),
  sin_contraindicaciones: z.boolean(),
  paciente_colaborador: z.boolean().optional(),
  radiografia_tomada: z.boolean(),
  resultado_evaluacion: z.enum(['APTO', 'NO APTO - Requiere tratamiento previo', 'PENDIENTE - Evaluación adicional']),
  tratamiento_previo: z.string().optional(),
  observaciones: z.string().optional(),
  firma_profesional: z.string().min(1, 'La firma del profesional es requerida'),
});

// Schema para Impresiones
export const impresionesSchema = z.object({
  tipo_impresion: z.enum(['Alginato', 'Silicona', 'Otro']),
  arcada: z.enum(['Superior', 'Inferior', 'Ambas']),
  observaciones: z.string().optional(),
  firma_profesional: z.string().min(1, 'La firma del profesional es requerida'),
});

// Schema para Prueba de Rodetes
export const pruebaRodetesSchema = z.object({
  dimension_vertical_correcta: z.boolean(),
  relacion_centrica_correcta: z.boolean(),
  linea_media_correcta: z.boolean(),
  observaciones: z.string().optional(),
  firma_profesional: z.string().min(1, 'La firma del profesional es requerida'),
});

// Schema para Prueba de Dientes
export const pruebaDientesSchema = z.object({
  estetica_aprobada: z.boolean(),
  oclusion_correcta: z.boolean(),
  ajustes_realizados: z.string().optional(),
  firma_profesional: z.string().min(1, 'La firma del profesional es requerida'),
});

// Schema para Instalación
export const instalacionSchema = z.object({
  tipo_protesis: z.array(z.string()).min(1, 'Seleccione al menos un tipo de prótesis'),
  ajustes_instalacion: z.string().optional(),
  observaciones: z.string().optional(),
  instrucciones_paciente: z.string().min(1, 'Las instrucciones al paciente son requeridas'),
  control_programado: z.string().optional(),
  firma_profesional: z.string().min(1, 'La firma del profesional es requerida'),
});

// Schema para Control
export const controlSchema = z.object({
  numero_control: z.enum(['Control 1 (15 días)', 'Control 2 (1 mes)', 'Control adicional']),
  adaptacion_correcta: z.boolean(),
  sin_molestias: z.boolean(),
  ajustes_realizados: z.string().optional(),
  paciente_satisfecho: z.boolean().optional(),
  firma_profesional: z.string().min(1, 'La firma del profesional es requerida'),
});

// Schema para Garantía
export const garantiaSchema = z.object({
  motivo_garantia: z.enum([
    'Fractura de prótesis',
    'Desajuste',
    'Molestias persistentes',
    'Diente(s) suelto(s)',
    'Otro'
  ]),
  descripcion_problema: z.string().min(10, 'Describa el problema en detalle'),
  solucion_aplicada: z.enum(['Reparación', 'Rebase', 'Ajuste', 'Reemplazo completo', 'Otro']),
  detalles_solucion: z.string().optional(),
  problema_resuelto: z.boolean().optional(),
  firma_profesional: z.string().min(1, 'La firma del profesional es requerida'),
});

// Schema para Paciente
export const pacienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  documento: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  fecha_nacimiento: z.string().optional(),
  genero: z.enum(['masculino', 'femenino', 'otro']),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  estado: z.enum(['activo', 'inactivo']).default('activo'),
});

// Schema para Historia Clínica
export const historiaClinicaSchema = z.object({
  motivo_consulta: z.string().min(10, 'El motivo de consulta debe ser más detallado'),
  antecedentes_medicos: z.string().optional(),
  antecedentes_odontologicos: z.string().optional(),
  observaciones: z.string().optional(),
});

export type EvaluacionAptitudInput = z.infer<typeof evaluacionAptitudSchema>;
export type ImpresionesInput = z.infer<typeof impresionesSchema>;
export type PruebaRodetesInput = z.infer<typeof pruebaRodetesSchema>;
export type PruebaDientesInput = z.infer<typeof pruebaDientesSchema>;
export type InstalacionInput = z.infer<typeof instalacionSchema>;
export type ControlInput = z.infer<typeof controlSchema>;
export type GarantiaInput = z.infer<typeof garantiaSchema>;
export type PacienteInput = z.infer<typeof pacienteSchema>;
export type HistoriaClinicaInput = z.infer<typeof historiaClinicaSchema>;
