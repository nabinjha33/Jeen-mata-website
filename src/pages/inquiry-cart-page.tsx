import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, Package, Boxes } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Separator } from "../components/ui/separator"
import { EmptyState } from "../components/ui/empty-state"
import { BreadcrumbNavigation } from "../components/ui/breadcrumb-navigation"
import { useI18n } from "../providers/i18n-provider"
import { useAppStore } from "../store/app-store"
import { ImageWithFallback } from "../components/figma/ImageWithFallback"
import { toast } from "sonner@2.0.3"

export function InquiryCartPage() {
  const { t, formatCurrency } = useI18n()
  const navigate = useNavigate()
  const { 
    inquiryCart, 
    products, 
    getProductById,
    getProductVariantById,
    getPackingOptionById,
    calculateTotalPieces,
    updateInquiryCartItem, 
    removeFromInquiryCart,
    clearInquiryCart
  } = useAppStore()

  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    whatsapp: '',
    city: '',
    preferredContact: 'email' as 'phone' | 'email',
    message: ''
  })
  
  const [overallNotes, setOverallNotes] = useState('')
  
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get cart items with product details, variants, and packing
  const cartItems = inquiryCart.map(item => {
    const product = getProductById(item.productId)
    const variant = item.variantId ? getProductVariantById(item.productId, item.variantId) : null
    const packingOption = item.packingOptionId && item.variantId 
      ? getPackingOptionById(item.productId, item.variantId, item.packingOptionId) 
      : null
    
    const totalPieces = item.totalPieces || item.quantity
    
    return {
      ...item,
      product: product!,
      variant,
      packingOption,
      totalPieces
    }
  }).filter(item => item.product)

  // Calculate totals
  const totalItems = inquiryCart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPieces = cartItems.reduce((sum, item) => sum + item.totalPieces, 0)
  const totalValue = cartItems.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price
    return sum + (price * item.quantity)
  }, 0)

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromInquiryCart(productId)
    } else {
      updateInquiryCartItem(productId, { quantity: newQuantity })
    }
  }

  const updateNotes = (productId: string, notes: string) => {
    updateInquiryCartItem(productId, { notes: notes || undefined })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!customerDetails.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    }
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    // WhatsApp validation (optional but recommended)
    if (customerDetails.whatsapp && customerDetails.whatsapp.trim()) {
      const whatsappClean = customerDetails.whatsapp.replace(/[\s\-\(\)]/g, '')
      if (!/^\+?\d{8,15}$/.test(whatsappClean)) {
        newErrors.whatsapp = 'Please enter a valid WhatsApp number with country code'
      }
    }

    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!customerDetails.city.trim()) {
      newErrors.city = 'City is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitInquiry = () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    // In a real app, this would submit to the backend
    const inquiryId = `INQ-${Date.now()}`
    
    // Clear cart and navigate to success page
    clearInquiryCart()
    navigate('/inquiry/success', { 
      state: { 
        inquiryId,
        customerName: customerDetails.fullName
      }
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="space-y-8 p-6">
        <BreadcrumbNavigation />
        
        <EmptyState
          icon={ShoppingCart}
          title="Your inquiry cart is empty"
          description="Add products to your inquiry cart to get quotes"
          action={
            <Button asChild>
              <Link to="/search">{t('exploreProducts')}</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <BreadcrumbNavigation />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold">{t('inquiryCart_title')}</h1>
          <p className="text-muted-foreground">
            {totalItems} item{totalItems !== 1 ? 's' : ''} • {totalPieces} pieces total
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => clearInquiryCart()}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={() => {
            setShowInquiryForm(true)
            // Scroll to inquiry form after a short delay
            setTimeout(() => {
              document.getElementById('inquiry-form')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }, 100)
          }}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('submitInquiry')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <div className="space-y-1">
                          <p className="text-small text-muted-foreground">
                            {item.product.brand} • SKU: {item.variant?.sku || item.product.sku}
                          </p>
                          
                          {/* Variant Information */}
                          {item.variant && (
                            <div className="flex items-center gap-2">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              <span className="text-small text-muted-foreground">
                                Size: {item.variant.size}
                              </span>
                            </div>
                          )}
                          
                          {/* Packing Information */}
                          {item.packingOption && (
                            <div className="flex items-center gap-2">
                              <Boxes className="h-3 w-3 text-muted-foreground" />
                              <span className="text-small text-muted-foreground">
                                {item.packingOption.label} ({item.packingOption.unitsPerPack} pcs)
                              </span>
                            </div>
                          )}
                          
                          <p className="text-small text-primary font-semibold">
                            {formatCurrency(item.variant?.price || item.product.price)} each
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromInquiryCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-20 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency((item.variant?.price || item.product.price) * item.quantity)}
                        </div>
                        {item.totalPieces > item.quantity && (
                          <div className="text-small text-muted-foreground">
                            {item.totalPieces} pieces total
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`notes-${item.productId}`} className="text-small">
                        {t('notes')} (optional)
                      </Label>
                      <Textarea
                        id={`notes-${item.productId}`}
                        placeholder="Any specific requirements..."
                        value={item.notes || ''}
                        onChange={(e) => updateNotes(item.productId, e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Overall Notes Section */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Overall Notes</h3>
                <div className="space-y-2">
                  <label className="text-small text-muted-foreground">
                    Add any general requirements, delivery preferences, or special instructions
                  </label>
                  <Textarea
                    placeholder="e.g., Urgent delivery required, specific packaging needs, bulk discount inquiry..."
                    value={overallNotes}
                    onChange={(e) => setOverallNotes(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t('total')} Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pieces:</span>
                <span className="font-medium">{totalPieces}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Value:</span>
                <span className="font-semibold">{formatCurrency(totalValue)}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-small text-muted-foreground">
                  Final prices will be provided in our quote response.
                </p>
                {totalPieces > totalItems && (
                  <p className="text-small text-muted-foreground">
                    * Total pieces include packing calculations
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Removed duplicate submit inquiry button */}
        </div>
      </div>

      {/* Inquiry Form */}
      {showInquiryForm && (
        <Card id="inquiry-form">
          <CardHeader>
            <CardTitle>{t('inquiryForm')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('fullName')} *</Label>
                <Input
                  id="fullName"
                  value={customerDetails.fullName}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
                  error={errors.fullName}
                />
                {errors.fullName && (
                  <p className="text-small text-danger">{errors.fullName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">{t('companyName')}</Label>
                <Input
                  id="companyName"
                  value={customerDetails.companyName}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                  error={errors.phone}
                />
                {errors.phone && (
                  <p className="text-small text-danger">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (recommended)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  value={customerDetails.whatsapp || ''}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, whatsapp: e.target.value }))}
                  error={errors.whatsapp}
                />
                {errors.whatsapp && (
                  <p className="text-small text-danger">{errors.whatsapp}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  We'll use this to send a confirmation on WhatsApp. Include country code (+977 for Nepal).
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                  error={errors.email}
                />
                {errors.email && (
                  <p className="text-small text-danger">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')} *</Label>
                <Input
                  id="city"
                  value={customerDetails.city}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, city: e.target.value }))}
                  error={errors.city}
                />
                {errors.city && (
                  <p className="text-small text-danger">{errors.city}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>{t('preferredContact')}</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={customerDetails.preferredContact === 'email'}
                      onChange={() => setCustomerDetails(prev => ({ ...prev, preferredContact: 'email' }))}
                    />
                    <span className="text-small">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={customerDetails.preferredContact === 'phone'}
                      onChange={() => setCustomerDetails(prev => ({ ...prev, preferredContact: 'phone' }))}
                    />
                    <span className="text-small">Phone</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">{t('message')}</Label>
              <Textarea
                id="message"
                placeholder="Additional requirements, delivery preferences, etc..."
                value={customerDetails.message}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
              {overallNotes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-small font-medium text-muted-foreground mb-2">Overall Notes:</p>
                  <p className="text-small">{overallNotes}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowInquiryForm(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSubmitInquiry} className="flex-1">
                {t('submitInquiry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}