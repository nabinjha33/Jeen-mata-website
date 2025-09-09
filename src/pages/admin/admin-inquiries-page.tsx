"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { MoreHorizontal, Eye, MessageSquare, CheckCircle, XCircle, Clock, Phone, Mail, ExternalLink } from "lucide-react"
import { useAppStore } from "../../store/app-store"
import { useAdminStore } from "../../stores/admin-store"
import { DrawerForm } from "../../components/admin/drawer-form"
import { ConfirmDialog } from "../../components/admin/confirm-dialog"
import type { Inquiry } from "../../data/fixtures"

export function AdminInquiriesPage() {
  const { inquiries, getUserById, getProductById } = useAppStore()
  const { addInquiryNote, closeInquiry, updateInquiryStatus, isLoading } = useAdminStore()
  
  // State for filters and UI
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showInquiryDetails, setShowInquiryDetails] = useState<string | null>(null)
  const [showRespond, setShowRespond] = useState<string | null>(null)
  const [internalNote, setInternalNote] = useState("")
  const tableRef = useRef<HTMLDivElement>(null)
  
  // Filter inquiries by status
  const filteredInquiries = inquiries.filter(inquiry => {
    if (statusFilter === "all") return true
    return inquiry.status === statusFilter
  })
  
  const handleAddNote = (inquiryId: string) => {
    if (internalNote.trim()) {
      addInquiryNote(inquiryId, internalNote)
      setInternalNote("")
    }
  }
  
  const handleMarkClosed = (inquiryId: string) => {
    closeInquiry(inquiryId)
  }
  
  const generateWhatsAppMessage = (inquiry: Inquiry) => {
    const customer = getUserById(inquiry.customerId)
    const productsText = inquiry.products.map(p => {
      const product = getProductById(p.productId)
      return `• ${product?.name || 'Unknown Product'} (${p.quantity} units)`
    }).join('\n')
    
    return `Hello ${customer?.fullName}, thank you for your inquiry!\n\nYour requested items:\n${productsText}\n\nWe'll get back to you with details and pricing soon.\n\n- Jeen Mata Impex Team`
  }
  
  const generateEmailContent = (inquiry: Inquiry) => {
    const customer = getUserById(inquiry.customerId)
    const productsText = inquiry.products.map(p => {
      const product = getProductById(p.productId)
      return `${product?.name || 'Unknown Product'} - ${p.quantity} units`
    }).join(', ')
    
    return {
      subject: `Re: Your inquiry for ${productsText}`,
      body: `Hello ${customer?.fullName},\n\nThank you for your interest in our products. We have received your inquiry for:\n\n${productsText}\n\nOur team will review your requirements and get back to you with detailed information and pricing.\n\nBest regards,\nJeen Mata Impex Team`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "responded":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "responded":
        return <MessageSquare className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInquiryProductsText = (inquiry: any) => {
    const productNames = inquiry.products.map((p: any) => {
      const product = getProductById(p.productId)
      return product?.name || 'Unknown Product'
    }).slice(0, 2)
    
    const remaining = inquiry.products.length - 2
    if (remaining > 0) {
      return `${productNames.join(', ')} +${remaining} more`
    }
    return productNames.join(', ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
        <p className="text-muted-foreground">
          Manage customer inquiries and requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inquiries.filter(i => i.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inquiries.filter(i => i.status === 'responded').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inquiries.filter(i => i.status === 'closed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries Table with Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({inquiries.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({inquiries.filter(i => i.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="responded">Open ({inquiries.filter(i => i.status === 'responded').length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({inquiries.filter(i => i.status === 'closed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {statusFilter === "all" ? "All Inquiries" : 
                 statusFilter === "pending" ? "New Inquiries" :
                 statusFilter === "responded" ? "Open Inquiries" : "Closed Inquiries"}
              </CardTitle>
              <CardDescription>
                Customer product inquiries and requests for information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={tableRef} className="rounded-md border" style={{ minHeight: '480px' }}>
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry) => {
                      const customer = getUserById(inquiry.customerId)
                      const totalItems = inquiry.products.reduce((sum, p) => sum + p.quantity, 0)
                      
                      return (
                        <TableRow key={inquiry.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{customer?.fullName || 'Unknown Customer'}</div>
                              <div className="text-sm text-muted-foreground">
                                {customer?.email || '—'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <div className="text-sm truncate">
                                {getInquiryProductsText(inquiry)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(inquiry.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(inquiry.status)}
                                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowInquiryDetails(inquiry.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowRespond(inquiry.id)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Respond
                                </DropdownMenuItem>
                                {inquiry.status !== 'closed' && (
                                  <DropdownMenuItem onClick={() => handleMarkClosed(inquiry.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Closed
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {filteredInquiries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No inquiries found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}