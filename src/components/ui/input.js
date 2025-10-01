"use client"
import React from "react"
import clsx from "clsx"

export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none",
        className
      )}
      {...props}
    />
  )
}
