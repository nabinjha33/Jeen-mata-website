"use client"

import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "./navbar"
import { AdminSidebar } from "./admin-sidebar"
import { AdminBreadcrumbs } from "./admin-breadcrumbs"
import { useAppStore } from "../../store/app-store"
import { cn } from "../ui/utils"

export function AdminLayout() {
  const { currentUser, sidebarOpen } = useAppStore()
  const location = useLocation()

  // Check if user has admin access
  if (!currentUser || !['owner', 'manager', 'content_editor'].includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin area.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-200",
          "lg:ml-64" // Always account for sidebar width on large screens
        )}>
          <div className="flex-1 p-6">
            <AdminBreadcrumbs />
            <div className="mt-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}