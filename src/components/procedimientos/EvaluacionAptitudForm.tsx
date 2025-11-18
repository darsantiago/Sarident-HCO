import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { evaluacionAptitudSchema, type EvaluacionAptitudInput } from '@/lib/validations/procedimientos.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface EvaluacionAptitudFormProps {
  onSubmit: (data: EvaluacionAptitudInput) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<EvaluacionAptitudInput>;
}

export const EvaluacionAptitudForm = ({ onSubmit, onCancel, defaultValues }: EvaluacionAptitudFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EvaluacionAptitudInput>({
    resolver: zodResolver(evaluacionAptitudSchema),
    defaultValues: defaultValues || {
      sin_enf_periodontal: false,
      sin_caries_activas: false,
      higiene_adecuada: false,
      sin_contraindicaciones: false,
      radiografia_tomada: false,
      resultado_evaluacion: 'PENDIENTE - Evaluación adicional',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evaluación de Aptitud</h3>

        <div className="space-y-4">
          <Checkbox
            {...register('sin_enf_periodontal')}
            label="Sin enfermedad periodontal"
          />
          {errors.sin_enf_periodontal && (
            <p className="text-sm text-red-600">{errors.sin_enf_periodontal.message}</p>
          )}

          <Checkbox
            {...register('sin_caries_activas')}
            label="Sin caries activas"
          />

          <Checkbox
            {...register('higiene_adecuada')}
            label="Higiene oral adecuada"
          />

          <Checkbox
            {...register('espacio_interoclusal')}
            label="Espacio interoclusal adecuado"
          />

          <Checkbox
            {...register('rebordes_adecuados')}
            label="Rebordes adecuados"
          />

          <Checkbox
            {...register('sin_contraindicaciones')}
            label="Sin contraindicaciones médicas"
          />

          <Checkbox
            {...register('paciente_colaborador')}
            label="Paciente colaborador"
          />

          <Checkbox
            {...register('radiografia_tomada')}
            label="Radiografía panorámica tomada"
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="resultado_evaluacion">Resultado de Evaluación *</Label>
            <Select {...register('resultado_evaluacion')} id="resultado_evaluacion">
              <option value="APTO">APTO</option>
              <option value="NO APTO - Requiere tratamiento previo">NO APTO - Requiere tratamiento previo</option>
              <option value="PENDIENTE - Evaluación adicional">PENDIENTE - Evaluación adicional</option>
            </Select>
            {errors.resultado_evaluacion && (
              <p className="text-sm text-red-600">{errors.resultado_evaluacion.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tratamiento_previo">Tratamiento Previo Requerido</Label>
            <Textarea
              {...register('tratamiento_previo')}
              id="tratamiento_previo"
              placeholder="Especifique el tratamiento previo necesario..."
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              {...register('observaciones')}
              id="observaciones"
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div>
            <Label htmlFor="firma_profesional">Firma del Profesional *</Label>
            <Input
              {...register('firma_profesional')}
              id="firma_profesional"
              placeholder="Nombre completo del profesional"
            />
            {errors.firma_profesional && (
              <p className="text-sm text-red-600">{errors.firma_profesional.message}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Evaluación'}
        </Button>
      </div>
    </form>
  );
};
