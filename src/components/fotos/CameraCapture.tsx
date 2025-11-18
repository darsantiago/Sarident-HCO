import { useEffect, useState } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { TipoFoto } from '@/types/foto.types';

interface CameraCaptureProps {
  onCapture: (blob: Blob, tipo: TipoFoto) => Promise<void>;
  onCancel: () => void;
}

const TIPOS_FOTO: { value: TipoFoto; label: string }[] = [
  { value: 'frontal', label: 'Frontal' },
  { value: 'lateral', label: 'Lateral' },
  { value: 'oclusal', label: 'Oclusal' },
  { value: 'panoramica', label: 'Panorámica' },
  { value: 'intraoral', label: 'Intraoral' },
  { value: 'extraoral', label: 'Extraoral' },
];

export const CameraCapture = ({ onCapture, onCancel }: CameraCaptureProps) => {
  const { videoRef, isActive, error, startCamera, stopCamera, capturePhoto, switchCamera } =
    useCamera();
  const [tipoFoto, setTipoFoto] = useState<TipoFoto>('frontal');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      const blob = await capturePhoto();
      if (blob) {
        await onCapture(blob, tipoFoto);
        stopCamera();
      }
    } catch (error) {
      console.error('Error al capturar foto:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <Card className="w-full max-w-4xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Capturar Foto Clínica</h2>
            <Button variant="ghost" onClick={handleCancel}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-800">
              <p>{error}</p>
            </div>
          )}

          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />

            {!isActive && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white">Iniciando cámara...</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="tipo_foto">Tipo de Foto</Label>
              <Select
                id="tipo_foto"
                value={tipoFoto}
                onChange={(e) => setTipoFoto(e.target.value as TipoFoto)}
              >
                {TIPOS_FOTO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={switchCamera}
                disabled={!isActive}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Cambiar Cámara
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                onClick={handleCapture}
                disabled={!isActive || isCapturing}
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {isCapturing ? 'Capturando...' : 'Capturar Foto'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
