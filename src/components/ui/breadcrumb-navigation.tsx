import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { useI18n } from "../../providers/i18n-provider"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[]
}

export function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  const { t } = useI18n()
  const location = useLocation()
  
  // Auto-generate breadcrumbs from URL if not provided
  const generatedItems = React.useMemo(() => {
    if (items) return items
    
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('breadcrumb_home'), href: '/' }
    ]
    
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      // Map path segments to translated labels
      let label = segment
      if (segment === 'brands') label = t('breadcrumb_brands')
      else if (segment === 'products') label = t('breadcrumb_products')
      else if (segment === 'search') label = t('breadcrumb_search')
      else if (segment === 'shipments') label = t('breadcrumb_shipments')
      else if (segment === 'inquiry') label = t('breadcrumb_inquiry')
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      })
    })
    
    return breadcrumbs
  }, [location.pathname, items, t])
  
  if (generatedItems.length <= 1) return null
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {generatedItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {index === 0 && <Home className="h-4 w-4 mr-1" />}
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Import React for useMemo
import React from "react"