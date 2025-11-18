import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

// Mock MediaStream
class MockMediaStreamTrack {
  kind: string
  enabled = true

  constructor(kind: string) {
    this.kind = kind
  }

  stop = vi.fn()
  getSettings = vi.fn(() => ({ facingMode: 'environment' }))
}

class MockMediaStream {
  private tracks: MockMediaStreamTrack[]

  constructor() {
    this.tracks = [new MockMediaStreamTrack('video')]
  }

  getTracks = vi.fn(() => this.tracks)
  getVideoTracks = vi.fn(() => this.tracks.filter(t => t.kind === 'video'))
}

// Mock navigator.mediaDevices
const mockGetUserMedia = vi.fn()

Object.defineProperty(global.navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: mockGetUserMedia,
  },
})

// Mock document.createElement for canvas
const mockToBlob = vi.fn()
const mockGetContext = vi.fn()
const mockDrawImage = vi.fn()

const originalCreateElement = document.createElement.bind(document)
document.createElement = vi.fn((tagName: string) => {
  if (tagName === 'canvas') {
    return {
      width: 0,
      height: 0,
      getContext: mockGetContext,
      toBlob: mockToBlob,
    } as any
  }
  return originalCreateElement(tagName)
})

// Import after mocks
const { useCamera } = await import('../use-camera')

describe('useCamera', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetContext.mockReturnValue({
      drawImage: mockDrawImage,
    })
  })

  it('debe tener estado inicial correcto', () => {
    const { result } = renderHook(() => useCamera())

    expect(result.current.stream).toBeNull()
    expect(result.current.isActive).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.videoRef).toBeDefined()
    expect(result.current.videoRef.current).toBeNull()
  })

  it('debe iniciar la cámara exitosamente', async () => {
    const mockStream = new MockMediaStream()
    mockGetUserMedia.mockResolvedValue(mockStream)

    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.startCamera()
    })

    await waitFor(() => {
      expect(result.current.isActive).toBe(true)
    })

    expect(result.current.stream).toBe(mockStream)
    expect(result.current.error).toBeNull()
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    })
  })

  it('debe manejar errores al iniciar la cámara', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'))

    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.startCamera()
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    expect(result.current.error).toContain('No se pudo acceder a la cámara')
    expect(result.current.isActive).toBe(false)
    expect(result.current.stream).toBeNull()
  })

  it('debe detener la cámara correctamente', async () => {
    const mockStream = new MockMediaStream()
    mockGetUserMedia.mockResolvedValue(mockStream)

    const { result } = renderHook(() => useCamera())

    // Iniciar la cámara
    await act(async () => {
      await result.current.startCamera()
    })

    await waitFor(() => {
      expect(result.current.isActive).toBe(true)
    })

    // Detener la cámara
    act(() => {
      result.current.stopCamera()
    })

    expect(result.current.stream).toBeNull()
    expect(result.current.isActive).toBe(false)
    expect(mockStream.getTracks()[0].stop).toHaveBeenCalled()
  })

  it('debe capturar una foto cuando hay video activo', async () => {
    const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
    mockToBlob.mockImplementation((callback: (blob: Blob) => void) => {
      callback(mockBlob)
    })

    const { result } = renderHook(() => useCamera())

    // Simular que hay un video activo
    const mockVideo = {
      videoWidth: 1920,
      videoHeight: 1080,
    }
    result.current.videoRef.current = mockVideo as any

    let capturedBlob: Blob | null = null
    await act(async () => {
      capturedBlob = await result.current.capturePhoto()
    })

    expect(capturedBlob).toBe(mockBlob)
    expect(mockDrawImage).toHaveBeenCalledWith(
      mockVideo,
      0,
      0,
      mockVideo.videoWidth,
      mockVideo.videoHeight
    )
  })

  it('debe retornar null cuando no hay video activo', async () => {
    const { result } = renderHook(() => useCamera())

    let capturedBlob: Blob | null = null
    await act(async () => {
      capturedBlob = await result.current.capturePhoto()
    })

    expect(capturedBlob).toBeNull()
  })

  it('debe retornar null cuando getContext falla', async () => {
    mockGetContext.mockReturnValue(null)

    const { result } = renderHook(() => useCamera())

    // Simular que hay un video activo
    result.current.videoRef.current = {
      videoWidth: 1920,
      videoHeight: 1080,
    } as any

    let capturedBlob: Blob | null = null
    await act(async () => {
      capturedBlob = await result.current.capturePhoto()
    })

    expect(capturedBlob).toBeNull()
  })

  it('debe cambiar entre cámaras', async () => {
    const mockStream1 = new MockMediaStream()
    const mockStream2 = new MockMediaStream()
    mockGetUserMedia
      .mockResolvedValueOnce(mockStream1)
      .mockResolvedValueOnce(mockStream2)

    const { result } = renderHook(() => useCamera())

    // Iniciar la cámara
    await act(async () => {
      await result.current.startCamera()
    })

    await waitFor(() => {
      expect(result.current.isActive).toBe(true)
    })

    // Cambiar de cámara
    await act(async () => {
      await result.current.switchCamera()
    })

    await waitFor(() => {
      expect(result.current.stream).toBe(mockStream2)
    })

    expect(mockStream1.getTracks()[0].stop).toHaveBeenCalled()
    expect(mockGetUserMedia).toHaveBeenCalledTimes(2)
  })

  it('debe manejar errores al cambiar de cámara', async () => {
    const mockStream = new MockMediaStream()
    mockGetUserMedia
      .mockResolvedValueOnce(mockStream)
      .mockRejectedValueOnce(new Error('Camera switch failed'))

    const { result } = renderHook(() => useCamera())

    // Iniciar la cámara
    await act(async () => {
      await result.current.startCamera()
    })

    await waitFor(() => {
      expect(result.current.isActive).toBe(true)
    })

    // Intentar cambiar de cámara
    await act(async () => {
      await result.current.switchCamera()
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    expect(result.current.error).toContain('No se pudo cambiar de cámara')
  })

  it('no debe hacer nada si switchCamera se llama sin stream activo', async () => {
    const { result } = renderHook(() => useCamera())

    await act(async () => {
      await result.current.switchCamera()
    })

    expect(mockGetUserMedia).not.toHaveBeenCalled()
    expect(result.current.stream).toBeNull()
  })

  it('debe asignar el stream al videoRef cuando está disponible', async () => {
    const mockStream = new MockMediaStream()
    mockGetUserMedia.mockResolvedValue(mockStream)

    const { result } = renderHook(() => useCamera())

    // Crear un mock video element
    const mockVideoElement = {
      srcObject: null,
    }
    result.current.videoRef.current = mockVideoElement as any

    await act(async () => {
      await result.current.startCamera()
    })

    await waitFor(() => {
      expect(result.current.isActive).toBe(true)
    })

    expect(mockVideoElement.srcObject).toBe(mockStream)
  })

  it('debe limpiar el videoRef al detener la cámara', async () => {
    const mockStream = new MockMediaStream()
    mockGetUserMedia.mockResolvedValue(mockStream)

    const { result } = renderHook(() => useCamera())

    // Crear un mock video element
    const mockVideoElement = {
      srcObject: null,
    }
    result.current.videoRef.current = mockVideoElement as any

    await act(async () => {
      await result.current.startCamera()
    })

    await waitFor(() => {
      expect(result.current.isActive).toBe(true)
    })

    act(() => {
      result.current.stopCamera()
    })

    expect(mockVideoElement.srcObject).toBeNull()
  })
})
