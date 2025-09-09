"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import type { Product, Brand, Inquiry, ProductVariant, PackingOption } from '../data/fixtures'

interface AdminStore {
  // Loading states
  isLoading: boolean
  
  // Products
  addProduct: (product: Omit<Product, 'id'>) => string
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Variants
  addVariant: (productId: string, variant: Omit<ProductVariant, 'id'>) => void
  updateVariant: (productId: string, variantId: string, updates: Partial<ProductVariant>) => void
  deleteVariant: (productId: string, variantId: string) => void
  
  // Brands
  addBrand: (brand: Omit<Brand, 'id'>) => string
  updateBrand: (id: string, updates: Partial<Brand>) => void
  deleteBrand: (id: string) => boolean // Returns false if has products
  
  // Inquiries
  addInquiryNote: (inquiryId: string, note: string) => void
  closeInquiry: (inquiryId: string) => void
  updateInquiryStatus: (inquiryId: string, status: Inquiry['status']) => void
  
  // UI state
  setLoading: (loading: boolean) => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      
      addProduct: (productData) => {
        set({ isLoading: true })
        
        // Simulate API delay
        setTimeout(() => {
          const newId = `product-${Date.now()}`
          const newProduct: Product = {
            ...productData,
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          
          // In a real app, this would go to the main store
          // For now, we'll show success feedback
          set({ isLoading: false })
          toast.success('Product created successfully!')
          
          // Return the new ID for scrolling to the row
          return newId
        }, 1000)
        
        return `product-${Date.now()}`
      },
      
      updateProduct: (id, updates) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Product updated successfully!')
        }, 800)
      },
      
      deleteProduct: (id) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Product deleted successfully!')
        }, 500)
      },
      
      addVariant: (productId, variantData) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Variant added successfully!')
        }, 800)
      },
      
      updateVariant: (productId, variantId, updates) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Variant updated successfully!')
        }, 600)
      },
      
      deleteVariant: (productId, variantId) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Variant deleted successfully!')
        }, 500)
      },
      
      addBrand: (brandData) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          const newId = `brand-${Date.now()}`
          set({ isLoading: false })
          toast.success('Brand added successfully!')
        }, 1000)
        
        return `brand-${Date.now()}`
      },
      
      updateBrand: (id, updates) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Brand updated successfully!')
        }, 800)
      },
      
      deleteBrand: (id) => {
        set({ isLoading: true })
        
        // Check if brand has products (UI rule)
        const hasProducts = Math.random() > 0.5 // Simulate check
        
        setTimeout(() => {
          set({ isLoading: false })
          
          if (hasProducts) {
            toast.error('Cannot delete a brand with products')
            return false
          } else {
            toast.success('Brand deleted successfully!')
            return true
          }
        }, 500)
        
        return !hasProducts
      },
      
      addInquiryNote: (inquiryId, note) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Note added to inquiry')
        }, 400)
      },
      
      closeInquiry: (inquiryId) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success('Inquiry marked as closed')
        }, 600)
      },
      
      updateInquiryStatus: (inquiryId, status) => {
        set({ isLoading: true })
        
        setTimeout(() => {
          set({ isLoading: false })
          toast.success(`Inquiry status updated to ${status}`)
        }, 500)
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        // Only persist non-loading state
      }),
    }
  )
)