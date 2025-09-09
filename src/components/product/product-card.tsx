"use client"

import { useState } from "react"
import { ShoppingCart, Eye, Package } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useI18n } from "../../providers/i18n-provider"
import { useAppStore } from "../../store/app-store"
import { type Product } from "../../data/fixtures"
import { ImageWithFallback } from "../figma/ImageWithFallback"
import { toast } from "sonner@2.0.3"

interface ProductCardProps {
  product: Product
  showPrice?: boolean
}

export function ProductCard({ product, showPrice = true }: ProductCardProps) {
  const { t, formatCurrency } = useI18n()
  const { addToInquiryCart, getVariantStockStatus } = useAppStore()

  const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  
  // State for variant selection
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.defaultVariantId || product.variants?.[0]?.id || null
  )
  
  // Get current variant or use product data for non-variant products
  const currentVariant = selectedVariantId 
    ? product.variants?.find(v => v.id === selectedVariantId)
    : null
  
  const currentPrice = currentVariant?.price || product.price
  const hasVariants = product.variants && product.variants.length > 0

  // Get stock status
  const getStockStatus = () => {
    if (hasVariants && selectedVariantId) {
      return getVariantStockStatus(product.id, selectedVariantId)
    }
    return product.inStock ? 'in_stock' : 'out_of_stock'
  }

  const stockStatus = getStockStatus()
  const isInStock = stockStatus !== 'out_of_stock'
  
  // Get main packing option for display
  const getMainPackingOption = () => {
    if (hasVariants && currentVariant) {
      const mainPacking = currentVariant.packingOptions.find(po => po.type === 'piece') || 
                         currentVariant.packingOptions[0]
      return mainPacking
    }
    return null
  }

  const mainPackingOption = getMainPackingOption()

  const handleAddToCart = () => {
    const defaultPackingOption = hasVariants && currentVariant 
      ? currentVariant.packingOptions.find(po => po.type === 'piece') || currentVariant.packingOptions[0]
      : null

    addToInquiryCart({
      productId: product.id,
      variantId: selectedVariantId || undefined,
      packingOptionId: defaultPackingOption?.id || undefined,
      quantity: 1,
    })
    toast.success(t('addToCart'))
  }

  return (
    <Card className="group overflow-hidden hover-lift transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="rounded-xl">
                {t('outOfStock')}
              </Badge>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-8 w-8 bg-background/80 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Link to={`/products/${productSlug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-body leading-tight line-clamp-2">
                {product.name}
              </h3>
              <Badge variant="outline" className="text-caption flex-shrink-0">
                {product.brand}
              </Badge>
            </div>
            
            <p className="text-small text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            
            {/* Variant Selector */}
            {hasVariants && (
              <div className="space-y-2">
                <label className="text-caption text-muted-foreground">Size:</label>
                <Select value={selectedVariantId || ''} onValueChange={setSelectedVariantId}>
                  <SelectTrigger className="h-8 text-small">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants?.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.size} - {formatCurrency(variant.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                {showPrice && (
                  <span className="text-h4 font-semibold text-primary">
                    {formatCurrency(currentPrice)}
                  </span>
                )}
                <p className="text-caption text-muted-foreground">
                  SKU: {currentVariant?.sku || product.sku}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <Badge 
                  variant={isInStock ? (stockStatus === 'low_stock' ? 'destructive' : 'default') : 'destructive'}
                  className={`text-caption ${
                    stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' :
                    stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {stockStatus === 'in_stock' ? t('inStock') : 
                   stockStatus === 'low_stock' ? 'Low Stock' : 
                   t('outOfStock')}
                </Badge>
                
                {/* Packing Indicator */}
                {mainPackingOption && (
                  <div className="flex items-center gap-1 text-caption text-muted-foreground">
                    <Package className="h-3 w-3" />
                    <span>{mainPackingOption.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className="w-full rounded-xl"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t('addToInquiry')}
        </Button>
      </CardFooter>
    </Card>
  )
}