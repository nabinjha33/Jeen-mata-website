# Route Tree and Components

## Public Routes (MainLayout)

### `/` - HomePage
**Components:** HomePage, ProductCard[], CategoryCard[], BrandCard[], FeaturedShipments
**Data Sources:** 
- `useAppStore()`: products, brands, categories, shipments
- Displays featured products, recent shipments, brand highlights

**States:**
- Loading: Hero section with skeleton loaders
- Empty: "No products available" message
- Error: Error boundary with retry action

---

### `/brands` - BrandsPage
**Components:** BrandsPage, BrandCard[], ProductFilters
**Data Sources:**
- `useAppStore()`: brands, selectedBrand, setSelectedBrand
- URL params: brand filter

**States:**
- Loading: Brand grid with skeleton cards
- Empty: "No brands found" with search reset
- Error: Error message with retry button

---

### `/brands/:brandSlug` - BrandDetailPage
**Components:** BrandDetailPage, ProductCard[], ProductFilters
**Data Sources:**
- `useAppStore()`: getBrandById(), getFilteredProducts()
- URL params: brandSlug

**States:**
- Loading: Brand header + product grid skeletons
- Empty: Brand found but no products
- Error: Brand not found (404) or fetch error

---

### `/products/:productSlug` - ProductDetailPage
**Components:** ProductDetailPage, VariantSelector, PackingOptions, ImageGallery
**Data Sources:**
- `useAppStore()`: getProductById(), addToInquiryCart()
- URL params: productSlug

**States:**
- Loading: Product detail skeleton
- Empty: Product not found (404)
- Error: Fetch error with retry

---

### `/search` - SearchPage  
**Components:** SearchPage, ProductCard[], AdvancedFilters, Pagination
**Data Sources:**
- `useAppStore()`: getFilteredProducts(), searchQuery, selectedCategory, selectedBrand
- URL params: q, category, brand, page

**States:**
- Loading: Search results skeleton
- Empty: "No products match your search"
- Error: Search service error

---

### `/shipments` - ShipmentsPage
**Components:** ShipmentsPage, ShipmentCard[], ShipmentFilters
**Data Sources:**
- `useAppStore()`: shipments (filtered by public visibility)
- URL params: status, page

**States:**
- Loading: Shipment cards skeleton
- Empty: "No shipments to display"
- Error: Shipments fetch error

---

### `/shipments/:shipmentId` - ShipmentDetailPage
**Components:** ShipmentDetailPage, TimelineComponent, ManifestTable
**Data Sources:**
- `useAppStore()`: shipments.find(id)
- URL params: shipmentId

**States:**
- Loading: Shipment detail skeleton
- Empty: Shipment not found (404)
- Error: Fetch error

---

### `/inquiry` - InquiryCartPage
**Components:** InquiryCartPage, InquiryItemCard[], CheckoutForm
**Data Sources:**
- `useAppStore()`: inquiryCart, clearInquiryCart()

**States:**
- Loading: Form submission in progress
- Empty: "Your inquiry cart is empty"
- Error: Submission failed with retry

---

### `/inquiry/success` - InquirySuccessPage
**Components:** InquirySuccessPage
**Data Sources:** None (static success message)

---

## Admin Routes (AdminLayout) 

**Auth Required:** All admin routes require authentication
**Role Gates:** Owner/Manager/ContentEditor with different permissions

### `/admin` - AdminDashboardPage
**Components:** AdminDashboardPage, KPICards, ActivityFeed, Charts
**Data Sources:**
- `useAppStore()`: getAdminKPIs(), adminActivity, getUserById()

**Permissions:** All admin roles can view dashboard

---

### `/admin/products` - AdminProductsPage
**Components:** AdminProductsPage, ProductTable, DrawerForm, ImageManager, VariantsDrawer
**Data Sources:**
- `useAppStore()`: products, brands, categories, getVariantStockStatus()
- `useAdminStore()`: addProduct(), updateProduct(), deleteProduct()

**Permissions:**
- Owner/Manager: Full CRUD
- ContentEditor: Read + Update only

**URL Params:** search, brand, category, hasVariants, page

---

### `/admin/brands` - AdminBrandsPage  
**Components:** AdminBrandsPage, BrandTable, DrawerForm
**Data Sources:**
- `useAppStore()`: brands, products (for product count)
- `useAdminStore()`: addBrand(), updateBrand(), deleteBrand()

**Permissions:**
- Owner/Manager: Full CRUD
- ContentEditor: Read only

---

### `/admin/shipments` - AdminShipmentsPage
**Components:** AdminShipmentsPage, ShipmentsTable, AddConsignmentDrawer, ShipmentDetailDrawer
**Data Sources:**
- `useShipmentsStore()`: shipments, productsLite, addShipment(), updateShipment()

**Permissions:**
- Owner/Manager: Full management
- ContentEditor: Read only

**URL Params:** stage, ref, page, pageSize

---

### `/admin/inquiries` - AdminInquiriesPage
**Components:** AdminInquiriesPage, InquiriesTable, InquiryDetailDrawer
**Data Sources:**
- `useAppStore()`: inquiries, updateInquiryStatus(), getUserById()

**Permissions:**
- Owner/Manager: Full management
- ContentEditor: Read + respond only

**URL Params:** status, fromDate, toDate, page

---

### `/admin/settings` - AdminSettingsPage
**Components:** AdminSettingsPage, SettingsSections (Catalog, Localization, etc.)
**Data Sources:**
- `useAppStore()`: adminSettings, updateAdminSettings()

**Permissions:**
- Owner: Full settings access
- Manager: Limited settings access  
- ContentEditor: Read only

---

## Component States Documentation

### Loading States
**Trigger Conditions:**
- Initial data fetch in progress
- Form submission pending
- Route transition with data dependencies

**UI Patterns:**
- Skeleton loaders matching final content structure
- Spinner overlays for form submissions
- Progressive loading for large datasets

### Empty States  
**Trigger Conditions:**
- No data returned from successful API call
- User filters result in no matches
- New user with no activity

**UI Patterns:**
- Illustrated empty state with clear messaging
- Primary action button to resolve empty state
- Helpful text explaining why content is empty

### Error States
**Trigger Conditions:**
- Network/API errors (4xx, 5xx responses)
- Validation errors on form submission
- Resource not found (404 scenarios)

**UI Patterns:**
- Error message with retry action
- Form validation errors inline with fields
- Global error boundary for unhandled errors

### Disabled States
**Trigger Conditions:**
- User lacks required permissions
- Feature not available in current context
- Dependencies not met (e.g., no internet)

**UI Patterns:**
- Disabled buttons with tooltip explanations
- Grayed out sections with permission messages
- Progressive disclosure based on user role

---

## URL Parameter Mapping

### Search and Filters (`/search`, `/admin/products`, etc.)
- `q` - Search query string
- `category` - Category filter
- `brand` - Brand filter  
- `inStock` - Stock availability filter (boolean)
- `hasVariants` - Products with variants filter (boolean)
- `priceMin` / `priceMax` - Price range filters

### Pagination
- `page` - Current page number (1-indexed)
- `pageSize` - Items per page (default: 20)

### Admin Filters
- `status` - Entity status filter
- `stage` - Shipment stage filter
- `fromDate` / `toDate` - Date range filters (ISO format)
- `ref` - Reference number search

**Filter Persistence:** 
- Search filters persist in URL for bookmarking
- Admin filters reset on navigation unless explicitly saved
- Pagination resets when filters change