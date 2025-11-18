import { useAuthStore } from '@/stores/auth.store'

export const useAuth = () => {
  const { user, session, isLoading, isAuthenticated, login, signup, logout, initialize } = useAuthStore()

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    initialize,
  }
}
