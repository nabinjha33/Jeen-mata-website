"use client"

import { ProductCard } from "./product-card"
import { EmptyState } from "../ui/empty-state"
import { Package } from "lucide-react"
import { useI18n } from "../../providers/i18n-provider"
import { useAppStore } from "../../store/app-store"

export function ProductGrid() {
  const { t } = useI18n()
  const { getFilteredProducts } = useAppStore()
  
  const products = getFilteredProducts()

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}