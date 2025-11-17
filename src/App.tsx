import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { useAuth } from './hooks/use-auth'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { PacientesPage } from './pages/PacientesPage'
import { PacienteDetailPage } from './pages/PacienteDetailPage'
import { SincronizacionPage } from './pages/SincronizacionPage'
import { syncManager } from './lib/db/sync-manager'
import './index.css'

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
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

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
    </BrowserRouter>
  )
}

export default App
