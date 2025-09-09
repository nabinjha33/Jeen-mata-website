"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, ShoppingCart, Sun, Moon, Menu, Globe, User, Home } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu"
import { useTheme } from "../../providers/theme-provider"
import { useI18n } from "../../providers/i18n-provider"
import { useAppStore } from "../../store/app-store"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    searchQuery, 
    setSearchQuery, 
    inquiryCart, 
    getInquiryCartTotal, 
    setSidebarOpen,
    currentUser
  } = useAppStore()
  
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  const cartTotal = getInquiryCartTotal()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery)
      navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {currentUser?.role === "admin" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">JM</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg">{t('companyName')}</h1>
                <p className="text-xs text-muted-foreground">{t('companyTagline')}</p>
              </div>
            </Link>
          </div>

          {/* Search Bar - Only show on non-home pages */}
          {location.pathname !== '/' && (
            <div className="flex-1 max-w-md mx-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </form>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className={location.pathname === '/' ? 'bg-accent' : ''}>
                  <Home className="h-4 w-4 mr-2" />
                  {t('home')}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/brands" className={location.pathname.startsWith('/brands') ? 'bg-accent' : ''}>
                  {t('brands')}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/shipments" className={location.pathname.startsWith('/shipments') ? 'bg-accent' : ''}>
                  {t('shipments')}
                </Link>
              </Button>
            </nav>

            {/* Inquiry Cart */}
            <Button variant="ghost" size="icon" className="relative hover-lift" asChild>
              <Link to="/inquiry">
                <ShoppingCart className="h-5 w-5" />
                {cartTotal > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartTotal}
                  </Badge>
                )}
                <span className="sr-only">{t('inquiryCart')}</span>
              </Link>
            </Button>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">{t('language')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  <span className={language === 'en' ? 'font-medium' : ''}>
                    English (EN)
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ne')}>
                  <span className={language === 'ne' ? 'font-medium' : ''}>
                    नेपाली (ने)
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">{t('theme')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover-lift">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem disabled>
                    {currentUser.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    {currentUser.role === 'admin' ? t('admin') : 'Customer'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}