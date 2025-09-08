import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { ExternalLink, Filter, Package, MapPin } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { ProductCard } from "../components/product/product-card"
import { AdvancedProductFilters } from "../components/product/advanced-product-filters"
import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"
import { ImageWithFallback } from "../components/figma/ImageWithFallback"

export function BrandDetailPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>()
  const { t } = useI18n()
  const { brands, products, categories } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name')

  // Find brand by slug
  const brand = useMemo(() => {
    return brands.find(b => 
      b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === brandSlug
    )
  }, [brands, brandSlug])

  // Get products for this brand
  const brandProducts = useMemo(() => {
    if (!brand) return []
    return products.filter(p => p.brand === brand.name)
  }, [products, brand])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = brandProducts.filter(product => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = 
        stockFilter === 'all' || 
        (stockFilter === 'inStock' && product.inStock) ||
        (stockFilter === 'outOfStock' && !product.inStock)
      
      return matchesCategory && matchesPrice && matchesStock
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          return a.price - b.price
        case 'newest':
          return a.id.localeCompare(b.id) // Simple newest simulation
        default:
          return 0
      }
    })

    return filtered
  }, [brandProducts, selectedCategory, priceRange, stockFilter, sortBy])

  // Get categories available for this brand
  const brandCategories = useMemo(() => {
    const categoryNames = [...new Set(brandProducts.map(p => p.category))]
    return categories.filter(cat => categoryNames.includes(cat.name))
  }, [brandProducts, categories])

  if (!brand) {
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

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />

      {/* Brand Header */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <ImageWithFallback
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-h1 font-semibold">{brand.name}</h1>
                  <p className="text-lead text-muted-foreground">
                    {brand.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-small">{brand.countryOfOrigin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-small">{brand.productCount} {t('products')}</span>
                  </div>
                </div>
                
                {brand.website && (
                  <Button variant="outline" asChild>
                    <a 
                      href={brand.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="rounded-xl"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('website')}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 font-semibold">
            {t('productsFromBrand')} {brand.name}
          </h2>
          <Badge variant="secondary">
            {filteredProducts.length} {t('products')}
          </Badge>
        </div>

        {brandProducts.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <AdvancedProductFilters
                categories={brandCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                stockFilter={stockFilter}
                onStockFilterChange={setStockFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Filter}
                  title={t('noResults')}
                  description={t('noResultsDescription')}
                  action={
                    <Button 
                      onClick={() => {
                        setSelectedCategory(null)
                        setPriceRange([0, 100000])
                        setStockFilter('all')
                      }} 
                      variant="outline"
                    >
                      {t('clear')} {t('filter')}
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No products found"
            description={`No products available for ${brand.name} at the moment.`}
          />
        )}
      </div>
    </div>
  )
}