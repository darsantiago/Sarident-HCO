import { Button } from '@/components/ui/button';
import type { FotoClinica } from '@/types/foto.types';

interface FotoViewerProps {
  foto: FotoClinica;
  onClose: () => void;
  onDelete?: (id: string, storagePath: string) => Promise<void>;
}

const TIPO_LABELS: Record<string, string> = {
  frontal: 'Frontal',
  lateral: 'Lateral',
  oclusal: 'Oclusal',
  panoramica: 'Panorámica',
  intraoral: 'Intraoral',
  extraoral: 'Extraoral',
};

export const FotoViewer = ({ foto, onClose, onDelete }: FotoViewerProps) => {
  const handleDelete = async () => {
    if (confirm('¿Está seguro de que desea eliminar esta foto?')) {
      await onDelete?.(foto.id, foto.storage_path);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-semibold">
              {TIPO_LABELS[foto.tipo] || foto.tipo}
            </h3>
            <p className="text-sm text-gray-300">
              {new Date(foto.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            {onDelete && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="bg-white/10 text-white hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white/10 text-white hover:bg-white/20"
            >
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
        </div>

        <img
          src={foto.url}
          alt={TIPO_LABELS[foto.tipo] || foto.tipo}
          className="max-h-[calc(90vh-80px)] max-w-full rounded-lg object-contain"
        />
      </div>
    </div>
  );
};
