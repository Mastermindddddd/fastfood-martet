"use client"
import React from "react"
import clsx from "clsx"

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx("rounded-lg border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={clsx("border-b border-gray-200 px-4 py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={clsx("text-lg font-semibold", className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={clsx("p-4", className)} {...props}>
      {children}
    </div>
  )
}
