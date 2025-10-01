"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Star, Clock, Filter, ShoppingCart, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppContext, useCartContext } from '@/components/AppContext'

// Mock restaurant data
const mockRestaurants = [
  {
    id: 1,
    name: "Burger Palace",
    cuisine: "Burgers",
    rating: 4.5,
    deliveryTime: "25-35 min",
    deliveryFee: 15,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    distance: 0.8,
    isOpen: true,
    featured: true
  },
  {
    id: 2,
    name: "Pizza Corner",
    cuisine: "Pizza",
    rating: 4.3,
    deliveryTime: "30-40 min",
    deliveryFee: 20,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    distance: 1.2,
    isOpen: true,
    featured: false
  },
  {
    id: 3,
    name: "Chicken Express",
    cuisine: "Chicken",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: 12,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    distance: 0.5,
    isOpen: true,
    featured: true
  },
  {
    id: 4,
    name: "Sushi Zen",
    cuisine: "Japanese",
    rating: 4.6,
    deliveryTime: "35-45 min",
    deliveryFee: 25,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    distance: 2.1,
    isOpen: false,
    featured: false
  },
  {
    id: 5,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.4,
    deliveryTime: "25-35 min",
    deliveryFee: 18,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    distance: 1.5,
    isOpen: true,
    featured: false
  },
  {
    id: 6,
    name: "Steakhouse Grill",
    cuisine: "Steakhouse",
    rating: 4.8,
    deliveryTime: "40-50 min",
    deliveryFee: 30,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    distance: 2.8,
    isOpen: true,
    featured: true
  }
]

const cuisineTypes = ["All", "Burgers", "Pizza", "Chicken", "Japanese", "Mexican", "Steakhouse"]

export default function HomePage() {
  const { user, userLocation } = useAppContext()
  const { getCartItemCount } = useCartContext()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [sortBy, setSortBy] = useState("distance") // distance, rating, deliveryTime
  const [showFilters, setShowFilters] = useState(false)
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants)

  useEffect(() => {
    let filtered = mockRestaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCuisine = selectedCuisine === "All" || restaurant.cuisine === selectedCuisine
      return matchesSearch && matchesCuisine
    })

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "deliveryTime":
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
        case "distance":
        default:
          return a.distance - b.distance
      }
    })

    setFilteredRestaurants(filtered)
  }, [searchQuery, selectedCuisine, sortBy])

  const featuredRestaurants = filteredRestaurants.filter(r => r.featured)

  return (
    <div className="min-h-screen bg-gray-50 mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
  {/* Mobile Filter Toggle */}
  <Button
    variant="outline"
    onClick={() => setShowFilters(!showFilters)}
    className="md:hidden"
  >
    <Filter className="h-4 w-4 mr-2" />
    Filters
  </Button>

  {/* Cuisine Filter */}
  <div className={`w-full md:w-auto md:flex-1 ${showFilters ? 'flex' : 'hidden md:flex'} gap-2`}>
    {cuisineTypes.map(cuisine => (
      <Button
        key={cuisine}
        variant={selectedCuisine === cuisine ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedCuisine(cuisine)}
      >
        {cuisine}
      </Button>
    ))}
  </div>

  {/* Sort Options */}
  <div className="flex items-center space-x-2">
    <span className="text-sm text-gray-600">Sort by:</span>
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
    >
      <option value="distance">Distance</option>
      <option value="rating">Rating</option>
      <option value="deliveryTime">Delivery Time</option>
    </select>
  </div>
</div>

        {/* Featured Restaurants */}
        {featuredRestaurants.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Featured Restaurants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Restaurants */}
        <section>
          <h3 className="text-2xl font-bold mb-4">
            All Restaurants ({filteredRestaurants.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Shop Owner CTA */}
      <section className="bg-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Are you a restaurant owner?</h3>
          <p className="text-gray-600 mb-6">Join FoodHub SA and reach more customers</p>
          <Link href="/shop/register">
            <Button size="lg">Register Your Restaurant</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function RestaurantCard({ restaurant, featured = false }) {
  const router = useRouter()

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-orange-500' : ''}`}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500">Featured</Badge>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
            <span className="text-white font-semibold">Closed</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-lg">{restaurant.name}</h4>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>R{restaurant.deliveryFee} delivery</span>
            <span>•</span>
            <span>{restaurant.distance}km away</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
