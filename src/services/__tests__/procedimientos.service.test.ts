import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock data
const mockProcedimiento = {
  id: 'proc-123',
  historia_clinica_id: 'hc-123',
  tipo: 'evaluacion_aptitud',
  fecha: '2024-01-15',
  datos: {
    presion_arterial: '120/80',
    pulso: '72',
    observaciones: 'Paciente apto para tratamiento'
  },
  observaciones: 'Primera consulta',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

const mockProcedimientoCreate = {
  historia_clinica_id: 'hc-123',
  tipo: 'evaluacion_aptitud',
  fecha: '2024-01-15',
  datos: {
    presion_arterial: '120/80',
    pulso: '72',
    observaciones: 'Paciente apto para tratamiento'
  },
}

// Create mocks before importing the service
const mockSupabase = {
  from: vi.fn(),
}

const mockIndexedDB = {
  procedimientos: {
    toArray: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    bulkPut: vi.fn(),
  },
}

const mockSyncManager = {
  addPendingOperation: vi.fn(),
}

// Mock modules
vi.mock('@/lib/db/supabase-client', () => ({
  supabase: mockSupabase,
}))

vi.mock('@/lib/db/indexeddb-client', () => ({
  indexedDB: mockIndexedDB,
}))

vi.mock('@/lib/db/sync-manager', () => ({
  syncManager: mockSyncManager,
}))

// Now import the service
const { procedimientosService } = await import('../procedimientos.service')

describe('procedimientosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getByHistoriaId', () => {
    it('debe obtener procedimientos por historia clínica de Supabase', async () => {
      const mockData = [mockProcedimiento]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.bulkPut.mockResolvedValue(undefined)

      const result = await procedimientosService.getByHistoriaId('hc-123')

      expect(result).toEqual(mockData)
      expect(mockSupabase.from).toHaveBeenCalledWith('procedimientos')
      expect(mockChain.eq).toHaveBeenCalledWith('historia_clinica_id', 'hc-123')
      expect(mockChain.order).toHaveBeenCalledWith('fecha', { ascending: false })
      expect(mockIndexedDB.procedimientos.bulkPut).toHaveBeenCalledWith(mockData)
    })

    it('debe usar IndexedDB cuando Supabase falla', async () => {
      const mockData = [mockProcedimiento]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.toArray.mockResolvedValue(mockData)

      const result = await procedimientosService.getByHistoriaId('hc-123')

      expect(result).toEqual(mockData)
      expect(mockIndexedDB.procedimientos.toArray).toHaveBeenCalled()
    })

    it('debe filtrar procedimientos por historia_clinica_id en IndexedDB', async () => {
      const allProcedimientos = [
        mockProcedimiento,
        { ...mockProcedimiento, id: 'proc-456', historia_clinica_id: 'hc-456' }
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
      mockIndexedDB.procedimientos.toArray.mockResolvedValue(allProcedimientos)

      const result = await procedimientosService.getByHistoriaId('hc-123')

      expect(result).toHaveLength(1)
      expect(result[0].historia_clinica_id).toBe('hc-123')
    })
  })

  describe('getById', () => {
    it('debe obtener procedimiento por ID de Supabase', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProcedimiento, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.put.mockResolvedValue(undefined)

      const result = await procedimientosService.getById('proc-123')

      expect(result).toEqual(mockProcedimiento)
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'proc-123')
      expect(mockIndexedDB.procedimientos.put).toHaveBeenCalledWith(mockProcedimiento)
    })

    it('debe usar IndexedDB cuando Supabase falla', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Not found')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.get.mockResolvedValue(mockProcedimiento)

      const result = await procedimientosService.getById('proc-123')

      expect(result).toEqual(mockProcedimiento)
      expect(mockIndexedDB.procedimientos.get).toHaveBeenCalledWith('proc-123')
    })
  })

  describe('create', () => {
    it('debe crear procedimiento en Supabase', async () => {
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProcedimiento, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.put.mockResolvedValue(undefined)

      const result = await procedimientosService.create(mockProcedimientoCreate)

      expect(result).toEqual(mockProcedimiento)
      expect(mockChain.insert).toHaveBeenCalledWith(mockProcedimientoCreate)
      expect(mockIndexedDB.procedimientos.put).toHaveBeenCalledWith(mockProcedimiento)
    })

    it('debe crear offline cuando Supabase falla', async () => {
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.put.mockResolvedValue(undefined)
      mockSyncManager.addPendingOperation.mockResolvedValue(undefined)

      const result = await procedimientosService.create(mockProcedimientoCreate)

      expect(result.id).toContain('temp_')
      expect(result.tipo).toBe(mockProcedimientoCreate.tipo)
      expect(mockIndexedDB.procedimientos.put).toHaveBeenCalled()
      expect(mockSyncManager.addPendingOperation).toHaveBeenCalledWith({
        tabla: 'procedimientos',
        tipo: 'create',
        datos: expect.objectContaining({
          tipo: mockProcedimientoCreate.tipo
        }),
      })
    })
  })

  describe('update', () => {
    it('debe actualizar procedimiento en Supabase', async () => {
      const updates = { observaciones: 'Actualización del procedimiento' }
      const updatedProcedimiento = { ...mockProcedimiento, ...updates }

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedProcedimiento, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.put.mockResolvedValue(undefined)

      const result = await procedimientosService.update('proc-123', updates)

      expect(result.observaciones).toBe(updates.observaciones)
      expect(mockChain.update).toHaveBeenCalledWith(updates)
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'proc-123')
    })

    it('debe actualizar offline cuando Supabase falla', async () => {
      const updates = { observaciones: 'Actualización offline' }

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.get.mockResolvedValue(mockProcedimiento)
      mockIndexedDB.procedimientos.put.mockResolvedValue(undefined)
      mockSyncManager.addPendingOperation.mockResolvedValue(undefined)

      const result = await procedimientosService.update('proc-123', updates)

      expect(result.observaciones).toBe(updates.observaciones)
      expect(mockIndexedDB.procedimientos.put).toHaveBeenCalled()
      expect(mockSyncManager.addPendingOperation).toHaveBeenCalled()
    })

    it('debe lanzar error si el procedimiento no existe en IndexedDB', async () => {
      const updates = { observaciones: 'Actualización' }

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.procedimientos.get.mockResolvedValue(null)

      await expect(
        procedimientosService.update('proc-999', updates)
      ).rejects.toThrow('Procedimiento no encontrado')
    })
  })
})
