"use client"

import React from "react"
import clsx from "clsx"

/**
 * Badge component
 * Props:
 * - children: content inside the badge
 * - variant: "default" | "success" | "error" | "warning" | "info"
 * - className: additional class names
 */
export function Badge({ children, variant = "default", className }) {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"

  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
  }

  return (
    <span className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  )
}
