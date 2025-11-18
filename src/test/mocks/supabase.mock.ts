import { vi } from 'vitest'

export const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  insert: vi.fn(() => mockSupabaseClient),
  update: vi.fn(() => mockSupabaseClient),
  delete: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  single: vi.fn(() => mockSupabaseClient),
  order: vi.fn(() => mockSupabaseClient),
  or: vi.fn(() => mockSupabaseClient),
  auth: {
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    })),
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
      getPublicUrl: vi.fn(),
    })),
  },
}

export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseClient).forEach((fn) => {
    if (typeof fn === 'function') {
      fn.mockClear()
    }
  })
  Object.values(mockSupabaseClient.auth).forEach((fn) => {
    if (typeof fn === 'function') {
      fn.mockClear()
    }
  })
}
