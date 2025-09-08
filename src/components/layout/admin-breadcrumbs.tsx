"use client"

import { useLocation, Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"

export function AdminBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  // Remove 'admin' from pathnames for cleaner breadcrumbs
  const adminPathnames = pathnames.slice(1)

  const getBreadcrumbTitle = (path: string) => {
    const titles: Record<string, string> = {
      'products': 'Products',
      'brands': 'Brands',
      'inquiries': 'Inquiries', 
      'shipments': 'Shipments',
      'users': 'Users',
      'analytics': 'Analytics',
      'settings': 'Settings',
    }
    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1)
  }

  if (location.pathname === '/admin') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {adminPathnames.map((pathname, index) => {
          const routeTo = `/admin/${adminPathnames.slice(0, index + 1).join('/')}`
          const isLast = index === adminPathnames.length - 1
          
          return (
            <div key={pathname} className="flex items-center gap-2">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{getBreadcrumbTitle(pathname)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo}>{getBreadcrumbTitle(pathname)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}