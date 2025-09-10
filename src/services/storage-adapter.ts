// Storage abstraction for image uploads

import { type StorageAdapter, type UploadResult } from '../types/image-manager'

class MockStorageAdapter implements StorageAdapter {
  isConfigured = false

  async uploadImage(file: File, pathHint?: string): Promise<UploadResult> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // For demo purposes, return a mock URL
    const mockUrl = URL.createObjectURL(file)
    const storagePath = `${pathHint || 'uploads'}/${file.name}`
    
    return {
      publicUrl: mockUrl,
      storagePath
    }
  }
}

class RealStorageAdapter implements StorageAdapter {
  isConfigured = true
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async uploadImage(file: File, pathHint?: string): Promise<UploadResult> {
    try {
      // Request signed URL from backend
      const signedUrlResponse = await fetch(`${this.baseUrl}/api/v1/uploads/signed-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          pathHint: pathHint || 'products'
        })
      })

      if (!signedUrlResponse.ok) {
        throw new Error('Failed to get signed URL')
      }

      const { signedUrl, publicUrl, storagePath } = await signedUrlResponse.json()

      // Upload file to signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      return { publicUrl, storagePath }
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }
}

// Global storage adapter instance
let storageAdapter: StorageAdapter = new MockStorageAdapter()

export function getStorageAdapter(): StorageAdapter {
  return storageAdapter
}

export function setStorageAdapter(adapter: StorageAdapter): void {
  storageAdapter = adapter
}

// Initialize storage adapter based on environment
export function initializeStorage(): void {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  
  if (baseUrl) {
    try {
      setStorageAdapter(new RealStorageAdapter(baseUrl))
    } catch (error) {
      console.warn('Failed to initialize real storage, falling back to mock:', error)
    }
  }
}

// Auto-initialize on module load
initializeStorage()