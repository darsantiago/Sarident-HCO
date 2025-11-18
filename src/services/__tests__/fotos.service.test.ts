import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock data
const mockFoto = {
  id: 'foto-123',
  procedimiento_id: 'proc-123',
  tipo: 'antes',
  url: 'https://example.com/foto.jpg',
  storage_path: 'proc-123/1234567890_foto.jpg',
  created_at: '2024-01-15T00:00:00Z',
}

const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })

// Create mocks before importing the service
const mockStorage = {
  from: vi.fn(() => ({
    upload: vi.fn(),
    remove: vi.fn(),
    getPublicUrl: vi.fn(),
  })),
}

const mockSupabase = {
  from: vi.fn(),
  storage: mockStorage,
}

const mockIndexedDB = {
  fotos_clinicas: {
    toArray: vi.fn(),
    put: vi.fn(),
    bulkPut: vi.fn(),
    delete: vi.fn(),
  },
}

// Mock modules
vi.mock('@/lib/db/supabase-client', () => ({
  supabase: mockSupabase,
}))

vi.mock('@/lib/db/indexeddb-client', () => ({
  indexedDB: mockIndexedDB,
}))

// Now import the service
const { fotosService } = await import('../fotos.service')

describe('fotosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getByProcedimientoId', () => {
    it('debe obtener fotos por procedimiento ID de Supabase', async () => {
      const mockData = [mockFoto]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.fotos_clinicas.bulkPut.mockResolvedValue(undefined)

      const result = await fotosService.getByProcedimientoId('proc-123')

      expect(result).toEqual(mockData)
      expect(mockSupabase.from).toHaveBeenCalledWith('fotos_clinicas')
      expect(mockChain.eq).toHaveBeenCalledWith('procedimiento_id', 'proc-123')
      expect(mockChain.order).toHaveBeenCalledWith('created_at', { ascending: true })
      expect(mockIndexedDB.fotos_clinicas.bulkPut).toHaveBeenCalledWith(mockData)
    })

    it('debe usar IndexedDB cuando Supabase falla', async () => {
      const mockData = [mockFoto]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.fotos_clinicas.toArray.mockResolvedValue(mockData)

      const result = await fotosService.getByProcedimientoId('proc-123')

      expect(result).toEqual(mockData)
      expect(mockIndexedDB.fotos_clinicas.toArray).toHaveBeenCalled()
    })

    it('debe filtrar fotos por procedimiento_id en IndexedDB', async () => {
      const allFotos = [
        mockFoto,
        { ...mockFoto, id: 'foto-456', procedimiento_id: 'proc-456' }
      ]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.fotos_clinicas.toArray.mockResolvedValue(allFotos)

      const result = await fotosService.getByProcedimientoId('proc-123')

      expect(result).toHaveLength(1)
      expect(result[0].procedimiento_id).toBe('proc-123')
    })
  })

  describe('upload', () => {
    it('debe subir foto correctamente', async () => {
      // Mock storage upload
      const mockStorageBucket = {
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/foto.jpg' }
        }),
      }
      mockStorage.from.mockReturnValue(mockStorageBucket)

      // Mock database insert
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFoto, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.fotos_clinicas.put.mockResolvedValue(undefined)

      const result = await fotosService.upload(mockFile, 'proc-123', 'antes')

      expect(result).toEqual(mockFoto)
      expect(mockStorage.from).toHaveBeenCalledWith('fotos-clinicas')
      expect(mockStorageBucket.upload).toHaveBeenCalled()
      expect(mockStorageBucket.getPublicUrl).toHaveBeenCalled()
      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          procedimiento_id: 'proc-123',
          tipo: 'antes',
        })
      )
      expect(mockIndexedDB.fotos_clinicas.put).toHaveBeenCalledWith(mockFoto)
    })

    it('debe lanzar error si falla la subida al storage', async () => {
      const mockStorageBucket = {
        upload: vi.fn().mockResolvedValue({
          error: new Error('Storage error')
        }),
      }
      mockStorage.from.mockReturnValue(mockStorageBucket)

      await expect(
        fotosService.upload(mockFile, 'proc-123', 'antes')
      ).rejects.toThrow('Storage error')
    })

    it('debe lanzar error si falla la inserción en base de datos', async () => {
      const mockStorageBucket = {
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/foto.jpg' }
        }),
      }
      mockStorage.from.mockReturnValue(mockStorageBucket)

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)

      await expect(
        fotosService.upload(mockFile, 'proc-123', 'antes')
      ).rejects.toThrow('Database error')
    })
  })

  describe('delete', () => {
    it('debe eliminar foto correctamente', async () => {
      // Mock storage remove
      const mockStorageBucket = {
        remove: vi.fn().mockResolvedValue({ error: null }),
      }
      mockStorage.from.mockReturnValue(mockStorageBucket)

      // Mock database delete
      const mockChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.fotos_clinicas.delete.mockResolvedValue(undefined)

      await fotosService.delete('foto-123', 'proc-123/1234567890_foto.jpg')

      expect(mockStorage.from).toHaveBeenCalledWith('fotos-clinicas')
      expect(mockStorageBucket.remove).toHaveBeenCalledWith(['proc-123/1234567890_foto.jpg'])
      expect(mockSupabase.from).toHaveBeenCalledWith('fotos_clinicas')
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'foto-123')
      expect(mockIndexedDB.fotos_clinicas.delete).toHaveBeenCalledWith('foto-123')
    })

    it('debe lanzar error si falla la eliminación del storage', async () => {
      const mockStorageBucket = {
        remove: vi.fn().mockResolvedValue({
          error: new Error('Storage delete error')
        }),
      }
      mockStorage.from.mockReturnValue(mockStorageBucket)

      await expect(
        fotosService.delete('foto-123', 'proc-123/1234567890_foto.jpg')
      ).rejects.toThrow('Storage delete error')
    })

    it('debe lanzar error si falla la eliminación en base de datos', async () => {
      const mockStorageBucket = {
        remove: vi.fn().mockResolvedValue({ error: null }),
      }
      mockStorage.from.mockReturnValue(mockStorageBucket)

      const mockChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          error: new Error('Database delete error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)

      await expect(
        fotosService.delete('foto-123', 'proc-123/1234567890_foto.jpg')
      ).rejects.toThrow('Database delete error')
    })
  })
})
