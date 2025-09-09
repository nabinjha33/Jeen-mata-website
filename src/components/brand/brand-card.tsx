import { Link } from "react-router-dom"
import { ExternalLink, Package } from "lucide-react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useI18n } from "../../providers/i18n-provider"
import { type Brand } from "../../data/fixtures"
import { ImageWithFallback } from "../figma/ImageWithFallback"

interface BrandCardProps {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  const { t } = useI18n()
  
  const brandSlug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <Card className="group overflow-hidden hover-lift transition-all duration-300 flex flex-col h-full">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex flex-col items-center text-center space-y-4 flex-1">
          <div className="relative w-40 h-24 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
            <ImageWithFallback
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-h4">
                {brand.name}
              </h3>
              
              <p className="text-small text-muted-foreground line-clamp-3 mt-2">
                {brand.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mt-auto">
              <Badge variant="outline" className="text-caption">
                {brand.countryOfOrigin}
              </Badge>
              <Badge variant="outline" className="text-caption bg-primary/10 text-primary border-primary/20 font-medium">
                <Package className="h-3 w-3 mr-1" />
                {brand.productCount} {t('products')}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2 mt-auto">
        <Button
          asChild
          className="flex-1 rounded-xl"
          size="sm"
        >
          <Link to={`/brands/${brandSlug}`}>
            {t('view')} {t('products')}
          </Link>
        </Button>
        
        {brand.website && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl"
          >
            <a 
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}