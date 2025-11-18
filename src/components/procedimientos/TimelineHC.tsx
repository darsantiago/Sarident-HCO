import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Procedimiento } from '@/types/procedimiento.types';

interface TimelineHCProps {
  procedimientos: Procedimiento[];
  onVerDetalle?: (procedimiento: Procedimiento) => void;
}

const TIPO_LABELS: Record<string, string> = {
  EVALUACION_APTITUD: 'Evaluación de Aptitud',
  APERTURA_HC: 'Apertura de HC',
  IMPRESIONES: 'Toma de Impresiones',
  PRUEBA_RODETES: 'Prueba de Rodetes',
  PRUEBA_DIENTES: 'Prueba de Dientes',
  INSTALACION: 'Instalación',
  CONTROL: 'Control',
  GARANTIA: 'Garantía',
};

const TIPO_COLORS: Record<string, string> = {
  EVALUACION_APTITUD: 'bg-blue-500',
  APERTURA_HC: 'bg-green-500',
  IMPRESIONES: 'bg-purple-500',
  PRUEBA_RODETES: 'bg-yellow-500',
  PRUEBA_DIENTES: 'bg-orange-500',
  INSTALACION: 'bg-indigo-500',
  CONTROL: 'bg-teal-500',
  GARANTIA: 'bg-red-500',
};

export const TimelineHC = ({ procedimientos, onVerDetalle }: TimelineHCProps) => {
  if (procedimientos.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No hay procedimientos registrados</p>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Línea vertical del timeline */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 md:left-6" />

      <div className="space-y-6">
        {procedimientos.map((procedimiento, index) => (
          <div key={procedimiento.id} className="relative pl-12 md:pl-16">
            {/* Punto del timeline */}
            <div
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ${
                TIPO_COLORS[procedimiento.tipo] || 'bg-gray-500'
              } md:left-2`}
            >
              <span className="text-xs font-bold text-white">{index + 1}</span>
            </div>

            <Card className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {TIPO_LABELS[procedimiento.tipo] || procedimiento.tipo}
                  </h3>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Fecha:</span>{' '}
                      {new Date(procedimiento.fecha).toLocaleDateString()}
                    </p>

                    {procedimiento.notas && (
                      <p className="mt-2">
                        <span className="font-medium">Notas:</span> {procedimiento.notas}
                      </p>
                    )}
                  </div>

                  {procedimiento.fotos && procedimiento.fotos.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{procedimiento.fotos.length} foto(s)</span>
                    </div>
                  )}
                </div>

                {onVerDetalle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVerDetalle(procedimiento)}
                  >
                    Ver Detalle
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
