import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOnline } from '../use-online'

describe('useOnline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar el estado online inicial basado en navigator.onLine', () => {
    // Simular que está online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })

    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(true)
  })

  it('debe retornar false cuando está offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    })

    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(false)
  })

  it('debe actualizar el estado cuando se dispara el evento online', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    })

    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(false)

    // Simular evento online
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current).toBe(true)
  })

  it('debe actualizar el estado cuando se dispara el evento offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })

    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(true)

    // Simular evento offline
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current).toBe(false)
  })

  it('debe manejar múltiples cambios de estado', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })

    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(true)

    // Ir offline
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)

    // Volver online
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current).toBe(true)

    // Ir offline nuevamente
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)
  })

  it('debe remover los event listeners cuando se desmonta', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useOnline())
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('debe agregar los event listeners cuando se monta', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    renderHook(() => useOnline())

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })
})
