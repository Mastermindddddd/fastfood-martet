'use client';

import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AuthLinks({ status }) {
if (status === "authenticated") {
return (
<button
onClick={() => signOut({ callbackUrl: "/" })}
className="bg-primary rounded-full text-white px-6 py-2 hover:bg-primary/80 transition"
>
Logout </button>
);
}
if (status === "unauthenticated") {
return (
<> <Link
       href="/login"
       className="text-gray-700 hover:text-primary transition"
     >
Login </Link> <Link
       href="/register"
       className="bg-primary rounded-full text-white px-6 py-2 hover:bg-primary/80 transition"
     >
Register </Link>
</>
);
}
return null;
}

export default function Header() {
const { data: session, status } = useSession();
const userName = session?.user?.name || "Guest";
const { cartProducts } = useContext(CartContext);
const [mobileNavOpen, setMobileNavOpen] = useState(false);

return ( <header className="px-4 sm:px-6 py-3 border-b bg-white sticky top-0 z-50 shadow-sm">
{/* Mobile Header */} <div className="flex items-center justify-between md:hidden"> <Link className="text-primary font-bold text-2xl" href="/">
🍔 FastBite </Link>

    <div className="flex items-center gap-4">
      <Link href="/cart" className="relative">
        <ShoppingCart />
        {cartProducts?.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartProducts.length}
          </span>
        )}
      </Link>
      <button
        className="p-2 border rounded-md hover:bg-gray-100"
        onClick={() => setMobileNavOpen((prev) => !prev)}
      >
        <Bars2 />
      </button>
    </div>
  </div>

  {/* Mobile Dropdown */}
  <AnimatePresence>
    {mobileNavOpen && (
      <motion.div
        key="mobile-nav"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="md:hidden mt-3 p-4 bg-gray-100 rounded-lg flex flex-col gap-3 text-center"
      >
        <Link href="/" onClick={() => setMobileNavOpen(false)}>
          Home
        </Link>
        <Link href="/menu" onClick={() => setMobileNavOpen(false)}>
          Menu
        </Link>
        <Link href="/#about" onClick={() => setMobileNavOpen(false)}>
          About
        </Link>
        <Link href="/#contact" onClick={() => setMobileNavOpen(false)}>
          Contact
        </Link>
        <AuthLinks status={status} />
        <p className="text-gray-600 text-sm mt-2">
          Welcome, {userName}
        </p>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-primary font-semibold text-2xl mr-20" href="/">
            <div className="w-full mx-auto">
              <h1 className="text-2xl font-bold text-center text-foreground">
                🍔 <span className="text-gray-700">FastBite</span>-Express
              </h1>
            </div>
          </Link>
          <p className={session?.user ? "text-gray-700 font-medium" : "text-gray-500"}>
            Welcome, {userName}
          </p>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthLinks status={status} userName={userName} />
          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
</header>
);
}
