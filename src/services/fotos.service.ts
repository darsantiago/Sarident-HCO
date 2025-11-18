import { supabase } from '@/lib/db/supabase-client'
import { indexedDB } from '@/lib/db/indexeddb-client'
import type { FotoClinica, FotoClinicaCreate } from '@/types/foto.types'

export const fotosService = {
  // Obtener fotos por procedimiento
  async getByProcedimientoId(procedimientoId: string): Promise<FotoClinica[]> {
    try {
      const { data, error } = await supabase
        .from('fotos_clinicas')
        .select('*')
        .eq('procedimiento_id', procedimientoId)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (data) {
        await indexedDB.fotos_clinicas.bulkPut(data)
      }

      return data || []
    } catch (error) {
      console.error('Error al obtener fotos:', error)
      const all = await indexedDB.fotos_clinicas.toArray()
      return all.filter((f) => f.procedimiento_id === procedimientoId)
    }
  },

  // Subir foto
  async upload(
    file: File,
    procedimientoId: string,
    tipo: FotoClinica['tipo']
  ): Promise<FotoClinica> {
    try {
      // Generar nombre único para el archivo
      const fileName = `${procedimientoId}/${Date.now()}_${file.name}`

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('fotos-clinicas')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('fotos-clinicas')
        .getPublicUrl(fileName)

      // Crear registro en base de datos
      const fotoData: FotoClinicaCreate = {
        procedimiento_id: procedimientoId,
        tipo,
        url: publicUrl,
        storage_path: fileName,
      }

      const { data, error } = await supabase
        .from('fotos_clinicas')
        .insert(fotoData)
        .select()
        .single()

      if (error) throw error

      await indexedDB.fotos_clinicas.put(data)

      return data
    } catch (error) {
      console.error('Error al subir foto:', error)
      throw error
    }
  },

  // Eliminar foto
  async delete(id: string, storagePath: string): Promise<void> {
    try {
      // Eliminar de Storage
      const { error: storageError } = await supabase.storage
        .from('fotos-clinicas')
        .remove([storagePath])

      if (storageError) throw storageError

      // Eliminar de base de datos
      const { error } = await supabase
        .from('fotos_clinicas')
        .delete()
        .eq('id', id)

      if (error) throw error

      await indexedDB.fotos_clinicas.delete(id)
    } catch (error) {
      console.error('Error al eliminar foto:', error)
      throw error
    }
  },
}
