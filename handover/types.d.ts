// TypeScript types used by the frontend UI
// These types must be implemented exactly as defined for seamless integration

// ============================================
// Core Domain Types
// ============================================

export interface VariantPacking {
  id: string
  label: string
  unitsPerPack: number
}

export interface ProductVariant {
  id: string
  sizeLabel: string
  priceCents?: number
  stockState: 'IN' | 'LOW' | 'OUT'
  packings?: VariantPacking[]
  // Legacy fields for compatibility
  sku?: string
  stock?: number
  price?: number
  unit?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number // Base price or main variant price
  category: string
  brand: string
  imageUrl: string
  inStock: boolean
  specifications: Record<string, string>
  sku: string
  variants?: ProductVariant[] // Empty array if no variants
  defaultVariantId?: string // ID of the default/main variant
  remarks?: string // Additional notes/packing details
  // Extended fields for image management
  images?: Array<{
    url: string
    alt: string
    isPrimary: boolean
    sort: number
  }>
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  id: string
  name: string
  nameNe: string // Nepali translation
  description: string
  imageUrl: string
  productCount: number
}

export interface Brand {
  id: string
  name: string
  description: string
  logoUrl: string
  website: string
  countryOfOrigin: string
  productCount: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "owner" | "manager" | "content_editor" | "customer"
  phone: string
  company?: string
  permissions?: string[]
  avatar?: string
}

// ============================================
// Inquiry System Types
// ============================================

export interface InquiryItem {
  productId: string
  variantId?: string // Selected variant (size)
  packingOptionId?: string // Selected packing option
  quantity: number // Number of packs
  totalPieces?: number // Auto-calculated: quantity × unitsPerPack
  unitPrice?: number // Price per unit/pack
  notes?: string
}

export interface Inquiry {
  id: string
  userId: string
  products: InquiryItem[]
  status: "pending" | "responded" | "closed"
  createdAt: Date
  updatedAt: Date
  customerNotes?: string
  whatsappNumber?: string // Required for inquiry submission
  customerName?: string
  customerEmail?: string
  customerCompany?: string
}

// ============================================
// Shipments System Types
// ============================================

export interface ShipmentManifestItem {
  productId: string
  variantId?: string
  packingOptionId?: string
  quantity: number
  totalPieces: number
}

export interface Shipment {
  id: string
  referenceNumber: string // Business reference (e.g., "CNS-2024-001")
  inquiryId?: string // Optional - not all shipments tied to inquiries
  trackingNumber: string
  status: "booked" | "in_transit" | "customs" | "warehouse" | "available" | "delivered"
  estimatedDelivery: Date
  actualDelivery?: Date
  carrier: string
  origin?: string
  destination?: string
  notes?: string // Editable notes field
  timeline?: Array<{
    id: string
    status: string
    timestamp: Date
    location?: string
    notes?: string
  }>
  manifestItems: ShipmentManifestItem[] // Enhanced manifest with variants
  createdAt: Date
  updatedAt: Date
}

// Specialized shipments store types
export type ShipmentStage = 'BOOKED' | 'TRANSIT' | 'CUSTOMS' | 'WAREHOUSE' | 'AVAILABLE'

export type ShipmentItem = {
  id: string
  shipmentId: string
  productId: string
  variantId?: string
  qty: number
}

export type ShipmentLite = {
  id: string
  ref: string
  stage: ShipmentStage
  eta?: string
  notes?: string
  items: ShipmentItem[]
  createdAt: string
  updatedAt: string
}

export type ProductLite = {
  id: string
  name: string
  variants?: { id: string; sizeLabel: string }[]
}

// ============================================
// Admin System Types
// ============================================

export interface AdminSettings {
  catalog: {
    priceVisibility: boolean
    lowStockThreshold: number
    outOfStockThreshold: number
  }
  localization: {
    defaultLanguage: string
    enableMultiLanguage: boolean
    supportedLanguages: string[]
  }
  inquiries: {
    autoAssignToOwner: boolean
    emailNotifications: boolean
    whatsappNotifications: boolean
  }
  shipments: {
    defaultCarrier: string
    trackingEnabled: boolean
    estimatedDeliveryDays: number
  }
}

export interface AdminActivity {
  id: string
  type: string
  description: string
  userId: string
  timestamp: Date
  metadata?: Record<string, any>
}

// ============================================
// Image Management Types
// ============================================

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

// ============================================
// API Response Wrapper Types
// ============================================

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  success: boolean
  message?: string
}

export interface ApiError {
  success: false
  message: string
  code?: string
  details?: Record<string, any>
}

// ============================================
// Filter and Search Types
// ============================================

export interface ProductFilters {
  q?: string // Search query
  category?: string
  brand?: string
  inStock?: boolean
  priceMin?: number
  priceMax?: number
  hasVariants?: boolean
}

export interface ShipmentFilters {
  status?: ShipmentStage
  stage?: string
  ref?: string
  eta?: string
  page?: number
  pageSize?: number
}

export interface InquiryFilters {
  status?: "pending" | "responded" | "closed"
  userId?: string
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
}

// ============================================
// Form Data Types (for API requests)
// ============================================

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
  brand: string
  imageUrl: string
  inStock: boolean
  specifications: Record<string, string>
  sku: string
  variants?: Omit<ProductVariant, 'id'>[]
  defaultVariantId?: string
  remarks?: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface CreateInquiryRequest {
  products: InquiryItem[]
  customerNotes?: string
  whatsappNumber: string
  customerName: string
  customerEmail?: string
  customerCompany?: string
}

export interface CreateShipmentRequest {
  referenceNumber: string
  inquiryId?: string
  carrier: string
  origin?: string
  destination?: string
  estimatedDelivery: string // ISO date string
  notes?: string
  manifestItems: Omit<ShipmentManifestItem, 'id'>[]
}

export interface UpdateShipmentRequest {
  status?: Shipment['status']
  estimatedDelivery?: string
  actualDelivery?: string
  notes?: string
  timeline?: Array<{
    status: string
    timestamp: string
    location?: string
    notes?: string
  }>
}