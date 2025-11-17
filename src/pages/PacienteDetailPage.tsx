import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { pacientesService } from '@/services/pacientes.service'
import { useHistoriaClinica } from '@/hooks/use-historia-clinica'
import { useProcedimientos } from '@/hooks/use-procedimientos'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Paciente } from '@/types/paciente.types'

export const PacienteDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { historia, createHistoria } = useHistoriaClinica(id)
  const { procedimientos } = useProcedimientos(historia?.id)

  useEffect(() => {
    if (id) {
      loadPaciente()
    }
  }, [id])

  const loadPaciente = async () => {
    if (!id) return

    try {
      const data = await pacientesService.getById(id)
      setPaciente(data)
    } catch (error) {
      console.error('Error al cargar paciente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbrirHistoria = async () => {
    if (!id) return

    await createHistoria({
      paciente_id: id,
      motivo_consulta: '',
      antecedentes_medicos: '',
      antecedentes_odontologicos: '',
      observaciones: '',
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500">Paciente no encontrado</p>
        <Link to="/pacientes">
          <Button className="mt-4">Volver a pacientes</Button>
        </Link>
      </div>
    )
  }

  const edad = paciente.fecha_nacimiento
    ? new Date().getFullYear() - new Date(paciente.fecha_nacimiento).getFullYear()
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {paciente.nombre} {paciente.apellido}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {paciente.documento} {edad && `• ${edad} años`}
          </p>
        </div>
        <Link to="/pacientes">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="font-medium">Documento:</span> {paciente.documento}</p>
            {paciente.fecha_nacimiento && (
              <p><span className="font-medium">Fecha de nacimiento:</span> {paciente.fecha_nacimiento}</p>
            )}
            <p><span className="font-medium">Género:</span> {paciente.genero}</p>
            {paciente.telefono && (
              <p><span className="font-medium">Teléfono:</span> {paciente.telefono}</p>
            )}
            {paciente.email && (
              <p><span className="font-medium">Email:</span> {paciente.email}</p>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Dirección</h2>
          <div className="mt-4 space-y-2 text-sm">
            {paciente.direccion && (
              <p><span className="font-medium">Dirección:</span> {paciente.direccion}</p>
            )}
            {paciente.ciudad && (
              <p><span className="font-medium">Ciudad:</span> {paciente.ciudad}</p>
            )}
          </div>
        </Card>
      </div>

      {!historia ? (
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">Historia Clínica</h2>
            <p className="mt-2 text-sm text-gray-500">
              Este paciente no tiene una historia clínica abierta
            </p>
            <Button onClick={handleAbrirHistoria} className="mt-4">
              Abrir Historia Clínica
            </Button>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="historia">
          <TabsList>
            <TabsTrigger value="historia">Historia Clínica</TabsTrigger>
            <TabsTrigger value="procedimientos">
              Procedimientos ({procedimientos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="historia">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Historia Clínica</h2>
              <div className="mt-4 space-y-4">
                {historia.motivo_consulta && (
                  <div>
                    <p className="font-medium text-sm">Motivo de consulta:</p>
                    <p className="mt-1 text-sm text-gray-600">{historia.motivo_consulta}</p>
                  </div>
                )}
                {historia.antecedentes_medicos && (
                  <div>
                    <p className="font-medium text-sm">Antecedentes médicos:</p>
                    <p className="mt-1 text-sm text-gray-600">{historia.antecedentes_medicos}</p>
                  </div>
                )}
                {historia.antecedentes_odontologicos && (
                  <div>
                    <p className="font-medium text-sm">Antecedentes odontológicos:</p>
                    <p className="mt-1 text-sm text-gray-600">{historia.antecedentes_odontologicos}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="procedimientos">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Procedimientos</h2>
                <Button>Nuevo Procedimiento</Button>
              </div>

              {procedimientos.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No hay procedimientos registrados
                </p>
              ) : (
                <div className="space-y-4">
                  {procedimientos.map((proc) => (
                    <Card key={proc.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{proc.tipo}</p>
                          <p className="text-sm text-gray-500">{proc.fecha}</p>
                        </div>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
