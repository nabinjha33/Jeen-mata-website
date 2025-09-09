import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { ShoppingCart, MessageCircle, Package, Eye, Star, Boxes, Ship } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { ProductCard } from "../components/product/product-card"

import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"
import { ImageWithFallback } from "../components/figma/ImageWithFallback"
import { toast } from "sonner"

export function ProductDetailPage() {
  const { productSlug } = useParams<{ productSlug: string }>()
  const { t, formatCurrency } = useI18n()
  const { products, shipments, addToInquiryCart, getVariantStockStatus } = useAppStore()
  const [quantity, setQuantity] = useState(1)
  const [inquiryNotes, setInquiryNotes] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [showPrice] = useState(true) // Could be controlled by global setting
  
  // Variant selection state
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [selectedPackingOptionId, setSelectedPackingOptionId] = useState<string | null>(null)

  // Find product by slug
  const product = useMemo(() => {
    return products.find(p => 
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === productSlug
    )
  }, [products, productSlug])
  
  // Initialize variant selection
  const hasVariants = product?.variants && product.variants.length > 0
  const currentVariant = selectedVariantId 
    ? product?.variants?.find(v => v.id === selectedVariantId)
    : null
  
  // Auto-select default variant when product loads
  useMemo(() => {
    if (product && hasVariants && !selectedVariantId) {
      const defaultVariant = product.defaultVariantId 
        ? product.variants?.find(v => v.id === product.defaultVariantId)
        : product.variants?.[0]
      
      if (defaultVariant) {
        setSelectedVariantId(defaultVariant.id)
        // Auto-select first packing option
        const defaultPacking = defaultVariant.packings?.find(p => p.unitsPerPack === 1) || 
                              defaultVariant.packings?.[0]
        if (defaultPacking) {
          setSelectedPackingOptionId(defaultPacking.id)
        }
      }
    }
  }, [product, hasVariants, selectedVariantId])
  
  // Get current pricing and data
  const currentPrice = currentVariant?.price || product?.price || 0
  const currentSku = currentVariant?.sku || product?.sku || ''
  
  // Get stock status
  const getStockStatus = () => {
    if (hasVariants && selectedVariantId && product) {
      return getVariantStockStatus(product.id, selectedVariantId)
    }
    return product?.inStock ? 'in_stock' : 'out_of_stock'
  }
  
  const stockStatus = getStockStatus()
  const isInStock = stockStatus !== 'out_of_stock'
  
  // Get current packings
  const currentPackings = currentVariant?.packings || []
  const selectedPacking = selectedPackingOptionId 
    ? currentPackings.find(p => p.id === selectedPackingOptionId)
    : null

  // Get related products (same category, different product)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [products, product])

  // Find upcoming consignments containing this product
  const upcomingConsignments = useMemo(() => {
    if (!product) return []
    
    return shipments.filter(shipment => {
      // Only show consignments that are not yet available (incoming stock)
      if (shipment.status === 'available') return false
      
      // Check if this product is in the manifest
      return shipment.manifestItems?.some(item => item.productId === product.id) || false
    }).sort((a, b) => 
      new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime()
    )
  }, [product, shipments])

  const nextConsignment = upcomingConsignments[0]

  const handleAddToInquiry = () => {
    if (!product) return
    
    addToInquiryCart({
      productId: product.id,
      variantId: selectedVariantId || undefined,
      packingOptionId: selectedPackingOptionId || undefined,
      quantity,
      notes: inquiryNotes || undefined
    })
    
    const variantInfo = currentVariant ? ` (${currentVariant.sizeLabel})` : ''
    toast.success(`${product.name}${variantInfo} added to inquiry cart`, { duration: 1500 })
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
                variant={isInStock ? (stockStatus === 'low_stock' ? 'destructive' : 'default') : 'destructive'}
                className={`flex-shrink-0 ${
                  stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' :
                  stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {stockStatus === 'in_stock' ? t('inStock') : 
                 stockStatus === 'low_stock' ? 'Low Stock' : 
                 t('outOfStock')}
              </Badge>
            </div>
            
            <p className="text-lead text-muted-foreground">
              {product.description}
            </p>
            
            <div className="flex items-center gap-4">
              {showPrice && (
                <div className="text-h2 font-bold text-primary">
                  {formatCurrency(currentPrice)}
                </div>
              )}
            </div>
            
            {/* Upcoming Consignment Alert */}
            {nextConsignment && !isInStock && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Ship className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900">
                        Next batch arriving {formatDate(nextConsignment.estimatedDelivery)}
                      </p>
                      <p className="text-xs text-blue-700">
                        Consignment {nextConsignment.referenceNumber} • 
                        {nextConsignment.manifestItems?.find(item => item.productId === product.id)?.quantity || 0} units incoming
                      </p>
                      <p className="text-xs text-blue-600">
                        Status: {nextConsignment.status.charAt(0).toUpperCase() + nextConsignment.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Variant & Packing Selectors */}
            {hasVariants && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Size Selector */}
                  <div className="space-y-2">
                    <label className="text-small font-medium">Size:</label>
                    <Select value={selectedVariantId || ''} onValueChange={setSelectedVariantId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants?.map((variant) => {
                          const variantStock = getVariantStockStatus(product.id, variant.id)
                          return (
                            <SelectItem key={variant.id} value={variant.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{variant.sizeLabel} - {formatCurrency(variant.price || (variant.priceCents ? variant.priceCents / 100 : 0))}</span>
                                <Badge 
                                  variant="secondary" 
                                  className={`ml-2 text-xs ${
                                    variantStock === 'in_stock' ? 'bg-green-100 text-green-700' :
                                    variantStock === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {variantStock === 'in_stock' ? 'In Stock' : 
                                   variantStock === 'low_stock' ? 'Low' : 
                                   'Out'}
                                </Badge>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Packing Selector */}
                  {currentPackings.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-small font-medium">Packing:</label>
                      <Select value={selectedPackingOptionId || ''} onValueChange={setSelectedPackingOptionId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select packing" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentPackings.map((packing) => (
                            <SelectItem key={packing.id} value={packing.id}>
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <span>{packing.label} ({packing.unitsPerPack} pcs)</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                {/* Selected Packing Info */}
                {selectedPacking && (
                  <div className="flex items-center gap-2 text-small text-muted-foreground p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Boxes className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">
                      {quantity} × {selectedPacking.label} = {quantity * selectedPacking.unitsPerPack} pieces total
                    </span>
                  </div>
                )}
              </div>
            )}
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
                  disabled={!isInStock}
                  className="w-full rounded-xl"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('addToInquiry')}
                  {currentVariant && ` (${currentVariant.size})`}
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

      {/* Variants & Specifications */}
      <Tabs defaultValue="specifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          {hasVariants && <TabsTrigger value="variants">Variants & Packing</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="specifications">
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
        </TabsContent>
        
        {hasVariants && (
          <TabsContent value="variants">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-h3 font-semibold mb-6">Available Variants</h2>
                
                <div className="space-y-6">
                  {/* Variants Table */}
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Size</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants?.map((variant) => {
                          const variantStock = getVariantStockStatus(product.id, variant.id)
                          return (
                            <TableRow 
                              key={variant.id}
                              className={selectedVariantId === variant.id ? 'bg-muted/50' : ''}
                            >
                              <TableCell className="font-medium">{variant.size}</TableCell>
                              <TableCell className="text-muted-foreground">{variant.sku}</TableCell>
                              <TableCell className="font-semibold">{formatCurrency(variant.price)}</TableCell>
                              <TableCell>{variant.stock} units</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary"
                                  className={
                                    variantStock === 'in_stock' ? 'bg-green-100 text-green-800' :
                                    variantStock === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }
                                >
                                  {variantStock === 'in_stock' ? 'In Stock' : 
                                   variantStock === 'low_stock' ? 'Low Stock' : 
                                   'Out of Stock'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Packing Options for Selected Variant */}
                  {currentVariant && currentPackingOptions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-h4 font-semibold">Packing Options - {currentVariant.size}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentPackingOptions.map((packing) => (
                          <Card 
                            key={packing.id} 
                            className={`cursor-pointer transition-all ${
                              selectedPackingOptionId === packing.id 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedPackingOptionId(packing.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Package className="h-8 w-8 text-primary" />
                                <div>
                                  <div className="font-medium">{packing.label}</div>
                                  <div className="text-small text-muted-foreground">
                                    {packing.unitsPerPack} units per {packing.type}
                                  </div>
                                  <div className="text-caption text-muted-foreground">
                                    Type: {packing.type}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

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