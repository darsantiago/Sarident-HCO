import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debe retornar el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('debe debounce el valor después del delay especificado', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Cambiar el valor
    rerender({ value: 'updated', delay: 500 })

    // El valor no debe cambiar inmediatamente
    expect(result.current).toBe('initial')

    // Avanzar el tiempo 499ms
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('initial')

    // Avanzar el tiempo 1ms más (total 500ms)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })

  it('debe resetear el timer cuando el valor cambia rápidamente', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    // Primer cambio
    rerender({ value: 'first', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Segundo cambio antes de que termine el delay
    rerender({ value: 'second', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // El valor aún debe ser 'initial' porque el timer se reseteó
    expect(result.current).toBe('initial')

    // Completar el delay
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('second')
  })

  it('debe usar el delay por defecto de 500ms cuando no se especifica', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'initial' },
      }
    )

    rerender({ value: 'updated' })
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })

  it('debe funcionar con diferentes tipos de datos', () => {
    // String
    const { result: stringResult, rerender: stringRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'test' } }
    )
    stringRerender({ value: 'updated' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(stringResult.current).toBe('updated')

    // Number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } }
    )
    numberRerender({ value: 42 })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(numberResult.current).toBe(42)

    // Object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: { a: 1 } } }
    )
    objectRerender({ value: { a: 2 } })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(objectResult.current).toEqual({ a: 2 })
  })

  it('debe limpiar el timer cuando el componente se desmonta', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    const { unmount } = renderHook(() => useDebounce('test', 500))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
