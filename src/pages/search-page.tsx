import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, Filter } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { ProductCard } from "../components/product/product-card"
import { AdvancedProductFilters } from "../components/product/advanced-product-filters"
import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"
import { useDebounce } from "../hooks/use-debounce"

export function SearchPage() {
  const { t } = useI18n()
  const { products, categories } = useAppStore()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get initial search query from URL
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '100000')
  ])
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>(
    (searchParams.get('stock') as any) || 'all'
  )
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>(
    (searchParams.get('sort') as any) || 'name'
  )

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < 100000) params.set('maxPrice', priceRange[1].toString())
    if (stockFilter !== 'all') params.set('stock', stockFilter)
    if (sortBy !== 'name') params.set('sort', sortBy)
    
    setSearchParams(params)
  }, [debouncedSearchQuery, selectedCategory, priceRange, stockFilter, sortBy, setSearchParams])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !debouncedSearchQuery || 
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = 
        stockFilter === 'all' || 
        (stockFilter === 'inStock' && product.inStock) ||
        (stockFilter === 'outOfStock' && !product.inStock)
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock
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
  }, [products, debouncedSearchQuery, selectedCategory, priceRange, stockFilter, sortBy])

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />
      
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-h1 font-semibold">
            {debouncedSearchQuery ? `${t('searchResults')} "${debouncedSearchQuery}"` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <AdvancedProductFilters
            categories={categories}
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
                    setSearchQuery('')
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
    </div>
  )
}