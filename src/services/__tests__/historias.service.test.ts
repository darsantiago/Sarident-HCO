import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock data
const mockHistoria = {
  id: 'hc-123',
  paciente_id: 'pac-123',
  motivo_consulta: 'Prótesis dental',
  antecedentes_medicos: 'Ninguno relevante',
  antecedentes_odontologicos: 'Extracciones previas',
  examen_extraoral: 'Normal',
  examen_intraoral: 'Edentulismo parcial',
  diagnostico: 'Edentulismo parcial superior',
  plan_tratamiento: 'Prótesis total superior',
  observaciones: 'Paciente colaborador',
  estado: 'activa',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockHistoriaCreate = {
  paciente_id: 'pac-123',
  motivo_consulta: 'Prótesis dental',
  antecedentes_medicos: 'Ninguno relevante',
  antecedentes_odontologicos: 'Extracciones previas',
  examen_extraoral: 'Normal',
  examen_intraoral: 'Edentulismo parcial',
  diagnostico: 'Edentulismo parcial superior',
  plan_tratamiento: 'Prótesis total superior',
}

// Create mocks before importing the service
const mockSupabase = {
  from: vi.fn(),
}

const mockIndexedDB = {
  historias_clinicas: {
    get: vi.fn(),
    put: vi.fn(),
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
const { historiasService } = await import('../historias.service')

describe('historiasService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getByPacienteId', () => {
    it('debe obtener historia clínica por paciente ID de Supabase', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockHistoria, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.historias_clinicas.put.mockResolvedValue(undefined)

      const result = await historiasService.getByPacienteId('pac-123')

      expect(result).toEqual(mockHistoria)
      expect(mockSupabase.from).toHaveBeenCalledWith('historias_clinicas')
      expect(mockChain.eq).toHaveBeenCalledWith('paciente_id', 'pac-123')
      expect(mockIndexedDB.historias_clinicas.put).toHaveBeenCalledWith(mockHistoria)
    })

    it('debe retornar null si no existe historia clínica', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' } // Not found error
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.historias_clinicas.get.mockResolvedValue(null)

      const result = await historiasService.getByPacienteId('pac-999')

      expect(result).toBeNull()
    })

    it('debe usar IndexedDB cuando Supabase falla', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error')
        }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.historias_clinicas.get.mockResolvedValue(mockHistoria)

      const result = await historiasService.getByPacienteId('pac-123')

      expect(result).toEqual(mockHistoria)
      expect(mockIndexedDB.historias_clinicas.get).toHaveBeenCalledWith('pac-123')
    })
  })

  describe('create', () => {
    it('debe crear historia clínica en Supabase', async () => {
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockHistoria, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.historias_clinicas.put.mockResolvedValue(undefined)

      const result = await historiasService.create(mockHistoriaCreate)

      expect(result).toEqual(mockHistoria)
      expect(mockChain.insert).toHaveBeenCalledWith(mockHistoriaCreate)
      expect(mockIndexedDB.historias_clinicas.put).toHaveBeenCalledWith(mockHistoria)
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
      mockIndexedDB.historias_clinicas.put.mockResolvedValue(undefined)
      mockSyncManager.addPendingOperation.mockResolvedValue(undefined)

      const result = await historiasService.create(mockHistoriaCreate)

      expect(result.id).toContain('temp_')
      expect(result.paciente_id).toBe(mockHistoriaCreate.paciente_id)
      expect(mockIndexedDB.historias_clinicas.put).toHaveBeenCalled()
      expect(mockSyncManager.addPendingOperation).toHaveBeenCalledWith({
        tabla: 'historias_clinicas',
        tipo: 'create',
        datos: expect.objectContaining({
          paciente_id: mockHistoriaCreate.paciente_id
        }),
      })
    })
  })

  describe('update', () => {
    it('debe actualizar historia clínica en Supabase', async () => {
      const updates = { diagnostico: 'Nuevo diagnóstico' }
      const updatedHistoria = { ...mockHistoria, ...updates }

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedHistoria, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.historias_clinicas.put.mockResolvedValue(undefined)

      const result = await historiasService.update('hc-123', updates)

      expect(result.diagnostico).toBe(updates.diagnostico)
      expect(mockChain.update).toHaveBeenCalledWith(updates)
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'hc-123')
    })

    it('debe actualizar offline cuando Supabase falla', async () => {
      const updates = { diagnostico: 'Nuevo diagnóstico' }

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
      mockIndexedDB.historias_clinicas.get.mockResolvedValue(mockHistoria)
      mockIndexedDB.historias_clinicas.put.mockResolvedValue(undefined)
      mockSyncManager.addPendingOperation.mockResolvedValue(undefined)

      const result = await historiasService.update('hc-123', updates)

      expect(result.diagnostico).toBe(updates.diagnostico)
      expect(mockIndexedDB.historias_clinicas.put).toHaveBeenCalled()
      expect(mockSyncManager.addPendingOperation).toHaveBeenCalled()
    })

    it('debe lanzar error si la historia no existe en IndexedDB', async () => {
      const updates = { diagnostico: 'Nuevo diagnóstico' }

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
      mockIndexedDB.historias_clinicas.get.mockResolvedValue(null)

      await expect(
        historiasService.update('hc-999', updates)
      ).rejects.toThrow('Historia clínica no encontrada')
    })
  })
})
