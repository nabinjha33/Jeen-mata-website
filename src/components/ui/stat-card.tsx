import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { cn } from "./utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    type: "positive" | "negative" | "neutral"
    label?: string
  }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const getTrendColor = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "text-success bg-success/10 border-success/20"
      case "negative":
        return "text-danger bg-danger/10 border-danger/20"
      case "neutral":
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getTrendIcon = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "↗"
      case "negative":
        return "↘"
      case "neutral":
        return "→"
    }
  }

  return (
    <Card className={cn("hover-lift transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-small font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-h3 font-semibold">{value}</div>
          
          {description && (
            <p className="text-small text-muted-foreground">
              {description}
            </p>
          )}
          
          {trend && (
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline"
                className={cn(
                  "text-caption px-2 py-0.5",
                  getTrendColor(trend.type)
                )}
              >
                <span className="mr-1">{getTrendIcon(trend.type)}</span>
                {Math.abs(trend.value)}%
              </Badge>
              {trend.label && (
                <span className="text-caption text-muted-foreground">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}