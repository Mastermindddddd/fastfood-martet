import SearchBar from "@/components/search-bar"
import SectionCards from "@/components/section-cards"
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-red-50/80 to-yellow-50/60 overflow-hidden">
      {/* Floating Lettuce Images */}
      <div className="absolute top-32 -left-8 w-24 h-24 opacity-80 animate-float z-10 transform hover:scale-110 transition-transform duration-300">
        <Image
          src="/sallad1.png"
          alt="Fresh lettuce decoration"
          width={96}
          height={96}
          className="object-contain drop-shadow-lg filter brightness-105 saturate-110"
        />
      </div>
      
      <div className="absolute top-80 -right-12 w-38 h-38 opacity-70 animate-float-delayed z-10 transform hover:scale-110 transition-transform duration-300 rotate-12">
        <Image
          src="/sallad2.png"
          alt="Fresh lettuce decoration"
          width={180}
          height={180}
          className="object-contain drop-shadow-lg filter brightness-105 saturate-110"
        />
      </div>

      {/* Additional floating lettuce for balance */}
      <div className="absolute top-80 -left-6 w-30 h-30 opacity-60 animate-bounce-slow z-10 transform hover:scale-110 transition-transform duration-300 -rotate-12">
        <Image
          src="/sallad1.png"
          alt="Fresh lettuce decoration"
          width={180}
          height={180}
          className="object-contain drop-shadow-md filter brightness-110 saturate-120"
        />
      </div>

      <div className="absolute bottom-96 -right-8 w-22 h-22 opacity-65 animate-sway z-10 transform hover:scale-110 transition-transform duration-300 rotate-12">
        <Image
          src="/sallad2.png"
          alt="Fresh lettuce decoration"
          width={88}
          height={88}
          className="object-contain drop-shadow-lg filter brightness-105 saturate-110"
        />
      </div>

      {/* Floating food-themed decorative elements */}
      <div className="absolute bottom-40 left-1/4 w-8 h-8 bg-gradient-to-br from-red-400 to-pink-400 rounded-full opacity-25 animate-bounce delay-500 blur-sm"></div>
      <div className="absolute bottom-60 right-1/3 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-25 animate-pulse delay-300 blur-sm"></div>
      
     {/*<Image
      src="/kota.png"
      alt="Background"
      width={800}      // desired width
      height={600}     // desired height
      className="object-contain absolute top-0 left-1/2 -translate-x-1/2 -z-10" 
      priority
    />*/}

      {/* Main Content */}
      <main className="py-12 relative">
        {/* Search Section */}
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <SearchBar />
        </div>

        {/* Section Cards */}
        <div className="transform hover:scale-[1.01] transition-transform duration-300">
          <SectionCards />
        </div>

        {/* Welcome Section */}
        <div className="mt-16 w-full px-4 text-center relative"> {/* full width */}
          {/* Food-themed decorative elements */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-6 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 rounded-full opacity-80"></div>
            <div className="w-4 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-60"></div>
            <div className="w-6 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 rounded-full opacity-80"></div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-balance bg-gradient-to-r from-orange-600 via-red-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
            Welcome to fast food ordering with <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-black text-4xl animate-pulse drop-shadow-lg">FastBite Express</span>
          </h2>
          <p className="text-slate-700 leading-relaxed mx-auto max-w-none relative z-10 backdrop-blur-md bg-white/60 p-8 rounded-3xl border-2 border-orange-200/50 shadow-2xl shadow-orange-200/30"> {/* removed max-w */}
            FastBite Express offers the very best in online food ordering. There is nothing that quite matches the
            excitement of getting your favorite meals delivered fresh to your door. The only thing that could make this
            experience any better would be by getting exclusive deals and tracking your orders in real-time.{" "}
            <span className="font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent text-lg">Place a bet and start ordering your food!</span>
          </p>
          <button className="mt-8 px-10 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-xl border-2 border-orange-300/50 backdrop-blur-sm relative overflow-hidden group text-lg">
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
            <span className="relative z-10 drop-shadow-sm">Show More 🍕→</span>
          </button>
          
          {/* Food-themed bottom decoration */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-orange-400 rounded-full opacity-60 animate-bounce"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-70 animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-60 animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 w-full px-4 relative"> {/* full width */}
          {/* Colorful background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-100/30 to-yellow-100/50 rounded-3xl blur-3xl -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fast Delivery Card - Orange/Red Theme */}
            <div className="bg-gradient-to-br from-white/90 to-orange-50/80 backdrop-blur-lg p-8 rounded-2xl border-2 border-orange-200/60 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-4 transition-all duration-400 group relative overflow-hidden">
              {/* Colorful gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-red-400/5 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-red-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-400 relative z-10 group-hover:rotate-12">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-400 drop-shadow-lg">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-orange-700 mb-3 relative z-10 group-hover:text-red-600 transition-colors duration-300">Fast Delivery</h3>
              <p className="text-slate-600 text-base relative z-10 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
                Get your food delivered in 30 minutes or less with our express delivery service.
              </p>
              {/* Decorative corner accent */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-orange-300 to-red-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>

            {/* Easy Payment Card - Green/Blue Theme */}
            <div className="bg-gradient-to-br from-white/90 to-emerald-50/80 backdrop-blur-lg p-8 rounded-2xl border-2 border-emerald-200/60 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-4 transition-all duration-400 group relative overflow-hidden">
              {/* Colorful gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-green-400/5 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-400 relative z-10 group-hover:rotate-12">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-400 drop-shadow-lg">💳</span>
              </div>
              <h3 className="text-xl font-bold text-emerald-700 mb-3 relative z-10 group-hover:text-green-600 transition-colors duration-300">Easy Payment</h3>
              <p className="text-slate-600 text-base relative z-10 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
                Multiple payment options including cards, digital wallets, and cash on delivery.
              </p>
              {/* Decorative corner accent */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-emerald-300 to-green-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>

            {/* Quality Food Card - Purple/Pink Theme */}
            <div className="bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-lg p-8 rounded-2xl border-2 border-purple-200/60 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-4 transition-all duration-400 group relative overflow-hidden">
              {/* Colorful gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/5 to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-400 to-violet-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-400 relative z-10 group-hover:rotate-12">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-400 drop-shadow-lg">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-3 relative z-10 group-hover:text-pink-600 transition-colors duration-300">Quality Food</h3>
              <p className="text-slate-600 text-base relative z-10 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
                Fresh ingredients and quality preparation ensure every meal meets our high standards.
              </p>
              {/* Decorative corner accent */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Additional food-themed floating elements */}
        <div className="absolute top-1/2 -left-4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-3/4 -right-6 w-8 h-8 bg-gradient-to-br from-red-400 to-pink-400 rounded-full opacity-15 animate-pulse delay-700"></div>
      </main>
    </div>
  )
}