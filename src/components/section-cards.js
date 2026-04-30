import BurgerIcon from "@/components/icons/burger"
import CustomerIcon from "@/components/icons/customer"
import ArrowRightIcon from "@/components/icons/arrow-right"
import Link from 'next/link'

export default function SectionCards({ compact = false }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
        compact ? "max-w-sm" : "max-w-4xl"
      } mx-auto px-2`}
    >
      {/* SHOP OWNER */}
      <Link href="/shop-registration">
        <div
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 
          ${compact ? "p-3" : "p-8"} 
          text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
        >
          <div className="relative z-10">
            <div className={`${compact ? "mb-3 scale-75" : "mb-6"}`}>
              <BurgerIcon />
            </div>

            <h2
              className={`${
                compact ? "text-base" : "text-3xl"
              } font-bold mb-2`}
            >
              SHOP OWNER
            </h2>

            <p
              className={`${
                compact ? "text-xs mb-3" : "mb-6"
              } text-primary-foreground/90 leading-relaxed`}
            >
              Browse our delicious menu, place orders, and enjoy fresh fast food ready for pickup
            </p>

            <div className="flex items-center gap-1 text-[10px] font-semibold">
              <span>CREATE SHOP ACCOUNT</span>
              <ArrowRightIcon />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div
            className={`absolute -bottom-4 -right-4 ${
              compact ? "w-16 h-16" : "w-24 h-24"
            } bg-white/10 rounded-full blur-xl`}
          />
        </div>
      </Link>

      {/* CUSTOMER */}
      <Link href="/restaurents">
        <div
          className={`group relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-200 
          ${compact ? "p-3" : "p-8"} 
          text-white transition-all duration-300 
          hover:scale-105 hover:shadow-2xl cursor-pointer`}
        >
          <div className="relative z-10">
            <div className={`${compact ? "mb-3 scale-75" : "mb-6"}`}>
              <CustomerIcon />
            </div>

            <h2
              className={`${
                compact ? "text-base" : "text-3xl"
              } font-bold mb-2`}
            >
              CUSTOMER
            </h2>

            <p
              className={`${
                compact ? "text-xs mb-3" : "mb-6"
              } text-secondary-foreground/90 leading-relaxed`}
            >
              Track your orders, manage your account, view order history, and get exclusive deals
            </p>

            <div className="flex items-center gap-1 text-[10px] font-semibold">
              <span>ORDER NOW</span>
              <ArrowRightIcon />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div
            className={`absolute -bottom-4 -right-4 ${
              compact ? "w-16 h-16" : "w-24 h-24"
            } bg-white/10 rounded-full blur-xl`}
          />
        </div>
      </Link>
    </div>
  )
}