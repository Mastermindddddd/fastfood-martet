"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../libs/utils"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"

// Variants for different alert types
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 flex items-start gap-3",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        success: "bg-green-50 text-green-800 border-green-200",
        destructive: "bg-red-50 text-red-800 border-red-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const icons = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle,
  warning: AlertCircle,
  info: Info,
}

const Alert = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  const Icon = icons[variant] || icons.default
  return (
    <div ref={ref} className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm leading-relaxed", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
