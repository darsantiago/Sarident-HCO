import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instalacionSchema, type InstalacionInput } from '@/lib/validations/procedimientos.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface InstalacionFormProps {
  onSubmit: (data: InstalacionInput) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<InstalacionInput>;
}

const TIPOS_PROTESIS = [
  'Total superior',
  'Total inferior',
  'Parcial superior',
  'Parcial inferior',
  'Inmediata',
];

export const InstalacionForm = ({ onSubmit, onCancel, defaultValues }: InstalacionFormProps) => {
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>(
    defaultValues?.tipo_protesis || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<InstalacionInput>({
    resolver: zodResolver(instalacionSchema),
    defaultValues: defaultValues || {
      tipo_protesis: [],
    },
  });

  const handleCheckboxChange = (tipo: string, checked: boolean) => {
    const nuevosSeleccionados = checked
      ? [...tiposSeleccionados, tipo]
      : tiposSeleccionados.filter((t) => t !== tipo);

    setTiposSeleccionados(nuevosSeleccionados);
    setValue('tipo_protesis', nuevosSeleccionados);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Instalación de Prótesis</h3>

        <div className="space-y-4">
          <div>
            <Label>Tipo de Prótesis *</Label>
            <div className="mt-2 space-y-2">
              {TIPOS_PROTESIS.map((tipo) => (
                <Checkbox
                  key={tipo}
                  label={tipo}
                  checked={tiposSeleccionados.includes(tipo)}
                  onChange={(e) => handleCheckboxChange(tipo, (e.target as HTMLInputElement).checked)}
                />
              ))}
            </div>
            {errors.tipo_protesis && (
              <p className="text-sm text-red-600">{errors.tipo_protesis.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ajustes_instalacion">Ajustes Durante Instalación</Label>
            <Textarea
              {...register('ajustes_instalacion')}
              id="ajustes_instalacion"
              placeholder="Ajustes realizados durante la instalación..."
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
            <Label htmlFor="instrucciones_paciente">Instrucciones al Paciente *</Label>
            <Textarea
              {...register('instrucciones_paciente')}
              id="instrucciones_paciente"
              placeholder="Instrucciones de cuidado y uso de la prótesis..."
              rows={4}
            />
            {errors.instrucciones_paciente && (
              <p className="text-sm text-red-600">{errors.instrucciones_paciente.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="control_programado">Fecha de Control Programado</Label>
            <Input
              {...register('control_programado')}
              id="control_programado"
              type="date"
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
          {isSubmitting ? 'Guardando...' : 'Guardar Instalación'}
        </Button>
      </div>
    </form>
  );
};
