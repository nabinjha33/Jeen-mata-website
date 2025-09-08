// Mock data fixtures for Jeen Mata Impex

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  imageUrl: string
  inStock: boolean
  specifications: Record<string, string>
  sku: string
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

export interface Inquiry {
  id: string
  userId: string
  products: Array<{
    productId: string
    quantity: number
    notes?: string
  }>
  status: "pending" | "responded" | "closed"
  createdAt: Date
  updatedAt: Date
  customerNotes?: string
}

export interface Shipment {
  id: string
  inquiryId: string
  trackingNumber: string
  status: "preparing" | "shipped" | "in_transit" | "delivered"
  estimatedDelivery: Date
  actualDelivery?: Date
  carrier: string
  origin?: string
  destination?: string
  timeline?: Array<{
    id: string
    status: string
    timestamp: Date
    location?: string
    notes?: string
  }>
  manifestItems?: Array<{
    productId: string
    quantity: number
  }>
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
    name: "Bosch GSB 550 Impact Drill",
    description: "13mm impact drill with variable speed control, perfect for drilling in concrete, metal, and wood.",
    price: 8500,
    category: "Power Tools",
    brand: "Bosch",
    imageUrl: "https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?w=400&h=300",
    inStock: true,
    sku: "BSH-GSB550",
    specifications: {
      "Power": "550W",
      "Chuck Size": "13mm",
      "No Load Speed": "0-3000 rpm",
      "Impact Rate": "0-48000 bpm",
      "Weight": "1.8 kg",
    },
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
    name: "Stanley 25mm x 5m Measuring Tape",
    description: "Durable measuring tape with easy-to-read markings and sturdy construction.",
    price: 450,
    category: "Hand Tools",
    brand: "Stanley",
    imageUrl: "https://images.unsplash.com/photo-1721250527686-9b31f11bfe3e?w=400&h=300",
    inStock: true,
    sku: "STN-25MM5M",
    specifications: {
      "Length": "5m",
      "Width": "25mm",
      "Case Material": "ABS Plastic",
      "Blade Material": "Steel",
      "Accuracy": "±2mm/5m",
    },
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

// Mock Shipments
export const mockShipments: Shipment[] = [
  {
    id: "1",
    inquiryId: "2",
    trackingNumber: "JMI-2024-001",
    status: "in_transit",
    estimatedDelivery: new Date("2024-01-20"),
    carrier: "Nepal Express Cargo",
    origin: "Kathmandu Warehouse",
    destination: "Pokhara Distribution Center",
  },
  {
    id: "2",
    inquiryId: "1",
    trackingNumber: "JMI-2024-002",
    status: "preparing",
    estimatedDelivery: new Date("2024-01-25"),
    carrier: "Kathmandu Logistics",
    origin: "Main Warehouse",
    destination: "Chitwan Branch",
  },
  {
    id: "3",
    inquiryId: "3",
    trackingNumber: "JMI-2024-003",
    status: "shipped",
    estimatedDelivery: new Date("2024-01-18"),
    carrier: "Fast Track Delivery",
    origin: "Kathmandu Central",
    destination: "Biratnagar Office",
  },
  {
    id: "4",
    inquiryId: "4",
    trackingNumber: "JMI-2024-004",
    status: "delivered",
    estimatedDelivery: new Date("2024-01-15"),
    actualDelivery: new Date("2024-01-14"),
    carrier: "City Express",
    origin: "Lalitpur Depot",
    destination: "Bhaktapur",
  },
]