# Store Actions → API Endpoints Mapping

The frontend uses Zustand stores instead of React Query. Here's how to convert store actions to API calls:

## Core Stores

### useAppStore (Main Application State)

**Base URL Change:**
```typescript
// Current: Uses mock data
const products = mockProducts

// After Integration: Replace with API calls
const fetchProducts = async (filters?: ProductFilters) => {
  const response = await fetch(`${API_BASE_URL}/products?${new URLSearchParams(filters)}`)
  return response.json()
}
```

#### Products Data Access

| Store Method | HTTP Endpoint | Request | Response | Notes |
|-------------|---------------|---------|----------|--------|
| `products` (state) | `GET /products` | Query params: `q`, `category`, `brand`, `inStock`, `hasVariants`, `page`, `pageSize` | `PaginatedResponse<Product[]>` | Main product listing |
| `getProductById(id)` | `GET /products/{id}` | Path: `id` | `ApiResponse<Product>` | Single product details |
| `getFilteredProducts()` | `GET /products` | Current filter state as query params | `PaginatedResponse<Product[]>` | Uses current filter state |
| `createProduct(product)` | `POST /products` | Body: `CreateProductRequest` | `ApiResponse<Product>` | Admin only |
| `updateProduct(id, updates)` | `PATCH /products/{id}` | Path: `id`, Body: `UpdateProductRequest` | `ApiResponse<Product>` | Admin only |
| `deleteProduct(id)` | `DELETE /products/{id}` | Path: `id` | `ApiResponse<void>` | Admin only |

**Example Implementation:**
```typescript
// Replace this store action
const createProduct = (product: Omit<Product, 'id'>) => {
  // Mock implementation with timeout
}

// With this API call
const createProduct = async (product: CreateProductRequest) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create product')
  }
  
  return response.json()
}
```

#### Brands Data Access

| Store Method | HTTP Endpoint | Request | Response | Cache Strategy |
|-------------|---------------|---------|----------|---------------|
| `brands` (state) | `GET /brands` | None | `ApiResponse<Brand[]>` | Cache for 1 hour |
| `getBrandById(id)` | `GET /brands/{id}` | Path: `id` | `ApiResponse<Brand>` | Cache for 30 min |
| `createBrand(brand)` | `POST /brands` | Body: `CreateBrandRequest` | `ApiResponse<Brand>` | Invalidate brands list |
| `updateBrand(id, updates)` | `PATCH /brands/{id}` | Path: `id`, Body: `UpdateBrandRequest` | `ApiResponse<Brand>` | Invalidate brand cache |
| `deleteBrand(id)` | `DELETE /brands/{id}` | Path: `id` | `ApiResponse<void>` | Invalidate brands list |

#### Categories Data Access

| Store Method | HTTP Endpoint | Request | Response | Cache Strategy |
|-------------|---------------|---------|----------|---------------|
| `categories` (state) | `GET /categories` | None | `ApiResponse<Category[]>` | Cache for 2 hours |
| `getCategoryById(id)` | Direct lookup | None | Category from cache | Use cached data |

#### Inquiries Management

| Store Method | HTTP Endpoint | Request | Response | Notes |
|-------------|---------------|---------|----------|--------|
| `inquiries` (state) | `GET /inquiries` | Query params: `status`, `userId`, `fromDate`, `toDate`, `page`, `pageSize` | `PaginatedResponse<Inquiry[]>` | Admin only |
| `addToInquiryCart(item)` | Local state only | None | None | No API call needed |
| `clearInquiryCart()` | Local state only | None | None | No API call needed |
| *(Submit inquiry)* | `POST /inquiries` | Body: `CreateInquiryRequest` | `ApiResponse<Inquiry>` | From inquiry cart |
| `updateInquiryStatus(id, status)` | `PATCH /inquiries/{id}` | Path: `id`, Body: `{status}` | `ApiResponse<Inquiry>` | Admin only |

**Inquiry Submission Flow:**
```typescript
// Current: Mock submission
const submitInquiry = (inquiryData) => {
  // Mock success message
}

// New: API integration
const submitInquiry = async (cartItems: InquiryItem[], customerData: CustomerData) => {
  const inquiryRequest: CreateInquiryRequest = {
    products: cartItems,
    whatsappNumber: customerData.whatsappNumber,
    customerName: customerData.customerName,
    customerEmail: customerData.customerEmail,
    customerCompany: customerData.customerCompany,
    customerNotes: customerData.notes,
  }
  
  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryRequest),
  })
  
  if (!response.ok) {
    throw new Error('Failed to submit inquiry')
  }
  
  return response.json()
}
```

#### Shipments Management

| Store Method | HTTP Endpoint | Request | Response | Notes |
|-------------|---------------|---------|----------|--------|
| `shipments` (state) | `GET /shipments` | Query params: `status`, `stage`, `ref`, `page`, `pageSize` | `PaginatedResponse<Shipment[]>` | Public + Admin |
| `updateShipmentStatus(id, status)` | `PATCH /shipments/{id}` | Path: `id`, Body: `{status}` | `ApiResponse<Shipment>` | Admin only |

#### Admin Settings

| Store Method | HTTP Endpoint | Request | Response | Cache Strategy |
|-------------|---------------|---------|----------|---------------|
| `adminSettings` (state) | `GET /settings` | None | `ApiResponse<AdminSettings>` | Cache for 5 minutes |
| `updateAdminSettings(updates)` | `PATCH /settings` | Body: Partial settings | `ApiResponse<AdminSettings>` | Invalidate cache |

---

### useAdminStore (Admin Operations)

