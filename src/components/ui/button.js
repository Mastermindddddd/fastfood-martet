"use client"
import React from "react"
import clsx from "clsx"

export function Button({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
