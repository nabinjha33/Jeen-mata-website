import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "./button"
import { cn } from "./utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode | {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 min-h-[200px]",
      className
    )}>
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      <h3 className="text-h4 font-semibold mb-2">{title}</h3>
      
      {description && (
        <p className="text-body text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-2">
          {React.isValidElement(action) ? action : (
            <Button onClick={(action as any).onClick} className="rounded-xl">
              {(action as any).label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}