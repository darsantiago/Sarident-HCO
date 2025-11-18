import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock data
const mockPaciente = {
  id: '123',
  nombre: 'Juan',
  apellido: 'Pérez',
  documento: '12345678',
  tipo_documento: 'CC' as const,
  fecha_nacimiento: '1990-01-01',
  genero: 'M' as const,
  telefono: '3001234567',
  email: 'juan@example.com',
  direccion: 'Calle 123',
  ciudad: 'Medellín',
  estado: 'activo' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockHistoria = {
  id: 'hc-123',
  paciente_id: '123',
  fecha_apertura: '2024-01-15',
  motivo_consulta: 'Control de rutina',
  antecedentes_medicos: {
    enfermedades: [],
    medicamentos: [],
    alergias: [],
  },
  antecedentes_odontologicos: 'Ninguno',
  estado: 'activo' as const,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

const mockProcedimientos = [
  {
    id: 'proc-123',
    historia_clinica_id: 'hc-123',
    tipo: 'evaluacion_aptitud' as const,
    fecha: '2024-01-15',
    datos: {},
    notas: 'Primera evaluación',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'proc-456',
    historia_clinica_id: 'hc-123',
    tipo: 'impresiones' as const,
    fecha: '2024-01-20',
    datos: {},
    notas: 'Impresiones tomadas',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
]

// Mock jsPDF with global spies
const mockSetFontSize = vi.fn()
const mockText = vi.fn()
const mockAddPage = vi.fn()
const mockSave = vi.fn()

class MockJsPDF {
  setFontSize = mockSetFontSize
  text = mockText
  addPage = mockAddPage
  save = mockSave
}

vi.mock('jspdf', () => ({
  default: MockJsPDF,
}))

// Mock DOM APIs
const mockCreateElement = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

// Import after mocks
const { exportService } = await import('../export.service')

describe('exportService', () => {
  beforeEach(() => {
    // Clear all mocks
    mockSetFontSize.mockClear()
    mockText.mockClear()
    mockAddPage.mockClear()
    mockSave.mockClear()
    mockCreateElement.mockClear()
    mockCreateObjectURL.mockClear()
    mockRevokeObjectURL.mockClear()

    // Setup DOM mocks
    global.document = {
      createElement: mockCreateElement,
    } as any

    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL

    global.Blob = class Blob {
      constructor(public parts: any[], public options?: any) {}
    } as any
  })

  describe('exportToText', () => {
    it('debe generar texto con información del paciente', () => {
      const text = exportService.exportToText(mockPaciente, mockHistoria, [])

      expect(text).toContain('HISTORIA CLÍNICA ODONTOLÓGICA')
      expect(text).toContain('Juan Pérez')
      expect(text).toContain('12345678')
      expect(text).toContain('3001234567')
      expect(text).toContain('juan@example.com')
    })

    it('debe incluir motivo de consulta', () => {
      const text = exportService.exportToText(mockPaciente, mockHistoria, [])

      expect(text).toContain('MOTIVO DE CONSULTA')
      expect(text).toContain('Control de rutina')
    })

    it('debe incluir antecedentes médicos cuando existen', () => {
      const historiaConAntecedentes = {
        ...mockHistoria,
        antecedentes_medicos: 'Hipertensión',
      }

      const text = exportService.exportToText(mockPaciente, historiaConAntecedentes, [])

      expect(text).toContain('ANTECEDENTES MÉDICOS')
      expect(text).toContain('Hipertensión')
    })

    it('debe incluir antecedentes odontológicos cuando existen', () => {
      const text = exportService.exportToText(mockPaciente, mockHistoria, [])

      expect(text).toContain('ANTECEDENTES ODONTOLÓGICOS')
      expect(text).toContain('Ninguno')
    })

    it('debe listar procedimientos correctamente', () => {
      const text = exportService.exportToText(mockPaciente, mockHistoria, mockProcedimientos)

      expect(text).toContain('PROCEDIMIENTOS')
      expect(text).toContain('1. evaluacion_aptitud')
      expect(text).toContain('2. impresiones')
      expect(text).toContain('2024-01-15')
      expect(text).toContain('2024-01-20')
      expect(text).toContain('Primera evaluación')
      expect(text).toContain('Impresiones tomadas')
    })

    it('debe manejar procedimientos sin notas', () => {
      const procSinNotas = [{
        ...mockProcedimientos[0],
        notas: undefined,
      }]

      const text = exportService.exportToText(mockPaciente, mockHistoria, procSinNotas)

      expect(text).toContain('N/A')
    })

    it('debe manejar paciente sin teléfono o email', () => {
      const pacienteSinDatos = {
        ...mockPaciente,
        telefono: undefined,
        email: undefined,
      }

      const text = exportService.exportToText(pacienteSinDatos, mockHistoria, [])

      expect(text).toContain('Juan Pérez')
      expect(text).not.toContain('TELÉFONO')
      expect(text).not.toContain('EMAIL')
    })
  })

  describe('exportToPDF', () => {
    it('debe crear documento PDF con título', () => {
      exportService.exportToPDF(mockPaciente, mockHistoria, [])

      expect(mockSetFontSize).toHaveBeenCalledWith(18)
      expect(mockText).toHaveBeenCalledWith(
        'Historia Clínica Odontológica',
        expect.any(Number),
        expect.any(Number)
      )
    })

    it('debe incluir información del paciente en PDF', () => {
      exportService.exportToPDF(mockPaciente, mockHistoria, [])

      expect(mockText).toHaveBeenCalledWith(
        'Paciente: Juan Pérez',
        expect.any(Number),
        expect.any(Number)
      )
      expect(mockText).toHaveBeenCalledWith(
        'Documento: 12345678',
        expect.any(Number),
        expect.any(Number)
      )
    })

    it('debe incluir teléfono si existe', () => {
      exportService.exportToPDF(mockPaciente, mockHistoria, [])

      expect(mockText).toHaveBeenCalledWith(
        'Teléfono: 3001234567',
        expect.any(Number),
        expect.any(Number)
      )
    })

    it('debe incluir motivo de consulta en PDF', () => {
      exportService.exportToPDF(mockPaciente, mockHistoria, [])

      expect(mockText).toHaveBeenCalledWith(
        'Motivo de consulta:',
        expect.any(Number),
        expect.any(Number)
      )
      expect(mockText).toHaveBeenCalledWith(
        'Control de rutina',
        expect.any(Number),
        expect.any(Number)
      )
    })

    it('debe agregar procedimientos al PDF', () => {
      exportService.exportToPDF(mockPaciente, mockHistoria, mockProcedimientos)

      expect(mockText).toHaveBeenCalledWith(
        'Procedimientos',
        expect.any(Number),
        expect.any(Number)
      )
      expect(mockText).toHaveBeenCalledWith(
        '1. evaluacion_aptitud',
        expect.any(Number),
        expect.any(Number)
      )
      expect(mockText).toHaveBeenCalledWith(
        '2. impresiones',
        expect.any(Number),
        expect.any(Number)
      )
    })

    it('debe guardar el PDF con nombre correcto', () => {
      exportService.exportToPDF(mockPaciente, mockHistoria, [])

      expect(mockSave).toHaveBeenCalledWith('HC_Juan_Pérez.pdf')
    })

    it('debe agregar nueva página si hay muchos procedimientos', () => {
      // Crear muchos procedimientos para forzar nueva página
      const muchosProcedimientos = Array.from({ length: 20 }, (_, i) => ({
        ...mockProcedimientos[0],
        id: `proc-${i}`,
        tipo: 'evaluacion_aptitud' as const,
        fecha: `2024-01-${String(i + 1).padStart(2, '0')}`,
      }))

      exportService.exportToPDF(mockPaciente, mockHistoria, muchosProcedimientos)

      expect(mockAddPage).toHaveBeenCalled()
    })
  })

  describe('downloadAsText', () => {
    it('debe crear un blob con el texto exportado', () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      }

      mockCreateElement.mockReturnValue(mockAnchor)
      mockCreateObjectURL.mockReturnValue('blob:mock-url')

      exportService.downloadAsText(mockPaciente, mockHistoria, [])

      // Verificar que se creó el blob
      expect(global.Blob).toBeDefined()
    })

    it('debe crear un enlace de descarga con nombre correcto', () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      }

      mockCreateElement.mockReturnValue(mockAnchor)
      mockCreateObjectURL.mockReturnValue('blob:mock-url')

      exportService.downloadAsText(mockPaciente, mockHistoria, [])

      expect(mockAnchor.download).toBe('HC_Juan_Pérez.txt')
    })

    it('debe hacer click en el enlace para descargar', () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      }

      mockCreateElement.mockReturnValue(mockAnchor)
      mockCreateObjectURL.mockReturnValue('blob:mock-url')

      exportService.downloadAsText(mockPaciente, mockHistoria, [])

      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('debe revocar la URL del objeto después de descargar', () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      }

      mockCreateElement.mockReturnValue(mockAnchor)
      mockCreateObjectURL.mockReturnValue('blob:mock-url')

      exportService.downloadAsText(mockPaciente, mockHistoria, [])

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })
})
