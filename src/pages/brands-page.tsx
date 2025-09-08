import { useState, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { BrandCard } from "../components/brand/brand-card"
import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"

export function BrandsPage() {
  const { t } = useI18n()
  const { brands } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<'name' | 'products'>('name')

  // Filter and sort brands
  const filteredBrands = useMemo(() => {
    let filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.countryOfOrigin.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort brands
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'products':
          return b.productCount - a.productCount
        default:
          return 0
      }
    })

    return filtered
  }, [brands, searchQuery, sortBy])

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />
      
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-h1 font-semibold">{t('allBrands')}</h1>
          <p className="text-muted-foreground">
            Discover products from {brands.length} trusted brands
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'products')}
                  className="px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="name">{t('sortByName')}</option>
                  <option value="products">By Products Count</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {filteredBrands.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-small text-muted-foreground">
              Showing {filteredBrands.length} of {brands.length} brands
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Filter}
          title={t('noResults')}
          description={t('noResultsDescription')}
          action={
            <Button onClick={() => setSearchQuery('')} variant="outline">
              {t('clear')} {t('filter')}
            </Button>
          }
        />
      )}
    </div>
  )
}