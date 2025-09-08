"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { 
  Package, 
  MessageSquare, 
  Truck, 
  AlertTriangle,
  TrendingUp,
  Users,
  Eye,
  Activity
} from "lucide-react"
import { useAppStore } from "../../store/app-store"

export function AdminDashboardPage() {
  const { getAdminKPIs, adminActivity, getUserById } = useAppStore()
  const kpis = getAdminKPIs()

  const recentActivities = adminActivity.slice(0, 5)

  const kpiCards = [
    {
      title: "Total Products",
      value: kpis.totalProducts,
      icon: Package,
      description: "Active products in catalog",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Inquiries This Week",
      value: kpis.inquiriesThisWeek,
      icon: MessageSquare,
      description: "New customer inquiries",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Shipments in Transit",
      value: kpis.shipmentsInTransit,
      icon: Truck,
      description: "Currently shipping",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Low Stock Items",
      value: kpis.lowStockCount,
      icon: AlertTriangle,
      description: "Items need restocking",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created': return <Package className="h-4 w-4 text-green-600" />
      case 'updated': return <Eye className="h-4 w-4 text-blue-600" />
      case 'responded': return <MessageSquare className="h-4 w-4 text-orange-600" />
      case 'shipped': return <Truck className="h-4 w-4 text-purple-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`${kpi.bgColor} p-2 rounded-md`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest actions performed by your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const user = getUserById(activity.userId)
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {activity.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}
              {recentActivities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              View Pending Inquiries
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Track Shipments
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}