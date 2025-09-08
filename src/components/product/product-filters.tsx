"use client"

import { Filter, X } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useI18n } from "../../providers/i18n-provider"
import { useAppStore } from "../../store/app-store"

export function ProductFilters() {
  const { t } = useI18n()
  const { 
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    setSelectedCategory,
    setSelectedBrand,
    searchQuery,
    setSearchQuery
  } = useAppStore()

  const hasActiveFilters = selectedCategory || selectedBrand || searchQuery

  const clearAllFilters = () => {
    setSelectedCategory(null)
    setSelectedBrand(null)
    setSearchQuery('')
  }

  const clearCategoryFilter = () => setSelectedCategory(null)
  const clearBrandFilter = () => setSelectedBrand(null)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-body">
          <Filter className="h-4 w-4" />
          {t('filter')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-small font-medium">{t('category')}</label>
          <Select
            value={selectedCategory || undefined}
            onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder={`Select ${t('category').toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div className="space-y-2">
          <label className="text-small font-medium">{t('brand')}</label>
          <Select
            value={selectedBrand || undefined}
            onValueChange={(value) => setSelectedBrand(value === 'all' ? null : value)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder={`Select ${t('brand').toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.name}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2 pt-2 border-t">
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
              {searchQuery && (
                <Badge variant="secondary" className="rounded-xl">
                  Search: "{searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {selectedCategory && (
                <Badge variant="secondary" className="rounded-xl">
                  {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={clearCategoryFilter}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {selectedBrand && (
                <Badge variant="secondary" className="rounded-xl">
                  {selectedBrand}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={clearBrandFilter}
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
  )
}