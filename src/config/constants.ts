export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const APP_NAME = 'Sarident HC';
export const APP_VERSION = '1.0.0';

export const STORAGE_BUCKETS = {
  FOTOS_CLINICAS: 'fotos-clinicas',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_WIDTH = 1920;
export const MAX_IMAGE_HEIGHT = 1080;
export const IMAGE_QUALITY = 0.8;
export const THUMBNAIL_SIZE = 200;

export const PAGINATION_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 300;
