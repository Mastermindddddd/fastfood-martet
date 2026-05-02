"use client"

import { CartContext } from "@/components/AppContext"
import ShoppingCart from "@/components/icons/ShoppingCart"
import Bars2 from "@/components/icons/Bars2"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

function AuthLinks({ status }) {
  if (status === "authenticated") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
      >
        Logout
      </motion.button>
    )
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Link
          href="/login"
          className="px-5 py-2.5 text-sm font-medium border border-orange-500/40 rounded-full hover:border-orange-500/70 bg-yellow-300 hover:bg-orange-400 text-white transition-all duration-200"
        >
          Sign In
        </Link>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 inline-block"
          >
            Register
          </Link>
        </motion.div>
      </>
    )
  }

  return null
}

export default function Header() {
  const { data: session, status } = useSession()
  const userName = session?.user?.name || "Guest"
  const { cartProducts } = useContext(CartContext)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Restaurants", href: "/restaurents" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ]

  return (
    <header className="fixed top-0 w-full bg-white backdrop-blur-2xl border-b border-orange-500/20 z-50">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
            <Image src="/kota-market2.png" alt="Kota Market" width={42} height={42} priority />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-yellow-400 via-orange-200 to-orange-500 bg-clip-text text-transparent">
              KOTA MARKET
            </span>
            <span className="text-[10px] text-orange-500/80 font-bold tracking-widest uppercase">
              Screw the Diet
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-10 text-sm font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <AuthLinks status={status} />
          <Link href="/cart" className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart />
            </motion.div>
            <AnimatePresence>
              {cartProducts?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-black shadow-lg px-1"
                >
                  {cartProducts.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/kota-market2.png" alt="Kota Market" width={36} height={36} priority />
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tighter bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
              KOTA MARKET
            </span>
            <span className="text-[8px] text-orange-500/80 font-bold tracking-widest uppercase">Screw the Diet</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative text-gray-300">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ShoppingCart />
            </motion.div>
            <AnimatePresence>
              {cartProducts?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-black"
                >
                  {cartProducts.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 border border-orange-500/30 rounded-lg text-gray-300 hover:bg-orange-500/10 transition-colors"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <Bars2 />
          </motion.button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-orange-500/20"
          >
            <div className="px-4 py-6 bg-gray-950/95 flex flex-col gap-4">
              <nav className="flex flex-col gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="text-gray-300 hover:text-white hover:bg-white/5 transition-all px-3 py-2.5 rounded-lg font-medium text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="h-px bg-orange-500/20 my-1" />
              <div className="flex flex-col gap-3">
                <AuthLinks status={status} />
              </div>
              {session?.user && (
                <p className="text-xs text-center text-gray-500 mt-1">
                  Welcome, <span className="text-orange-400 font-semibold">{userName}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}