This store handles admin-specific operations with loading states and optimistic updates.

| Store Method | HTTP Endpoint | Request | Response | Optimistic Updates |
|-------------|---------------|---------|----------|-------------------|
| `addProduct(product)` | `POST /products` | Body: `CreateProductRequest` | `ApiResponse<Product>` | Add to products list immediately |
| `updateProduct(id, updates)` | `PATCH /products/{id}` | Path: `id`, Body: updates | `ApiResponse<Product>` | Update product in list |
| `deleteProduct(id)` | `DELETE /products/{id}` | Path: `id` | `ApiResponse<void>` | Remove from products list |
| `addVariant(productId, variant)` | `POST /products/{productId}/variants` | Path: `productId`, Body: variant | `ApiResponse<ProductVariant>` | Add to product variants |
| `updateVariant(productId, variantId, updates)` | `PATCH /products/{productId}/variants/{variantId}` | Paths + Body: updates | `ApiResponse<ProductVariant>` | Update variant in product |
| `deleteVariant(productId, variantId)` | `DELETE /products/{productId}/variants/{variantId}` | Paths only | `ApiResponse<void>` | Remove variant |
| `addBrand(brand)` | `POST /brands` | Body: `CreateBrandRequest` | `ApiResponse<Brand>` | Add to brands list |
| `updateBrand(id, updates)` | `PATCH /brands/{id}` | Path: `id`, Body: updates | `ApiResponse<Brand>` | Update brand in list |
| `deleteBrand(id)` | `DELETE /brands/{id}` | Path: `id` | `ApiResponse<void>` or `409 Error` | Remove from brands list |

**Error Handling Pattern:**
```typescript
// Current: Simulated loading with setTimeout
const updateProduct = (id: string, updates: Partial<Product>) => {
  set({ isLoading: true })
  setTimeout(() => {
    set({ isLoading: false })
    toast.success('Product updated successfully!')
  }, 800)
}

// New: Real API call with error handling
const updateProduct = async (id: string, updates: UpdateProductRequest) => {
  set({ isLoading: true })
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update product')
    }
    
    const result = await response.json()
    
    // Update local state optimistically
    updateProductInStore(id, result.data)
    
    set({ isLoading: false })
    toast.success('Product updated successfully!')
    
    return result.data
  } catch (error) {
    set({ isLoading: false })
    toast.error(error.message || 'Failed to update product')
    throw error
  }
}
```

---

### useShipmentsStore (Specialized Shipments)

| Store Method | HTTP Endpoint | Request | Response | Notes |
|-------------|---------------|---------|----------|--------|
| `shipments` (state) | `GET /shipments` | Query params | `PaginatedResponse<ShipmentLite[]>` | Simplified shipment data |
| `addShipment(shipment)` | `POST /shipments` | Body: `CreateShipmentRequest` | `ApiResponse<Shipment>` | Create new shipment |
| `updateShipment(id, updates)` | `PATCH /shipments/{id}` | Path: `id`, Body: updates | `ApiResponse<Shipment>` | Update shipment details |
| `addShipmentItem(shipmentId, item)` | `POST /shipments/{shipmentId}/items` | Path + Body: item | `ApiResponse<ShipmentItem>` | Add item to manifest |
| `updateShipmentItem(shipmentId, itemId, updates)` | `PATCH /shipments/{shipmentId}/items/{itemId}` | Paths + Body: updates | `ApiResponse<ShipmentItem>` | Update item quantity |
| `deleteShipmentItem(shipmentId, itemId)` | `DELETE /shipments/{shipmentId}/items/{itemId}` | Paths only | `ApiResponse<void>` | Remove item from manifest |

---

## Cache Invalidation Rules

### When Products Change:
- Invalidate: `GET /products` (all variants)
- Invalidate: Brand/Category product counts
- Keep: Individual product cache for non-updated items

### When Brands Change:
- Invalidate: `GET /brands`
- Invalidate: All product lists (due to brand references)
- Keep: Categories cache

### When Inquiries Change:
- Invalidate: Admin inquiries list
- Keep: Product/brand/category caches

### When Shipments Change:
- Invalidate: Shipments list
- Keep: Product/brand/category caches

---

## Authentication Headers

All admin endpoints require authentication:

```typescript
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token') // or from auth store
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}
```

---

## Error Handling Standards

### Standard Error Response Format:
```typescript
interface ApiError {
  success: false
  message: string
  code?: string
  details?: Record<string, any>
}
```

### Common Error Codes:
- `VALIDATION_ERROR` - Invalid request data
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate SKU)
- `RATE_LIMITED` - Too many requests

### Error Handling Pattern:
```typescript
const handleApiError = (error: ApiError) => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      // Show field-specific errors
      break
    case 'UNAUTHORIZED':
      // Redirect to login
      break
    case 'FORBIDDEN':
      // Show permission error
      break
    default:
      // Show generic error message
      toast.error(error.message)
  }
}
```

---

## Migration Steps

1. **Replace Base URL**: Change from mock data to `process.env.REACT_APP_API_BASE_URL`

2. **Update Store Actions**: Replace setTimeout mocks with actual fetch calls

3. **Add Error Handling**: Implement proper error boundaries and user feedback

4. **Add Loading States**: Use existing `isLoading` state from admin store

5. **Test with Mock Server**: Use provided OpenAPI spec to generate mock server

6. **Switch to Production**: Update base URL to production endpoint

**Environment Variables Needed:**
```
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
REACT_APP_PRODUCTION_API_URL=https://api.jeenmataimpex.com/v1
```