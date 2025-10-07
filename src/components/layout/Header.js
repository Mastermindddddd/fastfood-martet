'use client';

import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";

function AuthLinks({ status, userName }) {
  if (status === "authenticated") {
    return (
      <>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Logout
        </button>
      </>
    );
  }
  if (status === "unauthenticated") {
    return (
      <>
        <Link href="/login">Login</Link>
        <Link
          href="/register"
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Register
        </Link>
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

  return (
    <header className="mx-8 my-4">
      {/* Mobile Header */}
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-3xl" href="/">
          FAST-FOOD
        </Link>

        <p className={session?.user ? "text-gray-700" : "text-gray-500"}>
          Welcome, {userName}
        </p>

        <div className="flex gap-8 items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <Bars2 />
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center"
        >
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}

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