// Image processing and validation utilities

import { DEFAULT_IMAGE_CONFIG, type ImageManagerConfig } from '../types/image-manager'

export class ImageValidationError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'ImageValidationError'
  }
}

export function validateImageFile(file: File, config: ImageManagerConfig = DEFAULT_IMAGE_CONFIG): void {
  // Check file type
  if (!config.acceptedTypes.includes(file.type)) {
    throw new ImageValidationError(
      `File type ${file.type} is not supported. Accepted types: ${config.acceptedTypes.join(', ')}`,
      'INVALID_TYPE'
    )
  }

  // Check file size
  if (file.size > config.maxSizeBytes) {
    const maxSizeMB = (config.maxSizeBytes / (1024 * 1024)).toFixed(1)
    throw new ImageValidationError(
      `File size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds maximum ${maxSizeMB}MB`,
      'FILE_TOO_LARGE'
    )
  }
}

export function compressImage(
  file: File, 
  config: ImageManagerConfig = DEFAULT_IMAGE_CONFIG
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img
        const maxDim = config.maxDimension
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height * maxDim) / width
            width = maxDim
          } else {
            width = (width * maxDim) / height
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            // Create new file with compressed blob
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.(jpeg|jpg|png)$/i, '.webp'),
              { type: 'image/webp' }
            )
            
            resolve(compressedFile)
          },
          'image/webp',
          config.compressionQuality
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function readClipboardImages(): Promise<File[]> {
  try {
    const clipboardItems = await navigator.clipboard.read()
    const imageFiles: File[] = []
    
    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type)
          const file = new File([blob], `pasted-image-${Date.now()}.${type.split('/')[1]}`, { type })
          imageFiles.push(file)
        }
      }
    }
    
    return imageFiles
  } catch (error) {
    console.warn('Failed to read clipboard:', error)
    return []
  }
}