"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShipmentStage = 'BOOKED' | 'TRANSIT' | 'CUSTOMS' | 'WAREHOUSE' | 'AVAILABLE'

export type ShipmentItem = {
  id: string
  shipmentId: string
  productId: string
  variantId?: string
  qty: number
}

export type Shipment = {
  id: string
  ref: string
  stage: ShipmentStage
  eta?: string
  notes?: string
  items: ShipmentItem[]
  createdAt: string
  updatedAt: string
}

export type ProductLite = {
  id: string
  name: string
  variants?: { id: string; sizeLabel: string }[]
}

type ShipmentsState = {
  shipments: Shipment[]
  productsLite: ProductLite[]
  loading: boolean
  error: string | null
}

type ShipmentsActions = {
  // Shipment CRUD
  createShipment: (input: { ref: string; stage?: ShipmentStage; eta?: string; notes?: string }) => Shipment
  updateShipment: (id: string, patch: Partial<Omit<Shipment, 'id' | 'items' | 'createdAt'>>) => void
  deleteShipment: (id: string) => void
  getShipmentById: (id: string) => Shipment | undefined
  
  // Item CRUD
  addItem: (input: { shipmentId: string; productId: string; variantId?: string; qty: number }) => ShipmentItem
  updateItem: (itemId: string, patch: { qty: number }) => void
  deleteItem: (itemId: string) => void
  
  // Search and filters
  searchShipments: (query: string, stage?: ShipmentStage) => Shipment[]
  getShipmentsByStage: (stage: ShipmentStage) => Shipment[]
  
  // Utilities
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initialize: () => void
}

// Mock data initialization
const initializeData = (): { shipments: Shipment[]; productsLite: ProductLite[] } => {
  const now = new Date().toISOString()
  
  const productsLite: ProductLite[] = [
    {
      id: "1",
      name: "Bosch GSB Impact Drill",
      variants: [
        { id: "1-10mm", sizeLabel: "10mm" },
        { id: "1-13mm", sizeLabel: "13mm" },
        { id: "1-16mm", sizeLabel: "16mm" }
      ]
    },
    {
      id: "2",
      name: "DeWalt Circular Saw",
      variants: [
        { id: "2-7inch", sizeLabel: "7 inch" },
        { id: "2-10inch", sizeLabel: "10 inch" }
      ]
    },
    {
      id: "3",
      name: "Stanley Measuring Tape",
      variants: [
        { id: "3-3m", sizeLabel: "3m" },
        { id: "3-5m", sizeLabel: "5m" },
        { id: "3-8m", sizeLabel: "8m" }
      ]
    }
  ]

  const shipments: Shipment[] = [
    {
      id: "1",
      ref: "CNS-2024-001",
      stage: "TRANSIT",
      eta: "2024-02-15",
      notes: "First batch of power tools from Germany",
      items: [
        { id: "item-1", shipmentId: "1", productId: "1", variantId: "1-10mm", qty: 25 },
        { id: "item-2", shipmentId: "1", productId: "2", variantId: "2-7inch", qty: 15 }
      ],
      createdAt: now,
      updatedAt: now
    },
    {
      id: "2", 
      ref: "CNS-2024-002",
      stage: "CUSTOMS",
      eta: "2024-02-20",
      notes: "Hand tools shipment from UK",
      items: [
        { id: "item-3", shipmentId: "2", productId: "3", variantId: "3-5m", qty: 50 }
      ],
      createdAt: now,
      updatedAt: now
    }
  ]

  return { shipments, productsLite }
}

export const useShipmentsStore = create<ShipmentsState & ShipmentsActions>()(
  persist(
    (set, get) => ({
      // Initial state
      shipments: [],
      productsLite: [],
      loading: false,
      error: null,

      // Initialize with mock data
      initialize: () => {
        const { shipments, productsLite } = initializeData()
        set({ shipments, productsLite })
      },

      // Shipment CRUD
      createShipment: (input) => {
        const now = new Date().toISOString()
        const newShipment: Shipment = {
          id: crypto.randomUUID(),
          ref: input.ref,
          stage: input.stage || 'BOOKED',
          eta: input.eta,
          notes: input.notes,
          items: [],
          createdAt: now,
          updatedAt: now
        }
        
        set((state) => ({
          shipments: [...state.shipments, newShipment]
        }))
        
        return newShipment
      },

      updateShipment: (id, patch) => {
        const now = new Date().toISOString()
        set((state) => ({
          shipments: state.shipments.map(shipment =>
            shipment.id === id
              ? { ...shipment, ...patch, updatedAt: now }
              : shipment
          )
        }))
      },

      deleteShipment: (id) => {
        set((state) => ({
          shipments: state.shipments.filter(shipment => shipment.id !== id)
        }))
      },

      getShipmentById: (id) => {
        return get().shipments.find(shipment => shipment.id === id)
      },

      // Item CRUD
      addItem: (input) => {
        const newItem: ShipmentItem = {
          id: crypto.randomUUID(),
          shipmentId: input.shipmentId,
          productId: input.productId,
          variantId: input.variantId,
          qty: input.qty
        }

        set((state) => ({
          shipments: state.shipments.map(shipment =>
            shipment.id === input.shipmentId
              ? { 
                  ...shipment, 
                  items: [...shipment.items, newItem],
                  updatedAt: new Date().toISOString()
                }
              : shipment
          )
        }))

        return newItem
      },

      updateItem: (itemId, patch) => {
        set((state) => ({
          shipments: state.shipments.map(shipment => ({
            ...shipment,
            items: shipment.items.map(item =>
              item.id === itemId ? { ...item, ...patch } : item
            ),
            updatedAt: shipment.items.some(item => item.id === itemId) 
              ? new Date().toISOString() 
              : shipment.updatedAt
          }))
        }))
      },

      deleteItem: (itemId) => {
        set((state) => ({
          shipments: state.shipments.map(shipment => ({
            ...shipment,
            items: shipment.items.filter(item => item.id !== itemId),
            updatedAt: shipment.items.some(item => item.id === itemId)
              ? new Date().toISOString()
              : shipment.updatedAt
          }))
        }))
      },

      // Search and filters
      searchShipments: (query, stage) => {
        const { shipments } = get()
        return shipments.filter(shipment => {
          const matchesQuery = !query || 
            shipment.ref.toLowerCase().includes(query.toLowerCase()) ||
            shipment.notes?.toLowerCase().includes(query.toLowerCase())
          const matchesStage = !stage || shipment.stage === stage
          return matchesQuery && matchesStage
        })
      },

      getShipmentsByStage: (stage) => {
        return get().shipments.filter(shipment => shipment.stage === stage)
      },

      // Utilities
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'shipments-storage',
      partialize: (state) => ({
        shipments: state.shipments,
        productsLite: state.productsLite
      })
    }
  )
)