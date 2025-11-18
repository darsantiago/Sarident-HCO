import { supabase } from '@/lib/db/supabase-client'
import { indexedDB } from '@/lib/db/indexeddb-client'
import { syncManager } from '@/lib/db/sync-manager'
import type { Procedimiento, ProcedimientoCreate } from '@/types/procedimiento.types'

export const procedimientosService = {
  // Obtener procedimientos por historia clínica
  async getByHistoriaId(historiaId: string): Promise<Procedimiento[]> {
    try {
      const { data, error } = await supabase
        .from('procedimientos')
        .select('*')
        .eq('historia_clinica_id', historiaId)
        .order('fecha', { ascending: false })

      if (error) throw error

      if (data) {
        await indexedDB.procedimientos.bulkPut(data)
      }

      return data || []
    } catch (error) {
      console.error('Error al obtener procedimientos:', error)
      const all = await indexedDB.procedimientos.toArray()
      return all.filter((p) => p.historia_clinica_id === historiaId)
    }
  },

  // Obtener procedimiento por ID
  async getById(id: string): Promise<Procedimiento | null> {
    try {
      const { data, error } = await supabase
        .from('procedimientos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data) {
        await indexedDB.procedimientos.put(data)
      }

      return data
    } catch (error) {
      console.error('Error al obtener procedimiento:', error)
      return (await indexedDB.procedimientos.get(id)) || null
    }
  },

  // Crear procedimiento
  async create(procedimiento: ProcedimientoCreate): Promise<Procedimiento> {
    try {
      const { data, error } = await supabase
        .from('procedimientos')
        .insert(procedimiento)
        .select()
        .single()

      if (error) throw error

      await indexedDB.procedimientos.put(data)

      return data
    } catch (error) {
      console.error('Error al crear procedimiento, guardando offline:', error)
      const tempId = `temp_${Date.now()}`
      const tempProcedimiento: Procedimiento = {
        ...procedimiento,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await indexedDB.procedimientos.put(tempProcedimiento)

      await syncManager.addPendingOperation({
        tabla: 'procedimientos',
        tipo: 'create',
        datos: tempProcedimiento,
      })

      return tempProcedimiento
    }
  },

  // Actualizar procedimiento
  async update(id: string, procedimiento: Partial<Procedimiento>): Promise<Procedimiento> {
    try {
      const { data, error } = await supabase
        .from('procedimientos')
        .update(procedimiento)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await indexedDB.procedimientos.put(data)

      return data
    } catch (error) {
      console.error('Error al actualizar procedimiento:', error)
      const existing = await indexedDB.procedimientos.get(id)
      if (!existing) throw new Error('Procedimiento no encontrado')

      const updated = { ...existing, ...procedimiento, updated_at: new Date().toISOString() }
      await indexedDB.procedimientos.put(updated)

      await syncManager.addPendingOperation({
        tabla: 'procedimientos',
        tipo: 'update',
        datos: { id, ...procedimiento },
      })

      return updated
    }
  },
}
