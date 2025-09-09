"use client"

import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { DrawerForm } from "./drawer-form"
import { ProductSelect } from "./product-select"
import { VariantSelect } from "./variant-select"
import { useShipmentsStore } from "../../stores/shipments-store"
import { toast } from "sonner"

interface AddItemDrawerProps {
  shipmentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddItemDrawer({ shipmentId, open, onOpenChange }: AddItemDrawerProps) {
  const [formData, setFormData] = useState({
    productId: '',
    variantId: '',
    qty: 1
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { addItem, productsLite } = useShipmentsStore()

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setFormData({
        productId: '',
        variantId: '',
        qty: 1
      })
      setErrors({})
    }
  }, [open])

  // Reset variant when product changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, variantId: '' }))
  }, [formData.productId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.productId) {
      newErrors.productId = 'Please select a product'
    }

    if (formData.qty < 1) {
      newErrors.qty = 'Quantity must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!shipmentId || !validateForm()) return

    setLoading(true)
    try {
      addItem({
        shipmentId,
        productId: formData.productId,
        variantId: formData.variantId || undefined,
        qty: formData.qty
      })

      toast.success("Item added to consignment")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to add item")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      productId: '',
      variantId: '',
      qty: 1
    })
    setErrors({})
    onOpenChange(false)
  }

  const selectedProduct = productsLite.find(p => p.id === formData.productId)
  const hasVariants = selectedProduct?.variants && selectedProduct.variants.length > 0

  return (
    <DrawerForm
      open={open}
      onClose={handleCancel}
      title="Add Item to Consignment"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      submitText="Add Item"
      isLoading={loading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Product *</Label>
          <ProductSelect
            value={formData.productId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
            placeholder="Search and select a product..."
            className="w-full"
          />
          {errors.productId && <p className="text-sm text-red-500">{errors.productId}</p>}
        </div>

        {hasVariants && (
          <div className="space-y-2">
            <Label>Variant/Size</Label>
            <VariantSelect
              productId={formData.productId}
              value={formData.variantId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, variantId: value }))}
              placeholder="Select variant (optional)"
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="qty">Quantity *</Label>
          <Input
            id="qty"
            type="number"
            min="1"
            value={formData.qty}
            onChange={(e) => setFormData(prev => ({ ...prev, qty: parseInt(e.target.value) || 1 }))}
            disabled={loading}
            className={errors.qty ? "border-red-500" : ""}
          />
          {errors.qty && <p className="text-sm text-red-500">{errors.qty}</p>}
        </div>

        {selectedProduct && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{selectedProduct.name}</p>
            {formData.variantId && hasVariants && (
              <p className="text-sm text-muted-foreground">
                Size: {selectedProduct.variants?.find(v => v.id === formData.variantId)?.sizeLabel}
              </p>
            )}
            <p className="text-sm text-muted-foreground">Quantity: {formData.qty}</p>
          </div>
        )}
      </div>
    </DrawerForm>
  )
}