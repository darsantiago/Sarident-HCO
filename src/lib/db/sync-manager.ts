import { supabase } from './supabase-client';
import { db, getOperacionesPendientes, deleteOperacionPendiente } from './indexeddb-client';

export class SyncManager {
  private static syncInProgress = false;

  static async isOnline(): Promise<boolean> {
    return navigator.onLine;
  }

  static async syncPendingOperations(): Promise<void> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return;
    }

    if (!(await this.isOnline())) {
      console.log('No internet connection');
      return;
    }

    this.syncInProgress = true;

    try {
      const operaciones = await getOperacionesPendientes();
      console.log(`Syncing ${operaciones.length} pending operations`);

      for (const operacion of operaciones) {
        try {
          await this.executarOperacion(operacion);
          await deleteOperacionPendiente(operacion.id);
        } catch (error) {
          console.error('Error syncing operation:', error);
          // Continue with next operation even if one fails
        }
      }

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private static async executarOperacion(operacion: any): Promise<void> {
    const { tipo, tabla, datos } = operacion;

    switch (tipo) {
      case 'create':
        await supabase.from(tabla).insert(datos);
        break;
      case 'update':
        await supabase.from(tabla).update(datos).eq('id', datos.id);
        break;
      case 'delete':
        await supabase.from(tabla).delete().eq('id', datos.id);
        break;
    }
  }

  static async saveOffline(
    tabla: string,
    tipo: 'create' | 'update' | 'delete',
    datos: any
  ): Promise<void> {
    // Save to IndexedDB
    const dbTable = (db as any)[tabla];
    
    if (tipo === 'create' || tipo === 'update') {
      await dbTable.put(datos);
    } else if (tipo === 'delete') {
      await dbTable.delete(datos.id);
    }

    // Add to pending operations
    const { addOperacionPendiente } = await import('./indexeddb-client');
    await addOperacionPendiente(tipo, tabla as any, datos);
  }

  static setupAutoSync(): void {
    // Sync when connection is restored
    window.addEventListener('online', () => {
      console.log('Connection restored, syncing...');
      this.syncPendingOperations();
    });

    // Periodic sync every 5 minutes when online
    setInterval(() => {
      if (navigator.onLine) {
        this.syncPendingOperations();
      }
    }, 5 * 60 * 1000);
  }
}

// Initialize auto-sync
SyncManager.setupAutoSync();
