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
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
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
          className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium"
        >
          Login
        </Link>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/register"
            className="bg-foreground text-background px-6 py-2.5 rounded-full font-medium hover:bg-foreground/90 transition-all duration-200 shadow-sm inline-block"
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
    <header className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden">
        <Link className="flex items-center gap-2 group" href="/">
          <motion.div
            className="w-10 h-10"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/fryer.png"
              alt="FastBite logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-foreground tracking-tight">FastBite</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Express</span>
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
                  className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md"
                >
                  {cartProducts.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
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
              className="mt-4 p-6 bg-muted/30 backdrop-blur-sm rounded-2xl flex flex-col gap-4 border border-border/50"
            >
              <nav className="flex flex-col gap-3">
                {["Home", "Restaurents", "About", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={item === "Home" ? "/" : item === "Restaurents" ? "/restaurents" : `/#${item.toLowerCase()}`}
                    onClick={() => setMobileNavOpen(false)}
                    className="text-foreground hover:text-foreground/70 transition-colors duration-200 font-medium py-2"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              <div className="h-px bg-border/50 my-2" />
              <div className="flex flex-col gap-3">
                <AuthLinks status={status} />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm mt-2 font-medium text-center text-muted-foreground"
              >
                Welcome,{" "}
                <span className="text-orange-500 font-semibold">{userName}</span>
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link className="flex items-center gap-3 group" href="/">
            <motion.div
              className="w-12 h-12"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/fryer.png"
                alt="Kota-Market logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-foreground tracking-tight">Kota-Market</span>
              <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase text-gray-700">
                Express Delivery
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            {["Home", "Restaurents", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : item === "Restaurents" ? "/restaurents" : `/#${item.toLowerCase()}`}
                className="relative text-foreground/70 hover:text-foreground font-medium transition-colors duration-200 group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {/*{session?.user && (
            <p className="text-muted-foreground font-medium">
              Welcome, <span className="text-foreground">{userName}</span>
            </p>
          )}*/}
          <AuthLinks status={status} />
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
                  className="absolute -top-2 -right-3 bg-accent text-accent-foreground text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold shadow-md px-1.5"
                >
                  {cartProducts.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </header>
  )
}
