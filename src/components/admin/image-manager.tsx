"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { Badge } from "../ui/badge"
import { Upload, Link, Image as ImageIcon, AlertCircle, Info } from "lucide-react"
import { ImageItem } from "./image-item"
import { 
  type ManagedImage, 
  type ImageManagerConfig, 
  DEFAULT_IMAGE_CONFIG 
} from "../../types/image-manager"
import { 
  validateImageFile, 
  compressImage, 
  createImagePreview, 
  generateImageId,
  readClipboardImages,
  ImageValidationError
} from "../../utils/image-utils"
import { getStorageAdapter } from "../../services/storage-adapter"
import { toast } from "sonner"

interface ImageManagerProps {
  images: ManagedImage[]
  onChange: (images: ManagedImage[]) => void
  config?: Partial<ImageManagerConfig>
  productId?: string
  className?: string
}

export function ImageManager({
  images,
  onChange,
  config: userConfig = {},
  productId,
  className = ""
}: ImageManagerProps) {
  const config = { ...DEFAULT_IMAGE_CONFIG, ...userConfig }
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const [urlInput, setUrlInput] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const storageAdapter = getStorageAdapter()

  // Handle file selection
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const newErrors: string[] = []
    const newImages: ManagedImage[] = []

    // Check total count limit
    if (images.length + fileArray.length > config.maxFiles) {
      newErrors.push(`Cannot add ${fileArray.length} files. Maximum ${config.maxFiles} images allowed (currently have ${images.length})`)
      setErrors(newErrors)
      return
    }

    for (const file of fileArray) {
      try {
        // Validate file
        validateImageFile(file, config)
        
        // Compress if needed
        const processedFile = await compressImage(file, config)
        
        // Create managed image
        const managedImage: ManagedImage = {
          id: generateImageId(),
          file: processedFile,
          previewUrl: createImagePreview(processedFile),
          alt: '',
          isPrimary: images.length === 0 && newImages.length === 0, // First image is primary
          status: 'ready',
          sort: images.length + newImages.length,
          filename: file.name,
          size: processedFile.size
        }

        newImages.push(managedImage)
      } catch (error) {
        if (error instanceof ImageValidationError) {
          newErrors.push(`${file.name}: ${error.message}`)
        } else {
          newErrors.push(`${file.name}: Failed to process image`)
        }
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages])
      toast.success(`Added ${newImages.length} image(s)`)
    }

    setErrors(newErrors)
  }, [images, onChange, config])

  // Handle URL addition
  const handleAddUrl = useCallback(() => {
    if (!urlInput.trim()) return

    try {
      new URL(urlInput) // Validate URL
      
      const managedImage: ManagedImage = {
        id: generateImageId(),
        url: urlInput,
        previewUrl: urlInput,
        alt: '',
        isPrimary: images.length === 0,
        status: 'uploaded',
        sort: images.length,
        filename: urlInput.split('/').pop() || 'External image'
      }

      onChange([...images, managedImage])
      setUrlInput("")
      toast.success("Image URL added")
    } catch {
      toast.error("Please enter a valid URL")
    }
  }, [urlInput, images, onChange])

  // Upload images to storage
  const uploadImage = useCallback(async (image: ManagedImage) => {
    if (!image.file || image.status !== 'ready') return

    const updatedImage = { ...image, status: 'uploading' as const, uploadProgress: 0 }
    onChange(images.map(img => img.id === image.id ? updatedImage : img))

    try {
      const result = await storageAdapter.uploadImage(
        image.file, 
        productId ? `products/${productId}` : undefined
      )

      const uploadedImage: ManagedImage = {
        ...image,
        url: result.publicUrl,
        status: 'uploaded',
        uploadProgress: 100
      }

      onChange(images.map(img => img.id === image.id ? uploadedImage : img))
      toast.success(`Uploaded ${image.filename}`)
    } catch (error) {
      const errorImage = {
        ...image,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Upload failed'
      }

      onChange(images.map(img => img.id === image.id ? errorImage : img))
      toast.error(`Failed to upload ${image.filename}`)
    }
  }, [images, onChange, storageAdapter, productId])

  // Auto-upload ready images if storage is configured
  useEffect(() => {
    if (storageAdapter.isConfigured) {
      const readyImages = images.filter(img => img.status === 'ready' && img.file)
      readyImages.forEach(uploadImage)
    }
  }, [images, storageAdapter.isConfigured, uploadImage])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!dropzoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!dropzoneRef.current?.contains(document.activeElement)) return
      
      const clipboardFiles = await readClipboardImages()
      if (clipboardFiles.length > 0) {
        handleFiles(clipboardFiles)
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handleFiles])

  // Image management functions
  const updateImage = useCallback((id: string, updates: Partial<ManagedImage>) => {
    onChange(images.map(img => img.id === id ? { ...img, ...updates } : img))
  }, [images, onChange])

  const removeImage = useCallback((id: string) => {
    const image = images.find(img => img.id === id)
    if (image?.previewUrl && image.file) {
      URL.revokeObjectURL(image.previewUrl)
    }
    
    const updatedImages = images.filter(img => img.id !== id)
    
    // If removing primary image, make the first remaining image primary
    if (image?.isPrimary && updatedImages.length > 0) {
      updatedImages[0] = { ...updatedImages[0], isPrimary: true }
    }
    
    onChange(updatedImages)
    toast.success("Image removed")
  }, [images, onChange])

  const setPrimaryImage = useCallback((id: string) => {
    onChange(images.map(img => ({ ...img, isPrimary: img.id === id })))
  }, [images, onChange])

  // Clear errors after a delay
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000)
      return () => clearTimeout(timer)
    }
  }, [errors])

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Product Images
            <Badge variant="outline" className="ml-auto">
              {images.length} / {config.maxFiles}
            </Badge>
          </CardTitle>
          <CardDescription>
            Upload product images or add image URLs. Supports drag-drop, file picker, and paste from clipboard.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Storage Status */}
          {!storageAdapter.isConfigured && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Image storage is not configured. Images will be kept in memory for preview but won't persist after page refresh.
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Area */}
          <div
            ref={dropzoneRef}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                fileInputRef.current?.click()
              }
            }}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 mb-2">
              {isDragging 
                ? 'Drop images here...' 
                : 'Drag images here, or click to select files'
              }
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPEG, PNG, WebP • Max {(config.maxSizeBytes / (1024 * 1024)).toFixed(1)}MB each
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= config.maxFiles}
            >
              Choose Files
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={config.acceptedTypes.join(',')}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label>Or add image URL:</Label>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
              />
              <Button 
                onClick={handleAddUrl}
                disabled={!urlInput.trim() || images.length >= config.maxFiles}
              >
                <Link className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Images ({images.length})</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images
                  .sort((a, b) => a.sort - b.sort)
                  .map((image) => (
                    <ImageItem
                      key={image.id}
                      image={image}
                      onUpdate={updateImage}
                      onRemove={removeImage}
                      onSetPrimary={setPrimaryImage}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No images added yet</p>
              <p className="text-sm">Upload images to showcase your product</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}