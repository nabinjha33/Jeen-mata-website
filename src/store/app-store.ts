import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  mockProducts, 
  mockCategories, 
  mockBrands, 
  mockUsers, 
  mockInquiries, 
  mockShipments,
  type Product,
  type Category,
  type Brand,
  type User,
  type Inquiry,
  type Shipment
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
  
  // Computed
  getFilteredProducts: () => Product[]
  getInquiryCartTotal: () => number
  getProductById: (id: string) => Product | undefined
  getCategoryById: (id: string) => Category | undefined
  getBrandById: (id: string) => Brand | undefined
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
      
      // Initial UI state
      sidebarOpen: false,
      currentUser: mockUsers.find(u => u.role === 'admin') || null,
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