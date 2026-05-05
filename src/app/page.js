"use client"

import SearchBar from "@/components/search-bar"
import SectionCards from "@/components/section-cards"
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

// ── Hero variants ────────────────────────────────────────

function GuestHero() {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div className="text-center lg:text-left space-y-8">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
          South Africa&apos;s Favourite Fast Food
        </span>
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tighter">
          <span className="block bg-gradient-to-br from-gray-900 via-gray-800 to-orange-600 bg-clip-text text-transparent">Screw</span>
          <span className="block text-orange-500">the Diet.</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
          Premium fast food prepared fresh for you.{" "}
          <span className="text-orange-500 font-medium">No compromises.</span>
        </p>
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            Get Started
          </Link>
          <Link href="/restaurents" className="px-6 py-3 border border-orange-500/40 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-all">
            Browse Restaurants
          </Link>
        </div>
        <SectionCards />
      </div>
      <HeroImage />
    </div>
  )
}

function CustomerHero({ userName }) {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div className="text-center lg:text-left space-y-8">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
          Welcome back
        </span>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tighter">
          <span className="block text-gray-900">Hey,</span>
          <span className="block text-orange-500">{userName?.split(' ')[0]}.</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
          Ready to order? Browse your favourite spots and get food fast.
        </p>
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link href="/restaurents" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            Order Now
          </Link>
        </div>
        <SectionCards />
      </div>
      <HeroImage />
    </div>
  )
}

function ShopOwnerHero({ userName }) {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div className="text-center lg:text-left space-y-8">
        <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
          Shop owner portal
        </span>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tighter">
          <span className="block text-gray-900">Welcome,</span>
          <span className="block text-orange-500">{userName?.split(' ')[0]}.</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
          Manage your menu, track ingredients, and keep your shop running smoothly.
        </p>
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link href="/shop-dashboard" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            Go to Dashboard →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
          {[
            { label: 'Menu', href: '/shop-dashboard', emoji: '🍔' },
            { label: 'Ingredients', href: '/shop-dashboard', emoji: '📦' },
            { label: 'Alerts', href: '/shop-dashboard', emoji: '🔔' },
          ].map(card => (
            <Link key={card.label} href={card.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-orange-100 hover:border-orange-300 hover:bg-orange-50 transition-all">
              <span className="text-2xl">{card.emoji}</span>
              <span className="text-xs font-semibold text-gray-600">{card.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <HeroImage />
    </div>
  )
}

function HeroImage() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="relative group">
        <Image src="/kota-market1.png" alt="Delicious Food" width={520} height={520}
          className="relative w-full max-w-md h-auto rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
          priority />
        <div className="absolute -top-4 -right-4 bg-white border border-orange-200 rounded-2xl p-3 shadow-xl">
          <div className="text-center">
            <div className="text-xl">⚡</div>
            <div className="font-black text-orange-500 text-xs">FAST</div>
            <div className="text-[10px] text-gray-500">PREP</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [isShopOwner, setIsShopOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkShopStatus() {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/check-shop?email=${encodeURIComponent(session.user.email)}`)
          const data = await res.json()
          setIsShopOwner(data.shopExists || false)
        } catch (error) {
          console.error('Error checking shop status:', error)
          setIsShopOwner(false)
        }
      } else {
        setIsShopOwner(false)
      }
      setLoading(false)
    }

    if (status !== 'loading') {
      checkShopStatus()
    }
  }, [session, status])

  if (loading && status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-white pt-24">

        {/* background */}
        <div className="absolute inset-0">
          <Image src="/kota-market1.png" alt="" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-orange-50/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {isShopOwner ? (
            <ShopOwnerHero userName={session?.user?.name} />
          ) : session ? (
            <CustomerHero userName={session.user.name} />
          ) : (
            <GuestHero />
          )}
        </div>
      </section>
    </div>
  )
}