import { useState } from 'react'
import { usePacientes } from '@/hooks/use-pacientes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import { PacienteCard } from '@/components/pacientes/PacienteCard'
import { PacienteForm } from '@/components/pacientes/PacienteForm'
import { Spinner } from '@/components/ui/spinner'
import type { Paciente, PacienteCreate } from '@/types/paciente.types'

export const PacientesPage = () => {
  const {
    pacientes,
    isLoading,
    createPaciente,
    updatePaciente,
    deletePaciente,
    searchPacientes,
    refreshPacientes,
  } = usePacientes()

  const [showDialog, setShowDialog] = useState(false)
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCreate = () => {
    setEditingPaciente(null)
    setShowDialog(true)
  }

  const handleEdit = (paciente: Paciente) => {
    setEditingPaciente(paciente)
    setShowDialog(true)
  }

  const handleSubmit = async (data: PacienteCreate) => {
    if (editingPaciente) {
      await updatePaciente(editingPaciente.id, data)
    } else {
      await createPaciente(data)
    }
    setShowDialog(false)
    setEditingPaciente(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      await deletePaciente(id)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      searchPacientes(query)
    } else {
      refreshPacientes()
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los pacientes del consultorio
          </p>
        </div>
        <Button onClick={handleCreate}>Nuevo Paciente</Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar por nombre, apellido o documento..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      {pacientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-gray-500">No hay pacientes registrados</p>
          <Button onClick={handleCreate} className="mt-4">
            Crear primer paciente
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pacientes.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold">
              {editingPaciente ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h2>
            <PacienteForm
              paciente={editingPaciente || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowDialog(false)
                setEditingPaciente(null)
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
