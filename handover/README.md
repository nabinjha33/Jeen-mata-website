# Jeen Mata Impex Backend API Handover Package

This package contains everything needed to implement the backend API that will seamlessly integrate with the existing frontend application.

## 📁 Package Contents

- **`openapi.json`** - Complete API specification derived from frontend usage patterns
- **`types.d.ts`** - TypeScript interfaces that must be implemented exactly as defined
- **`hooks.md`** - Mapping of frontend store actions to API endpoints with examples
- **`auth-roles.md`** - Role-based access control matrix and permission system
- **`uploads.md`** - Image upload flow using signed URLs
- **`routes-and-components.md`** - Complete route tree and component states
- **`.env.example`** - Environment variables needed by frontend
- **`fixtures/`** - JSON data samples matching exact API response format
- **`smoke-tests.postman_collection.json`** - API testing examples

## 🎯 Integration Objective

The frontend is currently using Zustand stores with mock data. After you implement the API endpoints, the frontend will switch from mock data to live API calls **without any code refactoring** - just environment variable changes.

## 🚀 Quick Start Guide

### 1. Review the API Contract
```bash
# Start with the OpenAPI specification
cat openapi.json | jq '.' | less

# Understand the data types
head -50 types.d.ts
```

### 2. Implement Core Endpoints First
**Priority Order:**
1. Authentication (`POST /auth/login`)
2. Products listing (`GET /products`)
3. Product details (`GET /products/{id}`)
4. Inquiry submission (`POST /inquiries`)
5. Admin product management
6. Shipments tracking
7. Settings management
8. Image uploads

### 3. Use Fixture Data for Testing
```bash
# Import sample data for testing
for file in fixtures/*.json; do
  echo "Sample data for $(basename $file .json):"
  head -20 "$file"
done
```

### 4. Test with Frontend Integration
```bash
# Change frontend environment variables
cp handover/.env.example .env.local

# Update API base URL
echo "REACT_APP_API_BASE_URL=http://localhost:3001/api/v1" >> .env.local
```

## 📋 Implementation Checklist

### Core API Endpoints
- [ ] `GET /products` - Product listing with filters
- [ ] `GET /products/{id}` - Single product details
- [ ] `POST /products` - Create product (admin)
- [ ] `PATCH /products/{id}` - Update product (admin)
- [ ] `DELETE /products/{id}` - Delete product (admin)
- [ ] `GET /brands` - Brand listing
- [ ] `GET /categories` - Category listing
- [ ] `POST /inquiries` - Submit customer inquiry
- [ ] `GET /inquiries` - List inquiries (admin)
- [ ] `PATCH /inquiries/{id}` - Update inquiry status
- [ ] `GET /shipments` - Shipment tracking
- [ ] `POST /shipments` - Create shipment (admin)
- [ ] `PATCH /shipments/{id}` - Update shipment
- [ ] `GET /settings` - Admin settings
- [ ] `PATCH /settings` - Update settings

### Authentication & Authorization
- [ ] `POST /auth/login` - User authentication
- [ ] JWT token generation and validation
- [ ] Role-based permission middleware
- [ ] Admin route protection

### File Upload System
- [ ] `POST /uploads/signed-url` - Generate signed upload URL
- [ ] Image validation and processing
- [ ] Storage integration (S3/CloudFlare/etc.)

### Error Handling
- [ ] Standard error response format
- [ ] Validation error details
- [ ] Proper HTTP status codes
- [ ] Error logging and monitoring

## 💾 Database Schema Requirements

Based on the TypeScript types, your database needs these core tables:

```sql
-- Products and variants with packing options
products (id, name, description, price, category, brand, image_url, in_stock, sku, specifications, created_at, updated_at)
product_variants (id, product_id, size_label, price_cents, stock_state, sku, stock, price, unit)
variant_packings (id, variant_id, label, units_per_pack)

-- Catalog organization
categories (id, name, name_ne, description, image_url, product_count)
brands (id, name, description, logo_url, website, country_of_origin, product_count)

-- User management
users (id, name, email, role, phone, company, permissions, avatar)

-- Business processes  
inquiries (id, user_id, status, customer_notes, whatsapp_number, customer_name, customer_email, customer_company, created_at, updated_at)
inquiry_items (id, inquiry_id, product_id, variant_id, packing_option_id, quantity, total_pieces, unit_price, notes)

shipments (id, reference_number, tracking_number, status, estimated_delivery, actual_delivery, carrier, origin, destination, notes, created_at, updated_at)
shipment_items (id, shipment_id, product_id, variant_id, packing_option_id, quantity, total_pieces)
shipment_timeline (id, shipment_id, status, timestamp, location, notes)

-- Configuration
admin_settings (id, catalog_settings, localization_settings, inquiry_settings, shipment_settings)
admin_activity (id, user_id, action, target, target_id, timestamp, details)
```

