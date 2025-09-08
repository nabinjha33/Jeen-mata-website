import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "./utils"

interface Step {
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                index < currentStep && "bg-primary border-primary text-primary-foreground",
                index === currentStep && "border-primary text-primary",
                index > currentStep && "border-muted-foreground/30 text-muted-foreground"
              )}>
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-small font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-small font-medium",
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className={cn(
                    "text-caption mt-1",
                    index <= currentStep ? "text-muted-foreground" : "text-muted-foreground/70"
                  )}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4 transition-colors duration-200",
                index < currentStep ? "bg-primary" : "bg-border"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}