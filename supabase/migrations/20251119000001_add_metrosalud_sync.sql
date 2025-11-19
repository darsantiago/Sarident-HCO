-- Crear tabla para metadata de sincronizaciones
CREATE TABLE IF NOT EXISTS sync_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL,
  pacientes_sincronizados INTEGER DEFAULT 0,
  estado TEXT NOT NULL CHECK (estado IN ('exitoso', 'error', 'en_progreso')),
  duracion_segundos INTEGER,
  error_mensaje TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_sync_metadata_type_created
ON sync_metadata(sync_type, created_at DESC);

-- Agregar columna para datos de Metrosalud en pacientes (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pacientes' AND column_name = 'metrosalud_data'
  ) THEN
    ALTER TABLE pacientes ADD COLUMN metrosalud_data JSONB;
  END IF;
END $$;

-- Índice para búsquedas en datos JSON
CREATE INDEX IF NOT EXISTS idx_pacientes_metrosalud_data
ON pacientes USING gin(metrosalud_data);

-- Función para limpiar sincronizaciones antiguas (mantener últimos 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_sync_metadata()
RETURNS void AS $$
BEGIN
  DELETE FROM sync_metadata
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Comentarios
COMMENT ON TABLE sync_metadata IS 'Metadata de sincronizaciones con sistemas externos (Metrosalud, etc)';
COMMENT ON COLUMN pacientes.metrosalud_data IS 'Datos adicionales de Metrosalud en formato JSON';
