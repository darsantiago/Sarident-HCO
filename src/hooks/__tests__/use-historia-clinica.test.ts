import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

// Mock data
const mockHistoria = {
  id: 'hc-123',
  paciente_id: 'pac-123',
  fecha_apertura: '2024-01-15',
  motivo_consulta: 'Control de rutina',
  antecedentes_medicos: {
    enfermedades: [],
    medicamentos: [],
    alergias: [],
  },
  estado: 'activo' as const,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

const mockHistoriaCreate = {
  paciente_id: 'pac-123',
  fecha_apertura: '2024-01-15',
  motivo_consulta: 'Control de rutina',
  antecedentes_medicos: {
    enfermedades: [],
    medicamentos: [],
    alergias: [],
  },
}

// Mock historias service
const mockHistoriasService = {
  getByPacienteId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}

// Mock useToast
const mockToast = vi.fn()
vi.mock('../use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Setup mocks
vi.mock('@/services/historias.service', () => ({
  historiasService: mockHistoriasService,
}))

// Import after mocks
const { useHistoriaClinica } = await import('../use-historia-clinica')

describe('useHistoriaClinica', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar historia automáticamente cuando se pasa pacienteId', async () => {
    mockHistoriasService.getByPacienteId.mockResolvedValue(mockHistoria)

    const { result } = renderHook(() => useHistoriaClinica('pac-123'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.historia).toEqual(mockHistoria)
    expect(mockHistoriasService.getByPacienteId).toHaveBeenCalledWith('pac-123')
  })

  it('no debe cargar historia si no se pasa pacienteId', () => {
    const { result } = renderHook(() => useHistoriaClinica())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.historia).toBeNull()
    expect(mockHistoriasService.getByPacienteId).not.toHaveBeenCalled()
  })

  it('debe crear historia y actualizar el estado', async () => {
    mockHistoriasService.create.mockResolvedValue(mockHistoria)

    const { result } = renderHook(() => useHistoriaClinica())

    let createdHistoria
    await act(async () => {
      createdHistoria = await result.current.createHistoria(mockHistoriaCreate)
    })

    expect(createdHistoria).toEqual(mockHistoria)
    expect(result.current.historia).toEqual(mockHistoria)
    expect(mockHistoriasService.create).toHaveBeenCalledWith(mockHistoriaCreate)
  })

  it('debe actualizar historia y actualizar el estado', async () => {
    const updatedHistoria = { ...mockHistoria, motivo_consulta: 'Urgencia' }
    mockHistoriasService.update.mockResolvedValue(updatedHistoria)

    const { result } = renderHook(() => useHistoriaClinica())

    // Primero establecer una historia
    act(() => {
      result.current.historia = mockHistoria
    })

    let updated
    await act(async () => {
      updated = await result.current.updateHistoria('hc-123', { motivo_consulta: 'Urgencia' })
    })

    expect(updated).toEqual(updatedHistoria)
    expect(result.current.historia).toEqual(updatedHistoria)
  })

  it('debe refrescar historia correctamente', async () => {
    const updatedHistoria = { ...mockHistoria, motivo_consulta: 'Actualizado' }
    mockHistoriasService.getByPacienteId
      .mockResolvedValueOnce(mockHistoria)
      .mockResolvedValueOnce(updatedHistoria)

    const { result } = renderHook(() => useHistoriaClinica('pac-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.historia?.motivo_consulta).toBe('Control de rutina')

    await act(async () => {
      await result.current.refreshHistoria()
    })

    expect(result.current.historia?.motivo_consulta).toBe('Actualizado')
    expect(mockHistoriasService.getByPacienteId).toHaveBeenCalledTimes(2)
  })

  it('debe manejar errores al cargar historia', async () => {
    mockHistoriasService.getByPacienteId.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useHistoriaClinica('pac-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.historia).toBeNull()
  })

  it('debe lanzar error al crear historia cuando falla', async () => {
    mockHistoriasService.create.mockRejectedValue(new Error('Create error'))

    const { result } = renderHook(() => useHistoriaClinica())

    await expect(async () => {
      await act(async () => {
        await result.current.createHistoria(mockHistoriaCreate)
      })
    }).rejects.toThrow('Create error')
  })

  it('debe lanzar error al actualizar historia cuando falla', async () => {
    mockHistoriasService.update.mockRejectedValue(new Error('Update error'))

    const { result } = renderHook(() => useHistoriaClinica())

    await expect(async () => {
      await act(async () => {
        await result.current.updateHistoria('hc-123', { motivo_consulta: 'Test' })
      })
    }).rejects.toThrow('Update error')
  })
})
