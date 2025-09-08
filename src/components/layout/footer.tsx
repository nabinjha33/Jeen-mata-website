"use client"

import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useI18n } from "../../providers/i18n-provider"

export function Footer() {
  const { t, language } = useI18n()

  const quickLinks = [
    { label: t('home'), href: '/' },
    { label: t('products'), href: '/products' },
    { label: t('categories'), href: '/categories' },
    { label: t('brands'), href: '/brands' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">JM</span>
              </div>
              <div>
                <h3 className="font-semibold">{t('companyName')}</h3>
              </div>
            </div>
            <p className="text-small text-muted-foreground">
              {t('companyTagline')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-small text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2 text-small text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+977-1-4567890</span>
              </div>
              <div className="flex items-center gap-2 text-small text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@jeenmataimPex.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('quickLinks')}</h3>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start px-0 h-auto text-small text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('categories')}</h3>
            <nav className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start px-0 h-auto text-small text-muted-foreground hover:text-foreground"
              >
                {language === 'ne' ? 'पावर टूल्स' : 'Power Tools'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start px-0 h-auto text-small text-muted-foreground hover:text-foreground"
              >
                {language === 'ne' ? 'ह्यान्ड टूल्स' : 'Hand Tools'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start px-0 h-auto text-small text-muted-foreground hover:text-foreground"
              >
                {language === 'ne' ? 'हार्डवेयर' : 'Hardware'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start px-0 h-auto text-small text-muted-foreground hover:text-foreground"
              >
                {language === 'ne' ? 'सुरक्षा उपकरण' : 'Safety Equipment'}
              </Button>
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('followUs')}</h3>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover-lift"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-small text-muted-foreground">
                Business Hours:
              </p>
              <p className="text-small text-muted-foreground">
                Sun - Fri: 9:00 AM - 6:00 PM
              </p>
              <p className="text-small text-muted-foreground">
                Saturday: 10:00 AM - 4:00 PM
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-small text-muted-foreground">
            © 2024 {t('companyName')}. {t('allRightsReserved')}.
          </p>
          <div className="flex space-x-4 text-small text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-auto p-0">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-0">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}