import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

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

// Mock pacientes service
const mockPacientesService = {
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  search: vi.fn(),
}

// Mock useToast
const mockToast = vi.fn()
vi.mock('./use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Setup mocks
vi.mock('@/services/pacientes.service', () => ({
  pacientesService: mockPacientesService,
}))

// Import after mocks
const { usePacientes } = await import('../use-pacientes')

describe('usePacientes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar pacientes automáticamente al montar', async () => {
    mockPacientesService.getAll.mockResolvedValue([mockPaciente])

    const { result } = renderHook(() => usePacientes())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pacientes).toEqual([mockPaciente])
    expect(mockPacientesService.getAll).toHaveBeenCalledTimes(1)
  })

  it('debe crear un paciente y agregarlo a la lista', async () => {
    mockPacientesService.getAll.mockResolvedValue([])
    mockPacientesService.create.mockResolvedValue(mockPaciente)

    const { result } = renderHook(() => usePacientes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let createdPaciente
    await act(async () => {
      createdPaciente = await result.current.createPaciente(mockPacienteCreate)
    })

    expect(createdPaciente).toEqual(mockPaciente)
    expect(result.current.pacientes).toContain(mockPaciente)
  })

  it('debe actualizar un paciente en la lista', async () => {
    const updatedPaciente = { ...mockPaciente, nombre: 'Carlos' }
    mockPacientesService.getAll.mockResolvedValue([mockPaciente])
    mockPacientesService.update.mockResolvedValue(updatedPaciente)

    const { result } = renderHook(() => usePacientes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let updated
    await act(async () => {
      updated = await result.current.updatePaciente('123', { nombre: 'Carlos' })
    })

    expect(updated).toEqual(updatedPaciente)
    expect(result.current.pacientes[0].nombre).toBe('Carlos')
  })

  it('debe eliminar un paciente de la lista', async () => {
    mockPacientesService.getAll.mockResolvedValue([mockPaciente])
    mockPacientesService.delete.mockResolvedValue(undefined)

    const { result } = renderHook(() => usePacientes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pacientes).toHaveLength(1)

    await act(async () => {
      await result.current.deletePaciente('123')
    })

    expect(result.current.pacientes).toHaveLength(0)
  })

  it('debe buscar pacientes y actualizar la lista', async () => {
    const searchResults = [mockPaciente]
    mockPacientesService.getAll.mockResolvedValue([])
    mockPacientesService.search.mockResolvedValue(searchResults)

    const { result } = renderHook(() => usePacientes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.searchPacientes('Juan')
    })

    expect(result.current.pacientes).toEqual(searchResults)
    expect(mockPacientesService.search).toHaveBeenCalledWith('Juan')
  })

  it('debe recargar la lista de pacientes', async () => {
    mockPacientesService.getAll
      .mockResolvedValueOnce([mockPaciente])
      .mockResolvedValueOnce([mockPaciente, { ...mockPaciente, id: '456' }])

    const { result } = renderHook(() => usePacientes())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pacientes).toHaveLength(1)

    await act(async () => {
      await result.current.refreshPacientes()
    })

    expect(result.current.pacientes).toHaveLength(2)
    expect(mockPacientesService.getAll).toHaveBeenCalledTimes(2)
  })
})
