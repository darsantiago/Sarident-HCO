import { supabase } from '@/lib/db/supabase-client'
import { indexedDB } from '@/lib/db/indexeddb-client'
import { syncManager } from '@/lib/db/sync-manager'
import type { HistoriaClinica, HistoriaClinicaCreate } from '@/types/historia-clinica.types'

export const historiasService = {
  // Obtener historia clínica por paciente
  async getByPacienteId(pacienteId: string): Promise<HistoriaClinica | null> {
    try {
      const { data, error } = await supabase
        .from('historias_clinicas')
        .select('*')
        .eq('paciente_id', pacienteId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        await indexedDB.historias_clinicas.put(data)
      }

      return data || null
    } catch (error) {
      console.error('Error al obtener historia clínica:', error)
      return (await indexedDB.historias_clinicas.get(pacienteId)) || null
    }
  },

  // Crear historia clínica
  async create(historia: HistoriaClinicaCreate): Promise<HistoriaClinica> {
    try {
      const { data, error } = await supabase
        .from('historias_clinicas')
        .insert(historia)
        .select()
        .single()

      if (error) throw error

      await indexedDB.historias_clinicas.put(data)

      return data
    } catch (error) {
      console.error('Error al crear historia clínica, guardando offline:', error)
      const tempId = `temp_${Date.now()}`
      const tempHistoria: HistoriaClinica = {
        ...historia,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await indexedDB.historias_clinicas.put(tempHistoria)

      await syncManager.addPendingOperation({
        tabla: 'historias_clinicas',
        tipo: 'create',
        datos: tempHistoria,
      })

      return tempHistoria
    }
  },

  // Actualizar historia clínica
  async update(id: string, historia: Partial<HistoriaClinica>): Promise<HistoriaClinica> {
    try {
      const { data, error } = await supabase
        .from('historias_clinicas')
        .update(historia)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await indexedDB.historias_clinicas.put(data)

      return data
    } catch (error) {
      console.error('Error al actualizar historia clínica:', error)
      const existing = await indexedDB.historias_clinicas.get(id)
      if (!existing) throw new Error('Historia clínica no encontrada')

      const updated = { ...existing, ...historia, updated_at: new Date().toISOString() }
      await indexedDB.historias_clinicas.put(updated)

      await syncManager.addPendingOperation({
        tabla: 'historias_clinicas',
        tipo: 'update',
        datos: { id, ...historia },
      })

      return updated
    }
  },
}
