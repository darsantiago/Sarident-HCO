import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Spinner } from '@/components/ui/spinner'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
