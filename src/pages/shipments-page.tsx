import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Search, Truck, Clock, Package, CheckCircle } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"

export function ShipmentsPage() {
  const { t, formatDate } = useI18n()
  const { shipments } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter shipments by search
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment =>
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [shipments, searchQuery])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Package className="h-4 w-4" />
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-warning/10 text-warning'
      case 'shipped':
      case 'in_transit':
        return 'bg-info/10 text-info'
      case 'delivered':
        return 'bg-success/10 text-success'
      default:
        return 'bg-muted/10 text-muted-foreground'
    }
  }

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />
      
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-h1 font-semibold">{t('shipments')}</h1>
          <p className="text-muted-foreground">
            Track your orders and shipments
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number or carrier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments List */}
      {filteredShipments.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-small text-muted-foreground">
              {filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{shipment.trackingNumber}</h3>
                    <div className={`px-2 py-1 rounded-full text-caption flex items-center gap-1 ${getStatusColor(shipment.status)}`}>
                      {getStatusIcon(shipment.status)}
                      {t(shipment.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-small">
                      <span className="text-muted-foreground">{t('carrier')}:</span>
                      <span>{shipment.carrier}</span>
                    </div>
                    <div className="flex justify-between text-small">
                      <span className="text-muted-foreground">{t('estimatedDelivery')}:</span>
                      <span>{formatDate(shipment.estimatedDelivery)}</span>
                    </div>
                    {shipment.actualDelivery && (
                      <div className="flex justify-between text-small">
                        <span className="text-muted-foreground">Delivered:</span>
                        <span className="text-success">{formatDate(shipment.actualDelivery)}</span>
                      </div>
                    )}
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
        </div>
      ) : (
        <EmptyState
          icon={Truck}
          title="No shipments found"
          description={searchQuery ? "No shipments match your search" : "No shipments available at the moment"}
          action={
            searchQuery ? (
              <Button onClick={() => setSearchQuery('')} variant="outline">
                {t('clear')} Search
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  )
}