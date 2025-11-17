import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { controlSchema, type ControlInput } from '@/lib/validations/procedimientos.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ControlFormProps {
  onSubmit: (data: ControlInput) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<ControlInput>;
}

export const ControlForm = ({ onSubmit, onCancel, defaultValues }: ControlFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ControlInput>({
    resolver: zodResolver(controlSchema),
    defaultValues: defaultValues || {
      numero_control: 'Control 1 (15 días)',
      adaptacion_correcta: false,
      sin_molestias: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Control Post-Instalación</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="numero_control">Número de Control *</Label>
            <Select {...register('numero_control')} id="numero_control">
              <option value="Control 1 (15 días)">Control 1 (15 días)</option>
              <option value="Control 2 (1 mes)">Control 2 (1 mes)</option>
              <option value="Control adicional">Control adicional</option>
            </Select>
            {errors.numero_control && (
              <p className="text-sm text-red-600">{errors.numero_control.message}</p>
            )}
          </div>

          <Checkbox
            {...register('adaptacion_correcta')}
            label="Adaptación correcta de la prótesis"
          />

          <Checkbox
            {...register('sin_molestias')}
            label="Paciente sin molestias"
          />

          <Checkbox
            {...register('paciente_satisfecho')}
            label="Paciente satisfecho con el resultado"
          />

          <div>
            <Label htmlFor="ajustes_realizados">Ajustes Realizados</Label>
            <Textarea
              {...register('ajustes_realizados')}
              id="ajustes_realizados"
              placeholder="Detalles de los ajustes realizados durante el control..."
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
          {isSubmitting ? 'Guardando...' : 'Guardar Control'}
        </Button>
      </div>
    </form>
  );
};
