"use client"

import { useState, useMemo } from "react"
import { Plus, Edit2, Trash2, Package, Save, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { DrawerForm } from "./drawer-form"
import { ConfirmDialog } from "./confirm-dialog"
import { useAppStore } from "../../store/app-store"
import { type ProductVariant, type VariantPacking } from "../../data/fixtures"

interface VariantsManagementDrawerProps {
  open: boolean
  onClose: () => void
  productId: string | null
}

interface VariantFormData {
  sizeLabel: string
  priceCents: string
  stockState: 'IN' | 'LOW' | 'OUT'
  sku: string
}

interface PackingFormData {
  label: string
  unitsPerPack: string
}

export function VariantsManagementDrawer({ open, onClose, productId }: VariantsManagementDrawerProps) {
  const { products } = useAppStore()
  
  // Get the product being managed
  const product = useMemo(() => {
    return products.find(p => p.id === productId)
  }, [products, productId])

  // Variant management state
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || [])
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [deleteConfirmVariant, setDeleteConfirmVariant] = useState<string | null>(null)
  
  // Packing management state
  const [editingPacking, setEditingPacking] = useState<{ variantId: string; packing: VariantPacking | null }>({ variantId: '', packing: null })
  const [deleteConfirmPacking, setDeleteConfirmPacking] = useState<{ variantId: string; packingId: string } | null>(null)
  
  // Form state
  const [variantForm, setVariantForm] = useState<VariantFormData>({
    sizeLabel: '',
    priceCents: '',
    stockState: 'IN',
    sku: ''
  })
  
  const [packingForm, setPackingForm] = useState<PackingFormData>({
    label: '',
    unitsPerPack: ''
  })

  const resetVariantForm = () => {
    setVariantForm({
      sizeLabel: '',
      priceCents: '',
      stockState: 'IN',
      sku: ''
    })
  }

  const resetPackingForm = () => {
    setPackingForm({
      label: '',
      unitsPerPack: ''
    })
  }

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!variantForm.sizeLabel.trim()) return

    const newVariant: ProductVariant = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sizeLabel: variantForm.sizeLabel,
      priceCents: variantForm.priceCents ? Number(variantForm.priceCents) * 100 : undefined,
      stockState: variantForm.stockState,
      packings: [],
      sku: variantForm.sku || undefined
    }

    setVariants(prev => [...prev, newVariant])
    setShowAddVariant(false)
    resetVariantForm()
  }

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setVariantForm({
      sizeLabel: variant.sizeLabel,
      priceCents: variant.priceCents ? (variant.priceCents / 100).toString() : '',
      stockState: variant.stockState,
      sku: variant.sku || ''
    })
  }

  const handleUpdateVariant = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingVariant || !variantForm.sizeLabel.trim()) return

    const updatedVariant: ProductVariant = {
      ...editingVariant,
      sizeLabel: variantForm.sizeLabel,
      priceCents: variantForm.priceCents ? Number(variantForm.priceCents) * 100 : undefined,
      stockState: variantForm.stockState,
      sku: variantForm.sku || undefined
    }

    setVariants(prev => prev.map(v => v.id === editingVariant.id ? updatedVariant : v))
    setEditingVariant(null)
    resetVariantForm()
  }

  const handleDeleteVariant = (variantId: string) => {
    setVariants(prev => prev.filter(v => v.id !== variantId))
    setDeleteConfirmVariant(null)
  }

  const handleAddPacking = (variantId: string) => {
    setEditingPacking({ variantId, packing: null })
    resetPackingForm()
  }

  const handleEditPacking = (variantId: string, packing: VariantPacking) => {
    setEditingPacking({ variantId, packing })
    setPackingForm({
      label: packing.label,
      unitsPerPack: packing.unitsPerPack.toString()
    })
  }

  const handleSavePacking = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!packingForm.label.trim() || !packingForm.unitsPerPack) return

    const packingData: VariantPacking = {
      id: editingPacking.packing?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: packingForm.label,
      unitsPerPack: Number(packingForm.unitsPerPack)
    }

    setVariants(prev => prev.map(variant => {
      if (variant.id === editingPacking.variantId) {
        const updatedPackings = editingPacking.packing
          ? variant.packings?.map(p => p.id === editingPacking.packing!.id ? packingData : p) || []
          : [...(variant.packings || []), packingData]
        
        return { ...variant, packings: updatedPackings }
      }
      return variant
    }))

    setEditingPacking({ variantId: '', packing: null })
    resetPackingForm()
  }

  const handleDeletePacking = () => {
    if (!deleteConfirmPacking) return

    setVariants(prev => prev.map(variant => {
      if (variant.id === deleteConfirmPacking.variantId) {
        return {
          ...variant,
          packings: variant.packings?.filter(p => p.id !== deleteConfirmPacking.packingId) || []
        }
      }
      return variant
    }))

    setDeleteConfirmPacking(null)
  }

  const getStockBadgeColor = (stockState: 'IN' | 'LOW' | 'OUT') => {
    switch (stockState) {
      case 'IN': return 'bg-green-100 text-green-700 border-green-200'
      case 'LOW': return 'bg-yellow-100 text-yellow-700 border-yellow-200' 
      case 'OUT': return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  if (!open || !product) return null

  return (
    <>
      <DrawerForm
        open={open}
        onClose={onClose}
        title={`Manage Variants - ${product.name}`}
        onSubmit={(e) => { e.preventDefault(); onClose() }}
        submitText="Done"
      >
        <div className="space-y-6">
          {/* Add Variant Button */}
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Product Variants</h3>
            <Button
              type="button"
              onClick={() => setShowAddVariant(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Variant
            </Button>
          </div>

          {/* Variants List */}
          {variants.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No variants added yet</p>
                <p className="text-sm">Add variants to manage different sizes, colors, or options</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {variants.map((variant) => (
                <Card key={variant.id} className="border-l-4 border-l-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-base">{variant.sizeLabel}</CardTitle>
                        <Badge className={getStockBadgeColor(variant.stockState)}>
                          {variant.stockState === 'IN' ? 'In Stock' : variant.stockState === 'LOW' ? 'Low Stock' : 'Out of Stock'}
                        </Badge>
                        {variant.priceCents && (
                          <span className="text-sm text-muted-foreground">
                            ${(variant.priceCents / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditVariant(variant)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmVariant(variant.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Packing Options */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Packing Options</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddPacking(variant.id)}
                          className="h-7 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Packing
                        </Button>
                      </div>
                      
                      {variant.packings && variant.packings.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {variant.packings.map((packing) => (
                            <div
                              key={packing.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded border"
                            >
                              <div className="flex items-center gap-2">
                                <Package className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{packing.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({packing.unitsPerPack} pcs)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditPacking(variant.id, packing)}
                                  className="h-6 w-6"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteConfirmPacking({ variantId: variant.id, packingId: packing.id })}
                                  className="h-6 w-6 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          No packing options added
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DrawerForm>

      {/* Add Variant Drawer */}
      <DrawerForm
        open={showAddVariant}
        onClose={() => {
          setShowAddVariant(false)
          resetVariantForm()
        }}
        title="Add New Variant"
        onSubmit={handleAddVariant}
        submitText="Add Variant"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="size-label">Size/Label *</Label>
            <Input
              id="size-label"
              value={variantForm.sizeLabel}
              onChange={(e) => setVariantForm(prev => ({ ...prev, sizeLabel: e.target.value }))}
              placeholder="e.g. 10mm, Large, Red"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={variantForm.priceCents}
              onChange={(e) => setVariantForm(prev => ({ ...prev, priceCents: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock-state">Stock Status</Label>
            <Select 
              value={variantForm.stockState} 
              onValueChange={(value: 'IN' | 'LOW' | 'OUT') => setVariantForm(prev => ({ ...prev, stockState: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">In Stock</SelectItem>
                <SelectItem value="LOW">Low Stock</SelectItem>
                <SelectItem value="OUT">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={variantForm.sku}
              onChange={(e) => setVariantForm(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Variant SKU (optional)"
            />
          </div>
        </div>
      </DrawerForm>

      {/* Edit Variant Drawer */}
      <DrawerForm
        open={!!editingVariant}
        onClose={() => {
          setEditingVariant(null)
          resetVariantForm()
        }}
        title="Edit Variant"
        onSubmit={handleUpdateVariant}
        submitText="Update Variant"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-size-label">Size/Label *</Label>
            <Input
              id="edit-size-label"
              value={variantForm.sizeLabel}
              onChange={(e) => setVariantForm(prev => ({ ...prev, sizeLabel: e.target.value }))}
              placeholder="e.g. 10mm, Large, Red"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Price ($)</Label>
            <Input
              id="edit-price"
              type="number"
              min="0"
              step="0.01"
              value={variantForm.priceCents}
              onChange={(e) => setVariantForm(prev => ({ ...prev, priceCents: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-stock-state">Stock Status</Label>
            <Select 
              value={variantForm.stockState} 
              onValueChange={(value: 'IN' | 'LOW' | 'OUT') => setVariantForm(prev => ({ ...prev, stockState: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">In Stock</SelectItem>
                <SelectItem value="LOW">Low Stock</SelectItem>
                <SelectItem value="OUT">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-sku">SKU</Label>
            <Input
              id="edit-sku"
              value={variantForm.sku}
              onChange={(e) => setVariantForm(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Variant SKU (optional)"
            />
          </div>
        </div>
      </DrawerForm>

      {/* Add/Edit Packing Drawer */}
      <DrawerForm
        open={!!editingPacking.variantId}
        onClose={() => {
          setEditingPacking({ variantId: '', packing: null })
          resetPackingForm()
        }}
        title={editingPacking.packing ? "Edit Packing Option" : "Add Packing Option"}
        onSubmit={handleSavePacking}
        submitText={editingPacking.packing ? "Update" : "Add"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="packing-label">Label *</Label>
            <Input
              id="packing-label"
              value={packingForm.label}
              onChange={(e) => setPackingForm(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g. Piece, Box (10), Carton (12×Box)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="units-per-pack">Units per Pack *</Label>
            <Input
              id="units-per-pack"
              type="number"
              min="1"
              value={packingForm.unitsPerPack}
              onChange={(e) => setPackingForm(prev => ({ ...prev, unitsPerPack: e.target.value }))}
              placeholder="1"
            />
          </div>
        </div>
      </DrawerForm>

      {/* Delete Variant Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirmVariant}
        onClose={() => setDeleteConfirmVariant(null)}
        onConfirm={() => deleteConfirmVariant && handleDeleteVariant(deleteConfirmVariant)}
        title="Delete Variant"
        description="Are you sure you want to delete this variant? All its packing options will also be removed."
        confirmText="Delete"
        variant="destructive"
      />

      {/* Delete Packing Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirmPacking}
        onClose={() => setDeleteConfirmPacking(null)}
        onConfirm={handleDeletePacking}
        title="Delete Packing Option"
        description="Are you sure you want to delete this packing option?"
        confirmText="Delete"
        variant="destructive"
      />
    </>
  )
}