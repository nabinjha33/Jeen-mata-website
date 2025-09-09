// Mock data fixtures for Jeen Mata Impex

export interface PackingOption {
  id: string
  type: "piece" | "box" | "carton"
  unitsPerPack: number
  label: string // e.g., "Box(25)", "Carton(12×Box)"
  notes?: string
}

export interface ProductVariant {
  id: string
  size: string // e.g., "4\"", "6\"", "8\""
  sku: string
  stock: number
  price: number
  unit: string // e.g., "pc", "m", "kg"
  packingOptions: PackingOption[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number // Base price or main variant price
  category: string
  brand: string
  imageUrl: string
  inStock: boolean
  specifications: Record<string, string>
  sku: string
  variants?: ProductVariant[] // Empty array if no variants
  defaultVariantId?: string // ID of the default/main variant
}

export interface Category {
  id: string
  name: string
  nameNe: string
  description: string
  imageUrl: string
  productCount: number
}

export interface Brand {
  id: string
  name: string
  description: string
  logoUrl: string
  website: string
  countryOfOrigin: string
  productCount: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "owner" | "manager" | "content_editor" | "customer"
  phone: string
  company?: string
  permissions?: string[]
  avatar?: string
}

export interface InquiryItem {
  productId: string
  variantId?: string // Selected variant (size)
  packingOptionId?: string // Selected packing option
  quantity: number // Number of packs
  totalPieces?: number // Auto-calculated: quantity × unitsPerPack
  unitPrice?: number // Price per unit/pack
  notes?: string
}

export interface Inquiry {
  id: string
  userId: string
  products: InquiryItem[]
  status: "pending" | "responded" | "closed"
  createdAt: Date
  updatedAt: Date
  customerNotes?: string
}

export interface ShipmentManifestItem {
  productId: string
  variantId?: string
  packingOptionId?: string
  quantity: number
  totalPieces: number
}

export interface Shipment {
  id: string
  referenceNumber: string // New: Shipment reference number
  inquiryId?: string // Made optional - not all shipments tied to inquiries
  trackingNumber: string
  status: "booked" | "in_transit" | "customs" | "warehouse" | "available" | "delivered"
  estimatedDelivery: Date
  actualDelivery?: Date
  carrier: string
  origin?: string
  destination?: string
  notes?: string // New: Editable notes field
  timeline?: Array<{
    id: string
    status: string
    timestamp: Date
    location?: string
    notes?: string
  }>
  manifestItems: ShipmentManifestItem[] // Enhanced manifest with variants
}

export interface AdminSettings {
  catalog: {
    priceVisibility: boolean
    lowStockThreshold: number
    outOfStockThreshold: number
  }
  localization: {
    defaultLanguage: string
    enabledLanguages: string[]
    uiCopy: Record<string, Record<string, string>>
  }
}

export interface AdminActivity {
  id: string
  userId: string
  action: string
  target: string
  targetId: string
  timestamp: Date
  details?: string
}

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Power Tools",
    nameNe: "पावर टूल्स",
    description: "Electric and battery-powered tools for professional and DIY use",
    imageUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=300&h=200",
    productCount: 45,
  },
  {
    id: "2",
    name: "Hand Tools",
    nameNe: "ह्यान्ड टूल्स",
    description: "Manual tools for various construction and repair tasks",
    imageUrl: "https://images.unsplash.com/photo-1721250527686-9b31f11bfe3e?w=300&h=200",
    productCount: 78,
  },
  {
    id: "3",
    name: "Hardware",
    nameNe: "हार्डवेयर",
    description: "Fasteners, fittings, and construction hardware",
    imageUrl: "https://images.unsplash.com/photo-1704732061018-3ac738176c20?w=300&h=200",
    productCount: 156,
  },
  {
    id: "4",
    name: "Safety Equipment",
    nameNe: "सुरक्षा उपकरण",
    description: "Personal protective equipment and safety gear",
    imageUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=300&h=200",
    productCount: 32,
  },
]

