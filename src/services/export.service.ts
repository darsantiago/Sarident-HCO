import jsPDF from 'jspdf'
import type { Paciente } from '@/types/paciente.types'
import type { HistoriaClinica } from '@/types/historia-clinica.types'
import type { Procedimiento } from '@/types/procedimiento.types'

export const exportService = {
  // Exportar a PDF
  exportToPDF: (
    paciente: Paciente,
    historia: HistoriaClinica,
    procedimientos: Procedimiento[]
  ) => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text('Historia Clínica Odontológica', 20, 20)

    // Información del paciente
    doc.setFontSize(12)
    doc.text(`Paciente: ${paciente.nombre} ${paciente.apellido}`, 20, 35)
    doc.text(`Documento: ${paciente.documento}`, 20, 42)

    if (paciente.telefono) {
      doc.text(`Teléfono: ${paciente.telefono}`, 20, 49)
    }

    // Historia clínica
    let yPos = 65
    doc.setFontSize(14)
    doc.text('Historia Clínica', 20, yPos)

    yPos += 10
    doc.setFontSize(10)

    if (historia.motivo_consulta) {
      doc.text('Motivo de consulta:', 20, yPos)
      yPos += 6
      doc.text(historia.motivo_consulta, 25, yPos)
      yPos += 10
    }

    if (historia.antecedentes_medicos) {
      doc.text('Antecedentes médicos:', 20, yPos)
      yPos += 6
      doc.text(historia.antecedentes_medicos, 25, yPos)
      yPos += 10
    }

    // Procedimientos
    if (procedimientos.length > 0) {
      yPos += 5
      doc.setFontSize(14)
      doc.text('Procedimientos', 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      procedimientos.forEach((proc, index) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }

        doc.text(`${index + 1}. ${proc.tipo}`, 20, yPos)
        doc.text(`Fecha: ${proc.fecha}`, 25, yPos + 6)
        yPos += 15
      })
    }

    // Guardar PDF
    doc.save(`HC_${paciente.nombre}_${paciente.apellido}.pdf`)
  },

  // Exportar a texto plano
  exportToText: (
    paciente: Paciente,
    historia: HistoriaClinica,
    procedimientos: Procedimiento[]
  ): string => {
    let text = '========================================\n'
    text += 'HISTORIA CLÍNICA ODONTOLÓGICA\n'
    text += '========================================\n\n'

    text += `PACIENTE: ${paciente.nombre} ${paciente.apellido}\n`
    text += `DOCUMENTO: ${paciente.documento}\n`

    if (paciente.telefono) {
      text += `TELÉFONO: ${paciente.telefono}\n`
    }

    if (paciente.email) {
      text += `EMAIL: ${paciente.email}\n`
    }

    text += '\n========================================\n'
    text += 'HISTORIA CLÍNICA\n'
    text += '========================================\n\n'

    if (historia.motivo_consulta) {
      text += `MOTIVO DE CONSULTA:\n${historia.motivo_consulta}\n\n`
    }

    if (historia.antecedentes_medicos) {
      text += `ANTECEDENTES MÉDICOS:\n${historia.antecedentes_medicos}\n\n`
    }

    if (historia.antecedentes_odontologicos) {
      text += `ANTECEDENTES ODONTOLÓGICOS:\n${historia.antecedentes_odontologicos}\n\n`
    }

    if (procedimientos.length > 0) {
      text += '\n========================================\n'
      text += 'PROCEDIMIENTOS\n'
      text += '========================================\n\n'

      procedimientos.forEach((proc, index) => {
        text += `${index + 1}. ${proc.tipo}\n`
        text += `   Fecha: ${proc.fecha}\n`
        text += `   Notas: ${proc.notas || 'N/A'}\n\n`
      })
    }

    return text
  },

  // Descargar como archivo de texto
  downloadAsText: (
    paciente: Paciente,
    historia: HistoriaClinica,
    procedimientos: Procedimiento[]
  ) => {
    const text = exportService.exportToText(paciente, historia, procedimientos)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `HC_${paciente.nombre}_${paciente.apellido}.txt`
    a.click()
    URL.revokeObjectURL(url)
  },
}
