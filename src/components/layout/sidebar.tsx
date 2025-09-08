"use client"

import { 
  Home, 
  Package, 
  Grid3X3, 
  Building2, 
  Users, 
  MessageSquare, 
  Truck, 
  BarChart3,
  Settings,
  X
} from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useI18n } from "../../providers/i18n-provider"
import { useAppStore } from "../../store/app-store"
import { cn } from "../ui/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useI18n()
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/admin",
    },
    {
      title: "Products",
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Categories", 
      icon: Grid3X3,
      href: "/admin/categories",
    },
    {
      title: "Brands",
      icon: Building2,
      href: "/admin/brands",
    },
    {
      title: "Inquiries",
      icon: MessageSquare,
      href: "/admin/inquiries",
    },
    {
      title: "Shipments",
      icon: Truck,
      href: "/admin/shipments",
    },
    {
      title: "Customers",
      icon: Users,
      href: "/admin/customers",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
  ]

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
        "fixed left-0 top-0 z-50 h-full w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <h2 className="font-semibold text-sidebar-foreground">{t('admin')}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-xl",
                "transition-colors duration-200"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          ))}
          
          <Separator className="my-4 bg-sidebar-border" />
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-xl"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>
    </>
  )
}