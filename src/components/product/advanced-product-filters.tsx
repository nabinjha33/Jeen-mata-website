import { Filter, X } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Slider } from "../ui/slider"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useI18n } from "../../providers/i18n-provider"
import { type Category } from "../../data/fixtures"

interface AdvancedProductFiltersProps {
  categories?: Category[]
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  stockFilter: 'all' | 'inStock' | 'outOfStock'
  onStockFilterChange: (filter: 'all' | 'inStock' | 'outOfStock') => void
  sortBy: 'name' | 'price' | 'newest'
  onSortChange: (sort: 'name' | 'price' | 'newest') => void
  maxPrice?: number
}

export function AdvancedProductFilters({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  stockFilter,
  onStockFilterChange,
  sortBy,
  onSortChange,
  maxPrice = 100000
}: AdvancedProductFiltersProps) {
  const { t, formatCurrency } = useI18n()

  const hasActiveFilters = selectedCategory || stockFilter !== 'all' || 
    priceRange[0] > 0 || priceRange[1] < maxPrice

  const clearAllFilters = () => {
    onCategoryChange(null)
    onStockFilterChange('all')
    onPriceRangeChange([0, maxPrice])
  }

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-body">{t('sortBy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="name">{t('sortByName')}</SelectItem>
              <SelectItem value="price">{t('sortByPrice')}</SelectItem>
              <SelectItem value="newest">{t('sortByNewest')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-body">
            <Filter className="h-4 w-4" />
            {t('filterBy')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <label className="text-small font-medium">{t('category')}</label>
              <Select
                value={selectedCategory || undefined}
                onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={`All ${t('categories')}`} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All {t('categories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="space-y-3">
            <label className="text-small font-medium">{t('priceRange')}</label>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                max={maxPrice}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex items-center justify-between text-small text-muted-foreground">
                <span>{formatCurrency(priceRange[0])}</span>
                <span>{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="space-y-3">
            <label className="text-small font-medium">{t('stockStatus')}</label>
            <RadioGroup value={stockFilter} onValueChange={onStockFilterChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="text-small">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inStock" id="inStock" />
                <Label htmlFor="inStock" className="text-small">{t('inStock')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outOfStock" id="outOfStock" />
                <Label htmlFor="outOfStock" className="text-small">{t('outOfStock')}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-small font-medium">Active Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-1 text-caption"
                >
                  {t('clear')} All
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="rounded-xl">
                    {selectedCategory}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => onCategoryChange(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {stockFilter !== 'all' && (
                  <Badge variant="secondary" className="rounded-xl">
                    {t(stockFilter)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => onStockFilterChange('all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <Badge variant="secondary" className="rounded-xl">
                    {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => onPriceRangeChange([0, maxPrice])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}