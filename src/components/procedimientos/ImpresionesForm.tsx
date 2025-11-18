import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { impresionesSchema, type ImpresionesInput } from '@/lib/validations/procedimientos.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ImpresionesFormProps {
  onSubmit: (data: ImpresionesInput) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<ImpresionesInput>;
}

export const ImpresionesForm = ({ onSubmit, onCancel, defaultValues }: ImpresionesFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ImpresionesInput>({
    resolver: zodResolver(impresionesSchema),
    defaultValues: defaultValues || {
      tipo_impresion: 'Alginato',
      arcada: 'Ambas',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Toma de Impresiones</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="tipo_impresion">Tipo de Impresión *</Label>
            <Select {...register('tipo_impresion')} id="tipo_impresion">
              <option value="Alginato">Alginato</option>
              <option value="Silicona">Silicona</option>
              <option value="Otro">Otro</option>
            </Select>
            {errors.tipo_impresion && (
              <p className="text-sm text-red-600">{errors.tipo_impresion.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="arcada">Arcada *</Label>
            <Select {...register('arcada')} id="arcada">
              <option value="Superior">Superior</option>
              <option value="Inferior">Inferior</option>
              <option value="Ambas">Ambas</option>
            </Select>
            {errors.arcada && (
              <p className="text-sm text-red-600">{errors.arcada.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              {...register('observaciones')}
              id="observaciones"
              placeholder="Detalles sobre la toma de impresiones..."
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
          {isSubmitting ? 'Guardando...' : 'Guardar Impresiones'}
        </Button>
      </div>
    </form>
  );
};