## 🎛️ Environment Setup

The frontend expects these environment variables to be configurable:

```bash
# Copy and customize the environment template
cp handover/.env.example .env

# Key variables for API integration:
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
REACT_APP_PRICE_VISIBILITY=true
REACT_APP_UPLOAD_METHOD=signed_url
REACT_APP_DEFAULT_PAGE_SIZE=20
```

## 🔧 Frontend Integration Steps

### Step 1: Replace Mock Data Access
The frontend currently uses Zustand stores with mock data:

```typescript
// Current: Mock data
const products = mockProducts

// After: API integration  
const fetchProducts = async (filters) => {
  const response = await fetch(`${API_BASE_URL}/products?${queryParams}`)
  return response.json()
}
```

### Step 2: Update Store Actions
Replace setTimeout mocks with actual API calls:

```typescript
// Current: Simulated operation
const createProduct = (product) => {
  setTimeout(() => {
    set({ isLoading: false })
    toast.success('Product created!')
  }, 1000)
}

// After: Real API call
const createProduct = async (product) => {
  set({ isLoading: true })
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    })
    const result = await response.json()
    set({ isLoading: false })
    toast.success('Product created!')
    return result
  } catch (error) {
    set({ isLoading: false })
    toast.error(error.message)
    throw error
  }
}
```

### Step 3: Handle Authentication
Add JWT token management:

```typescript
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const result = await response.json()
  if (result.success) {
    localStorage.setItem('auth_token', result.data.token)
    setCurrentUser(result.data.user)
  }
}

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json'
})
```

## 🧪 Testing Strategy

### 1. Start with Postman Collection
```bash
# Import the provided collection
newman run handover/smoke-tests.postman_collection.json
```

### 2. Test Core User Journeys
- **Customer Flow**: Product browsing → Inquiry submission
- **Admin Flow**: Login → Product management → Shipment tracking
- **Public Flow**: Shipment tracking without auth

### 3. Integration Testing
- Switch frontend to API mode and verify all features work
- Test with different user roles and permissions
- Validate error handling and edge cases

## 📝 Important Notes & Assumptions

### Data Format Assumptions
- **Dates**: All dates should be ISO 8601 strings in API responses
- **Prices**: Stored as cents (integers) to avoid floating point issues
- **IDs**: String UUIDs or sequential strings, not numeric IDs
- **Stock States**: Enum values `'IN' | 'LOW' | 'OUT'` exactly as defined

### Business Logic Assumptions
- **Inquiries**: No direct purchases - customers submit inquiries for quotes
- **Stock Management**: Variant-level stock tracking with packing options
- **Shipments**: Import/export consignments, not individual orders
- **Roles**: Owner > Manager > Content Editor > Customer hierarchy

### Frontend Behavior Assumptions
- **Caching**: Frontend expects reasonable cache headers on GET endpoints
- **Pagination**: Uses page/pageSize query parameters
- **Filtering**: Multiple filter parameters can be combined
- **Search**: Case-insensitive search across name, description, brand
- **Images**: Expects signed URL upload flow for admin image management

## 🚨 Critical Success Factors

1. **Exact Type Matching**: API responses must match TypeScript interfaces exactly
2. **Permission Enforcement**: Server-side validation of all admin operations
3. **Error Consistency**: Standard error format across all endpoints
4. **Performance**: Product listing should handle 1000+ products efficiently
5. **Security**: Proper JWT validation and SQL injection prevention

## 📞 Support & Questions

When implementing, refer to:
- `hooks.md` for exact store-to-endpoint mapping
- `auth-roles.md` for permission matrices
- `openapi.json` for request/response schemas
- `fixtures/` for data samples and relationships

The frontend is ready to integrate immediately once you implement the API endpoints according to this specification.

---

**Success Criteria**: A backend engineer should be able to implement all endpoints using only this handover package, and the frontend should work seamlessly by changing just the base URL environment variable.