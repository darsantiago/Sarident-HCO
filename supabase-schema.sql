-- ============================================================================
-- SARIDENT HC - Database Schema para Supabase
-- ============================================================================

-- ============================================================================
-- TABLA: pacientes
-- ============================================================================
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documento VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  edad INTEGER GENERATED ALWAYS AS (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::INTEGER
  ) STORED,
  telefono VARCHAR(20),
  direccion TEXT,
  email VARCHAR(255),
  
  -- Datos Metrosalud (sincronización externa opcional)
  metrosalud_id VARCHAR(50),
  metrosalud_sync_at TIMESTAMPTZ,
  
  -- Metadata
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pacientes_documento ON pacientes(documento);
CREATE INDEX idx_pacientes_nombre ON pacientes(nombre);
CREATE INDEX idx_pacientes_metrosalud ON pacientes(metrosalud_id);

-- ============================================================================
-- TABLA: historias_clinicas
-- ============================================================================
CREATE TABLE historias_clinicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  
  -- Datos de apertura
  fecha_apertura TIMESTAMPTZ DEFAULT NOW(),
  motivo_consulta TEXT,
  enfermedad_actual TEXT,
  antecedentes TEXT,
  examen_fisico TEXT,
  diagnostico TEXT,
  plan_tratamiento TEXT,
  profesional_apertura VARCHAR(255),
  
  -- Estado
  estado VARCHAR(20) DEFAULT 'activa',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solo una HC activa por paciente
CREATE UNIQUE INDEX idx_hc_paciente_activa ON historias_clinicas(paciente_id, estado) 
  WHERE estado = 'activa';

CREATE INDEX idx_hc_paciente ON historias_clinicas(paciente_id);
CREATE INDEX idx_hc_fecha ON historias_clinicas(fecha_apertura);

-- ============================================================================
-- TABLA: procedimientos
-- ============================================================================
CREATE TABLE procedimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  historia_clinica_id UUID NOT NULL REFERENCES historias_clinicas(id) ON DELETE CASCADE,
  
  tipo VARCHAR(50) NOT NULL, -- EVALUACION_APTITUD, IMPRESIONES, etc.
  titulo VARCHAR(255) NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  
  -- Datos específicos del procedimiento (flexible)
  datos JSONB NOT NULL DEFAULT '{}',
  
  profesional VARCHAR(255),
  observaciones TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_proc_hc ON procedimientos(historia_clinica_id);
CREATE INDEX idx_proc_tipo ON procedimientos(tipo);
CREATE INDEX idx_proc_fecha ON procedimientos(fecha);
CREATE INDEX idx_proc_datos ON procedimientos USING GIN (datos);

-- ============================================================================
-- TABLA: fotos_clinicas
-- ============================================================================
CREATE TABLE fotos_clinicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedimiento_id UUID NOT NULL REFERENCES procedimientos(id) ON DELETE CASCADE,
  
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  mime_type VARCHAR(50),
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  
  tipo VARCHAR(50), -- frontal, lateral, oclusal, panoramica, etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fotos_proc ON fotos_clinicas(procedimiento_id);
CREATE INDEX idx_fotos_tipo ON fotos_clinicas(tipo);

-- ============================================================================
-- TABLA: sincronizacion_metrosalud
-- ============================================================================
CREATE TABLE sincronizacion_metrosalud (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ultima_sync TIMESTAMPTZ NOT NULL,
  pacientes_sincronizados INTEGER DEFAULT 0,
  pacientes_nuevos INTEGER DEFAULT 0,
  pacientes_actualizados INTEGER DEFAULT 0,
  errores TEXT,
  duracion_ms INTEGER,
  estado VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pacientes_updated_at 
  BEFORE UPDATE ON pacientes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hc_updated_at 
  BEFORE UPDATE ON historias_clinicas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proc_updated_at 
  BEFORE UPDATE ON procedimientos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historias_clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sincronizacion_metrosalud ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso: usuarios autenticados tienen acceso completo
CREATE POLICY "Usuarios autenticados acceso completo pacientes" ON pacientes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados acceso completo hc" ON historias_clinicas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados acceso completo proc" ON procedimientos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados acceso completo fotos" ON fotos_clinicas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados acceso completo sync" ON sincronizacion_metrosalud
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- BUCKET DE STORAGE para fotos
-- ============================================================================
-- Ejecutar este código en el panel de Storage de Supabase:
-- 1. Crear bucket llamado "fotos-clinicas" con configuración pública = false
-- 2. Aplicar políticas de acceso para usuarios autenticados
