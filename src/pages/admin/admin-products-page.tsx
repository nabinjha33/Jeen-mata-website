"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Eye, Package, Boxes, Settings, ExternalLink, Upload } from "lucide-react"
import { useAppStore } from "../../store/app-store"
import { useAdminStore } from "../../stores/admin-store"
import { DrawerForm } from "../../components/admin/drawer-form"
import { ConfirmDialog } from "../../components/admin/confirm-dialog"
import { VariantsManagementDrawer } from "../../components/admin/variants-management-drawer"
import { ImageManager } from "../../components/admin/image-manager"
import type { Product } from "../../data/fixtures"
import type { ManagedImage } from "../../types/image-manager"

export function AdminProductsPage() {
  const { products, brands, categories, getVariantStockStatus } = useAppStore()
  const { addProduct, updateProduct, deleteProduct, isLoading } = useAdminStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showVariantsOnly, setShowVariantsOnly] = useState(false)
  
  // Drawer states
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showVariantsDrawer, setShowVariantsDrawer] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  // Form state
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    sku: '',
    inStock: true,
    tags: '',
    imageUrl: '',
    remarks: ''
  })
  
  const [productImages, setProductImages] = useState<ManagedImage[]>([])
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const tableRef = useRef<HTMLDivElement>(null)
  
  // Form handlers
  const resetForm = () => {
    setProductForm({
      name: '',
      brand: '',
      category: '',
      description: '',
      price: '',
      sku: '',
      inStock: true,
      tags: '',
      imageUrl: '',
      remarks: ''
    })
    setProductImages([])
    setFormErrors({})
  }
  
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!productForm.name.trim()) errors.name = 'Product name is required'
    if (!productForm.brand.trim()) errors.brand = 'Brand is required'
    if (!productForm.sku.trim()) errors.sku = 'SKU is required'
    if (productForm.price && isNaN(Number(productForm.price))) errors.price = 'Price must be a valid number'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Determine primary image URL
    const primaryImage = productImages.find(img => img.isPrimary) || productImages[0]
    const imageUrl = primaryImage?.url || primaryImage?.previewUrl || productForm.imageUrl || '/placeholder-product.jpg'
    
    const newProduct = {
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category || 'Uncategorized',
      description: productForm.description,
      price: productForm.price ? Number(productForm.price) : 0,
      sku: productForm.sku,
      inStock: productForm.inStock,
      specifications: {},
      imageUrl: imageUrl,
      remarks: productForm.remarks || undefined,
      // Store additional images for future use
      images: productImages.map(img => ({
        url: img.url || img.previewUrl,
        alt: img.alt,
        isPrimary: img.isPrimary,
        sort: img.sort
      }))
    }
    
    const newId = addProduct(newProduct)
    setShowAddProduct(false)
    resetForm()
    
    // Scroll to new row (simulate)
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 1200)
  }
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      sku: product.sku,
      inStock: product.inStock,
      tags: '',
      imageUrl: product.imageUrl || '',
      remarks: product.remarks || ''
    })
    
    // Load existing images if product has them
    const existingImages: ManagedImage[] = []
    if (product.imageUrl) {
      existingImages.push({
        id: 'existing-main',
        url: product.imageUrl,
        previewUrl: product.imageUrl,
        alt: product.name,
        isPrimary: true,
        status: 'uploaded',
        sort: 0,
        filename: 'Main product image'
      })
    }
    setProductImages(existingImages)
  }
  
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingProduct || !validateForm()) return
    
    // Determine primary image URL
    const primaryImage = productImages.find(img => img.isPrimary) || productImages[0]
    const imageUrl = primaryImage?.url || primaryImage?.previewUrl || productForm.imageUrl || editingProduct.imageUrl
    
    const updates = {
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category || 'Uncategorized',
      description: productForm.description,
      price: productForm.price ? Number(productForm.price) : 0,
      sku: productForm.sku,
      inStock: productForm.inStock,
      imageUrl: imageUrl,
      remarks: productForm.remarks || undefined,
      // Store additional images for future use
      images: productImages.map(img => ({
        url: img.url || img.previewUrl,
        alt: img.alt,
        isPrimary: img.isPrimary,
        sort: img.sort
      }))
    }
    
    updateProduct(editingProduct.id, updates)
    setEditingProduct(null)
    resetForm()
  }
  
  const handleDeleteProduct = (id: string) => {
    deleteProduct(id)
    setDeleteConfirm(null)
  }
  
  const handleViewProduct = (product: Product) => {
    const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    window.open(`/products/${slug}`, '_blank')
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBrand = !selectedBrand || product.brand === selectedBrand
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesVariantFilter = !showVariantsOnly || (product.variants && product.variants.length > 0)
    
    return matchesSearch && matchesBrand && matchesCategory && matchesVariantFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Brand: {selectedBrand || "All"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedBrand(null)}>
                  All Brands
                </DropdownMenuItem>
                {brands.map(brand => (
                  <DropdownMenuItem 
                    key={brand.id} 
                    onClick={() => setSelectedBrand(brand.name)}
                  >
                    {brand.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Category: {selectedCategory || "All"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                  All Categories
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem 
                    key={category.id} 
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant={showVariantsOnly ? "default" : "outline"}
              onClick={() => setShowVariantsOnly(!showVariantsOnly)}
            >
              <Boxes className="h-4 w-4 mr-2" />
              {showVariantsOnly ? "Show All" : "Variants Only"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            A list of all products in your catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={tableRef} className="rounded-md border">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description.slice(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.variants && product.variants.length > 0 ? (
                        <div className="text-sm">
                          NPR {Math.min(...product.variants.map(v => v.price)).toLocaleString()} - 
                          NPR {Math.max(...product.variants.map(v => v.price)).toLocaleString()}
                        </div>
                      ) : (
                        <div>NPR {product.price.toLocaleString()}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.variants && product.variants.length > 0 ? (
                        <div className="space-y-1">
                          {product.variants.slice(0, 2).map((variant) => {
                            const status = getVariantStockStatus(product.id, variant.id)
                            return (
                              <Badge 
                                key={variant.id}
                                variant="secondary"
                                className={`text-xs mr-1 ${
                                  status === 'in_stock' ? 'bg-green-100 text-green-700' :
                                  status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}
                              >
                                {variant.size}: {variant.stock}
                              </Badge>
                            )
                          })}
                          {product.variants.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.variants.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Badge variant={product.inStock ? "default" : "destructive"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.variants && product.variants.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Boxes className="h-3 w-3 mr-1" />
                            {product.variants.length} variants
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">No variants</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {product.variants && product.variants.length > 0 && (
                            <DropdownMenuItem onClick={() => setShowVariantsDrawer(product.id)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Manage Variants
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteConfirm(product.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Drawer */}
      <DrawerForm
        open={showAddProduct}
        onClose={() => {
          setShowAddProduct(false)
          resetForm()
        }}
        title="Add New Product"
        onSubmit={handleAddProduct}
        isLoading={isLoading}
        submitText="Create Product"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={productForm.name}
              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              aria-invalid={!!formErrors.name}
              aria-describedby={formErrors.name ? "name-error" : undefined}
            />
            {formErrors.name && (
              <p id="name-error" className="text-sm text-destructive">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Select value={productForm.brand} onValueChange={(value) => setProductForm(prev => ({ ...prev, brand: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.brand && (
              <p className="text-sm text-destructive">{formErrors.brand}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={productForm.category} onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={productForm.sku}
              onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Product SKU"
              aria-invalid={!!formErrors.sku}
            />
            {formErrors.sku && (
              <p className="text-sm text-destructive">{formErrors.sku}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (optional)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
              aria-invalid={!!formErrors.price}
            />
            {formErrors.price && (
              <p className="text-sm text-destructive">{formErrors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productForm.description}
              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Additional Notes / Packing Details</Label>
            <Textarea
              id="remarks"
              value={productForm.remarks}
              onChange={(e) => setProductForm(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="e.g., Special packaging requirements, handling instructions, etc."
              rows={2}
            />
          </div>

          {/* Image Management */}
          <ImageManager
            images={productImages}
            onChange={setProductImages}
            className="col-span-2"
          />

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Legacy Image URL (optional)</Label>
            <Input
              id="imageUrl"
              value={productForm.imageUrl}
              onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg (fallback if no images uploaded)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={productForm.inStock}
              onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, inStock: checked }))}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
        </div>
      </DrawerForm>

      {/* Edit Product Drawer */}
      <DrawerForm
        open={!!editingProduct}
        onClose={() => {
          setEditingProduct(null)
          resetForm()
        }}
        title="Edit Product"
        onSubmit={handleUpdateProduct}
        isLoading={isLoading}
        submitText="Update Product"
      >
        <div className="space-y-4">
          {/* Same form fields as Add Product */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Product Name *</Label>
            <Input
              id="edit-name"
              value={productForm.name}
              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              aria-invalid={!!formErrors.name}
            />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-brand">Brand *</Label>
            <Select value={productForm.brand} onValueChange={(value) => setProductForm(prev => ({ ...prev, brand: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.brand && (
              <p className="text-sm text-destructive">{formErrors.brand}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={productForm.category} onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-sku">SKU *</Label>
            <Input
              id="edit-sku"
              value={productForm.sku}
              onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Product SKU"
              aria-invalid={!!formErrors.sku}
            />
            {formErrors.sku && (
              <p className="text-sm text-destructive">{formErrors.sku}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Price (optional)</Label>
            <Input
              id="edit-price"
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
              aria-invalid={!!formErrors.price}
            />
            {formErrors.price && (
              <p className="text-sm text-destructive">{formErrors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={productForm.description}
              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-remarks">Additional Notes / Packing Details</Label>
            <Textarea
              id="edit-remarks"
              value={productForm.remarks}
              onChange={(e) => setProductForm(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="e.g., Special packaging requirements, handling instructions, etc."
              rows={2}
            />
          </div>

          {/* Image Management */}
          <ImageManager
            images={productImages}
            onChange={setProductImages}
            className="col-span-2"
          />

          <div className="space-y-2">
            <Label htmlFor="edit-imageUrl">Legacy Image URL (optional)</Label>
            <Input
              id="edit-imageUrl"
              value={productForm.imageUrl}
              onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg (fallback if no images uploaded)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-inStock"
              checked={productForm.inStock}
              onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, inStock: checked }))}
            />
            <Label htmlFor="edit-inStock">In Stock</Label>
          </div>
        </div>
      </DrawerForm>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDeleteProduct(deleteConfirm)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isLoading}
      />

      {/* Variants Management Drawer */}
      <VariantsManagementDrawer
        open={!!showVariantsDrawer}
        onClose={() => setShowVariantsDrawer(null)}
        productId={showVariantsDrawer}
      />
    </div>
  )
}