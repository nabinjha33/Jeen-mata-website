"use client"

import { Outlet } from "react-router-dom"
import { Navbar } from "./navbar"
import { Footer } from "./footer" 
import { Sidebar } from "./sidebar"
import { useAppStore } from "../../store/app-store"
import { cn } from "../ui/utils"

interface MainLayoutProps {
  children?: React.ReactNode
  showSidebar?: boolean
}

export function MainLayout({ children, showSidebar = false }: MainLayoutProps) {
  const { currentUser } = useAppStore()
  const shouldShowSidebar = showSidebar && currentUser?.role === "admin"

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {shouldShowSidebar && <Sidebar className="hidden lg:block" />}
        <Sidebar className="lg:hidden" />
        
        <main className={cn(
          "flex-1 flex flex-col",
          shouldShowSidebar ? "lg:ml-0" : ""
        )}>
          <div className="flex-1">
            {/* Use Outlet for router content or children for standalone usage */}
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}