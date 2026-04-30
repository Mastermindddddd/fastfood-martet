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
    <div className="min-h-screen bg-white overflow-hidden">
    
      {/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gray-950 pt-24">
  {/* Background image with overlay */}
  <div className="absolute inset-0">
    <Image
      src="/kota-market1.png"
      alt="Background food"
      fill
      className="object-cover opacity-20"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/90 to-orange-950/30" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto w-full">
    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* Left — Text */}
      <div className="text-center lg:text-left space-y-8">
        <div className="inline-block">
          <span className="text-xs font-semibold tracking-widest text-orange-500/80 uppercase">
            South Africa&apos;s Favourite Fast Food
          </span>
        </div>

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tighter">
          <span className="block bg-gradient-to-br from-white via-white to-orange-200/60 bg-clip-text text-transparent">
            Screw
          </span>
          <span className="block text-orange-500">
            the Diet.
          </span>
        </h1>

        <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
          Premium fast food prepared fresh for you.{" "}
          <span className="text-orange-400 font-medium">No compromises.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
  
  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

  {/* Customer Card */}
  <div className="flex justify-center lg:justify-start">
  <SectionCards />
</div>

</div>

</div>

      </div>

      {/* Right — Image */}
      <div className="relative flex justify-center lg:justify-end">
        <div className="relative group">
          <Image
            src="/kota-market1.png"
            alt="Delicious Food"
            width={520}
            height={520}
            className="relative w-full max-w-md h-auto rounded-3xl shadow-2xl shadow-black/60 transform group-hover:scale-105 transition-transform duration-500"
            priority
          />
          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 bg-gray-900 border border-orange-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xl mb-0.5">⚡</div>
              <div className="font-black text-orange-500 text-xs">FAST</div>
              <div className="text-[10px] text-gray-500">PREP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Popular Categories - Bold Grid */}
      {/*<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 rounded-full text-orange-700 font-bold text-xs sm:text-sm mb-3 sm:mb-4">
              POPULAR CATEGORIES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
              FIND YOUR <span className="text-orange-600">FLAVOUR</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
              Explore our most loved food categories from across South Africa
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {[
              { name: 'Burgers', emoji: '🍔', color: 'from-yellow-400 to-orange-500', count: '120+' },
              { name: 'Kota', emoji: '🥖', color: 'from-orange-400 to-red-500', count: '200+' },
              { name: 'Pizza', emoji: '🍕', color: 'from-red-400 to-pink-500', count: '150+' },
              { name: 'Chicken', emoji: '🍗', color: 'from-amber-400 to-orange-500', count: '180+' },
              { name: 'Pap & Vleis', emoji: '🍖', color: 'from-red-500 to-orange-600', count: '90+' },
              { name: 'Drinks', emoji: '🥤', color: 'from-blue-400 to-cyan-500', count: '100+' }
            ].map((category) => (
              <div 
                key={category.name} 
                className="group relative bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="font-black text-gray-900 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{category.name}</h3>
                  <p className="text-xs sm:text-sm font-bold text-orange-600">{category.count} shops</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Features - Modern Cards */}
      {/*<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
              WHY CHOOSE <span className="text-orange-600">US?</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
              We&apos;re not just another food ordering platform. We&apos;re your food partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                desc: 'Get your food ready in 30 minutes or less. We don\'t mess around.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '💳',
                title: 'Easy Payment',
                desc: 'Multiple secure payment options. Pay how you want, when you want.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: '⭐',
                title: 'Premium Quality',
                desc: 'Only the best restaurants. Only the freshest ingredients. Period.',
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Testimonials - Social Proof */}
      {/*<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 rounded-full text-orange-700 font-bold text-xs sm:text-sm mb-3 sm:mb-4">
              DON&apos;T TAKE OUR WORD FOR IT
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
              WHAT OUR <span className="text-orange-600">CUSTOMERS</span> SAY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Regular Customer',
                text: 'FastBite Express has been a game-changer for our family. The food is always hot and fresh, and the service is incredibly fast!',
                rating: 5,
                avatar: 'SJ'
              },
              {
                name: 'Mike Rodriguez',
                role: 'Food Enthusiast',
                text: 'The variety of restaurants and cuisines available is amazing. I can order from my favorite places all in one app!',
                rating: 5,
                avatar: 'MR'
              },
              {
                name: 'Emily Chen',
                role: 'Satisfied Customer',
                text: 'Customer service is outstanding! They resolved my order issue within minutes and even offered a discount for the inconvenience.',
                rating: 5,
                avatar: 'EC'
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg sm:text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed italic">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center font-black text-white text-sm sm:text-base">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Stats - Bold Section */}
      {/*<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">TRUSTED BY THOUSANDS</h2>
            <p className="text-base sm:text-lg lg:text-xl text-orange-100 px-2 sm:px-0">Join our growing community of satisfied customers</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '500+', label: 'Partner Restaurants' },
              { number: '100K+', label: 'Orders Completed' },
              { number: '25', label: 'Cities Served' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-orange-100 text-sm sm:text-base lg:text-lg font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* How It Works */}
      {/*<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
              ORDER IN <span className="text-orange-600">3 EASY STEPS</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">From craving to eating in minutes! 🚀</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '1', emoji: '🔍', title: 'Browse & Choose', desc: 'Find your favorite restaurant and pick what you love from hundreds of options' },
              { step: '2', emoji: '🛒', title: 'Add to Cart', desc: 'Customize your order, add special instructions, and proceed to checkout' },
              { step: '3', emoji: '🚀', title: 'Ready for Pickup', desc: 'Track your order in real-time and enjoy hot, fresh food ready for you!' }
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                  <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 mt-3 sm:mt-4 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Final CTA */}
      {/*<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
            READY TO <span className="text-orange-500">ORDER?</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto px-2 sm:px-0">
            Join thousands of satisfied customers and experience the best food ordering platform in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
            <Link href='/restaurents' className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base sm:text-lg overflow-hidden">
                <span className="relative z-10">START ORDERING NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>*/}
    </div>
  )
}
