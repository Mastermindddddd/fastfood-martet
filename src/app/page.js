import SearchBar from "@/components/search-bar"
import SectionCards from "@/components/section-cards"
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log("server session:", session);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* Decorative images - hidden on mobile, visible on larger screens */}
      <div className="hidden md:block absolute top-32 -left-8 w-24 h-24 opacity-80 animate-float z-10 transform hover:scale-110 transition-transform duration-300">
        <Image
          src="/sallad1.png"
          alt="Fresh lettuce decoration"
          width={96}
          height={96}
          className="object-contain drop-shadow-lg filter brightness-105 saturate-110"
        />
      </div>

      <div className="hidden lg:block absolute top-80 -right-12 w-38 h-38 opacity-70 animate-float-delayed z-10 transform hover:scale-110 transition-transform duration-300 rotate-12">
        <Image
          src="/sallad2.png"
          alt="Fresh lettuce decoration"
          width={180}
          height={180}
          className="object-contain drop-shadow-lg filter brightness-105 saturate-110"
        />
      </div>

      <div className="hidden lg:block absolute top-80 -left-6 w-30 h-30 opacity-60 animate-bounce-slow z-10 transform hover:scale-110 transition-transform duration-300 -rotate-12">
        <Image
          src="/sallad1.png"
          alt="Fresh lettuce decoration"
          width={180}
          height={180}
          className="object-contain drop-shadow-md filter brightness-110 saturate-120"
        />
      </div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/40 -z-10"></div>

      {/* Hero Section */}
      <section className="relative py-6 sm:py-12 lg:py-20 px-4 sm:px-6 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mt-4 sm:mt-8 lg:mt-16 mb-6 sm:mb-8 lg:mb-12">
          <SearchBar />
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Text side */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-4 sm:mb-6 lg:mb-6 px-2 lg:px-0">
              Delicious Food,
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block lg:inline">
                Delivered Fast
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 lg:mb-8 leading-relaxed px-2 lg:px-0">
              Premium food delivery from your favorite restaurants, delivered fresh to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-4 justify-center lg:justify-start px-2 lg:px-0">
              {/*<button className="w-full sm:w-auto px-6 py-3 sm:py-4 lg:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg">
                🚀 Order Now
              </button>*/}
              <Link href='/restaurents' className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 sm:py-4 lg:py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition-all duration-300 text-sm sm:text-base lg:text-lg">
                  📖 View Shops
                </button>
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="relative group">
              
              <Image
                src="/kota.png"
                alt="Delicious Kota"
                width={600}
                height={500}
                className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-xl group-hover:scale-105 transition-transform duration-500"
                priority
              />
              
              {/* Floating badges - hidden on mobile, visible on larger screens */}
              <div className="hidden md:block absolute top-4 md:top-8 lg:top-8 -right-2 md:-right-4 lg:-right-4 backdrop-blur-xl p-3 md:p-4 lg:p-4 rounded-2xl shadow-2xl animate-float">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl md:text-3xl lg:text-3xl">🔥</span>
                  <div>
                    <div className="font-bold text-slate-900 text-xs md:text-sm lg:text-sm">Hot & Fresh</div>
                    <div className="text-xs text-slate-600">30 min delivery</div>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block absolute bottom-4 md:bottom-8 lg:bottom-8 -left-2 md:-left-4 lg:-left-4 backdrop-blur-xl p-3 md:p-4 lg:p-4 rounded-2xl shadow-2xl animate-float-delayed">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl md:text-3xl lg:text-3xl">💯</span>
                  <div>
                    <div className="font-bold text-slate-900 text-xs md:text-sm lg:text-sm">Quality Food</div>
                    <div className="text-xs text-slate-600">100% Fresh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Section Cards */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <SectionCards />
        </div>
      </section>

      {/* Popular Categories with enhanced cards */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 lg:mb-4 px-2 lg:px-0">
              🍽️ Popular on <span className="text-orange-600">FoodHub SA</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-slate-600 max-w-2xl mx-auto px-2 lg:px-0">
              Explore South Africa&apos;s favorite fast food delivered to your door
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-6">
            {[
              { name: 'Burgers', emoji: '🍔', count: '120+', color: 'from-yellow-400 to-orange-500' },
              { name: 'Kota', emoji: '🥖', count: '200+', color: 'from-orange-400 to-red-500' },
              { name: 'Pizza', emoji: '🍕', count: '150+', color: 'from-red-400 to-pink-500' },
              { name: 'Chicken', emoji: '🍗', count: '180+', color: 'from-amber-400 to-orange-500' },
              { name: 'Pap & Vleis', emoji: '🍖', count: '90+', color: 'from-red-500 to-orange-600' },
              { name: 'Drinks', emoji: '🥤', count: '100+', color: 'from-blue-400 to-cyan-500' }
            ].map((category) => (
              <div 
                key={category.name} 
                className="group relative bg-white p-4 sm:p-5 md:p-6 lg:p-6 rounded-2xl sm:rounded-3xl lg:rounded-3xl text-center hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-slate-100 hover:border-orange-300 hover:-translate-y-1 sm:hover:-translate-y-2 lg:hover:-translate-y-2 overflow-hidden active:scale-95 lg:active:scale-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl mb-2 sm:mb-3 lg:mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg lg:text-lg mb-1 line-clamp-1">{category.name}</h3>
                  <p className="text-xs sm:text-sm lg:text-sm text-orange-600 font-semibold">{category.count} shops</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-4 px-2 lg:px-0">
              Why Choose FastBite Express?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-slate-600 max-w-3xl mx-auto px-2 lg:px-0">
              We&apos;re committed to providing you with the best food delivery experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-8">
            {[
              {
                emoji: '🚚',
                title: 'Lightning Fast Delivery',
                desc: 'Get your favorite meals delivered in 30 minutes or less. Our optimized delivery network ensures your food arrives hot and fresh.'
              },
              {
                emoji: '💳',
                title: 'Secure & Easy Payment',
                desc: 'Multiple secure payment options including credit cards, digital wallets, and cash on delivery for your convenience.'
              },
              {
                emoji: '⭐',
                title: 'Premium Quality',
                desc: 'We partner only with top-rated restaurants that maintain the highest standards for ingredients and food preparation.'
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-5 sm:p-6 md:p-8 lg:p-8 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl">{item.emoji}</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-base mb-4 sm:mb-6 lg:mb-6">{item.desc}</p>
                <div className="flex items-center text-orange-600 font-semibold text-sm sm:text-base lg:text-base">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-16 px-2 lg:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-4">Trusted by Thousands</h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-orange-100">Join our growing community of satisfied customers</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-8 px-2 lg:px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 lg:mb-2">50K+</div>
              <div className="text-orange-100 text-xs sm:text-sm md:text-base lg:text-lg">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 lg:mb-2">500+</div>
              <div className="text-orange-100 text-xs sm:text-sm md:text-base lg:text-lg">Partner Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 lg:mb-2">100K+</div>
              <div className="text-orange-100 text-xs sm:text-sm md:text-base lg:text-lg">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 lg:mb-2">25</div>
              <div className="text-orange-100 text-xs sm:text-sm md:text-base lg:text-lg">Cities Served</div>
            </div>
          </div>
        </div>
      </section>

      
      {/* How It Works  */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 lg:mb-4 px-2 lg:px-0">
              Order in <span className="text-orange-600">3 Easy Steps</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-slate-600 px-2 lg:px-0">From craving to eating in minutes! 🚀</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {[
              { step: '1', emoji: '🔍', title: 'Browse & Choose', desc: 'Find your favorite restaurant and pick what you love from hundreds of options' },
              { step: '2', emoji: '🛒', title: 'Add to Cart', desc: 'Customize your order, add special instructions, and proceed to checkout' },
              { step: '3', emoji: '🚀', title: 'Fast Delivery', desc: 'Track your order in real-time and enjoy hot, fresh food at your doorstep!' }
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="text-center p-6 sm:p-8 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-3xl bg-white border-2 border-slate-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 lg:hover:-translate-y-2">
                  <div className="absolute -top-5 sm:-top-6 lg:-top-6 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-black text-lg sm:text-xl lg:text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl mb-4 sm:mb-6 lg:mb-6 mt-3 sm:mt-4 lg:mt-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {item.emoji}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-4">{item.title}</h3>
                  <p className="text-sm sm:text-base lg:text-base text-slate-600 leading-relaxed px-2 lg:px-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-4">What Our Customers Say</h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-slate-600">Real reviews from real customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <div className="bg-slate-50 p-5 sm:p-6 lg:p-8 rounded-2xl">
              <div className="flex mb-3 sm:mb-4 lg:mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg sm:text-xl lg:text-xl">⭐</span>
                ))}
              </div>
              <p className="text-sm sm:text-base lg:text-base text-slate-700 mb-4 sm:mb-6 lg:mb-6 italic leading-relaxed">
                &quot;FastBite Express has been a game-changer for our family. The food always arrives hot and fresh, and the delivery is incredibly fast!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-bold text-orange-700 text-sm lg:text-base">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm sm:text-base lg:text-base">Sarah Johnson</div>
                  <div className="text-slate-600 text-xs sm:text-sm lg:text-sm">Regular Customer</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 lg:p-8 rounded-2xl">
              <div className="flex mb-3 sm:mb-4 lg:mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg sm:text-xl lg:text-xl">⭐</span>
                ))}
              </div>
              <p className="text-sm sm:text-base lg:text-base text-slate-700 mb-4 sm:mb-6 lg:mb-6 italic leading-relaxed">
                &quot;The variety of restaurants and cuisines available is amazing. I can order from my favorite places all in one app!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-bold text-orange-700 text-sm lg:text-base">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm sm:text-base lg:text-base">Mike Rodriguez</div>
                  <div className="text-slate-600 text-xs sm:text-sm lg:text-sm">Food Enthusiast</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 lg:p-8 rounded-2xl">
              <div className="flex mb-3 sm:mb-4 lg:mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg sm:text-xl lg:text-xl">⭐</span>
                ))}
              </div>
              <p className="text-sm sm:text-base lg:text-base text-slate-700 mb-4 sm:mb-6 lg:mb-6 italic leading-relaxed">
                &quot;Customer service is outstanding! They resolved my order issue within minutes and even offered a discount for the inconvenience.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-bold text-orange-700 text-sm lg:text-base">EC</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm sm:text-base lg:text-base">Emily Chen</div>
                  <div className="text-slate-600 text-xs sm:text-sm lg:text-sm">Satisfied Customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6">Ready to Order?</h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl text-slate-300 mb-6 sm:mb-7 lg:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the best food delivery service in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-4 justify-center">
            <button className="w-full sm:w-auto px-6 sm:px-8 lg:px-8 py-3 sm:py-4 lg:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-base">
              Start Ordering Now
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 lg:px-8 py-3 sm:py-4 lg:py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-slate-800 transition-all duration-300 text-sm sm:text-base lg:text-base">
              Download App
            </button>
          </div>
          
          <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-wrap justify-center gap-6 sm:gap-7 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-3xl mb-1 sm:mb-2 lg:mb-2">📱</div>
              <div className="text-xs sm:text-sm lg:text-sm text-slate-300">Mobile App</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-3xl mb-1 sm:mb-2 lg:mb-2">🌐</div>
              <div className="text-xs sm:text-sm lg:text-sm text-slate-300">Web Platform</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-3xl mb-1 sm:mb-2 lg:mb-2">☎️</div>
              <div className="text-xs sm:text-sm lg:text-sm text-slate-300">Phone Orders</div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}