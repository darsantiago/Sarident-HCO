import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { garantiaSchema, type GarantiaInput } from '@/lib/validations/procedimientos.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface GarantiaFormProps {
  onSubmit: (data: GarantiaInput) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<GarantiaInput>;
}

export const GarantiaForm = ({ onSubmit, onCancel, defaultValues }: GarantiaFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GarantiaInput>({
    resolver: zodResolver(garantiaSchema),
    defaultValues: defaultValues || {
      motivo_garantia: 'Fractura de prótesis',
      solucion_aplicada: 'Reparación',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Garantía de Prótesis</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="motivo_garantia">Motivo de la Garantía *</Label>
            <Select {...register('motivo_garantia')} id="motivo_garantia">
              <option value="Fractura de prótesis">Fractura de prótesis</option>
              <option value="Desajuste">Desajuste</option>
              <option value="Molestias persistentes">Molestias persistentes</option>
              <option value="Diente(s) suelto(s)">Diente(s) suelto(s)</option>
              <option value="Otro">Otro</option>
            </Select>
            {errors.motivo_garantia && (
              <p className="text-sm text-red-600">{errors.motivo_garantia.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descripcion_problema">Descripción del Problema *</Label>
            <Textarea
              {...register('descripcion_problema')}
              id="descripcion_problema"
              placeholder="Describa en detalle el problema presentado..."
              rows={4}
            />
            {errors.descripcion_problema && (
              <p className="text-sm text-red-600">{errors.descripcion_problema.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="solucion_aplicada">Solución Aplicada *</Label>
            <Select {...register('solucion_aplicada')} id="solucion_aplicada">
              <option value="Reparación">Reparación</option>
              <option value="Rebase">Rebase</option>
              <option value="Ajuste">Ajuste</option>
              <option value="Reemplazo completo">Reemplazo completo</option>
              <option value="Otro">Otro</option>
            </Select>
            {errors.solucion_aplicada && (
              <p className="text-sm text-red-600">{errors.solucion_aplicada.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="detalles_solucion">Detalles de la Solución</Label>
            <Textarea
              {...register('detalles_solucion')}
              id="detalles_solucion"
              placeholder="Detalles técnicos de la solución aplicada..."
            />
          </div>

          <Checkbox
            {...register('problema_resuelto')}
            label="Problema resuelto satisfactoriamente"
          />

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
          {isSubmitting ? 'Guardando...' : 'Guardar Garantía'}
        </Button>
      </div>
    </form>
  );
};
