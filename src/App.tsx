import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { useAuth } from './hooks/use-auth'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { Spinner } from './components/ui/spinner'
import { syncManager } from './lib/db/sync-manager'
import './index.css'

// Lazy loading de páginas
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const PacientesPage = lazy(() => import('./pages/PacientesPage').then(m => ({ default: m.PacientesPage })))
const PacienteDetailPage = lazy(() => import('./pages/PacienteDetailPage').then(m => ({ default: m.PacienteDetailPage })))
const SincronizacionPage = lazy(() => import('./pages/SincronizacionPage').then(m => ({ default: m.SincronizacionPage })))

function App() {
  const { initialize } = useAuth()

  useEffect(() => {
    // Inicializar autenticación
    initialize()

    // Inicializar sincronización automática
    syncManager.startAutoSync()

    return () => {
      syncManager.stopAutoSync()
    }
  }, [initialize])

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/pacientes/:id" element={<PacienteDetailPage />} />
            <Route path="/sincronizacion" element={<SincronizacionPage />} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
