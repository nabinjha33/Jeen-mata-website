# Authentication & Role-Based Access Control

## Authentication Requirements

### Public Routes (No Auth Required)
- `/` - Home page
- `/brands` - Brands listing
- `/brands/:brandSlug` - Brand details
- `/products/:productSlug` - Product details  
- `/search` - Product search
- `/shipments` - Public shipment tracking
- `/shipments/:shipmentId` - Public shipment details
- `/inquiry` - Inquiry cart
- `/inquiry/success` - Inquiry submission success

### Protected Routes (Auth Required)
- `/admin/*` - All admin routes require authentication
- Admin users must have role: `owner`, `manager`, or `content_editor`

---

## User Roles & Permissions Matrix

### Role Hierarchy
1. **Owner** - Full system access
2. **Manager** - Admin access with some restrictions  
3. **Content Editor** - Limited admin access
4. **Customer** - Public access only

---

## Admin Area Permissions

### `/admin` - Dashboard
| Action | Owner | Manager | Content Editor |
|--------|-------|---------|----------------|
| View KPIs | ✅ | ✅ | ✅ |
| View activity feed | ✅ | ✅ | ✅ |
| View charts/analytics | ✅ | ✅ | ❌ |

**Implementation:**
```typescript
const canViewAnalytics = (user: User) => {
  return ['owner', 'manager'].includes(user.role)
}
```

### `/admin/products` - Product Management
| Action | Owner | Manager | Content Editor |
|--------|-------|---------|----------------|
| View products list | ✅ | ✅ | ✅ |
| Search/filter products | ✅ | ✅ | ✅ |
| Create new product | ✅ | ✅ | ❌ |
| Edit product details | ✅ | ✅ | ✅ |
| Delete product | ✅ | ✅ | ❌ |
| Manage variants | ✅ | ✅ | ✅ |
| Manage packing options | ✅ | ✅ | ✅ |
| Upload/manage images | ✅ | ✅ | ✅ |
| Edit product remarks | ✅ | ✅ | ✅ |

**UI Permission Gates:**
```typescript
const ProductsPage = () => {
  const { currentUser } = useAppStore()
  
  const canCreateProduct = ['owner', 'manager'].includes(currentUser?.role)
  const canDeleteProduct = ['owner', 'manager'].includes(currentUser?.role)
  
  return (
    <div>
      {canCreateProduct && (
        <Button onClick={() => setShowAddProduct(true)}>
          Add Product
        </Button>
      )}
      
      {/* Product list with conditional delete buttons */}
      {products.map(product => (
        <ProductRow 
          key={product.id}
          product={product}
          canDelete={canDeleteProduct}
        />
      ))}
    </div>
  )
}
```

### `/admin/brands` - Brand Management  
| Action | Owner | Manager | Content Editor |
|--------|-------|---------|----------------|
| View brands list | ✅ | ✅ | ✅ |
| Create new brand | ✅ | ✅ | ❌ |
| Edit brand details | ✅ | ✅ | ❌ |
| Delete brand | ✅ | ❌ | ❌ |

**Server-Side Check Required:**
```typescript
// Backend should verify before allowing brand deletion
DELETE /brands/{id}
// Check: user.role === 'owner'
```

### `/admin/shipments` - Shipment Management
| Action | Owner | Manager | Content Editor |
|--------|-------|---------|----------------|
| View shipments list | ✅ | ✅ | ✅ |
| Create new shipment | ✅ | ✅ | ❌ |
| Edit shipment details | ✅ | ✅ | ❌ |
| Update shipment status | ✅ | ✅ | ❌ |
| Add/remove shipment items | ✅ | ✅ | ❌ |
| Update shipment timeline | ✅ | ✅ | ❌ |

### `/admin/inquiries` - Inquiry Management
| Action | Owner | Manager | Content Editor |
|--------|-------|---------|----------------|
| View inquiries list | ✅ | ✅ | ✅ |
| View inquiry details | ✅ | ✅ | ✅ |
| Update inquiry status | ✅ | ✅ | ✅ |
| Close inquiry | ✅ | ✅ | ❌ |
| Add inquiry notes | ✅ | ✅ | ✅ |