// Mock Brands
export const mockBrands: Brand[] = [
  {
    id: "1",
    name: "Bosch",
    description: "German engineering excellence in power tools",
    logoUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=150&h=75",
    website: "https://bosch.com",
    countryOfOrigin: "Germany",
    productCount: 28,
  },
  {
    id: "2",
    name: "Makita",
    description: "Japanese precision in cordless power tools",
    logoUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=150&h=75",
    website: "https://makita.com",
    countryOfOrigin: "Japan",
    productCount: 35,
  },
  {
    id: "3",
    name: "DeWalt",
    description: "American durability for professional contractors",
    logoUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=150&h=75",
    website: "https://dewalt.com",
    countryOfOrigin: "USA",
    productCount: 42,
  },
  {
    id: "4",
    name: "Stanley",
    description: "Trusted hand tools since 1843",
    logoUrl: "https://images.unsplash.com/photo-1721250527686-9b31f11bfe3e?w=150&h=75",
    website: "https://stanley.com",
    countryOfOrigin: "USA",
    productCount: 67,
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Bosch GSB Impact Drill",
    description: "Professional impact drill with variable speed control, perfect for drilling in concrete, metal, and wood.",
    price: 8500,
    category: "Power Tools",
    brand: "Bosch",
    imageUrl: "https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?w=400&h=300",
    inStock: true,
    sku: "BSH-GSB",
    defaultVariantId: "1-10mm",
    specifications: {
      "Power": "550W",
      "No Load Speed": "0-3000 rpm",
      "Impact Rate": "0-48000 bpm",
      "Weight": "1.8 kg",
    },
    variants: [
      {
        id: "1-10mm",
        size: "10mm",
        sku: "BSH-GSB-10",
        stock: 15,
        price: 8500,
        unit: "pc",
        packingOptions: [
          { id: "1-10-piece", type: "piece", unitsPerPack: 1, label: "Unit", notes: "Individual unit" },
          { id: "1-10-box", type: "box", unitsPerPack: 5, label: "Box(5)", notes: "5 units per box" }
        ]
      },
      {
        id: "1-13mm",
        size: "13mm", 
        sku: "BSH-GSB-13",
        stock: 8,
        price: 9200,
        unit: "pc",
        packingOptions: [
          { id: "1-13-piece", type: "piece", unitsPerPack: 1, label: "Unit", notes: "Individual unit" },
          { id: "1-13-box", type: "box", unitsPerPack: 4, label: "Box(4)", notes: "4 units per box" }
        ]
      },
      {
        id: "1-16mm",
        size: "16mm",
        sku: "BSH-GSB-16", 
        stock: 3,
        price: 10500,
        unit: "pc",
        packingOptions: [
          { id: "1-16-piece", type: "piece", unitsPerPack: 1, label: "Unit", notes: "Individual unit" },
          { id: "1-16-box", type: "box", unitsPerPack: 3, label: "Box(3)", notes: "3 units per box" }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Makita DF331D Cordless Driver",
    description: "12V MAX cordless driver drill with LED light and compact design.",
    price: 12000,
    category: "Power Tools",
    brand: "Makita",
    imageUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=400&h=300",
    inStock: true,
    sku: "MKT-DF331D",
    specifications: {
      "Voltage": "12V",
      "Chuck Size": "10mm",
      "Max Torque": "30 Nm",
      "Battery": "Li-ion",
      "Weight": "1.1 kg",
    },
  },
  {
    id: "3",
    name: "Stanley Measuring Tape",
    description: "Durable measuring tape with easy-to-read markings and sturdy construction.",
    price: 450,
    category: "Hand Tools",
    brand: "Stanley",
    imageUrl: "https://images.unsplash.com/photo-1721250527686-9b31f11bfe3e?w=400&h=300",
    inStock: true,
    sku: "STN-TAPE",
    defaultVariantId: "3-5m",
    specifications: {
      "Width": "25mm",
      "Case Material": "ABS Plastic",
      "Blade Material": "Steel",
      "Accuracy": "±2mm/5m",
    },
    variants: [
      {
        id: "3-3m",
        size: "3m",
        sku: "STN-TAPE-3M",
        stock: 25,
        price: 350,
        unit: "pc",
        packingOptions: [
          { id: "3-3-piece", type: "piece", unitsPerPack: 1, label: "Unit" },
          { id: "3-3-box", type: "box", unitsPerPack: 12, label: "Box(12)", notes: "12 pieces per box" },
          { id: "3-3-carton", type: "carton", unitsPerPack: 144, label: "Carton(12×Box)", notes: "12 boxes per carton" }
        ]
      },
      {
        id: "3-5m", 
        size: "5m",
        sku: "STN-TAPE-5M",
        stock: 18,
        price: 450,
        unit: "pc",
        packingOptions: [
          { id: "3-5-piece", type: "piece", unitsPerPack: 1, label: "Unit" },
          { id: "3-5-box", type: "box", unitsPerPack: 10, label: "Box(10)", notes: "10 pieces per box" },
          { id: "3-5-carton", type: "carton", unitsPerPack: 120, label: "Carton(12×Box)", notes: "12 boxes per carton" }
        ]
      },
      {
        id: "3-8m",
        size: "8m",
        sku: "STN-TAPE-8M",
        stock: 5,
        price: 650,
        unit: "pc",
        packingOptions: [
          { id: "3-8-piece", type: "piece", unitsPerPack: 1, label: "Unit" },
          { id: "3-8-box", type: "box", unitsPerPack: 6, label: "Box(6)", notes: "6 pieces per box" }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "DeWalt Safety Helmet with Visor",
    description: "Professional safety helmet with adjustable suspension and clear visor.",
    price: 1200,
    category: "Safety Equipment",
    brand: "DeWalt",
    imageUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=400&h=300",
    inStock: false,
    sku: "DWT-HELMET-V",
    specifications: {
      "Material": "HDPE",
      "Weight": "350g",
      "Adjustment": "Ratchet",
      "Certification": "CE EN397",
      "Color": "Yellow",
    },
  },
  {
    id: "5",
    name: "Hex Bolt M8 x 50mm (Pack of 50)",
    description: "Galvanized hex bolts suitable for outdoor construction projects.",
    price: 275,
    category: "Hardware",
    brand: "Generic",
    imageUrl: "https://images.unsplash.com/photo-1704732061018-3ac738176c20?w=400&h=300",
    inStock: true,
    sku: "HW-HEX-M8-50",
    specifications: {
      "Size": "M8 x 50mm",
      "Material": "Steel",
      "Coating": "Galvanized",
      "Grade": "8.8",
      "Package": "50 pieces",
    },
  },
  {
    id: "6",
    name: "Black & Decker BEH710 Rotary Hammer",
    description: "Powerful 710W rotary hammer for heavy-duty drilling and chiseling.",
    price: 15000,
    category: "Power Tools",
    brand: "Black & Decker",
    imageUrl: "https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?w=400&h=300",
    inStock: true,
    sku: "BD-BEH710",
    specifications: {
      "Power": "710W",
      "Max Drilling": "24mm",
      "Impact Energy": "2.5J",
      "Chuck": "SDS-Plus",
      "Weight": "2.8 kg",
    },
  },
  {
    id: "7",
    name: "Stanley FatMax Utility Knife",
    description: "Heavy-duty utility knife with quick-change blade mechanism.",
    price: 850,
    category: "Hand Tools",
    brand: "Stanley",
    imageUrl: "https://images.unsplash.com/photo-1721250527686-9b31f11bfe3e?w=400&h=300",
    inStock: true,
    sku: "STN-FMAX-UK",
    specifications: {
      "Blade Type": "18mm Snap-off",
      "Handle": "Bi-Material Grip",
      "Length": "165mm",
      "Blade Storage": "5 blades",
      "Weight": "180g",
    },
  },
  {
    id: "8",
    name: "Bosch Professional Safety Goggles",
    description: "Anti-fog safety goggles with UV protection and adjustable strap.",
    price: 650,
    category: "Safety Equipment",
    brand: "Bosch",
    imageUrl: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=400&h=300",
    inStock: true,
    sku: "BSH-GO100",
    specifications: {
      "Lens": "Polycarbonate",
      "Coating": "Anti-fog",
      "UV Protection": "99.9%",
      "Strap": "Adjustable Elastic",
      "Weight": "85g",
    },
  }
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Pradeep Sharma",
    email: "pradeep@jeenmataimPex.com",
    role: "owner",
    phone: "+977-1-4567890",
    company: "Jeen Mata Impex",
    permissions: ["all"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Sita Thapa",
    email: "sita@jeenmataimPex.com",
    role: "manager",
    phone: "+977-1-4567891",
    company: "Jeen Mata Impex",
    permissions: ["products", "brands", "inquiries", "shipments", "customers"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Rajesh Patel",
    email: "rajesh@jeenmataimPex.com",
    role: "content_editor",
    phone: "+977-1-4567892",
    company: "Jeen Mata Impex",
    permissions: ["products", "brands"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "राम श्रेष्ठ",
    email: "ram@example.com",
    role: "customer",
    phone: "+977-9841234567",
    company: "श्रेष्ठ कन्स्ट्रक्शन",
  },
  {
    id: "5",
    name: "John Contractor",
    email: "john@buildpro.com",
    role: "customer",
    phone: "+977-9876543210",
    company: "BuildPro Contractors",
  },
]

// Mock Admin Settings
export const mockAdminSettings: AdminSettings = {
  catalog: {
    priceVisibility: true,
    lowStockThreshold: 10,
    outOfStockThreshold: 0,
  },
  localization: {
    defaultLanguage: "en",
    enabledLanguages: ["en", "ne"],
    uiCopy: {
      en: {
        companyName: "Jeen Mata Impex",
        companyTagline: "Quality Tools & Hardware",
        welcome: "Welcome to our store",
        products: "Products",
        brands: "Brands",
        inquiries: "Inquiries",
        shipments: "Shipments",
      },
      ne: {
        companyName: "जीन माता इम्पेक्स",
        companyTagline: "गुणस्तरीय उपकरण र हार्डवेयर",
        welcome: "हाम्रो स्टोरमा स्वागत छ",
        products: "उत्पादनहरू",
        brands: "ब्रान्डहरू",
        inquiries: "सोधपुछ",
        shipments: "ढुवानी",
      },
    },
  },
};

// Mock Admin Activity
export const mockAdminActivity: AdminActivity[] = [
  {
    id: "1",
    userId: "2",
    action: "updated",
    target: "product",
    targetId: "1",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: "Updated stock status for Bosch GSB 550 Impact Drill",
  },
  {
    id: "2",
    userId: "3",
    action: "created",
    target: "product",
    targetId: "8",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    details: "Added new product: Bosch Professional Safety Goggles",
  },
  {
    id: "3",
    userId: "2",
    action: "responded",
    target: "inquiry",
    targetId: "1",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    details: "Responded to inquiry from राम श्रेष्ठ",
  },
  {
    id: "4",
    userId: "1",
    action: "updated",
    target: "settings",
    targetId: "catalog",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    details: "Updated catalog visibility settings",
  },
  {
    id: "5",
    userId: "2",
    action: "shipped",
    target: "shipment",
    targetId: "3",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    details: "Marked shipment JMI-2024-003 as shipped",
  },
];

// Mock Inquiries
export const mockInquiries: Inquiry[] = [
  {
    id: "1",
    userId: "2",
    products: [
      { productId: "1", quantity: 2, notes: "Need urgent delivery" },
      { productId: "3", quantity: 10 },
    ],
    status: "pending",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    customerNotes: "Building new house, need these tools by next week",
  },
  {
    id: "2",
    userId: "3",
    products: [
      { productId: "2", quantity: 5 },
      { productId: "4", quantity: 20 },
    ],
    status: "responded",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    customerNotes: "For commercial project",
  },
  {
    id: "3",
    userId: "2",
    products: [
      { productId: "6", quantity: 1 },
      { productId: "8", quantity: 5 },
    ],
    status: "responded",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-09"),
    customerNotes: "Professional contractors need reliable equipment",
  },
  {
    id: "4",
    userId: "3",
    products: [
      { productId: "7", quantity: 12 },
      { productId: "5", quantity: 100 },
    ],
    status: "closed",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-07"),
    customerNotes: "Bulk order for construction site",
  },
]

// Mock Consignments (Incoming Shipments)
export const mockShipments: Shipment[] = [
  {
    id: "1",
    referenceNumber: "CSG-2024-001",
    trackingNumber: "DE-8847392843",
    status: "in_transit",
    estimatedDelivery: new Date("2024-02-15"),
    carrier: "DHL Express",
    origin: "Hamburg, Germany",
    destination: "Jeen Mata Impex Warehouse",
    notes: "High-priority shipment with new Bosch power tools",
    manifestItems: [
      { productId: "1", variantId: "1-1", quantity: 50, description: "Professional Drill Set - 18V" },
      { productId: "2", variantId: "2-1", quantity: 25, description: "Angle Grinder - 125mm" },
      { productId: "3", variantId: "3-2", quantity: 100, description: "Safety Glasses - Clear" },
    ],
    timeline: [
      { id: "1", status: "booked", timestamp: new Date("2024-01-05"), location: "Hamburg Port", notes: "Consignment booked and documentation prepared" },
      { id: "2", status: "in_transit", timestamp: new Date("2024-01-08"), location: "Sea Transit", notes: "Departed Hamburg via cargo vessel" },
    ]
  },
  {
    id: "2", 
    referenceNumber: "CSG-2024-002",
    trackingNumber: "FX-9923847562",
    status: "customs",
    estimatedDelivery: new Date("2024-02-08"),
    carrier: "FedEx International",
    origin: "Tokyo, Japan",
    destination: "Tribhuvan International Airport",
    notes: "Premium Makita tools - customs clearance in progress",
    manifestItems: [
      { productId: "4", variantId: "4-1", quantity: 30, description: "Cordless Impact Driver - 18V" },
      { productId: "5", variantId: "5-1", quantity: 75, description: "Measuring Tape - 5m Professional" },
      { productId: "6", variantId: "6-2", quantity: 200, description: "Work Gloves - Size L" },
    ],
    timeline: [
      { id: "1", status: "booked", timestamp: new Date("2024-01-10"), location: "Tokyo Warehouse" },
      { id: "2", status: "in_transit", timestamp: new Date("2024-01-12"), location: "Narita Airport" },
      { id: "3", status: "customs", timestamp: new Date("2024-02-05"), location: "Kathmandu Customs", notes: "Documentation under review" },
    ]
  },
  {
    id: "3",
    referenceNumber: "CSG-2024-003", 
    trackingNumber: "UPS-4472831956",
    status: "warehouse",
    estimatedDelivery: new Date("2024-02-10"),
    carrier: "UPS Worldwide",
    origin: "Milwaukee, USA",
    destination: "Jeen Mata Impex Warehouse",
    notes: "Milwaukee power tools consignment - quality inspection completed",
    manifestItems: [
      { productId: "7", variantId: "7-1", quantity: 40, description: "Rotary Hammer - SDS-Plus" },
      { productId: "8", variantId: "8-1", quantity: 60, description: "Circular Saw - 190mm" },
      { productId: "9", variantId: "9-1", quantity: 150, description: "Screwdriver Set - Professional" },
    ],
    timeline: [
      { id: "1", status: "booked", timestamp: new Date("2024-01-20"), location: "Milwaukee Distribution" },
      { id: "2", status: "in_transit", timestamp: new Date("2024-01-25"), location: "Chicago Hub" },
      { id: "3", status: "customs", timestamp: new Date("2024-02-02"), location: "Kathmandu Customs" },
      { id: "4", status: "warehouse", timestamp: new Date("2024-02-05"), location: "JMI Warehouse", notes: "Arrived and under quality inspection" },
    ]
  },
  {
    id: "4",
    referenceNumber: "CSG-2024-004",
    trackingNumber: "TNT-7739485612", 
    status: "available",
    estimatedDelivery: new Date("2024-01-30"),
    actualDelivery: new Date("2024-01-28"),
    carrier: "TNT Express",
    origin: "Stuttgart, Germany", 
    destination: "Jeen Mata Impex Warehouse",
    notes: "Festool precision tools - now available for sale",
    manifestItems: [
      { productId: "10", variantId: "10-1", quantity: 20, description: "Track Saw - 160mm Guide Rail System" },
      { productId: "11", variantId: "11-1", quantity: 35, description: "Random Orbital Sander - 150mm" },
      { productId: "12", variantId: "12-1", quantity: 80, description: "Dust Extractor - Compact" },
    ],
    timeline: [
      { id: "1", status: "booked", timestamp: new Date("2024-01-15"), location: "Stuttgart Warehouse" },
      { id: "2", status: "in_transit", timestamp: new Date("2024-01-18"), location: "Frankfurt Hub" },
      { id: "3", status: "customs", timestamp: new Date("2024-01-25"), location: "Kathmandu Customs" },
      { id: "4", status: "warehouse", timestamp: new Date("2024-01-27"), location: "JMI Warehouse" },
      { id: "5", status: "available", timestamp: new Date("2024-01-28"), location: "JMI Showroom", notes: "Quality checked and ready for sale" },
    ]
  },
  {
    id: "5",
    referenceNumber: "CSG-2024-005",
    trackingNumber: "AR-1128475639",
    status: "booked",
    estimatedDelivery: new Date("2024-02-20"),
    carrier: "Air Cargo Express",
    origin: "Guangzhou, China",
    destination: "Tribhuvan International Airport",
    notes: "Mixed consignment - hand tools and hardware accessories",
    manifestItems: [
      { productId: "13", variantId: "13-1", quantity: 200, description: "Hammer Set - Various Sizes" },
      { productId: "14", variantId: "14-1", quantity: 500, description: "Screws Assortment - Mixed" },
      { productId: "15", variantId: "15-1", quantity: 300, description: "Utility Knives - Retractable" },
    ],
    timeline: [
      { id: "1", status: "booked", timestamp: new Date("2024-02-01"), location: "Guangzhou Export Hub", notes: "Documentation prepared, awaiting cargo space" },
    ]
  },
]