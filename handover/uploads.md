# Image Upload Contract

## Overview

The frontend implements a sophisticated image management system that supports multiple upload strategies. The backend should implement the signed URL approach for security and scalability.

## Upload Strategy: Signed URLs (Recommended)

### How It Works
1. Frontend requests a signed URL from backend
2. Backend generates signed URL and returns upload details
3. Frontend uploads directly to storage (S3, CloudFlare, etc.)
4. Frontend receives public URL for immediate use
5. Backend stores image metadata

### API Contract

#### 1. Request Signed URL

**Endpoint:** `POST /uploads/signed-url`

**Request:**
```json
{
  "filename": "product-image-1.jpg",
  "contentType": "image/jpeg",
  "pathHint": "products/product-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://storage.example.com/upload?signature=...",
    "publicUrl": "https://cdn.example.com/images/products/product-123/product-image-1_uuid.jpg",
    "storagePath": "images/products/product-123/product-image-1_uuid.jpg",
    "expiresAt": "2024-01-01T12:00:00Z"
  }
}
```

#### 2. Upload to Storage

**Method:** `PUT` to `uploadUrl`
**Headers:** 
```
Content-Type: image/jpeg
Content-Length: [file-size]
```
**Body:** Raw image file bytes

**Success Response:** `200 OK` (from storage provider)

#### 3. Confirm Upload (Optional)

**Endpoint:** `POST /uploads/confirm`

**Request:**
```json
{
  "storagePath": "images/products/product-123/product-image-1_uuid.jpg",
  "publicUrl": "https://cdn.example.com/images/products/product-123/product-image-1_uuid.jpg",
  "metadata": {
    "originalName": "product-image-1.jpg",
    "size": 245760,
    "dimensions": "800x600",
    "productId": "product-123"
  }
}
```

## Frontend Image Manager Integration

### Current Implementation

The ImageManager component (`src/components/admin/image-manager.tsx`) expects this interface:

```typescript
interface StorageAdapter {
  uploadImage(file: File, pathHint?: string): Promise<UploadResult>
  isConfigured: boolean
}

interface UploadResult {
  publicUrl: string
  storagePath: string
}
```

### Upload Flow Implementation

```typescript
const uploadImage = async (file: File, pathHint?: string): Promise<UploadResult> => {
  // 1. Request signed URL
  const signedUrlResponse = await fetch('/api/v1/uploads/signed-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      pathHint: pathHint || 'general'
    }),
  })
  
  const { data: uploadData } = await signedUrlResponse.json()
  
  // 2. Upload to storage
  const uploadResponse = await fetch(uploadData.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })
  
  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image')
  }
  
  // 3. Return result for immediate use
  return {
    publicUrl: uploadData.publicUrl,
    storagePath: uploadData.storagePath,
  }
}
```

## File Processing Requirements

### Image Compression (Frontend)

The frontend automatically compresses images before upload:

```typescript
interface CompressionSettings {
  maxDimension: 1600      // Resize to max 1600px width/height
  quality: 0.85           // JPEG quality 85%
  format: 'jpeg' | 'webp' // Convert to optimized format
}
```

### File Validation (Frontend + Backend)

**Frontend validation:**
- File types: `image/jpeg`, `image/png`, `image/webp`
- Max size: 5MB before compression
- Min dimensions: 100x100px
- Max dimensions: 4000x4000px

**Backend validation (recommended):**
- Verify file signature matches content-type
- Scan for malicious content
- Enforce size limits
- Generate thumbnails if needed

## Storage Organization

### Recommended Path Structure
```
images/
├── products/
│   ├── product-123/
│   │   ├── main_uuid.jpg
│   │   ├── gallery_uuid.jpg
│   │   └── thumbnail_uuid.jpg
│   └── product-456/
├── brands/
│   ├── brand-logo_uuid.png
│   └── brand-banner_uuid.jpg
├── categories/
│   └── category-icon_uuid.svg
└── general/
    └── upload_uuid.jpg
```

### File Naming Convention
- Format: `{purpose}_{uuid}.{ext}`
- Purpose: `main`, `gallery`, `thumbnail`, `logo`, `banner`, `icon`
- UUID: Unique identifier to prevent conflicts
- Extension: Original file extension (after conversion)

## Product Images Integration

### When Creating/Updating Products

The frontend sends image data in this format:

```typescript
interface ProductImageData {
  url: string        // Public URL from upload
  alt: string        // Alt text for accessibility
  isPrimary: boolean // Main product image
  sort: number       // Display order
}

interface CreateProductRequest {
  name: string
  // ... other fields
  imageUrl: string                    // Legacy: main image URL
  images?: ProductImageData[]         // New: multiple images
}
```

### Backend Storage Recommendations

```typescript
// Store in database
interface ProductImage {
  id: string
  productId: string
  url: string
  storagePath: string
  alt: string
  isPrimary: boolean
  sort: number
  originalFilename: string
  fileSize: number
  dimensions: string // "800x600"
  createdAt: Date
  updatedAt: Date
}
```

## Error Handling

### Upload Errors

```typescript
interface UploadError {
  code: string
  message: string
  details?: any
}

// Common error codes:
const UPLOAD_ERRORS = {
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'File type not supported',
  UPLOAD_FAILED: 'Failed to upload to storage',
  SIGNED_URL_EXPIRED: 'Upload URL has expired',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded',
}
```

### Frontend Error Handling

```typescript
const handleUploadError = (error: UploadError) => {
  switch (error.code) {
    case 'FILE_TOO_LARGE':
      toast.error('Image is too large. Please use an image under 5MB.')
      break
    case 'INVALID_FILE_TYPE':
      toast.error('Please upload a JPEG, PNG, or WebP image.')
      break
    default:
      toast.error(error.message || 'Failed to upload image.')
  }
}
```

## Security Considerations

### Signed URL Security
- URLs should expire within 5-10 minutes
- Include content-type restrictions
- Limit file size in signed URL policy
- Use unique paths to prevent overwrites

### Content Validation
- Verify uploaded files match expected content-type
- Scan for malware/malicious content
- Generate thumbnails server-side to validate image integrity
- Strip EXIF data for privacy

### Access Control
- Only authenticated admin users can request signed URLs
- Log all upload attempts for auditing
- Implement rate limiting on upload endpoints
- Clean up expired/unused uploads periodically

## Storage Provider Examples

### AWS S3 Configuration

```typescript
const generateSignedUrl = async (filename: string, contentType: string, pathHint: string) => {
  const key = `images/${pathHint}/${filename}_${uuidv4()}.${getExtension(filename)}`
  
  const signedUrl = await s3.getSignedUrl('putObject', {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    Expires: 300, // 5 minutes
    ACL: 'public-read',
  })
  
  return {
    uploadUrl: signedUrl,
    publicUrl: `https://${process.env.CDN_DOMAIN}/${key}`,
    storagePath: key,
  }
}
```

### Cloudflare R2 Configuration

```typescript
const generateSignedUrl = async (filename: string, contentType: string, pathHint: string) => {
  const key = `images/${pathHint}/${filename}_${uuidv4()}.${getExtension(filename)}`
  
  const signedUrl = await r2.getSignedUrl('PUT', {
    Bucket: process.env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
    Expires: 300,
  })
  
  return {
    uploadUrl: signedUrl,
    publicUrl: `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`,
    storagePath: key,
  }
}
```

This upload system provides secure, scalable image management that integrates seamlessly with the existing frontend image manager component.