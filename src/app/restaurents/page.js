"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Star, Clock, Filter, ShoppingCart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { useCartContext } from '@/components/AppContext'
import { Alert, AlertDescription } from '@/components/ui/alert'

const cuisineTypes = ["All", "Burgers", "Pizza", "Chicken", "Japanese", "Mexican", "Steakhouse", "Fast Food", "Other"]

export default function HomePage() {
  const { data: session, status } = useSession()
  const { addToCart, cartProducts } = useCartContext()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedShop, setSelectedShop] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(false)

  // Fetch shops from database
  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/shops')
      const data = await response.json()
      
      if (data.success) {
        setShops(data.shops || [])
      } else {
        setError(data.message || 'Failed to fetch shops')
      }
    } catch (err) {
      console.error('Error fetching shops:', err)
      setError('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  // Fetch menu items for a specific shop
  const fetchMenuItems = async (shopId) => {
    try {
      setLoadingMenu(true)
      const response = await fetch(`/api/menu-items?shopId=${shopId}`)
      const data = await response.json()
      
      if (data.success) {
        setMenuItems(data.menuItems || [])
      } else {
        setError(data.message || 'Failed to fetch menu items')
      }
    } catch (err) {
      console.error('Error fetching menu items:', err)
      setError('Failed to load menu items')
    } finally {
      setLoadingMenu(false)
    }
  }

  const handleShopClick = async (shop) => {
    setSelectedShop(shop)
    await fetchMenuItems(shop._id)
  }

  const handleAddToCart = (item) => {
    if (!session) {
      alert('Please sign in to add items to cart')
      router.push('/auth/signin')
      return
    }
    
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      shopId: selectedShop._id,
      shopName: selectedShop.businessName
    })
    
    alert('Item added to cart!')
  }

  const closeMenu = () => {
    setSelectedShop(null)
    setMenuItems([])
  }

  // Filter and sort shops
  const filteredShops = shops
    .filter(shop => {
      const matchesSearch = 
        shop.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCuisine = 
        selectedCuisine === "All" || 
        shop.cuisine?.toLowerCase() === selectedCuisine.toLowerCase()
      
      return matchesSearch && matchesCuisine
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.businessName || '').localeCompare(b.businessName || '')
        case "cuisine":
          return (a.cuisine || '').localeCompare(b.cuisine || '')
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Delicious Food, Ready Fast</h2>
          <p className="text-xl mb-8">Discover the best restaurants near you</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for restaurants or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

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

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="name">Name</option>
              <option value="cuisine">Cuisine</option>
            </select>
          </div>
        </div>

        {/* Restaurants Grid */}
        <section>
          <h3 className="text-2xl font-bold mb-4">
            All Restaurants ({filteredShops.length})
          </h3>
          
          {filteredShops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {shops.length === 0 
                  ? 'No restaurants available yet. Be the first to register!' 
                  : 'No restaurants found matching your criteria.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map(shop => (
                <ShopCard 
                  key={shop._id} 
                  shop={shop} 
                  onClick={() => handleShopClick(shop)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Menu Modal */}
        {selectedShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedShop.businessName}</h2>
                  <p className="text-gray-600">{selectedShop.cuisine}</p>
                </div>
                <Button variant="outline" onClick={closeMenu}>Close</Button>
              </div>
              
              <div className="p-6">
                {loadingMenu ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading menu...</p>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No menu items available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => item.available)
                      .map(item => (
                        <MenuItemCard 
                          key={item._id} 
                          item={item}
                          onAddToCart={() => handleAddToCart(item)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shop Owner CTA */}
      <section className="bg-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Are you a restaurant owner?</h3>
          <p className="text-gray-600 mb-6">Join FoodHub SA and reach more customers</p>
          <Button size="lg" onClick={() => router.push('/shop-registration')}>
            Register Your Restaurant
          </Button>
        </div>
      </section>
    </div>
  )
}

function ShopCard({ shop, onClick }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        {shop.shopImage ? (
          <img 
            src={shop.shopImage} 
            alt={shop.businessName}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-t-lg flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {shop.businessName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-orange-500">
          {shop.cuisine || 'Food'}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-lg mb-2">{shop.businessName}</h4>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {shop.description || 'Delicious food awaits you!'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{shop.city}</span>
          </div>
          <span className="text-orange-600 font-medium">View Menu →</span>
        </div>
      </CardContent>
    </Card>
  )
}

function MenuItemCard({ item, onAddToCart }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h5 className="font-semibold text-lg">{item.name}</h5>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            <Badge variant="outline" className="text-xs">{item.category}</Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-orange-600">
            R{item.price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            onClick={onAddToCart}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}