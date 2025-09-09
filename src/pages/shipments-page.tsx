import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Search, Truck, Clock, Package, CheckCircle, Ship, Plane, AlertCircle } from "lucide-react"
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

  // Filter consignments by search
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment =>
      shipment.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.origin?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [shipments, searchQuery])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked':
        return <Package className="h-4 w-4" />
      case 'in_transit':
        return <Ship className="h-4 w-4" />
      case 'customs':
        return <AlertCircle className="h-4 w-4" />
      case 'warehouse':
        return <Package className="h-4 w-4" />
      case 'available':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'customs':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'warehouse':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-muted/10 text-muted-foreground'
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'booked': return 20
      case 'in_transit': return 40
      case 'customs': return 60
      case 'warehouse': return 80
      case 'available': return 100
      default: return 0
    }
  }

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />
      
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-h1 font-semibold">Incoming Consignments</h1>
          <p className="text-muted-foreground">
            Track incoming inventory and product availability
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference number, carrier, or origin..."
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
              {filteredShipments.length} consignment{filteredShipments.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{shipment.referenceNumber}</h3>
                      <p className="text-sm text-muted-foreground">{shipment.trackingNumber}</p>
                    </div>
                    <Badge className={`border ${getStatusColor(shipment.status)} flex items-center gap-1`}>
                      {getStatusIcon(shipment.status)}
                      {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{getProgressPercentage(shipment.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${getProgressPercentage(shipment.status)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-small">
                      <span className="text-muted-foreground">Origin:</span>
                      <span className="text-right">{shipment.origin}</span>
                    </div>
                    <div className="flex justify-between text-small">
                      <span className="text-muted-foreground">ETA:</span>
                      <Badge variant="outline" className="text-xs">
                        {formatDate(shipment.estimatedDelivery)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-small">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{shipment.manifestItems?.length || 0} products</span>
                    </div>
                    {shipment.notes && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">{shipment.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" asChild className="w-full rounded-xl">
                    <Link to={`/shipments/${shipment.id}`}>
                      View Consignment Details
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