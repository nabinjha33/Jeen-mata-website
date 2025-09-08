import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "./utils"

interface TimelineItem {
  title: string
  description?: string
  time: string
  icon?: LucideIcon
  status?: "completed" | "current" | "upcoming"
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
              item.status === "completed" && "bg-success border-success text-success-foreground",
              item.status === "current" && "bg-primary border-primary text-primary-foreground",
              item.status === "upcoming" && "bg-muted border-muted-foreground/20 text-muted-foreground"
            )}>
              {item.icon ? (
                <item.icon className="h-4 w-4" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>
            {index < items.length - 1 && (
              <div className={cn(
                "w-0.5 h-8 mt-2 transition-colors",
                item.status === "completed" ? "bg-success/30" : "bg-border"
              )} />
            )}
          </div>
          
          <div className="flex-1 pb-8">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{item.title}</h4>
              <span className="text-small text-muted-foreground">{item.time}</span>
            </div>
            {item.description && (
              <p className="text-small text-muted-foreground">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}