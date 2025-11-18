import { create } from 'zustand'
import { supabase } from '@/lib/db/supabase-client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  },

  signup: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Si la confirmación de email está deshabilitada, el usuario ya estará autenticado
      if (data.session) {
        set({
          user: data.user,
          session: data.session,
          isAuthenticated: true,
        })
      }
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({
        user: null,
        session: null,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Error en logout:', error)
      throw error
    }
  },

  initialize: async () => {
    try {
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession()

      set({
        user: session?.user ?? null,
        session,
        isAuthenticated: !!session,
        isLoading: false,
      })

      // Escuchar cambios en la autenticación
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
          session,
          isAuthenticated: !!session,
        })
      })
    } catch (error) {
      console.error('Error inicializando auth:', error)
      set({ isLoading: false })
    }
  },
}))
