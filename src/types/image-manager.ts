// Image management types and interfaces

export interface ManagedImage {
  id: string
  file?: File
  url?: string
  previewUrl: string
  alt: string
  isPrimary: boolean
  status: 'ready' | 'uploading' | 'uploaded' | 'error'
  sort: number
  filename?: string
  size?: number
  error?: string
  uploadProgress?: number
}

export interface ImageManagerConfig {
  maxFiles: number
  maxSizeBytes: number
  acceptedTypes: string[]
  compressionQuality: number
  maxDimension: number
}

export interface UploadResult {
  publicUrl: string
  storagePath: string
}

export interface StorageAdapter {
  uploadImage(file: File, pathHint?: string): Promise<UploadResult>
  isConfigured: boolean
}

export const DEFAULT_IMAGE_CONFIG: ImageManagerConfig = {
  maxFiles: 8,
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  compressionQuality: 0.85,
  maxDimension: 1600
}