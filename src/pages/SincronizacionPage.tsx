import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { syncManager } from '@/lib/db/sync-manager'
import { useToast } from '@/hooks/use-toast'
import {
  sincronizarPacientesMetrosalud,
  obtenerEstadoSincronizacion,
  configurarSyncAutomatica,
  eliminarSyncAutomatica,
  type MetrosaludSyncStatus,
} from '@/services/metrosalud-sync.service'

export const SincronizacionPage = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isMetrosaludSyncing, setIsMetrosaludSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [metrosaludStatus, setMetrosaludStatus] = useState<MetrosaludSyncStatus | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const { toast } = useToast()

  // Cargar estado de Metrosalud al montar
  useEffect(() => {
    loadMetrosaludStatus()
  }, [])

  const loadMetrosaludStatus = async () => {
    setIsLoadingStatus(true)
    try {
      const status = await obtenerEstadoSincronizacion()
      setMetrosaludStatus(status)
      // Verificar si tiene triggers configurados (aproximación)
      setAutoSyncEnabled(status.config.configurado)
    } catch (error) {
      console.error('Error cargando estado de Metrosalud:', error)
    } finally {
      setIsLoadingStatus(false)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)

    try {
      await syncManager.syncPendingOperations()
      setLastSync(new Date())
      toast({
        title: 'Sincronización exitosa',
        description: 'Todos los cambios locales han sido sincronizados',
      })
    } catch (error) {
      toast({
        title: 'Error en sincronización',
        description: 'No se pudo completar la sincronización local',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleMetrosaludSync = async () => {
    setIsMetrosaludSyncing(true)

    try {
      const result = await sincronizarPacientesMetrosalud()

      if (result.ok) {
        toast({
          title: 'Sincronización con Metrosalud exitosa',
          description: `${result.pacientes_sincronizados} pacientes sincronizados en ${result.duracion_segundos}s`,
        })
        // Recargar el estado
        await loadMetrosaludStatus()
      } else {
        throw new Error(result.error || 'Error desconocido')
      }
    } catch (error: any) {
      console.error('Error sincronizando con Metrosalud:', error)
      toast({
        title: 'Error en sincronización con Metrosalud',
        description: error?.message || 'No se pudo completar la sincronización',
        variant: 'destructive',
      })
    } finally {
      setIsMetrosaludSyncing(false)
    }
  }

  const handleToggleAutoSync = async () => {
    try {
      if (autoSyncEnabled) {
        const result = await eliminarSyncAutomatica()
        if (result.ok) {
          setAutoSyncEnabled(false)
          toast({
            title: 'Sincronización automática desactivada',
            description: result.mensaje,
          })
        }
      } else {
        const result = await configurarSyncAutomatica()
        if (result.ok) {
          setAutoSyncEnabled(true)
          toast({
            title: 'Sincronización automática activada',
            description: result.mensaje,
          })
        }
      }
      // Recargar estado
      await loadMetrosaludStatus()
    } catch (error: any) {
      toast({
        title: 'Error configurando sincronización automática',
        description: error?.message || 'No se pudo cambiar la configuración',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sincronización</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sincroniza los datos locales y con Metrosalud
        </p>
      </div>

      {/* Sincronización con Metrosalud */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Sincronización con Metrosalud
            </h2>
            {isLoadingStatus ? (
              <div className="flex items-center mt-4">
                <Spinner size="sm" className="mr-2" />
                <span className="text-sm text-gray-500">Cargando estado...</span>
              </div>
            ) : metrosaludStatus ? (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Última sincronización:</span>{' '}
                    <span className="text-gray-700">
                      {metrosaludStatus.ultima_sincronizacion.fecha
                        ? new Date(
                            metrosaludStatus.ultima_sincronizacion.fecha
                          ).toLocaleString('es-CO', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : 'Nunca'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Pacientes sincronizados:</span>{' '}
                    <span className="text-gray-700">
                      {metrosaludStatus.ultima_sincronizacion.pacientes || 0}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span>{' '}
                    <span
                      className={
                        metrosaludStatus.ultima_sincronizacion.estado === 'exitoso'
                          ? 'text-green-600'
                          : metrosaludStatus.ultima_sincronizacion.estado === 'error'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }
                    >
                      {metrosaludStatus.ultima_sincronizacion.mensaje}
                    </span>
                  </div>
                  {metrosaludStatus.ultima_sincronizacion.duracion && (
                    <div>
                      <span className="font-medium">Duración:</span>{' '}
                      <span className="text-gray-700">
                        {metrosaludStatus.ultima_sincronizacion.duracion}s
                      </span>
                    </div>
                  )}
                </div>

                {metrosaludStatus.necesita_sincronizar.necesita && (
                  <div className="rounded-lg bg-amber-50 p-3 text-sm">
                    <span className="font-medium text-amber-900">Atención:</span>{' '}
                    <span className="text-amber-700">
                      {metrosaludStatus.necesita_sincronizar.razon}
                    </span>
                  </div>
                )}

                {metrosaludStatus.ultima_sincronizacion.error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm">
                    <span className="font-medium text-red-900">Error:</span>{' '}
                    <span className="text-red-700">
                      {metrosaludStatus.ultima_sincronizacion.error}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-500">
                No se pudo cargar el estado de sincronización
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleMetrosaludSync}
              disabled={isMetrosaludSyncing}
              className="flex-1 sm:flex-none"
            >
              {isMetrosaludSyncing ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Sincronizando...
                </div>
              ) : (
                'Sincronizar Ahora'
              )}
            </Button>

            <Button
              onClick={handleToggleAutoSync}
              variant={autoSyncEnabled ? 'destructive' : 'outline'}
              className="flex-1 sm:flex-none"
            >
              {autoSyncEnabled ? 'Desactivar Sync Automática' : 'Activar Sync Automática'}
            </Button>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="font-medium text-blue-900">Información</h3>
            <p className="mt-2 text-sm text-blue-700">
              La sincronización con Metrosalud trae los datos desde Google Sheets a la base
              de datos local. {metrosaludStatus?.config.configurado && (
                <>
                  La sincronización automática está programada para las{' '}
                  {metrosaludStatus.config.trigger_hora}:00 AM diariamente.
                </>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Sincronización Local */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sincronización Local</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium">Última sincronización:</span>{' '}
                {lastSync ? lastSync.toLocaleString() : 'Nunca'}
              </p>
              <p>
                <span className="font-medium">Estado:</span>{' '}
                {isSyncing ? 'Sincronizando...' : 'Inactivo'}
              </p>
            </div>
          </div>

          <div>
            <Button onClick={handleSync} disabled={isSyncing} className="w-full sm:w-auto">
              {isSyncing ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Sincronizando...
                </div>
              ) : (
                'Sincronizar Ahora'
              )}
            </Button>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="font-medium text-blue-900">Información</h3>
            <p className="mt-2 text-sm text-blue-700">
              La sincronización local se realiza automáticamente cuando se recupera la
              conexión a internet. Puedes usar este botón para forzar una sincronización
              manual.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
