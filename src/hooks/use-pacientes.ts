import { useState, useEffect } from 'react'
import { pacientesService } from '@/services/pacientes.service'
import type { Paciente, PacienteCreate } from '@/types/paciente.types'
import { useToast } from './use-toast'

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadPacientes = async () => {
    setIsLoading(true)
    try {
      const data = await pacientesService.getAll()
      setPacientes(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los pacientes',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPacientes()
  }, [])

  const createPaciente = async (paciente: PacienteCreate) => {
    try {
      const newPaciente = await pacientesService.create(paciente)
      setPacientes((prev) => [newPaciente, ...prev])
      toast({
        title: 'Paciente creado',
        description: 'El paciente se ha creado exitosamente',
      })
      return newPaciente
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el paciente',
        variant: 'destructive',
      })
      throw error
    }
  }

  const updatePaciente = async (id: string, paciente: Partial<Paciente>) => {
    try {
      const updated = await pacientesService.update(id, paciente)
      setPacientes((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      )
      toast({
        title: 'Paciente actualizado',
        description: 'El paciente se ha actualizado exitosamente',
      })
      return updated
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el paciente',
        variant: 'destructive',
      })
      throw error
    }
  }

  const deletePaciente = async (id: string) => {
    try {
      await pacientesService.delete(id)
      setPacientes((prev) => prev.filter((p) => p.id !== id))
      toast({
        title: 'Paciente eliminado',
        description: 'El paciente se ha marcado como inactivo',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el paciente',
        variant: 'destructive',
      })
      throw error
    }
  }

  const searchPacientes = async (query: string) => {
    try {
      const results = await pacientesService.search(query)
      setPacientes(results)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo buscar pacientes',
        variant: 'destructive',
      })
    }
  }

  return {
    pacientes,
    isLoading,
    createPaciente,
    updatePaciente,
    deletePaciente,
    searchPacientes,
    refreshPacientes: loadPacientes,
  }
}
