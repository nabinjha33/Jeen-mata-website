"use client"

import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard,
  Package,
  Building2,
  Truck,
  MessageSquare,
  Settings,
  Users,
  BarChart3,
  X
} from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useAppStore } from "../../store/app-store"
import { cn } from "../ui/utils"

export function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen, currentUser, checkPermission } = useAppStore()

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      permission: "dashboard",
    },
    {
      title: "Products",
      icon: Package,
      href: "/admin/products",
      permission: "products",
    },
    {
      title: "Brands",
      icon: Building2,
      href: "/admin/brands",
      permission: "brands",
    },
    {
      title: "Inquiries",
      icon: MessageSquare,
      href: "/admin/inquiries",
      permission: "inquiries",
    },
    {
      title: "Shipments",
      icon: Truck,
      href: "/admin/shipments",
      permission: "shipments",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
      permission: "users",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      permission: "analytics",
    },
  ]

  const filteredNavigationItems = navigationItems.filter(item => 
    currentUser?.role === 'owner' || checkPermission(item.permission)
  )

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto lg:top-0 lg:h-[calc(100vh-4rem)]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Admin Panel</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </nav>

          <Separator />

          {/* Settings */}
          <div className="p-4">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          </div>

          {/* User info */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">
                  {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{currentUser?.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}