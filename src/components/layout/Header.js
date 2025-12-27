"use client"

import { CartContext } from "@/components/AppContext"
import Bars2 from "@/components/icons/Bars2"
import ShoppingCart from "@/components/icons/ShoppingCart"
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
        className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-full hover:shadow-lg transition-all duration-200"
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
          className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold"
        >
          Login
        </Link>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-full hover:shadow-lg transition-all duration-200 inline-block"
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

  return (
    <header className="relative px-4 sm:px-6 lg:px-8 py-4 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link className="flex items-center gap-3 group" href="/">
            <motion.div
              className="relative"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/kota-market2.png"
                alt="Kota-Market logo"
                width={60}
                height={60}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors">
                KOTA MARKET
              </span>
              <span className="text-xs text-orange-600 font-bold tracking-wider uppercase">
                SCREW THE DIET
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            {["Home", "Restaurents", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : item === "Restaurents" ? "/restaurents" : `/#${item.toLowerCase()}`}
                className="relative text-gray-700 hover:text-orange-600 font-bold transition-colors duration-200 group text-sm uppercase tracking-wide"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <AuthLinks status={status} />
          <Link href="/cart" className="relative group">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart />
            </motion.div>
            <AnimatePresence>
              {cartProducts?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs min-w-[24px] h-6 flex items-center justify-center rounded-full font-black shadow-lg px-1.5"
                >
                  {cartProducts.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden">
        <Link className="flex items-center gap-2 group" href="/">
          <motion.div
            className="w-10 h-10"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/kota-market2.png"
              alt="Kota-Market logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-gray-900 tracking-tight">KOTA MARKET</span>
            <span className="text-[9px] text-orange-600 font-bold tracking-wider uppercase">SCREW THE DIET</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ShoppingCart />
            </motion.div>
            <AnimatePresence>
              {cartProducts?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-black shadow-md"
                >
                  {cartProducts.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="mt-4 p-6 bg-gray-50 rounded-2xl flex flex-col gap-4 border-2 border-gray-200"
            >
              <nav className="flex flex-col gap-3">
                {["Home", "Restaurents", "About", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={item === "Home" ? "/" : item === "Restaurents" ? "/restaurents" : `/#${item.toLowerCase()}`}
                    onClick={() => setMobileNavOpen(false)}
                    className="text-gray-900 hover:text-orange-600 transition-colors duration-200 font-bold py-2 uppercase tracking-wide"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              <div className="h-px bg-gray-300 my-2" />
              <div className="flex flex-col gap-3">
                <AuthLinks status={status} />
              </div>
              {session?.user && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm mt-2 font-semibold text-center text-gray-600"
                >
                  Welcome,{" "}
                  <span className="text-orange-600 font-black">{userName}</span>
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
