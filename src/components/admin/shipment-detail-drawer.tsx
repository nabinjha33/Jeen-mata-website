"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DrawerForm } from "./drawer-form"
import { ConfirmDialog } from "./confirm-dialog"
import { AddItemDrawer } from "./add-item-drawer"
import { useShipmentsStore, type ShipmentStage } from "../../stores/shipments-store"
import { Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

interface ShipmentDetailDrawerProps {
  shipmentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShipmentDetailDrawer({ shipmentId, open, onOpenChange }: ShipmentDetailDrawerProps) {
  const { getShipmentById, updateShipment, deleteItem, productsLite } = useShipmentsStore()
  const shipment = shipmentId ? getShipmentById(shipmentId) : null

  const [formData, setFormData] = useState({
    ref: '',
    stage: 'BOOKED' as ShipmentStage,
    eta: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)

  // Update form data when shipment changes
  useEffect(() => {
    if (shipment) {
      setFormData({
        ref: shipment.ref,
        stage: shipment.stage,
        eta: shipment.eta || '',
        notes: shipment.notes || ''
      })
    }
  }, [shipment])

  const handleUpdate = async () => {
    if (!shipment) return

    setLoading(true)
    try {
      updateShipment(shipment.id, {
        ref: formData.ref.trim(),
        stage: formData.stage,
        eta: formData.eta || undefined,
        notes: formData.notes.trim() || undefined
      })

      toast.success("Consignment updated successfully")
    } catch (error) {
      toast.error("Failed to update consignment")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      deleteItem(itemId)
      toast.success("Item removed from consignment")
      setDeleteItemId(null)
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const getProductName = (productId: string) => {
    return productsLite.find(p => p.id === productId)?.name || 'Unknown Product'
  }

  const getVariantLabel = (productId: string, variantId?: string) => {
    if (!variantId) return null
    const product = productsLite.find(p => p.id === productId)
    return product?.variants?.find(v => v.id === variantId)?.sizeLabel
  }

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

  if (!shipment) {
    return null
  }

  return (
    <>
      <DrawerForm
        open={open}
        onClose={() => onOpenChange(false)}
        title={`Consignment ${shipment.ref}`}
        onSubmit={(e) => {
          e.preventDefault()
          handleUpdate()
        }}
        submitText="Save Changes"
        isLoading={loading}
      >
        <div className="space-y-6">
          {/* Consignment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Consignment Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ref">Reference Number</Label>
                <Input
                  id="ref"
                  value={formData.ref}
                  onChange={(e) => setFormData(prev => ({ ...prev, ref: e.target.value }))}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select 
                  value={formData.stage} 
                  onValueChange={(value: ShipmentStage) => setFormData(prev => ({ ...prev, stage: value }))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOOKED">Booked</SelectItem>
                    <SelectItem value="TRANSIT">In Transit</SelectItem>
                    <SelectItem value="CUSTOMS">Customs</SelectItem>
                    <SelectItem value="WAREHOUSE">Warehouse</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eta">Estimated Arrival</Label>
                <Input
                  id="eta"
                  type="date"
                  value={formData.eta}
                  onChange={(e) => setFormData(prev => ({ ...prev, eta: e.target.value }))}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge className={getStageColor(shipment.stage)}>
                  {shipment.stage}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this consignment..."
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Manifest Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Manifest Items ({shipment.items.length})</h3>
              <Button 
                onClick={() => setShowAddItem(true)}
                size="sm"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {shipment.items.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variant/Size</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipment.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {getProductName(item.productId)}
                        </TableCell>
                        <TableCell>
                          {getVariantLabel(item.productId, item.variantId) || 'Standard'}
                        </TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteItemId(item.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No items in this consignment yet. Click "Add Item" to get started.
              </div>
            )}
          </div>
        </div>
      </DrawerForm>

      {/* Add Item Drawer */}
      <AddItemDrawer
        shipmentId={shipmentId}
        open={showAddItem}
        onOpenChange={setShowAddItem}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        title="Remove Item"
        description="Are you sure you want to remove this item from the consignment?"
        onConfirm={() => deleteItemId && handleDeleteItem(deleteItemId)}
        variant="destructive"
        confirmText="Remove"
      />
    </>
  )
}