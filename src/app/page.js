import SearchBar from "@/components/search-bar"
import SectionCards from "@/components/section-cards"
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 -z-10"></div>
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-slate-800 leading-tight px-2">
              Delicious Food,{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block sm:inline">
                Delivered Fast
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Experience the convenience of premium food delivery with FastBite Express. 
              Quality meals from your favorite restaurants, delivered fresh to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg">
                Order Now
              </button>
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition-all duration-300 text-base sm:text-lg">
                View Menu
              </button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mt-8 sm:mt-12 px-4">
          <SearchBar />
        </div>
      </section>

      {/* Section Cards */}
      <section className="py-12 sm:py-16 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <SectionCards />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
              Why Choose FastBite Express?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              We're committed to providing you with the best food delivery experience possible
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Fast Delivery */}
            <div className="group p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 bg-white mx-4 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">🚚</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Lightning Fast Delivery</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Get your favorite meals delivered in 30 minutes or less. Our optimized delivery network ensures your food arrives hot and fresh.
              </p>
              <div className="flex items-center text-orange-600 font-semibold text-sm sm:text-base">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Easy Payment */}
            <div className="group p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 bg-white mx-4 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">💳</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Secure & Easy Payment</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Multiple secure payment options including credit cards, digital wallets, and cash on delivery for your convenience.
              </p>
              <div className="flex items-center text-orange-600 font-semibold text-sm sm:text-base">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Quality Food */}
            <div className="group p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 bg-white mx-4 sm:mx-0 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">⭐</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Premium Quality</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                We partner only with top-rated restaurants that maintain the highest standards for ingredients and food preparation.
              </p>
              <div className="flex items-center text-orange-600 font-semibold text-sm sm:text-base">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
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

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-slate-600">Ordering your favorite food is just a few clicks away</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 px-4">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">📱</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Choose Restaurant</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">Browse through our extensive list of partner restaurants and cuisines</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🍕</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Select Items</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">Add your favorite dishes to cart and customize as needed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">💳</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Make Payment</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">Choose your preferred payment method and complete the order</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🚚</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">Fast Delivery</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">Sit back and relax while we deliver your food fresh and hot</p>
            </div>
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
                "FastBite Express has been a game-changer for our family. The food always arrives hot and fresh, and the delivery is incredibly fast!"
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
                "The variety of restaurants and cuisines available is amazing. I can order from my favorite places all in one app!"
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
                "Customer service is outstanding! They resolved my order issue within minutes and even offered a discount for the inconvenience."
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

      {/* Popular Categories Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Popular Categories</h2>
            <p className="text-xl text-slate-600">Discover cuisines loved by our customers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { name: 'Pizza', emoji: '🍕', count: '150+ Restaurants' },
              { name: 'Burgers', emoji: '🍔', count: '120+ Restaurants' },
              { name: 'Asian', emoji: '🍜', count: '200+ Restaurants' },
              { name: 'Mexican', emoji: '🌮', count: '80+ Restaurants' },
              { name: 'Desserts', emoji: '🍰', count: '90+ Restaurants' },
              { name: 'Healthy', emoji: '🥗', count: '100+ Restaurants' }
            ].map((category) => (
              <div key={category.name} className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 cursor-pointer group border border-slate-200 hover:border-orange-300">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{category.name}</h3>
                <p className="text-sm text-slate-600">{category.count}</p>
              </div>
            ))}
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