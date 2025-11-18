import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { FotoClinica } from '@/types/foto.types';
import { FotoViewer } from './FotoViewer';

interface FotosGalleryProps {
  fotos: FotoClinica[];
  onDelete?: (id: string, storagePath: string) => Promise<void>;
  isLoading?: boolean;
}

const TIPO_LABELS: Record<string, string> = {
  frontal: 'Frontal',
  lateral: 'Lateral',
  oclusal: 'Oclusal',
  panoramica: 'Panorámica',
  intraoral: 'Intraoral',
  extraoral: 'Extraoral',
};

export const FotosGallery = ({ fotos, onDelete, isLoading }: FotosGalleryProps) => {
  const [selectedFoto, setSelectedFoto] = useState<FotoClinica | null>(null);

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Cargando fotos...</p>
      </Card>
    );
  }

  if (fotos.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No hay fotos registradas</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {fotos.map((foto) => (
          <Card key={foto.id} className="overflow-hidden">
            <div className="group relative aspect-square">
              <img
                src={foto.url}
                alt={TIPO_LABELS[foto.tipo] || foto.tipo}
                className="h-full w-full cursor-pointer object-cover transition-transform group-hover:scale-105"
                onClick={() => setSelectedFoto(foto)}
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                  onClick={() => setSelectedFoto(foto)}
                >
                  Ver
                </Button>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {TIPO_LABELS[foto.tipo] || foto.tipo}
                </span>

                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDelete(foto.id, foto.storage_path)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                  </Button>
                )}
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {new Date(foto.created_at).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {selectedFoto && (
        <FotoViewer
          foto={selectedFoto}
          onClose={() => setSelectedFoto(null)}
          onDelete={onDelete}
        />
      )}
    </>
  );
};
