import { useState, useEffect } from 'react'
import { procedimientosService } from '@/services/procedimientos.service'
import type { Procedimiento, ProcedimientoCreate } from '@/types/procedimiento.types'
import { useToast } from './use-toast'

export const useProcedimientos = (historiaId?: string) => {
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (historiaId) {
      loadProcedimientos()
    }
  }, [historiaId])

  const loadProcedimientos = async () => {
    if (!historiaId) return

    setIsLoading(true)
    try {
      const data = await procedimientosService.getByHistoriaId(historiaId)
      setProcedimientos(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los procedimientos',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createProcedimiento = async (data: ProcedimientoCreate) => {
    try {
      const newProcedimiento = await procedimientosService.create(data)
      setProcedimientos((prev) => [newProcedimiento, ...prev])
      toast({
        title: 'Procedimiento creado',
        description: 'El procedimiento se ha creado exitosamente',
      })
      return newProcedimiento
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el procedimiento',
        variant: 'destructive',
      })
      throw error
    }
  }

  const updateProcedimiento = async (id: string, data: Partial<Procedimiento>) => {
    try {
      const updated = await procedimientosService.update(id, data)
      setProcedimientos((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      )
      toast({
        title: 'Procedimiento actualizado',
        description: 'El procedimiento se ha actualizado exitosamente',
      })
      return updated
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el procedimiento',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    procedimientos,
    isLoading,
    createProcedimiento,
    updateProcedimiento,
    refreshProcedimientos: loadProcedimientos,
  }
}
