"use client"

import { useState } from "react"
import { Package, Users, TrendingUp, ShoppingCart, Calendar, Upload, Image, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Skeleton } from "../ui/skeleton"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { StatCard } from "../ui/stat-card"
import { EmptyState } from "../ui/empty-state"
import { Timeline } from "../ui/timeline"
import { FileUpload } from "../ui/file-upload"
import { ImageGallery } from "../ui/image-gallery"
import { Stepper } from "../ui/stepper"
import { toast } from "sonner@2.0.3"
import { useI18n } from "../../providers/i18n-provider"

export function ComponentsShowcase() {
  const [switchValue, setSwitchValue] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState("option1")
  const [currentStep, setCurrentStep] = useState(1)
  const { t } = useI18n()

  const sampleImages = [
    { src: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHRvb2xzJTIwd29ya3Nob3B8ZW58MXx8fHwxNzU3MjIxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Power Tools Workshop", caption: "Power Tools Collection" },
    { src: "https://images.unsplash.com/photo-1721250527686-9b31f11bfe3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwdG9vbHMlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU3MjUwOTU3fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Hand Tools Construction", caption: "Hand Tools Selection" },
    { src: "https://images.unsplash.com/photo-1704732061018-3ac738176c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkd2FyZSUyMHNjcmV3cyUyMGJvbHRzfGVufDF8fHx8MTc1NzI1MDk2MXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Hardware Components", caption: "Hardware Assortment" },
  ]

  const timelineItems = [
    {
      title: "Order Placed",
      description: "Your inquiry has been received",
      time: "2 hours ago",
      status: "completed" as const,
      icon: CheckCircle,
    },
    {
      title: "Processing",
      description: "We're preparing your quotation",
      time: "1 hour ago", 
      status: "current" as const,
      icon: Package,
    },
    {
      title: "Quote Ready",
      description: "Quotation will be sent to your email",
      time: "Soon",
      status: "upcoming" as const,
      icon: TrendingUp,
    },
  ]

  const steps = [
    { title: "Product Selection", description: "Choose your products" },
    { title: "Inquiry Details", description: "Add specifications" },
    { title: "Contact Information", description: "Provide details" },
    { title: "Review & Submit", description: "Confirm your request" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-display">Components Showcase</h1>
        <p className="text-lead text-muted-foreground max-w-3xl mx-auto">
          Explore the comprehensive component library for Jeen Mata Impex, featuring modern design patterns 
          with Nepali-modern aesthetics and full internationalization support.
        </p>
      </div>

      {/* Stats Section */}
      <section className="space-y-4">
        <h2 className="text-h2">Statistics & KPI Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value="1,247"
            description="Active inventory"
            icon={Package}
            trend={{ value: 12.5, type: "positive", label: "from last month" }}
          />
          <StatCard
            title="Active Customers"
            value="324"
            description="Registered users"
            icon={Users}
            trend={{ value: 8.2, type: "positive", label: "this quarter" }}
          />
          <StatCard
            title="Monthly Revenue"
            value="रु 8,45,000"
            description="This month's sales"
            icon={TrendingUp}
            trend={{ value: -2.1, type: "negative", label: "vs last month" }}
          />
          <StatCard
            title="Pending Inquiries"
            value="42"
            description="Awaiting response"
            icon={ShoppingCart}
            trend={{ value: 0, type: "neutral" }}
          />
        </div>
      </section>

      {/* Form Components */}
      <section className="space-y-6">
        <h2 className="text-h2">Form Components</h2>
        <Card>
          <CardHeader>
            <CardTitle>Interactive Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Text Input</Label>
                  <Input placeholder="Enter product name..." className="rounded-xl" />
                </div>
                
                <div>
                  <Label>Select Dropdown</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="power-tools">Power Tools</SelectItem>
                      <SelectItem value="hand-tools">Hand Tools</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Textarea</Label>
                  <Textarea 
                    placeholder="Enter product description..." 
                    className="rounded-xl"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={switchValue}
                    onCheckedChange={setSwitchValue}
                    id="switch-demo"
                  />
                  <Label htmlFor="switch-demo">Enable notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked as boolean)}
                    id="checkbox-demo"
                  />
                  <Label htmlFor="checkbox-demo">I agree to terms and conditions</Label>
                </div>

                <div>
                  <Label>Radio Group</Label>
                  <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="r1" />
                      <Label htmlFor="r1">Express Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="r2" />
                      <Label htmlFor="r2">Standard Delivery</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Buttons and Badges */}
      <section className="space-y-4">
        <h2 className="text-h2">Buttons & Badges</h2>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-h4 mb-3">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-h4 mb-3">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Package className="h-4 w-4" /></Button>
              </div>
            </div>

            <div>
              <h3 className="text-h4 mb-3">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-success text-success-foreground">Success</Badge>
                <Badge className="bg-warning text-warning-foreground">Warning</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alerts */}
      <section className="space-y-4">
        <h2 className="text-h2">Alerts & Notifications</h2>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert with helpful context.
            </AlertDescription>
          </Alert>

          <Alert className="border-success text-success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your inquiry has been submitted successfully!
            </AlertDescription>
          </Alert>

          <Alert className="border-warning text-warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Some products in your cart have limited stock.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => toast.success("Success toast notification")}
            >
              Show Success Toast
            </Button>
            <Button 
              variant="outline" 
              onClick={() => toast.error("Error toast notification")}
            >
              Show Error Toast
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Components */}
      <section className="space-y-4">
        <h2 className="text-h2">Interactive Components</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tabs Component</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="specs">Specs</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <p className="text-small text-muted-foreground">
                    Product overview and general information.
                  </p>
                </TabsContent>
                <TabsContent value="specs" className="mt-4">
                  <p className="text-small text-muted-foreground">
                    Detailed specifications and technical data.
                  </p>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  <p className="text-small text-muted-foreground">
                    Customer reviews and ratings.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accordion</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    We offer express and standard delivery options throughout Nepal.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Return Policy</AccordionTrigger>
                  <AccordionContent>
                    30-day return policy for defective or damaged products.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Warranty</AccordionTrigger>
                  <AccordionContent>
                    All power tools come with manufacturer warranty.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modals */}
      <section className="space-y-4">
        <h2 className="text-h2">Modals & Sheets</h2>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
                <DialogDescription>
                  View detailed information about this product.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-small">
                  This is a modal dialog showcasing product information
                  with the brand's rounded-2xl design language.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent className="rounded-l-2xl">
              <SheetHeader>
                <SheetTitle>Inquiry Cart</SheetTitle>
                <SheetDescription>
                  Review your selected products before submitting inquiry.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <p className="text-small">
                  Sheet component for slide-out panels and side navigation.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      {/* Advanced Components */}
      <section className="space-y-6">
        <h2 className="text-h2">Advanced Components</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept=".jpg,.png,.pdf"
                multiple
                onFilesChange={(files) => console.log('Files:', files)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Stepper</CardTitle>
            </CardHeader>
            <CardContent>
              <Stepper steps={steps} currentStep={currentStep} />
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Timeline Component</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGallery images={sampleImages} />
          </CardContent>
        </Card>
      </section>

      {/* Table */}
      <section className="space-y-4">
        <h2 className="text-h2">Data Tables</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Bosch GSB 550 Drill</TableCell>
                  <TableCell>Bosch</TableCell>
                  <TableCell>Power Tools</TableCell>
                  <TableCell className="text-right">रु 8,500</TableCell>
                  <TableCell>
                    <Badge className="bg-success text-success-foreground">In Stock</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Stanley Measuring Tape</TableCell>
                  <TableCell>Stanley</TableCell>
                  <TableCell>Hand Tools</TableCell>
                  <TableCell className="text-right">रु 450</TableCell>
                  <TableCell>
                    <Badge className="bg-success text-success-foreground">In Stock</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">DeWalt Safety Helmet</TableCell>
                  <TableCell>DeWalt</TableCell>
                  <TableCell>Safety Equipment</TableCell>
                  <TableCell className="text-right">रु 1,200</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Out of Stock</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Empty States */}
      <section className="space-y-4">
        <h2 className="text-h2">Empty States</h2>
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your search criteria or check back later for new products."
          action={{
            label: "Browse Categories",
            onClick: () => toast.info("Navigate to categories")
          }}
        />
      </section>

      {/* Skeletons */}
      <section className="space-y-4">
        <h2 className="text-h2">Loading States</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}