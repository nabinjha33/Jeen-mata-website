"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DrawerForm } from "./drawer-form"
import { useShipmentsStore, type ShipmentStage } from "../../stores/shipments-store"
import { toast } from "sonner"

interface AddConsignmentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddConsignmentDrawer({ open, onOpenChange }: AddConsignmentDrawerProps) {
  const [formData, setFormData] = useState({
    ref: '',
    stage: 'BOOKED' as ShipmentStage,
    eta: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { createShipment, shipments } = useShipmentsStore()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.ref.trim()) {
      newErrors.ref = 'Reference number is required'
    } else if (shipments.some(s => s.ref === formData.ref.trim())) {
      newErrors.ref = 'Reference number must be unique'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      createShipment({
        ref: formData.ref.trim(),
        stage: formData.stage,
        eta: formData.eta || undefined,
        notes: formData.notes.trim() || undefined
      })

      toast.success("Consignment created successfully")
      onOpenChange(false)
      
      // Reset form
      setFormData({
        ref: '',
        stage: 'BOOKED',
        eta: '',
        notes: ''
      })
      setErrors({})
    } catch (error) {
      toast.error("Failed to create consignment")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      ref: '',
      stage: 'BOOKED',
      eta: '',
      notes: ''
    })
    setErrors({})
    onOpenChange(false)
  }

  return (
    <DrawerForm
      open={open}
      onClose={handleCancel}
      title="Add New Consignment"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      submitText="Create Consignment"
      isLoading={loading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ref">Reference Number *</Label>
          <Input
            id="ref"
            value={formData.ref}
            onChange={(e) => setFormData(prev => ({ ...prev, ref: e.target.value }))}
            placeholder="CNS-2024-001"
            disabled={loading}
            className={errors.ref ? "border-red-500" : ""}
          />
          {errors.ref && <p className="text-sm text-red-500">{errors.ref}</p>}
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
          <Label htmlFor="eta">Estimated Arrival (optional)</Label>
          <Input
            id="eta"
            type="date"
            value={formData.eta}
            onChange={(e) => setFormData(prev => ({ ...prev, eta: e.target.value }))}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
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
    </DrawerForm>
  )
}