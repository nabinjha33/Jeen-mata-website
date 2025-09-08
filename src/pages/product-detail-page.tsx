import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { ShoppingCart, MessageCircle, Package, Eye, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { ProductCard } from "../components/product/product-card"

import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"
import { ImageWithFallback } from "../components/figma/ImageWithFallback"
import { toast } from "sonner@2.0.3"

export function ProductDetailPage() {
  const { productSlug } = useParams<{ productSlug: string }>()
  const { t, formatCurrency } = useI18n()
  const { products, addToInquiryCart } = useAppStore()
  const [quantity, setQuantity] = useState(1)
  const [inquiryNotes, setInquiryNotes] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [showPrice] = useState(true) // Could be controlled by global setting

  // Find product by slug
  const product = useMemo(() => {
    return products.find(p => 
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === productSlug
    )
  }, [products, productSlug])

  // Get related products (same category, different product)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [products, product])

  const handleAddToInquiry = () => {
    if (!product) return
    
    addToInquiryCart({
      productId: product.id,
      quantity,
      notes: inquiryNotes || undefined
    })
    
    toast.success(`${product.name} added to inquiry cart`)
    setQuantity(1)
    setInquiryNotes("")
  }

  const handleAskQuestion = () => {
    if (!questionText.trim()) return
    
    // In a real app, this would send the question
    toast.success("Question submitted! We'll get back to you soon.")
    setQuestionText("")
  }

  if (!product) {
    return (
      <div className="p-6">
        <BreadcrumbNavigation />
        <EmptyState
          title={t('pageNotFound')}
          description={t('pageNotFoundDescription')}
          action={
            <Button onClick={() => window.history.back()}>
              {t('goHome')}
            </Button>
          }
        />
      </div>
    )
  }

  // In a real app, you'd have multiple product images

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />

      {/* Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
            <ImageWithFallback
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Thumbnail images would go here in a real app */}
          <div className="flex gap-2">
            <div className="w-16 h-16 rounded-lg bg-muted/50 border-2 border-primary overflow-hidden">
              <ImageWithFallback
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="outline">{product.brand}</Badge>
                <h1 className="text-h1 font-semibold">{product.name}</h1>
              </div>
              <Badge 
                variant={product.inStock ? "default" : "destructive"}
                className="flex-shrink-0"
              >
                {product.inStock ? t('inStock') : t('outOfStock')}
              </Badge>
            </div>
            
            <p className="text-lead text-muted-foreground">
              {product.description}
            </p>
            
            <div className="flex items-center gap-4">
              {showPrice && (
                <div className="text-h2 font-bold text-primary">
                  {formatCurrency(product.price)}
                </div>
              )}
              <div className="text-small text-muted-foreground">
                SKU: {product.sku}
              </div>
            </div>
          </div>

          {/* Add to Inquiry */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">{t('addToInquiry')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-small font-medium min-w-fit">
                    {t('quantity')}:
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-24"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-small font-medium">
                    {t('notes')} (optional):
                  </label>
                  <Textarea
                    placeholder="Any specific requirements or questions..."
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button
                  onClick={handleAddToInquiry}
                  disabled={!product.inStock}
                  className="w-full rounded-xl"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('addToInquiry')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ask Question */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">{t('askQuestion')}</h3>
              
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask any questions about this product..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                />
                
                <Button
                  onClick={handleAskQuestion}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('askQuestion')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Specifications */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-h3 font-semibold mb-6">{t('specifications')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value], index) => (
              <div key={key} className="flex justify-between py-3 border-b border-border last:border-b-0">
                <span className="font-medium text-small">{key}</span>
                <span className="text-small text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-h2 font-semibold">{t('relatedProducts')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard 
                key={relatedProduct.id} 
                product={relatedProduct}
                showPrice={showPrice}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}