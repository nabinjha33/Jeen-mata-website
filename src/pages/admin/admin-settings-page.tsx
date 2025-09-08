"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { Settings, Users, Globe, Store, Save } from "lucide-react"
import { useAppStore } from "../../store/app-store"

export function AdminSettingsPage() {
  const { adminSettings, users } = useAppStore()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "content_editor":
        return "bg-green-100 text-green-800"
      case "customer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "content_editor":
        return "Content Editor"
      default:
        return role.charAt(0).toUpperCase() + role.slice(1)
    }
  }

  // Filter admin users
  const adminUsers = users.filter(user => 
    ['owner', 'manager', 'content_editor'].includes(user.role)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and configurations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Catalog Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Catalog Settings
            </CardTitle>
            <CardDescription>
              Configure how your catalog appears to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Price Visibility</Label>
                <div className="text-sm text-muted-foreground">
                  Show prices to all visitors on the storefront
                </div>
              </div>
              <Switch defaultChecked={adminSettings.catalog.priceVisibility} />
            </div>
            
            <Separator />
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lowStock">Low Stock Threshold</Label>
                <Input 
                  id="lowStock"
                  type="number" 
                  defaultValue={adminSettings.catalog.lowStockThreshold}
                  placeholder="10"
                />
                <div className="text-sm text-muted-foreground">
                  Alert when stock falls below this number
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="outOfStock">Out of Stock Threshold</Label>
                <Input 
                  id="outOfStock"
                  type="number" 
                  defaultValue={adminSettings.catalog.outOfStockThreshold}
                  placeholder="0"
                />
                <div className="text-sm text-muted-foreground">
                  Mark as out of stock when below this number
                </div>
              </div>
            </div>
            
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Catalog Settings
            </Button>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization
            </CardTitle>
            <CardDescription>
              Manage languages and regional settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <div className="text-sm">
                  <Badge variant="outline">
                    {adminSettings.localization.defaultLanguage.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Enabled Languages</Label>
                <div className="flex gap-2">
                  {adminSettings.localization.enabledLanguages.map(lang => (
                    <Badge key={lang} variant="outline">
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">UI Text Translations</Label>
              <div className="text-sm text-muted-foreground mb-3">
                Manage text displayed throughout the application
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label className="text-sm font-medium">English (EN)</Label>
                  <div className="grid gap-2 pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Company Name" 
                        defaultValue={adminSettings.localization.uiCopy.en.companyName}
                      />
                      <Input 
                        placeholder="Company Tagline"
                        defaultValue={adminSettings.localization.uiCopy.en.companyTagline}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Label className="text-sm font-medium">Nepali (NE)</Label>
                  <div className="grid gap-2 pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="कम्पनीको नाम" 
                        defaultValue={adminSettings.localization.uiCopy.ne.companyName}
                      />
                      <Input 
                        placeholder="कम्पनी ट्यागलाइन"
                        defaultValue={adminSettings.localization.uiCopy.ne.companyTagline}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Localization Settings
            </Button>
          </CardContent>
        </Card>

        {/* Users & Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users & Roles
            </CardTitle>
            <CardDescription>
              Manage admin users and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-foreground">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleText(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.role === 'owner' ? (
                            <Badge variant="outline" className="text-xs">All</Badge>
                          ) : (
                            user.permissions?.map(permission => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.phone}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}