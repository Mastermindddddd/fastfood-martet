"use client"

import { SessionProvider } from "next-auth/react"
import { AppProvider } from "@/components/AppContext"

export function Providers({ children }) {
  return (
    <SessionProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </SessionProvider>
  )
}