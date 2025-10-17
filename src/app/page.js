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

      <div className="absolute top-80 -left-6 w-30 h-30 opacity-60 animate-bounce-slow z-10 transform hover:scale-110 transition-transform duration-300 -rotate-12">
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
      <section className="relative py-12 sm:py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mt-10 sm:mt-16">
          <SearchBar />
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Delicious Food,
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block lg:inline">
                Delivered Fast
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Premium food delivery from your favorite restaurants, delivered fresh to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg">
                🚀 Order Now
              </button>
              <Link href='/menu'>
                <button className="w-full sm:w-auto px-6 py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition-all duration-300 text-base sm:text-lg">
                  📖 View Menu
                </button>
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative group">
              
              <Image
                src="/kota.png"
                alt="Delicious Kota"
                width={600}
                height={500}
                className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl group-hover:scale-105 transition-transform duration-500"
                priority
              />
              
              {/* Floating badges */}
              <div className="absolute top-8 -right-4 backdrop-blur-xl p-4 rounded-2xl shadow-2xl animate-float">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <div className="font-bold text-slate-900">Hot & Fresh</div>
                    <div className="text-sm text-slate-600">30 min delivery</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 -left-4 backdrop-blur-xl p-4 rounded-2xl shadow-2xl animate-float-delayed">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">💯</span>
                  <div>
                    <div className="font-bold text-slate-900">Quality Food</div>
                    <div className="text-sm text-slate-600">100% Fresh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Section Cards */}
      <section className="py-12 sm:py-16 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <SectionCards />
        </div>
      </section>

      {/* Popular Categories with enhanced cards */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              🍽️ Popular on <span className="text-orange-600">FoodHub SA</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore South Africa&apos;s favorite fast food delivered to your door
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
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
                className="group relative bg-white p-6 rounded-3xl text-center hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-slate-100 hover:border-orange-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="text-5xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-orange-600 font-semibold">{category.count} shops</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Why Choose FastBite Express?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              We’re committed to providing you with the best food delivery experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className="group p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl">{item.emoji}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">{item.desc}</p>
                <div className="flex items-center text-orange-600 font-semibold text-sm sm:text-base">
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
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Trusted by Thousands</h2>
            <p className="text-lg sm:text-xl text-orange-100">Join our growing community of satisfied customers</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">50K+</div>
              <div className="text-orange-100 text-sm sm:text-base lg:text-lg">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">500+</div>
              <div className="text-orange-100 text-sm sm:text-base lg:text-lg">Partner Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">100K+</div>
              <div className="text-orange-100 text-sm sm:text-base lg:text-lg">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">25</div>
              <div className="text-orange-100 text-sm sm:text-base lg:text-lg">Cities Served</div>
            </div>
          </div>
        </div>
      </section>

      
      {/* How It Works  */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              Order in <span className="text-orange-600">3 Easy Steps</span>
            </h2>
            <p className="text-xl text-slate-600">From craving to eating in minutes! 🚀</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '1', emoji: '🔍', title: 'Browse & Choose', desc: 'Find your favorite restaurant and pick what you love from hundreds of options' },
              { step: '2', emoji: '🛒', title: 'Add to Cart', desc: 'Customize your order, add special instructions, and proceed to checkout' },
              { step: '3', emoji: '🚀', title: 'Fast Delivery', desc: 'Track your order in real-time and enjoy hot, fresh food at your doorstep!' }
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="text-center p-8 rounded-3xl bg-white border-2 border-slate-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-6xl mb-6 mt-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {item.emoji}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-slate-600">Real reviews from real customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">
                &quot;FastBite Express has been a game-changer for our family. The food always arrives hot and fresh, and the delivery is incredibly fast!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-orange-700">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Sarah Johnson</div>
                  <div className="text-slate-600 text-sm">Regular Customer</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">
                &quot;The variety of restaurants and cuisines available is amazing. I can order from my favorite places all in one app!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-orange-700">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Mike Rodriguez</div>
                  <div className="text-slate-600 text-sm">Food Enthusiast</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">
                &quot;Customer service is outstanding! They resolved my order issue within minutes and even offered a discount for the inconvenience.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-orange-700">EC</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Emily Chen</div>
                  <div className="text-slate-600 text-sm">Satisfied Customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the best food delivery service in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Start Ordering Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-slate-800 transition-all duration-300">
              Download App
            </button>
          </div>
          
          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <div className="text-sm text-slate-300">Mobile App</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <div className="text-sm text-slate-300">Web Platform</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">☎️</div>
              <div className="text-sm text-slate-300">Phone Orders</div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}