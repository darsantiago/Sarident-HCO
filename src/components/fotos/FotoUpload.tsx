import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { TipoFoto } from '@/types/foto.types';

interface FotoUploadProps {
  onUpload: (file: File, tipo: TipoFoto) => Promise<void>;
  isUploading?: boolean;
}

const TIPOS_FOTO: { value: TipoFoto; label: string }[] = [
  { value: 'frontal', label: 'Frontal' },
  { value: 'lateral', label: 'Lateral' },
  { value: 'oclusal', label: 'Oclusal' },
  { value: 'panoramica', label: 'Panorámica' },
  { value: 'intraoral', label: 'Intraoral' },
  { value: 'extraoral', label: 'Extraoral' },
];

export const FotoUpload = ({ onUpload, isUploading }: FotoUploadProps) => {
  const [tipoFoto, setTipoFoto] = useState<TipoFoto>('frontal');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        await onUpload(imageFiles[0], tipoFoto);
      }
    },
    [onUpload, tipoFoto]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file, tipoFoto);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="tipo_foto">Tipo de Foto</Label>
          <Select
            id="tipo_foto"
            value={tipoFoto}
            onChange={(e) => setTipoFoto(e.target.value as TipoFoto)}
            disabled={isUploading}
          >
            {TIPOS_FOTO.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </Select>
        </div>

        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          <div className="space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <div>
              <p className="text-sm text-gray-600">
                Arrastra y suelta una imagen aquí, o
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Subiendo...' : 'Seleccionar Archivo'}
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Formatos soportados: JPG, PNG, WEBP (máx. 10MB)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
