import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pruebaDientesSchema, type PruebaDientesInput } from '@/lib/validations/procedimientos.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface PruebaDientesFormProps {
  onSubmit: (data: PruebaDientesInput) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<PruebaDientesInput>;
}

export const PruebaDientesForm = ({ onSubmit, onCancel, defaultValues }: PruebaDientesFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PruebaDientesInput>({
    resolver: zodResolver(pruebaDientesSchema),
    defaultValues: defaultValues || {
      estetica_aprobada: false,
      oclusion_correcta: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Prueba de Dientes</h3>

        <div className="space-y-4">
          <Checkbox
            {...register('estetica_aprobada')}
            label="Estética aprobada por el paciente"
          />

          <Checkbox
            {...register('oclusion_correcta')}
            label="Oclusión correcta"
          />

          <div>
            <Label htmlFor="ajustes_realizados">Ajustes Realizados</Label>
            <Textarea
              {...register('ajustes_realizados')}
              id="ajustes_realizados"
              placeholder="Detalles de los ajustes realizados..."
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
