import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { Truck, Package, Clock, CheckCircle, MapPin, Calendar, Ship, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { Button } from "../components/ui/button"
import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"

// Mock shipment timeline data
const mockShipmentTimeline = [
  {
    status: 'booked',
    title: 'Order Booked',
    description: 'Your order has been confirmed and is being prepared',
    date: new Date('2024-01-10'),
    completed: true
  },
  {
    status: 'preparing',
    title: 'Preparing for Shipment',
    description: 'Items are being packed and prepared for shipping',
    date: new Date('2024-01-11'),
    completed: true
  },
  {
    status: 'shipped',
    title: 'Shipped',
    description: 'Package has been dispatched from warehouse',
    date: new Date('2024-01-12'),
    completed: true
  },
  {
    status: 'in_transit',
    title: 'In Transit',
    description: 'Package is on its way to destination',
    date: new Date('2024-01-13'),
    completed: false,
    current: true
  },
  {
    status: 'customs',
    title: 'Customs Clearance',
    description: 'Package is being processed at customs',
    date: new Date('2024-01-14'),
    completed: false
  },
  {
    status: 'warehouse',
    title: 'Local Warehouse',
    description: 'Package has arrived at local distribution center',
    date: new Date('2024-01-15'),
    completed: false
  },
  {
    status: 'available',
    title: 'Available for Pickup',
    description: 'Package is ready for delivery or pickup',
    date: new Date('2024-01-16'),
    completed: false
  }
]

// Mock manifest data
const mockManifest = [
  { id: '1', name: 'Bosch GSB 550 Impact Drill', quantity: 2, weight: '3.6 kg' },
  { id: '3', name: 'Stanley 25mm x 5m Measuring Tape', quantity: 10, weight: '2.5 kg' }
]

export function ShipmentDetailPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>()
  const { t, formatDate } = useI18n()
  const { shipments, getProductById } = useAppStore()

  // Find consignment by ID
  const shipment = useMemo(() => {
    return shipments.find(s => s.id === shipmentId)
  }, [shipments, shipmentId])

  const getStatusIcon = (status: string, completed: boolean = false, current: boolean = false) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (current) {
      return <Clock className="h-5 w-5 text-blue-600 animate-spin" />
    }
    
    switch (status) {
      case 'booked':
        return <Package className="h-5 w-5 text-gray-500" />
      case 'in_transit':
        return <Ship className="h-5 w-5 text-blue-500" />
      case 'customs':
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case 'warehouse':
        return <Package className="h-5 w-5 text-purple-500" />
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'customs': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'warehouse': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-muted/10 text-muted-foreground'
    }
  }

  if (!shipment) {
    return (
      <div className="p-6">
        <BreadcrumbNavigation />
        <EmptyState
          title={t('pageNotFound')}
          description="Shipment not found"
          action={
            <Button onClick={() => window.history.back()}>
              {t('back')}
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />

      {/* Consignment Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h1 font-semibold">{shipment.referenceNumber}</h1>
            <p className="text-muted-foreground">Consignment Details</p>
            <p className="text-sm text-muted-foreground">Tracking: {shipment.trackingNumber}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`border ${getStatusColor(shipment.status)} flex items-center gap-1`}>
              {getStatusIcon(shipment.status)}
              {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
            </Badge>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">ETA</p>
              <p className="font-medium">{formatDate(shipment.estimatedDelivery)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t('timeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {shipment.timeline?.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(step.status, true, shipment.status === step.status)}
                    {index < (shipment.timeline?.length || 0) - 1 && (
                      <div className="w-px h-12 mt-2 bg-border" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </h3>
                      <span className="text-small text-muted-foreground">
                        {formatDate(step.timestamp)}
                      </span>
                    </div>
                    <p className="text-small text-muted-foreground">
                      {step.location}
                    </p>
                    {step.notes && (
                      <p className="text-small text-muted-foreground mt-1">
                        {step.notes}
                      </p>
                    )}
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">
                  No timeline data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Manifest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Consignment Manifest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipment.manifestItems?.map((item, index) => {
                  const product = getProductById(item.productId)
                  return (
                    <div key={`${item.productId}-${item.variantId || index}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {product?.name || item.description}
                          </h4>
                          <div className="flex gap-4 text-small text-muted-foreground mt-1">
                            <span>Quantity: {item.quantity}</span>
                            {item.variantId && (
                              <span>Variant: {item.variantId}</span>
                            )}
                          </div>
                          <div className="mt-2">
                            <Badge 
                              variant="outline" 
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {shipment.status === 'available' ? 'Available Now' : 'Incoming Stock'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {index < (shipment.manifestItems?.length || 0) - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  )
                }) || (
                  <p className="text-muted-foreground text-center py-4">
                    No manifest items available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipment Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-small font-medium text-muted-foreground">
                  {t('trackingNumber')}
                </label>
                <p className="font-mono">{shipment.trackingNumber}</p>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-small font-medium text-muted-foreground">
                  {t('carrier')}
                </label>
                <p>{shipment.carrier}</p>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-small font-medium text-muted-foreground">
                  {t('estimatedDelivery')}
                </label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(shipment.estimatedDelivery)}
                </p>
              </div>
              
              {shipment.actualDelivery && (
                <>
                  <Separator />
                  <div>
                    <label className="text-small font-medium text-muted-foreground">
                      Actual Delivery
                    </label>
                    <p className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-4 w-4" />
                      {formatDate(shipment.actualDelivery)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}