"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { SkeletonTable } from "../../components/admin/skeleton-table"
import { AddConsignmentDrawer } from "../../components/admin/add-consignment-drawer"
import { ShipmentDetailDrawer } from "../../components/admin/shipment-detail-drawer"
import { useShipmentsStore, type ShipmentStage } from "../../stores/shipments-store"
import { Plus, MoreHorizontal, Eye, Edit, Truck, MapPin, Calendar, Search, Package } from "lucide-react"

export function AdminShipmentsPage() {
  const { 
    shipments, 
    loading, 
    searchShipments, 
    initialize 
  } = useShipmentsStore()

  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<ShipmentStage | 'ALL'>('ALL')
  const [showAddConsignment, setShowAddConsignment] = useState(false)
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null)

  // Initialize store on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Filter shipments
  const filteredShipments = searchShipments(
    searchQuery, 
    stageFilter === 'ALL' ? undefined : stageFilter
  )

  const getStageColor = (stage: ShipmentStage) => {
    switch (stage) {
      case 'BOOKED': return 'bg-gray-100 text-gray-800'
      case 'TRANSIT': return 'bg-blue-100 text-blue-800'
      case 'CUSTOMS': return 'bg-amber-100 text-amber-800'
      case 'WAREHOUSE': return 'bg-purple-100 text-purple-800'
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatETA = (eta?: string) => {
    if (!eta) return 'TBD'
    return new Date(eta).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consignments</h1>
          <p className="text-muted-foreground">
            Manage incoming consignments and inventory tracking
          </p>
        </div>
        
        <Button onClick={() => setShowAddConsignment(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Consignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consignments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => ['TRANSIT', 'CUSTOMS'].includes(s.stage)).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => s.stage === 'AVAILABLE').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.reduce((sum, s) => sum + s.items.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference number or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={stageFilter} 
              onValueChange={(value: ShipmentStage | 'ALL') => setStageFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Stages</SelectItem>
                <SelectItem value="BOOKED">Booked</SelectItem>
                <SelectItem value="TRANSIT">In Transit</SelectItem>
                <SelectItem value="CUSTOMS">Customs</SelectItem>
                <SelectItem value="WAREHOUSE">Warehouse</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Consignments ({filteredShipments.length})</CardTitle>
          <CardDescription>
            Manage and track consignment progress and manifest items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SkeletonTable columns={6} rows={5} />
          ) : filteredShipments.length > 0 ? (
            <div className="rounded-md border">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Reference</TableHead>
                    <TableHead className="w-[120px]">Stage</TableHead>
                    <TableHead className="w-[100px]">ETA</TableHead>
                    <TableHead className="w-[80px]">Items</TableHead>
                    <TableHead className="w-[120px]">Updated</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        {shipment.ref}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStageColor(shipment.stage)}>
                          {shipment.stage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatETA(shipment.eta)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {shipment.items.length}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(shipment.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedShipmentId(shipment.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedShipmentId(shipment.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Consignment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No consignments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || stageFilter !== 'ALL' 
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first consignment'
                }
              </p>
              {!searchQuery && stageFilter === 'ALL' && (
                <Button onClick={() => setShowAddConsignment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Consignment
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drawers */}
      <AddConsignmentDrawer
        open={showAddConsignment}
        onOpenChange={setShowAddConsignment}
      />
      
      <ShipmentDetailDrawer
        shipmentId={selectedShipmentId}
        open={!!selectedShipmentId}
        onOpenChange={(open) => !open && setSelectedShipmentId(null)}
      />
    </div>
  )
}