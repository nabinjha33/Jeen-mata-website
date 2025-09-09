"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useShipmentsStore } from "../../stores/shipments-store"
import { cn } from "../../lib/utils"

interface VariantSelectProps {
  productId?: string
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function VariantSelect({ productId, value, onValueChange, placeholder = "Select variant...", className }: VariantSelectProps) {
  const [open, setOpen] = useState(false)
  const { productsLite } = useShipmentsStore()

  const product = productsLite.find(p => p.id === productId)
  const variants = product?.variants || []
  const selectedVariant = variants.find(variant => variant.id === value)

  if (!productId || variants.length === 0) {
    return (
      <Button variant="outline" disabled className={cn("justify-between", className)}>
        {!productId ? "Select product first" : "No variants available"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedVariant ? selectedVariant.sizeLabel : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No variants found.</CommandEmpty>
            <CommandGroup>
              {variants.map((variant) => (
                <CommandItem
                  key={variant.id}
                  value={variant.id}
                  onSelect={(currentValue: string) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === variant.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {variant.sizeLabel}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}