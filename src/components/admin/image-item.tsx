"use client"

import { useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Progress } from "../ui/progress"
import { Trash2, Star, StarOff, Edit2, Check, X, GripVertical } from "lucide-react"
import { type ManagedImage } from "../../types/image-manager"
import { formatFileSize } from "../../utils/image-utils"

interface ImageItemProps {
  image: ManagedImage
  onUpdate: (id: string, updates: Partial<ManagedImage>) => void
  onRemove: (id: string) => void
  onSetPrimary: (id: string) => void
  isDragging?: boolean
  dragHandleProps?: any
}

export function ImageItem({
  image,
  onUpdate,
  onRemove,
  onSetPrimary,
  isDragging = false,
  dragHandleProps
}: ImageItemProps) {
  const [isEditingAlt, setIsEditingAlt] = useState(false)
  const [altText, setAltText] = useState(image.alt)

  const handleSaveAlt = () => {
    onUpdate(image.id, { alt: altText })
    setIsEditingAlt(false)
  }

  const handleCancelEdit = () => {
    setAltText(image.alt)
    setIsEditingAlt(false)
  }

  const getStatusColor = () => {
    switch (image.status) {
      case 'ready': return 'bg-blue-100 text-blue-800'
      case 'uploading': return 'bg-yellow-100 text-yellow-800'
      case 'uploaded': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = () => {
    switch (image.status) {
      case 'ready': return 'Ready'
      case 'uploading': return 'Uploading...'
      case 'uploaded': return 'Uploaded'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  return (
    <div 
      className={`relative group bg-white border rounded-lg overflow-hidden transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      } ${image.status === 'error' ? 'border-red-300' : 'border-gray-200'}`}
    >
      {/* Primary Badge */}
      {image.isPrimary && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-amber-500 text-white text-xs">
            <Star className="h-3 w-3 mr-1" />
            Primary
          </Badge>
        </div>
      )}

      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        title="Drag to reorder"
      >
        <Button variant="ghost" size="icon" className="h-6 w-6 bg-black/20 hover:bg-black/40 text-white">
          <GripVertical className="h-3 w-3" />
        </Button>
      </div>

      {/* Image Preview */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={image.previewUrl}
          alt={image.alt || 'Product image'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Upload Progress Overlay */}
        {image.status === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-2">Uploading...</div>
              {typeof image.uploadProgress === 'number' && (
                <Progress value={image.uploadProgress} className="w-24" />
              )}
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {image.status === 'error' && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <div className="text-center text-red-800 text-sm p-2">
              <div className="font-medium">Upload Failed</div>
              {image.error && <div className="text-xs mt-1">{image.error}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="p-3 space-y-2">
        {/* Status and File Info */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusText()}
          </Badge>
          {image.size && (
            <span className="text-xs text-gray-500">{formatFileSize(image.size)}</span>
          )}
        </div>

        {/* Filename */}
        {image.filename && (
          <div className="text-xs text-gray-600 truncate" title={image.filename}>
            {image.filename}
          </div>
        )}

        {/* Alt Text */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-700">Alt Text</Label>
          {isEditingAlt ? (
            <div className="flex gap-1">
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="text-xs h-7"
                placeholder="Describe this image..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAlt()
                  if (e.key === 'Escape') handleCancelEdit()
                }}
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveAlt}
                className="h-7 w-7"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-7 w-7"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div 
              className="text-xs text-gray-600 cursor-pointer hover:bg-gray-50 p-1 rounded min-h-[20px] group/alt"
              onClick={() => setIsEditingAlt(true)}
              title="Click to edit alt text"
            >
              {image.alt || (
                <span className="text-gray-400 italic">Click to add description...</span>
              )}
              <Edit2 className="h-3 w-3 ml-1 inline opacity-0 group-hover/alt:opacity-100 transition-opacity" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-1">
          <Button
            size="sm"
            variant={image.isPrimary ? "default" : "outline"}
            onClick={() => onSetPrimary(image.id)}
            className="h-7 text-xs"
            disabled={image.status === 'uploading'}
          >
            {image.isPrimary ? (
              <>
                <StarOff className="h-3 w-3 mr-1" />
                Primary
              </>
            ) : (
              <>
                <Star className="h-3 w-3 mr-1" />
                Set Primary
              </>
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(image.id)}
            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={image.status === 'uploading'}
            title="Remove image"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}