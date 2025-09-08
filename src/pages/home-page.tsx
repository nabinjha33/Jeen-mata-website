import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Search, Package, Truck, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { ProductCard } from "../components/product/product-card"
import { BrandCard } from "../components/brand/brand-card"
import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"
import { ImageWithFallback } from "../components/figma/ImageWithFallback"

export function HomePage() {
  const { t } = useI18n()
  const { products, brands, shipments, setSearchQuery } = useAppStore()
  const [heroSearchQuery, setHeroSearchQuery] = useState("")

  // Get featured products (first 6 in stock products)
  const featuredProducts = products.filter(p => p.inStock).slice(0, 6)
  
  // Get popular brands (first 4 brands)
  const popularBrands = brands.slice(0, 4)
  
  // Get incoming shipments (preparing or shipped status)
  const incomingShipments = shipments.filter(s => 
    s.status === 'preparing' || s.status === 'shipped'
  ).slice(0, 3)

  const handleHeroSearch = () => {
    if (heroSearchQuery.trim()) {
      setSearchQuery(heroSearchQuery)
      // Navigate to search page would happen here
      window.location.href = `/search?q=${encodeURIComponent(heroSearchQuery)}`
    }
  }

  return (
    <div className="space-y-16 p-6">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-6 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-display font-bold text-foreground">
              {t('welcomeTitle')}
            </h1>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              {t('welcomeSubtitle')}
            </p>
          </div>
          
          {/* Hero Search */}
          <div className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              <Button 
                onClick={handleHeroSearch}
                size="lg"
                className="rounded-xl px-6"
              >
                {t('search_text')}
              </Button>
            </div>
          </div>
          
          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="rounded-xl">
              <Link to="/brands">
                {t('exploreProducts')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-xl">
              <Link to="/shipments">
                {t('viewAllShipments')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 hover-lift">
          <CardContent className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-h2 font-bold text-primary">{products.length}</div>
              <p className="text-muted-foreground">{t('products_title')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center p-6 hover-lift">
          <CardContent className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="text-h2 font-bold text-accent">{brands.length}+</div>
              <p className="text-muted-foreground">{t('brands')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center p-6 hover-lift">
          <CardContent className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <Truck className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-h2 font-bold text-success">{incomingShipments.length}</div>
              <p className="text-muted-foreground">{t('incomingShipments')}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Products */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h2 font-semibold">{t('featuredProducts')}</h2>
            <p className="text-muted-foreground">{t('viewAllProducts')}</p>
          </div>
          <Button variant="outline" asChild className="rounded-xl">
            <Link to="/search">
              {t('viewAllProducts')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Brands */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h2 font-semibold">{t('popularBrands')}</h2>
            <p className="text-muted-foreground">{t('viewAllBrands')}</p>
          </div>
          <Button variant="outline" asChild className="rounded-xl">
            <Link to="/brands">
              {t('viewAllBrands')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      {/* Incoming Shipments Preview */}
      {incomingShipments.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h2 font-semibold">{t('incomingShipments')}</h2>
              <p className="text-muted-foreground">Track your orders</p>
            </div>
            <Button variant="outline" asChild className="rounded-xl">
              <Link to="/shipments">
                {t('viewAllShipments')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {incomingShipments.map((shipment) => (
              <Card key={shipment.id} className="hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{shipment.trackingNumber}</h3>
                    <div className={`px-2 py-1 rounded-full text-caption ${
                      shipment.status === 'preparing' ? 'bg-warning/10 text-warning' :
                      shipment.status === 'shipped' ? 'bg-info/10 text-info' :
                      'bg-success/10 text-success'
                    }`}>
                      {t(shipment.status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-small text-muted-foreground">
                      {t('carrier')}: {shipment.carrier}
                    </p>
                    <p className="text-small text-muted-foreground">
                      {t('estimatedDelivery')}: {shipment.estimatedDelivery.toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full rounded-xl">
                    <Link to={`/shipments/${shipment.id}`}>
                      {t('view')} {t('shipmentDetails')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}