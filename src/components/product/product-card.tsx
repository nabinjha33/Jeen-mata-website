"use client"

import { ShoppingCart, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
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
  const { addToInquiryCart } = useAppStore()

  const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleAddToCart = () => {
    addToInquiryCart({
      productId: product.id,
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
          
          {!product.inStock && (
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
          <div className="space-y-2">
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
            
            <div className="flex items-center justify-between">
              <div>
                {showPrice && (
                  <span className="text-h4 font-semibold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <p className="text-caption text-muted-foreground">
                  SKU: {product.sku}
                </p>
              </div>
              
              <Badge 
                variant={product.inStock ? "default" : "destructive"}
                className="text-caption"
              >
                {product.inStock ? t('inStock') : t('outOfStock')}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
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