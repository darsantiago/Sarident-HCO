import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock data
const mockPaciente = {
  id: '123',
  nombre: 'Juan',
  apellido: 'Pérez',
  documento: '12345678',
  tipo_documento: 'CC',
  fecha_nacimiento: '1990-01-01',
  genero: 'M',
  telefono: '3001234567',
  email: 'juan@example.com',
  direccion: 'Calle 123',
  ciudad: 'Medellín',
  estado: 'activo',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockPacienteCreate = {
  nombre: 'Juan',
  apellido: 'Pérez',
  documento: '12345678',
  tipo_documento: 'CC',
  fecha_nacimiento: '1990-01-01',
  genero: 'M',
}

// Create mocks before importing the service
const mockSupabase = {
  from: vi.fn(),
}

const mockIndexedDB = {
  pacientes: {
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
const { pacientesService } = await import('../pacientes.service')

describe('pacientesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getAll', () => {
    it('debe obtener todos los pacientes de Supabase', async () => {
      const mockData = [mockPaciente]

      // Set up chain mock
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.pacientes.bulkPut.mockResolvedValue(undefined)

      const result = await pacientesService.getAll()

      expect(result).toEqual(mockData)
      expect(mockSupabase.from).toHaveBeenCalledWith('pacientes')
    })

    it('debe usar IndexedDB cuando Supabase falla', async () => {
      const mockData = [mockPaciente]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: new Error('Network error') }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.pacientes.toArray.mockResolvedValue(mockData)

      const result = await pacientesService.getAll()

      expect(result).toEqual(mockData)
      expect(mockIndexedDB.pacientes.toArray).toHaveBeenCalled()
    })
  })

  describe('getById', () => {
    it('debe obtener un paciente por ID de Supabase', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockPaciente, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.pacientes.put.mockResolvedValue(undefined)

      const result = await pacientesService.getById('123')

      expect(result).toEqual(mockPaciente)
      expect(mockChain.eq).toHaveBeenCalledWith('id', '123')
    })
  })

  describe('search', () => {
    it('debe buscar pacientes en Supabase', async () => {
      const mockData = [mockPaciente]
      const query = 'Juan'

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)

      const result = await pacientesService.search(query)

      expect(result).toEqual(mockData)
      expect(mockChain.or).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('debe crear un paciente en Supabase', async () => {
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockPaciente, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.pacientes.put.mockResolvedValue(undefined)

      const result = await pacientesService.create(mockPacienteCreate)

      expect(result).toEqual(mockPaciente)
      expect(mockChain.insert).toHaveBeenCalledWith(mockPacienteCreate)
    })

    it('debe crear offline cuando Supabase falla', async () => {
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Network error') }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.pacientes.put.mockResolvedValue(undefined)
      mockSyncManager.addPendingOperation.mockResolvedValue(undefined)

      const result = await pacientesService.create(mockPacienteCreate)

      expect(result.id).toContain('temp_')
      expect(result.nombre).toBe(mockPacienteCreate.nombre)
      expect(mockSyncManager.addPendingOperation).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('debe actualizar un paciente en Supabase', async () => {
      const updates = { nombre: 'Juan Carlos' }
      const updatedPaciente = { ...mockPaciente, ...updates }

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedPaciente, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.pacientes.put.mockResolvedValue(undefined)

      const result = await pacientesService.update('123', updates)

      expect(result.nombre).toBe(updates.nombre)
      expect(mockChain.update).toHaveBeenCalledWith(updates)
    })
  })

  describe('delete', () => {
    it('debe hacer soft delete en Supabase', async () => {
      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabase.from.mockReturnValue(mockChain)
      mockIndexedDB.pacientes.get.mockResolvedValue(mockPaciente)
      mockIndexedDB.pacientes.put.mockResolvedValue(undefined)

      await pacientesService.delete('123')

      expect(mockChain.update).toHaveBeenCalledWith({ estado: 'inactivo' })
    })
  })
})
