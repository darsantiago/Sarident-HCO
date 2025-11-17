import { supabase } from '@/lib/db/supabase-client'
import { indexedDB } from '@/lib/db/indexeddb-client'
import { syncManager } from '@/lib/db/sync-manager'
import type { Paciente, PacienteCreate } from '@/types/paciente.types'

export const pacientesService = {
  // Obtener todos los pacientes
  async getAll(): Promise<Paciente[]> {
    try {
      // Intentar obtener de Supabase primero
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Actualizar IndexedDB con los datos más recientes
      if (data) {
        await indexedDB.pacientes.bulkPut(data)
      }

      return data || []
    } catch (error) {
      console.error('Error al obtener pacientes, usando caché offline:', error)
      // Si falla, obtener de IndexedDB
      return await indexedDB.pacientes.toArray()
    }
  },

  // Obtener paciente por ID
  async getById(id: string): Promise<Paciente | null> {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data) {
        await indexedDB.pacientes.put(data)
      }

      return data
    } catch (error) {
      console.error('Error al obtener paciente, usando caché offline:', error)
      return (await indexedDB.pacientes.get(id)) || null
    }
  },

  // Buscar pacientes
  async search(query: string): Promise<Paciente[]> {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%,documento.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error al buscar pacientes:', error)
      // Búsqueda offline en IndexedDB
      const all = await indexedDB.pacientes.toArray()
      const lowerQuery = query.toLowerCase()
      return all.filter(
        (p) =>
          p.nombre.toLowerCase().includes(lowerQuery) ||
          p.apellido.toLowerCase().includes(lowerQuery) ||
          p.documento.includes(query)
      )
    }
  },

  // Crear paciente
  async create(paciente: PacienteCreate): Promise<Paciente> {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .insert(paciente)
        .select()
        .single()

      if (error) throw error

      // Guardar en IndexedDB
      await indexedDB.pacientes.put(data)

      return data
    } catch (error) {
      console.error('Error al crear paciente, guardando offline:', error)
      // Crear ID temporal
      const tempId = `temp_${Date.now()}`
      const tempPaciente: Paciente = {
        ...paciente,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Guardar en IndexedDB
      await indexedDB.pacientes.put(tempPaciente)

      // Registrar operación pendiente
      await syncManager.addPendingOperation({
        tabla: 'pacientes',
        tipo: 'create',
        datos: tempPaciente,
      })

      return tempPaciente
    }
  },

  // Actualizar paciente
  async update(id: string, paciente: Partial<Paciente>): Promise<Paciente> {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .update(paciente)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Actualizar en IndexedDB
      await indexedDB.pacientes.put(data)

      return data
    } catch (error) {
      console.error('Error al actualizar paciente, guardando offline:', error)
      // Actualizar en IndexedDB
      const existing = await indexedDB.pacientes.get(id)
      if (!existing) throw new Error('Paciente no encontrado')

      const updated = { ...existing, ...paciente, updated_at: new Date().toISOString() }
      await indexedDB.pacientes.put(updated)

      // Registrar operación pendiente
      await syncManager.addPendingOperation({
        tabla: 'pacientes',
        tipo: 'update',
        datos: { id, ...paciente },
      })

      return updated
    }
  },

  // Eliminar paciente (soft delete)
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pacientes')
        .update({ estado: 'inactivo' })
        .eq('id', id)

      if (error) throw error

      // Actualizar en IndexedDB
      const existing = await indexedDB.pacientes.get(id)
      if (existing) {
        await indexedDB.pacientes.put({ ...existing, estado: 'inactivo' })
      }
    } catch (error) {
      console.error('Error al eliminar paciente, guardando offline:', error)
      // Actualizar en IndexedDB
      const existing = await indexedDB.pacientes.get(id)
      if (existing) {
        await indexedDB.pacientes.put({ ...existing, estado: 'inactivo' })
      }

      // Registrar operación pendiente
      await syncManager.addPendingOperation({
        tabla: 'pacientes',
        tipo: 'update',
        datos: { id, estado: 'inactivo' },
      })
    }
  },
}
