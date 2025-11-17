import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pruebaRodetesSchema, type PruebaRodetesInput } from '@/lib/validations/procedimientos.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface PruebaRodetesFormProps {
  onSubmit: (data: PruebaRodetesInput) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<PruebaRodetesInput>;
}

export const PruebaRodetesForm = ({ onSubmit, onCancel, defaultValues }: PruebaRodetesFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PruebaRodetesInput>({
    resolver: zodResolver(pruebaRodetesSchema),
    defaultValues: defaultValues || {
      dimension_vertical_correcta: false,
      relacion_centrica_correcta: false,
      linea_media_correcta: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Prueba de Rodetes</h3>

        <div className="space-y-4">
          <Checkbox
            {...register('dimension_vertical_correcta')}
            label="Dimensión vertical correcta"
          />

          <Checkbox
            {...register('relacion_centrica_correcta')}
            label="Relación céntrica correcta"
          />

          <Checkbox
            {...register('linea_media_correcta')}
            label="Línea media correcta"
          />

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              {...register('observaciones')}
              id="observaciones"
              placeholder="Observaciones sobre la prueba de rodetes..."
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
          {isSubmitting ? 'Guardando...' : 'Guardar Prueba'}
        </Button>
      </div>
    </form>
  );
};
