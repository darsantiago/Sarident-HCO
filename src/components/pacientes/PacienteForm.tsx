import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import type { Paciente, PacienteCreate } from '@/types/paciente.types'

interface PacienteFormProps {
  paciente?: Paciente
  onSubmit: (data: PacienteCreate) => Promise<void>
  onCancel: () => void
}

export const PacienteForm = ({ paciente, onSubmit, onCancel }: PacienteFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PacienteCreate>({
    nombre: paciente?.nombre || '',
    apellido: paciente?.apellido || '',
    documento: paciente?.documento || '',
    fecha_nacimiento: paciente?.fecha_nacimiento || '',
    genero: paciente?.genero || 'otro',
    telefono: paciente?.telefono || '',
    email: paciente?.email || '',
    direccion: paciente?.direccion || '',
    ciudad: paciente?.ciudad || '',
    estado: paciente?.estado || 'activo',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documento">Documento *</Label>
          <Input
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
          <Input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genero">Género</Label>
          <Select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : paciente ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
