import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

// Mock data
const mockFoto = {
  id: 'foto-123',
  procedimiento_id: 'proc-123',
  tipo: 'antes' as const,
  url: 'https://example.com/foto.jpg',
  storage_path: 'fotos/foto.jpg',
  created_at: '2024-01-15T00:00:00Z',
}

// Mock fotos service
const mockFotosService = {
  getByProcedimientoId: vi.fn(),
  upload: vi.fn(),
  delete: vi.fn(),
}

// Mock useToast
const mockToast = vi.fn()
vi.mock('../use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Mock browser-image-compression
vi.mock('browser-image-compression', () => ({
  default: vi.fn((file) => Promise.resolve(file)), // Just return the same file
}))

// Setup mocks
vi.mock('@/services/fotos.service', () => ({
  fotosService: mockFotosService,
}))

// Import after mocks
const { useFotos } = await import('../use-fotos')

describe('useFotos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar fotos automáticamente cuando se pasa procedimientoId', async () => {
    mockFotosService.getByProcedimientoId.mockResolvedValue([mockFoto])

    const { result } = renderHook(() => useFotos('proc-123'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.fotos).toEqual([mockFoto])
    expect(mockFotosService.getByProcedimientoId).toHaveBeenCalledWith('proc-123')
  })

  it('no debe cargar fotos si no se pasa procedimientoId', () => {
    const { result } = renderHook(() => useFotos())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.fotos).toEqual([])
    expect(mockFotosService.getByProcedimientoId).not.toHaveBeenCalled()
  })

  it('debe subir foto y agregarla a la lista', async () => {
    mockFotosService.getByProcedimientoId.mockResolvedValue([])
    mockFotosService.upload.mockResolvedValue(mockFoto)

    const { result } = renderHook(() => useFotos('proc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    let uploadedFoto
    await act(async () => {
      uploadedFoto = await result.current.uploadFoto(mockFile, 'antes')
    })

    expect(uploadedFoto).toEqual(mockFoto)
    expect(result.current.fotos).toContain(mockFoto)
    expect(mockFotosService.upload).toHaveBeenCalled()
  })

  it('debe subir foto desde blob', async () => {
    mockFotosService.getByProcedimientoId.mockResolvedValue([])
    mockFotosService.upload.mockResolvedValue(mockFoto)

    const { result } = renderHook(() => useFotos('proc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const mockBlob = new Blob(['test'], { type: 'image/jpeg' })

    let uploadedFoto
    await act(async () => {
      uploadedFoto = await result.current.uploadFotoFromBlob(mockBlob, 'antes', 'test.jpg')
    })

    expect(uploadedFoto).toEqual(mockFoto)
    expect(result.current.fotos).toContain(mockFoto)
  })

  it('debe eliminar foto de la lista', async () => {
    mockFotosService.getByProcedimientoId.mockResolvedValue([mockFoto])
    mockFotosService.delete.mockResolvedValue(undefined)

    const { result } = renderHook(() => useFotos('proc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.fotos).toHaveLength(1)

    await act(async () => {
      await result.current.deleteFoto('foto-123', 'fotos/foto.jpg')
    })

    expect(result.current.fotos).toHaveLength(0)
    expect(mockFotosService.delete).toHaveBeenCalledWith('foto-123', 'fotos/foto.jpg')
  })

  it('debe refrescar la lista de fotos', async () => {
    const newFoto = { ...mockFoto, id: 'foto-456' }
    mockFotosService.getByProcedimientoId
      .mockResolvedValueOnce([mockFoto])
      .mockResolvedValueOnce([mockFoto, newFoto])

    const { result } = renderHook(() => useFotos('proc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.fotos).toHaveLength(1)

    await act(async () => {
      await result.current.refreshFotos()
    })

    expect(result.current.fotos).toHaveLength(2)
    expect(mockFotosService.getByProcedimientoId).toHaveBeenCalledTimes(2)
  })

  it('debe manejar errores al cargar fotos', async () => {
    mockFotosService.getByProcedimientoId.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useFotos('proc-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.fotos).toEqual([])
  })

  it('debe manejar error cuando no hay procedimientoId al subir', async () => {
    const { result } = renderHook(() => useFotos())

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    await act(async () => {
      const result_upload = await result.current.uploadFoto(mockFile, 'antes')
      expect(result_upload).toBeUndefined()
    })

    expect(mockFotosService.upload).not.toHaveBeenCalled()
  })

  it('debe lanzar error al subir foto cuando falla', async () => {
    mockFotosService.upload.mockRejectedValue(new Error('Upload error'))

    const { result } = renderHook(() => useFotos('proc-123'))

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    await expect(async () => {
      await act(async () => {
        await result.current.uploadFoto(mockFile, 'antes')
      })
    }).rejects.toThrow('Upload error')
  })

  it('debe lanzar error al eliminar foto cuando falla', async () => {
    mockFotosService.delete.mockRejectedValue(new Error('Delete error'))

    const { result } = renderHook(() => useFotos())

    await expect(async () => {
      await act(async () => {
        await result.current.deleteFoto('foto-123', 'fotos/foto.jpg')
      })
    }).rejects.toThrow('Delete error')
  })
})