### `/admin/settings` - System Settings
| Setting Category | Owner | Manager | Content Editor |
|-----------------|-------|---------|----------------|
| **Catalog Settings** | | | |
| - Price visibility | ✅ | ✅ | ❌ |
| - Stock thresholds | ✅ | ✅ | ❌ |
| **Localization** | | | |
| - Default language | ✅ | ❌ | ❌ |
| - Multi-language toggle | ✅ | ❌ | ❌ |
| **Inquiry Settings** | | | |
| - Auto-assign settings | ✅ | ✅ | ❌ |
| - Notification settings | ✅ | ✅ | ❌ |
| **Shipment Settings** | | | |
| - Default carrier | ✅ | ✅ | ❌ |
| - Delivery estimates | ✅ | ✅ | ❌ |

**Settings UI Implementation:**
```typescript
const SettingsPage = () => {
  const { currentUser } = useAppStore()
  
  const canEditCatalog = ['owner', 'manager'].includes(currentUser?.role)
  const canEditLocalization = currentUser?.role === 'owner'
  
  return (
    <div>
      <SettingsSection 
        title="Catalog Settings"
        disabled={!canEditCatalog}
      />
      <SettingsSection 
        title="Localization"
        disabled={!canEditLocalization}
      />
    </div>
  )
}
```

---

## API Authentication

### JWT Token Structure
```typescript
interface JWTPayload {
  sub: string        // User ID
  email: string      // User email
  role: string       // User role
  permissions: string[]  // Specific permissions
  iat: number        // Issued at
  exp: number        // Expires at
}
```

### Permission System
Instead of just role-based checks, the backend should also support granular permissions:

```typescript
interface User {
  id: string
  email: string
  role: 'owner' | 'manager' | 'content_editor' | 'customer'
  permissions: Permission[]
}

interface Permission {
  resource: string    // 'products', 'brands', 'shipments', etc.
  actions: string[]   // ['read', 'create', 'update', 'delete']
}
```

### Frontend Permission Checking
```typescript
const checkPermission = (user: User, resource: string, action: string): boolean => {
  // Role-based fallback
  if (user.role === 'owner') return true
  
  // Permission-based check
  const permission = user.permissions?.find(p => p.resource === resource)
  return permission?.actions.includes(action) || false
}

// Usage in components
const canEditProduct = checkPermission(currentUser, 'products', 'update')
const canDeleteBrand = checkPermission(currentUser, 'brands', 'delete')
```

---

## Route Guards

### Admin Layout Guard
```typescript
const AdminLayout = () => {
  const { currentUser } = useAppStore()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    if (!['owner', 'manager', 'content_editor'].includes(currentUser.role)) {
      navigate('/')
      toast.error('Access denied: Admin privileges required')
      return
    }
  }, [currentUser, navigate])
  
  if (!currentUser || !isAdminUser(currentUser)) {
    return <div>Access denied</div>
  }
  
  return <Outlet />
}
```

### Page-Level Permission Guards
```typescript
const AdminProductsPage = () => {
  const { currentUser } = useAppStore()
  
  // Check if user can access products admin
  if (!checkPermission(currentUser, 'products', 'read')) {
    return (
      <div className="p-8 text-center">
        <h2>Access Denied</h2>
        <p>You don't have permission to manage products.</p>
      </div>
    )
  }
  
  return <ProductsManagementInterface />
}
```

---

## Server-Side Verification Required

The frontend permission checks are for UX only. Backend must verify:

### For Every Admin API Call:
1. **Authentication**: Valid JWT token
2. **Authorization**: User role allows the action
3. **Resource Access**: User can access specific resource
4. **Operation Permission**: User can perform specific operation

### Example Backend Middleware:
```typescript
const requirePermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user // From JWT middleware
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }
    
    if (!checkPermission(user, resource, action)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      })
    }
    
    next()
  }
}

// Usage
app.delete('/products/:id', 
  authenticateJWT,
  requirePermission('products', 'delete'),
  deleteProduct
)
```

---

## Login Flow Integration

### Login API Response:
```typescript
interface LoginResponse {
  success: true
  data: {
    token: string
    user: {
      id: string
      name: string
      email: string
      role: string
      permissions: Permission[]
    }
  }
}
```

### Frontend Token Management:
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const result = await response.json()
  
  if (result.success) {
    // Store token and user
    localStorage.setItem('auth_token', result.data.token)
    setCurrentUser(result.data.user)
    
    // Redirect based on role
    if (isAdminUser(result.data.user)) {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }
}
```

This permission system ensures secure access control while maintaining a smooth user experience for different admin roles.