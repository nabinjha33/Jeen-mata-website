"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Language = "en" | "ne"

type I18nContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  formatCurrency: (amount: number) => string
  formatDate: (date: Date) => string
  formatNumber: (number: number) => string
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    products: "Products",
    categories: "Categories",
    brands: "Brands",
    about: "About Us",
    contact: "Contact",
    search: "Search products...",
    inquiryCart: "Inquiry Cart",
    language: "Language",
    theme: "Theme",
    admin: "Admin",
    shipments: "Shipments",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    view: "View",
    filter: "Filter",
    sort: "Sort",
    search_text: "Search",
    clear: "Clear",
    reset: "Reset",
    submit: "Submit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    open: "Open",
    showMore: "Show More",
    showLess: "Show Less",
    quantity: "Quantity",
    notes: "Notes",
    total: "Total",
    
    // Product related
    product: "Product",
    products_title: "Products",
    category: "Category",
    brand: "Brand",
    price: "Price",
    availability: "Availability",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    lowStock: "Low Stock",
    addToInquiry: "Add to Inquiry",
    askQuestion: "Ask a Question",
    productDetails: "Product Details",
    specifications: "Specifications",
    description: "Description",
    relatedProducts: "Related Products",
    productImages: "Product Images",
    sku: "SKU",
    
    // Home page
    welcomeTitle: "Welcome to Jeen Mata Impex",
    welcomeSubtitle: "Your trusted partner for premium hardware and power tools",
    featuredProducts: "Featured Products",
    popularBrands: "Popular Brands",
    incomingShipments: "Incoming Shipments",
    viewAllProducts: "View All Products",
    viewAllBrands: "View All Brands",
    viewAllShipments: "View All Shipments",
    shopNow: "Shop Now",
    exploreProducts: "Explore Products",
    
    // Brands
    allBrands: "All Brands",
    brandDetails: "Brand Details",
    countryOfOrigin: "Country of Origin",
    website: "Website",
    productsFromBrand: "Products from",
    
    // Filters & Search
    filterBy: "Filter By",
    sortBy: "Sort By",
    priceRange: "Price Range",
    stockStatus: "Stock Status",
    sortByName: "Name",
    sortByPrice: "Price",
    sortByBrand: "Brand",
    sortByNewest: "Newest",
    searchResults: "Search Results",
    noResults: "No results found",
    noResultsDescription: "Try adjusting your search or filters",
    
    // Inquiry
    inquiryCart_title: "Inquiry Cart",
    addToCart: "Add to Cart",
    removeFromCart: "Remove from Cart",
    inquiryForm: "Inquiry Form",
    customerDetails: "Customer Details",
    fullName: "Full Name",
    companyName: "Company Name",
    phone: "Phone Number",
    email: "Email Address",
    city: "City",
    preferredContact: "Preferred Contact Method",
    message: "Message",
    reviewInquiry: "Review Inquiry",
    submitInquiry: "Submit Inquiry",
    inquirySuccess: "Inquiry Submitted Successfully",
    inquiryReference: "Reference ID",
    inquirySuccessMessage: "We will contact you soon with a quote",
    
    // Shipments
    trackingNumber: "Tracking Number",
    estimatedDelivery: "Estimated Delivery",
    carrier: "Carrier",
    shipmentStatus: "Status",
    shipmentDetails: "Shipment Details",
    manifest: "Manifest",
    timeline: "Timeline",
    booked: "Booked",
    inTransit: "In Transit",
    customs: "Customs",
    warehouse: "Warehouse",
    available: "Available",
    
    // Status
    preparing: "Preparing",
    shipped: "Shipped",
    delivered: "Delivered",
    pending: "Pending",
    responded: "Responded",
    closed: "Closed",
    
    // Footer
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    companyInfo: "Company Information",
    allRightsReserved: "All rights reserved",
    
    // Company
    companyName: "Jeen Mata Impex",
    companyTagline: "Your trusted hardware & power tools partner",
    
    // Error pages
    pageNotFound: "Page Not Found",
    pageNotFoundDescription: "The page you're looking for doesn't exist",
    goHome: "Go Home",
    
    // Breadcrumbs
    breadcrumb_home: "Home",
    breadcrumb_brands: "Brands",
    breadcrumb_products: "Products",
    breadcrumb_search: "Search",
    breadcrumb_shipments: "Shipments",
    breadcrumb_inquiry: "Inquiry",
  },
  ne: {
    // Navigation
    home: "गृहपृष्ठ",
    products: "उत्पादनहरू",
    categories: "श्रेणीहरू",
    brands: "ब्राण्डहरू",
    about: "हाम्रो बारेमा",
    contact: "सम्पर्क",
    search: "उत्पादनहरू खोज्नुहोस्...",
    inquiryCart: "सोधपुछ कार्ट",
    language: "भाषा",
    theme: "थिम",
    admin: "प्रशासक",
    shipments: "ढुवानी",
    
    // Common
    loading: "लोड हुँदै...",
    error: "त्रुटि",
    success: "सफल",
    warning: "चेतावनी",
    info: "जानकारी",
    save: "सेभ गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    delete: "मेटाउनुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    add: "थप्नुहोस्",
    remove: "हटाउनुहोस्",
    view: "हेर्नुहोस्",
    filter: "फिल्टर",
    sort: "क्रमबद्ध",
    search_text: "खोज्नुहोस्",
    clear: "स्पष्ट",
    reset: "रिसेट",
    submit: "पेश गर्नुहोस्",
    back: "फिर्ता",
    next: "अगाडि",
    previous: "अघिल्लो",
    close: "बन्द गर्नुहोस्",
    open: "खोल्नुहोस्",
    showMore: "थप देखाउनुहोस्",
    showLess: "कम देखाउनुहोस्",
    quantity: "मात्रा",
    notes: "टिप्पणी",
    total: "कुल",
    
    // Product related
    product: "उत्पादन",
    products_title: "उत्पादनहरू",
    category: "श्रेणी",
    brand: "ब्राण्ड",
    price: "मूल्य",
    availability: "उपलब्धता",
    inStock: "स्टकमा छ",
    outOfStock: "स्टकमा छैन",
    lowStock: "कम स्टक",
    addToInquiry: "सोधपुछमा थप्नुहोस्",
    askQuestion: "प्रश्न सोध्नुहोस्",
    productDetails: "उत्पादन विवरण",
    specifications: "विशिष्टताहरू",
    description: "विवरण",
    relatedProducts: "सम्बन्धित उत्पादनहरू",
    productImages: "उत्पादन तस्बिरहरू",
    sku: "SKU",
    
    // Home page
    welcomeTitle: "जीन माता इम्पेक्समा स्वागत",
    welcomeSubtitle: "प्रिमियम हार्डवेयर र पावर टूल्सका लागि तपाईंको भरपर्दो साझेदार",
    featuredProducts: "फिचर्ड उत्पादनहरू",
    popularBrands: "लोकप्रिय ब्राण्डहरू",
    incomingShipments: "आउँदो ढुवानी",
    viewAllProducts: "सबै उत्पादनहरू हेर्नुहोस्",
    viewAllBrands: "सबै ब्राण्डहरू हेर्नुहोस्",
    viewAllShipments: "सबै ढुवानी हेर्नुहोस्",
    shopNow: "अहिले किन्नुहोस्",
    exploreProducts: "उत्पादनहरू अन्वेषण गर्नुहोस्",
    
    // Brands
    allBrands: "सबै ब्राण्डहरू",
    brandDetails: "ब्राण्ड विवरण",
    countryOfOrigin: "मूल देश",
    website: "वेबसाइट",
    productsFromBrand: "उत्पादनहरू",
    
    // Filters & Search
    filterBy: "फिल्टर गर्नुहोस्",
    sortBy: "क्रमबद्ध गर्नुहोस्",
    priceRange: "मूल्य दायरा",
    stockStatus: "स्टक स्थिति",
    sortByName: "नाम",
    sortByPrice: "मूल्य",
    sortByBrand: "ब्राण्ड",
    sortByNewest: "नयाँ",
    searchResults: "खोज परिणामहरू",
    noResults: "कुनै परिणाम फेला परेन",
    noResultsDescription: "तपाईंको खोज वा फिल्टर समायोजन गर्ने प्रयास गर्नुहोस्",
    
    // Inquiry
    inquiryCart_title: "सोधपुछ कार्ट",
    addToCart: "कार्टमा थप्नुहोस्",
    removeFromCart: "कार्टबाट हटाउनुहोस्",
    inquiryForm: "सोधपुछ फारम",
    customerDetails: "ग्राहक विवरण",
    fullName: "पूरा नाम",
    companyName: "कम्पनीको नाम",
    phone: "फोन नम्बर",
    email: "इमेल ठेगाना",
    city: "शहर",
    preferredContact: "मनपर्दो सम्पर्क विधि",
    message: "सन्देश",
    reviewInquiry: "सोधपुछ समीक्षा",
    submitInquiry: "सोधपुछ पेश गर्नुहोस्",
    inquirySuccess: "सोधपुछ सफलतापूर्वक पेश गरियो",
    inquiryReference: "सन्दर्भ ID",
    inquirySuccessMessage: "हामी चाँडै तपाईंलाई कोटेशन सहित सम्पर्क गर्नेछौं",
    
    // Shipments
    trackingNumber: "ट्र्याकिङ नम्बर",
    estimatedDelivery: "अनुमानित डेलिभरी",
    carrier: "वाहक",
    shipmentStatus: "स्थिति",
    shipmentDetails: "ढुवानी विवरण",
    manifest: "मेनिफेस्ट",
    timeline: "समयरेखा",
    booked: "बुक गरिएको",
    inTransit: "बाटोमा",
    customs: "भन्सार",
    warehouse: "गोदाम",
    available: "उपलब्ध",
    
    // Status
    preparing: "तयारी गर्दै",
    shipped: "पठाइएको",
    delivered: "डेलिभर गरिएको",
    pending: "पेन्डिङ",
    responded: "जवाफ दिइएको",
    closed: "बन्द",
    
    // Footer
    quickLinks: "द्रुत लिङ्कहरू",
    followUs: "हामीलाई फलो गर्नुहोस्",
    companyInfo: "कम्पनी जानकारी",
    allRightsReserved: "सबै अधिकार सुरक्षित",
    
    // Company
    companyName: "जीन माता इम्पेक्स",
    companyTagline: "तपाईंको भरपर्दो हार्डवेयर र पावर टूल्स साझेदार",
    
    // Error pages
    pageNotFound: "पृष्ठ फेला परेन",
    pageNotFoundDescription: "तपाईंले खोजिरहनु भएको पृष्ठ अवस्थित छैन",
    goHome: "गृहपृष्ठमा जानुहोस्",
    
    // Breadcrumbs
    breadcrumb_home: "गृहपृष्ठ",
    breadcrumb_brands: "ब्राण्डहरू",
    breadcrumb_products: "उत्पादनहरू",
    breadcrumb_search: "खोज",
    breadcrumb_shipments: "ढुवानी",
    breadcrumb_inquiry: "सोधपुछ",
  },
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  const formatCurrency = (amount: number): string => {
    if (language === "ne") {
      return `रु ${amount.toLocaleString("ne-NP")}`
    }
    return `NPR ${amount.toLocaleString("en-US")}`
  }

  const formatDate = (date: Date): string => {
    if (language === "ne") {
      return date.toLocaleDateString("ne-NP")
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatNumber = (number: number): string => {
    if (language === "ne") {
      return number.toLocaleString("ne-NP")
    }
    return number.toLocaleString("en-US")
  }

  return (
    <I18nContext.Provider value={{
      language,
      setLanguage,
      t,
      formatCurrency,
      formatDate,
      formatNumber,
    }}>
      <div className={language === "ne" ? "nepali-numbers" : ""}>
        {children}
      </div>
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}