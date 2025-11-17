import { useState, useEffect } from 'react'
import { historiasService } from '@/services/historias.service'
import type { HistoriaClinica, HistoriaClinicaCreate } from '@/types/historia-clinica.types'
import { useToast } from './use-toast'

export const useHistoriaClinica = (pacienteId?: string) => {
  const [historia, setHistoria] = useState<HistoriaClinica | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (pacienteId) {
      loadHistoria()
    }
  }, [pacienteId])

  const loadHistoria = async () => {
    if (!pacienteId) return

    setIsLoading(true)
    try {
      const data = await historiasService.getByPacienteId(pacienteId)
      setHistoria(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar la historia clínica',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createHistoria = async (data: HistoriaClinicaCreate) => {
    try {
      const newHistoria = await historiasService.create(data)
      setHistoria(newHistoria)
      toast({
        title: 'Historia clínica creada',
        description: 'La historia clínica se ha creado exitosamente',
      })
      return newHistoria
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la historia clínica',
        variant: 'destructive',
      })
      throw error
    }
  }

  const updateHistoria = async (id: string, data: Partial<HistoriaClinica>) => {
    try {
      const updated = await historiasService.update(id, data)
      setHistoria(updated)
      toast({
        title: 'Historia clínica actualizada',
        description: 'La historia clínica se ha actualizado exitosamente',
      })
      return updated
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la historia clínica',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    historia,
    isLoading,
    createHistoria,
    updateHistoria,
    refreshHistoria: loadHistoria,
  }
}
