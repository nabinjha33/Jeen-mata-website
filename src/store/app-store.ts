import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  mockProducts, 
  mockCategories, 
  mockBrands, 
  mockUsers, 
  mockInquiries, 
  mockShipments,
  mockAdminSettings,
  mockAdminActivity,
  type Product,
  type Category,
  type Brand,
  type User,
  type Inquiry,
  type Shipment,
  type AdminSettings,
  type AdminActivity
} from '../data/fixtures'

interface InquiryItem {
  productId: string
  quantity: number
  notes?: string
}

interface AppStore {
  // Data
  products: Product[]
  categories: Category[]
  brands: Brand[]
  users: User[]
  inquiries: Inquiry[]
  shipments: Shipment[]
  adminSettings: AdminSettings
  adminActivity: AdminActivity[]
  
  // UI State
  sidebarOpen: boolean
  currentUser: User | null
  inquiryCart: InquiryItem[]
  searchQuery: string
  selectedCategory: string | null
  selectedBrand: string | null
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setCurrentUser: (user: User | null) => void
  addToInquiryCart: (item: InquiryItem) => void
  removeFromInquiryCart: (productId: string) => void
  updateInquiryCartItem: (productId: string, updates: Partial<InquiryItem>) => void
  clearInquiryCart: () => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (categoryId: string | null) => void
  setSelectedBrand: (brandId: string | null) => void
  
  // Admin Actions
  createProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  createBrand: (brand: Omit<Brand, 'id'>) => void
  updateBrand: (id: string, updates: Partial<Brand>) => void
  deleteBrand: (id: string) => void
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void
  updateShipmentStatus: (id: string, status: Shipment['status']) => void
  updateAdminSettings: (updates: Partial<AdminSettings>) => void
  addAdminActivity: (activity: Omit<AdminActivity, 'id' | 'timestamp'>) => void
  checkPermission: (permission: string) => boolean
  
  // Computed
  getFilteredProducts: () => Product[]
  getInquiryCartTotal: () => number
  getProductById: (id: string) => Product | undefined
  getCategoryById: (id: string) => Category | undefined
  getBrandById: (id: string) => Brand | undefined
  getUserById: (id: string) => User | undefined
  getAdminKPIs: () => {
    totalProducts: number
    inquiriesThisWeek: number
    shipmentsInTransit: number
    lowStockCount: number
  }
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial data
      products: mockProducts,
      categories: mockCategories,
      brands: mockBrands,
      users: mockUsers,
      inquiries: mockInquiries,
      shipments: mockShipments,
      adminSettings: mockAdminSettings,
      adminActivity: mockAdminActivity,
      
      // Initial UI state
      sidebarOpen: false,
      currentUser: mockUsers.find(u => u.role === 'owner') || null,
      inquiryCart: [],
      searchQuery: '',
      selectedCategory: null,
      selectedBrand: null,
      
      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      addToInquiryCart: (item) => set((state) => {
        const existingIndex = state.inquiryCart.findIndex(i => i.productId === item.productId)
        if (existingIndex >= 0) {
          const updated = [...state.inquiryCart]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
            notes: item.notes || updated[existingIndex].notes
          }
          return { inquiryCart: updated }
        }
        return { inquiryCart: [...state.inquiryCart, item] }
      }),
      
      removeFromInquiryCart: (productId) => set((state) => ({
        inquiryCart: state.inquiryCart.filter(item => item.productId !== productId)
      })),
      
      updateInquiryCartItem: (productId, updates) => set((state) => ({
        inquiryCart: state.inquiryCart.map(item => 
          item.productId === productId ? { ...item, ...updates } : item
        )
      })),
      
      clearInquiryCart: () => set({ inquiryCart: [] }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
      
      setSelectedBrand: (brandId) => set({ selectedBrand: brandId }),
      
      // Computed getters
      getFilteredProducts: () => {
        const { products, searchQuery, selectedCategory, selectedBrand } = get()
        return products.filter(product => {
          const matchesSearch = !searchQuery || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
          
          const matchesCategory = !selectedCategory || product.category === selectedCategory
          
          const matchesBrand = !selectedBrand || product.brand === selectedBrand
          
          return matchesSearch && matchesCategory && matchesBrand
        })
      },
      
      getInquiryCartTotal: () => {
        const { inquiryCart } = get()
        return inquiryCart.reduce((total, item) => total + item.quantity, 0)
      },
      
      getProductById: (id) => {
        const { products } = get()
        return products.find(p => p.id === id)
      },
      
      getCategoryById: (id) => {
        const { categories } = get()
        return categories.find(c => c.id === id)
      },
      
      getBrandById: (id) => {
        const { brands } = get()
        return brands.find(b => b.id === id)
      },

      getUserById: (id) => {
        const { users } = get()
        return users.find(u => u.id === id)
      },

      // Admin Actions
      createProduct: (productData) => set((state) => {
        const newProduct = {
          ...productData,
          id: Date.now().toString()
        }
        return { products: [...state.products, newProduct] }
      }),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      createBrand: (brandData) => set((state) => {
        const newBrand = {
          ...brandData,
          id: Date.now().toString()
        }
        return { brands: [...state.brands, newBrand] }
      }),

      updateBrand: (id, updates) => set((state) => ({
        brands: state.brands.map(b => b.id === id ? { ...b, ...updates } : b)
      })),

      deleteBrand: (id) => set((state) => ({
        brands: state.brands.filter(b => b.id !== id)
      })),

      updateInquiryStatus: (id, status) => set((state) => ({
        inquiries: state.inquiries.map(i => 
          i.id === id ? { ...i, status, updatedAt: new Date() } : i
        )
      })),

      updateShipmentStatus: (id, status) => set((state) => ({
        shipments: state.shipments.map(s => s.id === id ? { ...s, status } : s)
      })),

      updateAdminSettings: (updates) => set((state) => ({
        adminSettings: { ...state.adminSettings, ...updates }
      })),

      addAdminActivity: (activityData) => set((state) => {
        const newActivity = {
          ...activityData,
          id: Date.now().toString(),
          timestamp: new Date()
        }
        return { 
          adminActivity: [newActivity, ...state.adminActivity].slice(0, 50) // Keep only last 50 activities
        }
      }),

      checkPermission: (permission) => {
        const { currentUser } = get()
        if (!currentUser) return false
        if (currentUser.role === 'owner') return true
        return currentUser.permissions?.includes(permission) || false
      },

      getAdminKPIs: () => {
        const { products, inquiries, shipments, adminSettings } = get()
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        
        return {
          totalProducts: products.length,
          inquiriesThisWeek: inquiries.filter(i => i.createdAt >= oneWeekAgo).length,
          shipmentsInTransit: shipments.filter(s => ['shipped', 'in_transit'].includes(s.status)).length,
          lowStockCount: products.filter(p => !p.inStock).length // Simplified low stock logic
        }
      },
    }),
    {
      name: 'jeen-mata-store',
      partialize: (state) => ({
        inquiryCart: state.inquiryCart,
        currentUser: state.currentUser,
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        selectedBrand: state.selectedBrand,
      }),
    }
  )
)