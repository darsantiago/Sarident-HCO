import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

// Mock user and session data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
}

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
}

// Mock auth store functions
const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockInitialize = vi.fn()

// Mock the auth store
vi.mock('@/stores/auth.store', () => ({
  useAuthStore: vi.fn(() => ({
    user: mockUser,
    session: mockSession,
    isLoading: false,
    isAuthenticated: true,
    login: mockLogin,
    logout: mockLogout,
    initialize: mockInitialize,
  })),
}))

// Import after mocks
const { useAuth } = await import('../use-auth')
const { useAuthStore } = await import('@/stores/auth.store')

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe devolver el usuario del store', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
  })

  it('debe devolver la sesión del store', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.session).toEqual(mockSession)
  })

  it('debe devolver isLoading del store', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(false)
  })

  it('debe devolver isAuthenticated del store', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)
  })

  it('debe exponer la función login', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.login).toBe(mockLogin)
    expect(typeof result.current.login).toBe('function')
  })

  it('debe exponer la función logout', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.logout).toBe(mockLogout)
    expect(typeof result.current.logout).toBe('function')
  })

  it('debe exponer la función initialize', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.initialize).toBe(mockInitialize)
    expect(typeof result.current.initialize).toBe('function')
  })

  it('debe devolver null cuando no hay usuario autenticado', () => {
    // Override the mock for this specific test
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      login: mockLogin,
      logout: mockLogout,
      initialize: mockInitialize,
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('debe devolver isLoading true durante la inicialización', () => {
    // Override the mock for this specific test
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      login: mockLogin,
      logout: mockLogout,
      initialize: mockInitialize,
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
  })
})
