import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { Truck, Package, Clock, CheckCircle, MapPin, Calendar } from "lucide-react"
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
  const { shipments } = useAppStore()

  // Find shipment by ID
  const shipment = useMemo(() => {
    return shipments.find(s => s.id === shipmentId)
  }, [shipments, shipmentId])

  const getStatusIcon = (status: string, completed: boolean, current: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-success" />
    } else if (current) {
      return <Clock className="h-5 w-5 text-info animate-spin" />
    }
    
    switch (status) {
      case 'booked':
        return <Package className="h-5 w-5 text-muted-foreground" />
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-5 w-5 text-muted-foreground" />
      case 'customs':
        return <MapPin className="h-5 w-5 text-muted-foreground" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
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

      {/* Shipment Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h1 font-semibold">{shipment.trackingNumber}</h1>
            <p className="text-muted-foreground">{t('shipmentDetails')}</p>
          </div>
          <Badge 
            variant={
              shipment.status === 'delivered' ? 'default' :
              shipment.status === 'shipped' ? 'secondary' : 'outline'
            }
            className="text-small"
          >
            {t(shipment.status)}
          </Badge>
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
              {mockShipmentTimeline.map((step, index) => (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(step.status, step.completed, step.current || false)}
                    {index < mockShipmentTimeline.length - 1 && (
                      <div className={`w-px h-12 mt-2 ${
                        step.completed ? 'bg-success' : 'bg-border'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium ${
                        step.current ? 'text-info' : 
                        step.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      <span className="text-small text-muted-foreground">
                        {formatDate(step.date)}
                      </span>
                    </div>
                    <p className="text-small text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Manifest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('manifest')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManifest.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex gap-4 text-small text-muted-foreground">
                          <span>{t('quantity')}: {item.quantity}</span>
                          <span>Weight: {item.weight}</span>
                        </div>
                      </div>
                    </div>
                    {index < mockManifest.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
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