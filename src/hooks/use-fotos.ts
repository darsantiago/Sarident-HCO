import { useState, useEffect } from 'react';
import { fotosService } from '@/services/fotos.service';
import type { FotoClinica, TipoFoto } from '@/types/foto.types';
import { useToast } from './use-toast';
import imageCompression from 'browser-image-compression';

export const useFotos = (procedimientoId?: string) => {
  const [fotos, setFotos] = useState<FotoClinica[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (procedimientoId) {
      loadFotos();
    }
  }, [procedimientoId]);

  const loadFotos = async () => {
    if (!procedimientoId) return;

    setIsLoading(true);
    try {
      const data = await fotosService.getByProcedimientoId(procedimientoId);
      setFotos(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las fotos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFoto = async (file: File, tipo: TipoFoto) => {
    if (!procedimientoId) {
      toast({
        title: 'Error',
        description: 'No se especificó el procedimiento',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      // Comprimir imagen antes de subir
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const foto = await fotosService.upload(compressedFile, procedimientoId, tipo);
      setFotos((prev) => [...prev, foto]);

      toast({
        title: 'Foto subida',
        description: 'La foto se ha subido exitosamente',
      });

      return foto;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo subir la foto',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFotoFromBlob = async (blob: Blob, tipo: TipoFoto, filename: string = 'foto.jpg') => {
    const file = new File([blob], filename, { type: 'image/jpeg' });
    return await uploadFoto(file, tipo);
  };

  const deleteFoto = async (id: string, storagePath: string) => {
    try {
      await fotosService.delete(id, storagePath);
      setFotos((prev) => prev.filter((f) => f.id !== id));

      toast({
        title: 'Foto eliminada',
        description: 'La foto se ha eliminado exitosamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la foto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    fotos,
    isLoading,
    isUploading,
    uploadFoto,
    uploadFotoFromBlob,
    deleteFoto,
    refreshFotos: loadFotos,
  };
};
