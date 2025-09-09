"use client"

import { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

interface DrawerFormProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  submitText?: string
}

export function DrawerForm({ 
  open, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  isLoading = false,
  submitText = "Save"
}: DrawerFormProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {children}
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                  aria-label={isLoading ? "Saving..." : submitText}
                >
                  {isLoading ? "Saving..." : submitText}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}