import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Paciente } from '@/types/paciente.types'
import { cn } from '@/lib/utils/cn'

interface PacienteCardProps {
  paciente: Paciente
  onEdit?: (paciente: Paciente) => void
  onDelete?: (id: string) => void
}

export const PacienteCard = ({ paciente, onEdit, onDelete }: PacienteCardProps) => {
  const edad = paciente.fecha_nacimiento
    ? new Date().getFullYear() - new Date(paciente.fecha_nacimiento).getFullYear()
    : null

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            to={`/pacientes/${paciente.id}`}
            className="block hover:text-primary"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {paciente.nombre} {paciente.apellido}
            </h3>
          </Link>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Documento:</span> {paciente.documento}
            </p>
            {edad && (
              <p>
                <span className="font-medium">Edad:</span> {edad} años
              </p>
            )}
            {paciente.telefono && (
              <p>
                <span className="font-medium">Teléfono:</span> {paciente.telefono}
              </p>
            )}
            {paciente.email && (
              <p>
                <span className="font-medium">Email:</span> {paciente.email}
              </p>
            )}
          </div>

          <div className="mt-3">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                paciente.estado === 'activo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              {paciente.estado}
            </span>
          </div>
        </div>

        <div className="ml-4 flex flex-col gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(paciente)}
            >
              Editar
            </Button>
          )}
          {onDelete && paciente.estado === 'activo' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(paciente.id)}
              className="text-red-600 hover:text-red-700"
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
