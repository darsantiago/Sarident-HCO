import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { syncManager } from '@/lib/db/sync-manager'
import { useToast } from '@/hooks/use-toast'

export const SincronizacionPage = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const { toast } = useToast()

  const handleSync = async () => {
    setIsSyncing(true)

    try {
      await syncManager.syncPendingOperations()
      setLastSync(new Date())
      toast({
        title: 'Sincronización exitosa',
        description: 'Todos los cambios han sido sincronizados',
      })
    } catch (error) {
      toast({
        title: 'Error en sincronización',
        description: 'No se pudo completar la sincronización',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sincronización</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sincroniza los datos locales con el servidor
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Estado de Sincronización</h2>
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
              La sincronización se realiza automáticamente cuando se recupera la conexión a
              internet. Puedes usar este botón para forzar una sincronización manual.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4">
            <h3 className="font-medium text-amber-900">Sincronización con Metrosalud</h3>
            <p className="mt-2 text-sm text-amber-700">
              La integración con Google Sheets para sincronización con Metrosalud estará
              disponible en una próxima versión.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
