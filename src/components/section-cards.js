import BurgerIcon from "@/components/icons/burger"
import CustomerIcon from "@/components/icons/customer"
import ArrowRightIcon from "@/components/icons/arrow-right"

export default function SectionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
      {/* Shop Section Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
        <div className="relative z-10">
          <div className="mb-6">
            <BurgerIcon />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-balance">SHOP</h2>
          <p className="text-primary-foreground/90 mb-6 leading-relaxed">
            Browse our delicious menu, place orders, and enjoy fresh fast food delivered to your door
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>Order Now</span>
            <ArrowRightIcon />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Customer Section Card */}
      <div className="group relative overflow-hidden rounded-2xl 
bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-200 
p-8 text-white transition-all duration-300 
hover:scale-105 hover:shadow-2xl cursor-pointer">


        <div className="relative z-10">
          <div className="mb-6">
            <CustomerIcon />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-balance">CUSTOMER</h2>
          <p className="text-secondary-foreground/90 mb-6 leading-relaxed">
            Track your orders, manage your account, view order history, and get exclusive deals
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>My Account</span>
            <ArrowRightIcon />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>
    </div>
  )
}
