import { useState, useEffect } from 'react'
import { usePacientes } from '@/hooks/use-pacientes'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

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

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      searchPacientes(debouncedSearchQuery)
    } else {
      refreshPacientes()
    }
  }, [debouncedSearchQuery])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPaciente ? 'Editar Paciente' : 'Nuevo Paciente'}
            </DialogTitle>
          </DialogHeader>
          <PacienteForm
            paciente={editingPaciente || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowDialog(false)
              setEditingPaciente(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
