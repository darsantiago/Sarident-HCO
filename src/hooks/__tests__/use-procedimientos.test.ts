import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

// Mock data
const mockProcedimiento = {
  id: 'proc-123',
  historia_clinica_id: 'hc-123',
  tipo: 'evaluacion_aptitud' as const,
  fecha: '2024-01-15',
  datos: {
    presion_arterial: '120/80',
    pulso: '72',
    observaciones: 'Paciente apto',
  },
  observaciones: 'Primera consulta',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

const mockProcedimientoCreate = {
  historia_clinica_id: 'hc-123',
  tipo: 'evaluacion_aptitud' as const,
  fecha: '2024-01-15',
  datos: {
    presion_arterial: '120/80',
    pulso: '72',
    observaciones: 'Paciente apto',
  },
}

// Mock procedimientos service
const mockProcedimientosService = {
  getByHistoriaId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}

// Mock useToast
const mockToast = vi.fn()
vi.mock('../use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Setup mocks
vi.mock('@/services/procedimientos.service', () => ({
  procedimientosService: mockProcedimientosService,
}))

// Import after mocks
const { useProcedimientos } = await import('../use-procedimientos')

describe('useProcedimientos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar procedimientos automáticamente cuando se pasa historiaId', async () => {
    mockProcedimientosService.getByHistoriaId.mockResolvedValue([mockProcedimiento])

    const { result } = renderHook(() => useProcedimientos('hc-123'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.procedimientos).toEqual([mockProcedimiento])
    expect(mockProcedimientosService.getByHistoriaId).toHaveBeenCalledWith('hc-123')
  })

  it('no debe cargar procedimientos si no se pasa historiaId', () => {
    const { result } = renderHook(() => useProcedimientos())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.procedimientos).toEqual([])
    expect(mockProcedimientosService.getByHistoriaId).not.toHaveBeenCalled()
  })

  it('debe crear procedimiento y agregarlo a la lista', async () => {
    mockProcedimientosService.getByHistoriaId.mockResolvedValue([])
    mockProcedimientosService.create.mockResolvedValue(mockProcedimiento)

    const { result } = renderHook(() => useProcedimientos('hc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let createdProcedimiento
    await act(async () => {
      createdProcedimiento = await result.current.createProcedimiento(mockProcedimientoCreate)
    })

    expect(createdProcedimiento).toEqual(mockProcedimiento)
    expect(result.current.procedimientos).toContain(mockProcedimiento)
    expect(mockProcedimientosService.create).toHaveBeenCalledWith(mockProcedimientoCreate)
  })

  it('debe actualizar procedimiento en la lista', async () => {
    const updatedProcedimiento = { ...mockProcedimiento, observaciones: 'Actualizado' }
    mockProcedimientosService.getByHistoriaId.mockResolvedValue([mockProcedimiento])
    mockProcedimientosService.update.mockResolvedValue(updatedProcedimiento)

    const { result } = renderHook(() => useProcedimientos('hc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let updated
    await act(async () => {
      updated = await result.current.updateProcedimiento('proc-123', { observaciones: 'Actualizado' })
    })

    expect(updated).toEqual(updatedProcedimiento)
    expect(result.current.procedimientos[0].observaciones).toBe('Actualizado')
  })

  it('debe refrescar la lista de procedimientos', async () => {
    const newProcedimiento = { ...mockProcedimiento, id: 'proc-456' }
    mockProcedimientosService.getByHistoriaId
      .mockResolvedValueOnce([mockProcedimiento])
      .mockResolvedValueOnce([mockProcedimiento, newProcedimiento])

    const { result } = renderHook(() => useProcedimientos('hc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.procedimientos).toHaveLength(1)

    await act(async () => {
      await result.current.refreshProcedimientos()
    })

    expect(result.current.procedimientos).toHaveLength(2)
    expect(mockProcedimientosService.getByHistoriaId).toHaveBeenCalledTimes(2)
  })

  it('debe manejar errores al cargar procedimientos', async () => {
    mockProcedimientosService.getByHistoriaId.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useProcedimientos('hc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.procedimientos).toEqual([])
  })

  it('debe lanzar error al crear procedimiento cuando falla', async () => {
    mockProcedimientosService.create.mockRejectedValue(new Error('Create error'))

    const { result } = renderHook(() => useProcedimientos())

    await expect(async () => {
      await act(async () => {
        await result.current.createProcedimiento(mockProcedimientoCreate)
      })
    }).rejects.toThrow('Create error')
  })

  it('debe lanzar error al actualizar procedimiento cuando falla', async () => {
    mockProcedimientosService.update.mockRejectedValue(new Error('Update error'))

    const { result } = renderHook(() => useProcedimientos())

    await expect(async () => {
      await act(async () => {
        await result.current.updateProcedimiento('proc-123', { observaciones: 'Test' })
      })
    }).rejects.toThrow('Update error')
  })
})
