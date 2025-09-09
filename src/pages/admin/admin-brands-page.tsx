"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash, Eye, ExternalLink, Upload } from "lucide-react"
import { useAppStore } from "../../store/app-store"
import { useAdminStore } from "../../stores/admin-store"
import { DrawerForm } from "../../components/admin/drawer-form"
import { ConfirmDialog } from "../../components/admin/confirm-dialog"
import type { Brand } from "../../data/fixtures"

export function AdminBrandsPage() {
  const { brands, products } = useAppStore()
  const { addBrand, updateBrand, deleteBrand, isLoading } = useAdminStore()
  
  // UI state
  const [showAddBrand, setShowAddBrand] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Form state
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    logoUrl: '',
    countryOfOrigin: '',
    featured: false,
    color: '#000000'
  })
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Form handlers
  const resetForm = () => {
    setBrandForm({
      name: '',
      slug: '',
      description: '',
      website: '',
      logoUrl: '',
      countryOfOrigin: '',
      featured: false,
      color: '#000000'
    })
    setFormErrors({})
  }
  
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!brandForm.name.trim()) errors.name = 'Brand name is required'
    if (!brandForm.slug.trim()) {
      setBrandForm(prev => ({ ...prev, slug: generateSlug(prev.name) }))
    }
    if (brandForm.website && !brandForm.website.startsWith('http')) {
      errors.website = 'Website must start with http:// or https://'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const newBrand = {
      name: brandForm.name,
      slug: brandForm.slug || generateSlug(brandForm.name),
      description: brandForm.description,
      website: brandForm.website,
      logoUrl: brandForm.logoUrl || '/placeholder-brand.png',
      countryOfOrigin: brandForm.countryOfOrigin,
      featured: brandForm.featured,
      productCount: 0
    }
    
    const newId = addBrand(newBrand)
    setShowAddBrand(false)
    resetForm()
    
    // Scroll to new brand (simulate)
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 1200)
  }
  
  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand)
    setBrandForm({
      name: brand.name,
      slug: brand.slug || generateSlug(brand.name),
      description: brand.description,
      website: brand.website,
      logoUrl: brand.logoUrl || '',
      countryOfOrigin: brand.countryOfOrigin,
      featured: brand.featured || false,
      color: '#000000'
    })
  }
  
  const handleUpdateBrand = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingBrand || !validateForm()) return
    
    const updates = {
      name: brandForm.name,
      slug: brandForm.slug,
      description: brandForm.description,
      website: brandForm.website,
      logoUrl: brandForm.logoUrl,
      countryOfOrigin: brandForm.countryOfOrigin,
      featured: brandForm.featured
    }
    
    updateBrand(editingBrand.id, updates)
    setEditingBrand(null)
    resetForm()
  }
  
  const handleDeleteBrand = (id: string) => {
    const success = deleteBrand(id)
    if (success) {
      setDeleteConfirm(null)
    }
  }
  
  const getBrandProductCount = (brandName: string) => {
    return products.filter(product => product.brand === brandName).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">
            Manage brand partnerships and information
          </p>
        </div>
        <Button onClick={() => setShowAddBrand(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Brands Grid */}
      <div ref={gridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ minHeight: '480px' }}>
        {brands.map((brand) => (
          <Card key={brand.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={brand.logoUrl} 
                    alt={`${brand.name} logo`}
                    className="h-12 w-12 rounded-lg object-cover border"
                  />
                  <div>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {brand.countryOfOrigin}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditBrand(brand)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Brand
                    </DropdownMenuItem>
                    {brand.website && (
                      <DropdownMenuItem onClick={() => window.open(brand.website, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => setDeleteConfirm(brand.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {brand.description}
                </p>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Products:</span>
                  <span className="font-medium">{getBrandProductCount(brand.name)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Website:</span>
                  <a 
                    href={brand.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {brands.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No brands found</p>
            <Button onClick={() => setShowAddBrand(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Brand
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Brand Drawer */}
      <DrawerForm
        open={showAddBrand}
        onClose={() => {
          setShowAddBrand(false)
          resetForm()
        }}
        title="Add New Brand"
        onSubmit={handleAddBrand}
        isLoading={isLoading}
        submitText="Create Brand"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name *</Label>
            <Input
              id="brand-name"
              value={brandForm.name}
              onChange={(e) => {
                const name = e.target.value
                setBrandForm(prev => ({ 
                  ...prev, 
                  name,
                  slug: generateSlug(name)
                }))
              }}
              placeholder="Enter brand name"
              aria-invalid={!!formErrors.name}
            />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand-slug">Slug</Label>
            <Input
              id="brand-slug"
              value={brandForm.slug}
              onChange={(e) => setBrandForm(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="brand-slug"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from name, but you can edit it
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand-country">Country of Origin</Label>
            <Input
              id="brand-country"
              value={brandForm.countryOfOrigin}
              onChange={(e) => setBrandForm(prev => ({ ...prev, countryOfOrigin: e.target.value }))}
              placeholder="e.g., Germany, Japan, USA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand-website">Website</Label>
            <Input
              id="brand-website"
              type="url"
              value={brandForm.website}
              onChange={(e) => setBrandForm(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://example.com"
              aria-invalid={!!formErrors.website}
            />
            {formErrors.website && (
              <p className="text-sm text-destructive">{formErrors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand-description">Description</Label>
            <Textarea
              id="brand-description"
              value={brandForm.description}
              onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the brand"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand-logo">Logo URL</Label>
            <div className="flex gap-2">
              <Input
                id="brand-logo"
                value={brandForm.logoUrl}
                onChange={(e) => setBrandForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="https://example.com/logo.png"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon" aria-label="Upload logo">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="brand-featured"
              checked={brandForm.featured}
              onCheckedChange={(checked) => setBrandForm(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="brand-featured">Featured Brand</Label>
          </div>
        </div>
      </DrawerForm>

      {/* Edit Brand Drawer */}
      <DrawerForm
        open={!!editingBrand}
        onClose={() => {
          setEditingBrand(null)
          resetForm()
        }}
        title="Edit Brand"
        onSubmit={handleUpdateBrand}
        isLoading={isLoading}
        submitText="Update Brand"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-brand-name">Brand Name *</Label>
            <Input
              id="edit-brand-name"
              value={brandForm.name}
              onChange={(e) => {
                const name = e.target.value
                setBrandForm(prev => ({ 
                  ...prev, 
                  name,
                  slug: generateSlug(name)
                }))
              }}
              placeholder="Enter brand name"
              aria-invalid={!!formErrors.name}
            />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-brand-slug">Slug</Label>
            <Input
              id="edit-brand-slug"
              value={brandForm.slug}
              onChange={(e) => setBrandForm(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="brand-slug"
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-brand-description">Description</Label>
            <Textarea
              id="edit-brand-description"
              value={brandForm.description}
              onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the brand"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-brand-featured"
              checked={brandForm.featured}
              onCheckedChange={(checked) => setBrandForm(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="edit-brand-featured">Featured Brand</Label>
          </div>
        </div>
      </DrawerForm>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDeleteBrand(deleteConfirm)}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? If it has associated products, this action will be prevented."
        confirmText="Delete"
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  )
}