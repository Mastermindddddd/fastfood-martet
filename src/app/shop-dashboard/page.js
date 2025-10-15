"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from 'next-auth/react'
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Bell,
  Plus,
  Edit,
  CheckCircle,
  AlertTriangle,
  Loader,
  Trash2,
  X,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Mock data for orders and ingredients
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    items: [
      { name: 'Classic Beef Burger', quantity: 2, price: 89 },
      { name: 'French Fries', quantity: 1, price: 35 }
    ],
    total: 213,
    status: 'new',
    orderTime: '2025-09-29T14:30:00',
    specialInstructions: 'No onions please'
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    items: [
      { name: 'Chicken Deluxe', quantity: 1, price: 79 }
    ],
    total: 79,
    status: 'preparing',
    orderTime: '2025-09-29T14:25:00'
  }
]

const mockIngredients = [
  { id: 1, name: 'Beef Patties', stock: 50, lowStockThreshold: 10, unit: 'pieces' },
  { id: 2, name: 'Chicken Breast', stock: 8, lowStockThreshold: 15, unit: 'pieces' },
  { id: 3, name: 'Lettuce', stock: 25, lowStockThreshold: 5, unit: 'heads' },
  { id: 4, name: 'Tomatoes', stock: 2, lowStockThreshold: 10, unit: 'kg' },
  { id: 5, name: 'Cheese Slices', stock: 100, lowStockThreshold: 20, unit: 'slices' }
]

export default function ShopOwnerDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState(mockOrders)
  const [ingredients, setIngredients] = useState(mockIngredients)
  const [menuItems, setMenuItems] = useState([])
  const [shopOpen, setShopOpen] = useState(true)
  const [shopData, setShopData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Menu modal states
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    available: true
  })
  const [menuErrors, setMenuErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Fetch shop data when component mounts
  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.email) {
      fetchShopData(session.user.email)
    }
  }, [status, session, router])

  const fetchShopData = async (email) => {
    try {
      const res = await fetch(`/api/check-shop?email=${encodeURIComponent(email)}`)
      const data = await res.json()

      if (!data.shopExists || !data.shop) {
        setError('No shop found for this account')
        router.push('/shop-registration')
        return
      }

      setShopData(data.shop)
      // Load menu items (mock data for now - replace with API call)
      loadMenuItems(data.shop._id)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching shop data:', err)
      setError('Failed to load shop data')
      setIsLoading(false)
    }
  }

  const loadMenuItems = async (shopId) => {
    try {
      const res = await fetch(`/api/menu-items?shopId=${shopId}`)
      const data = await res.json()
      
      if (data.success) {
        setMenuItems(data.menuItems.map(item => ({
          ...item,
          id: item._id
        })))
      } else {
        console.error('Failed to load menu items:', data.message)
        setMenuItems([])
      }
    } catch (err) {
      console.error('Error loading menu items:', err)
      setMenuItems([])
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const handleIngredientUpdate = (ingredientId, newStock) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === ingredientId ? { ...ingredient, stock: newStock } : ingredient
    ))
  }

  const handleShopStatusToggle = () => {
    setShopOpen(!shopOpen)
  }

  // Menu management functions
  const openAddMenuModal = () => {
    setEditingItem(null)
    setMenuFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      available: true
    })
    setMenuErrors({})
    setShowMenuModal(true)
  }

  const openEditMenuModal = (item) => {
    setEditingItem(item)
    setMenuFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description || '',
      available: item.available
    })
    setMenuErrors({})
    setShowMenuModal(true)
  }

  const closeMenuModal = () => {
    setShowMenuModal(false)
    setEditingItem(null)
    setMenuFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      available: true
    })
    setMenuErrors({})
  }

  const handleMenuInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setMenuFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (menuErrors[name]) {
      setMenuErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateMenuForm = () => {
    const errors = {}
    if (!menuFormData.name.trim()) errors.name = 'Name is required'
    if (!menuFormData.price || parseFloat(menuFormData.price) <= 0) errors.price = 'Valid price is required'
    if (!menuFormData.category.trim()) errors.category = 'Category is required'
    setMenuErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveMenuItem = async () => {
    if (!validateMenuForm()) return

    setIsSaving(true)
    try {
      if (editingItem) {
        // Update existing item
        const res = await fetch(`/api/menu-items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: menuFormData.name,
            price: parseFloat(menuFormData.price),
            category: menuFormData.category,
            description: menuFormData.description,
            available: menuFormData.available
          })
        })

        const data = await res.json()
        
        if (data.success) {
          setMenuItems(menuItems.map(item => 
            item.id === editingItem.id ? { ...data.menuItem, id: data.menuItem._id } : item
          ))
          closeMenuModal()
        } else {
          setMenuErrors({ general: data.message || 'Failed to update menu item' })
        }
      } else {
        // Add new item
        const res = await fetch('/api/menu-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shopId: shopData._id,
            name: menuFormData.name,
            price: parseFloat(menuFormData.price),
            category: menuFormData.category,
            description: menuFormData.description,
            available: menuFormData.available
          })
        })

        const data = await res.json()
        
        if (data.success) {
          setMenuItems([...menuItems, { ...data.menuItem, id: data.menuItem._id }])
          closeMenuModal()
        } else {
          setMenuErrors({ general: data.message || 'Failed to add menu item' })
        }
      }
    } catch (err) {
      console.error('Error saving menu item:', err)
      setMenuErrors({ general: 'Failed to save menu item' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMenuItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const res = await fetch(`/api/menu-items/${itemId}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      
      if (data.success) {
        setMenuItems(menuItems.filter(item => item.id !== itemId))
      } else {
        alert(data.message || 'Failed to delete menu item')
      }
    } catch (err) {
      console.error('Error deleting menu item:', err)
      alert('Failed to delete menu item')
    }
  }

  const handleToggleAvailability = async (itemId) => {
    try {
      const res = await fetch(`/api/menu-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: undefined }) // Will toggle
      })

      const data = await res.json()
      
      if (data.success) {
        setMenuItems(menuItems.map(item =>
          item.id === itemId ? { ...data.menuItem, id: data.menuItem._id } : item
        ))
      } else {
        alert(data.message || 'Failed to update availability')
      }
    } catch (err) {
      console.error('Error toggling availability:', err)
      alert('Failed to update availability')
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatus = (ingredient) => {
    if (ingredient.stock <= ingredient.lowStockThreshold) {
      return { color: 'text-red-600', icon: AlertTriangle, status: 'Low Stock' }
    }
    return { color: 'text-green-600', icon: CheckCircle, status: 'In Stock' }
  }

  const lowStockCount = ingredients.filter(ing => ing.stock <= ing.lowStockThreshold).length
  const newOrdersCount = orders.filter(order => order.status === 'new').length

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-5 w-5 animate-spin text-orange-600" />
          <span className="text-gray-600">Loading shop dashboard...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  // No shop found
  if (!shopData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Shop Registered</h2>
          <p className="text-gray-600 mb-4">You need to register your shop first</p>
          <Button onClick={() => router.push('/shop-registration')}>Register Shop</Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'orders', name: 'Orders', icon: ShoppingBag, badge: newOrdersCount },
    { id: 'menu', name: 'Menu', icon: Package },
    { id: 'ingredients', name: 'Ingredients', icon: Package, badge: lowStockCount },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-orange-600">FoodHub SA</h1>
              <span className="ml-4 font-medium">{shopData.businessName}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Shop Status:</span>
                <Button
                  variant={shopOpen ? "default" : "secondary"}
                  size="sm"
                  onClick={handleShopStatusToggle}
                >
                  {shopOpen ? 'Open' : 'Closed'}
                </Button>
              </div>
              
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                {(newOrdersCount + lowStockCount) > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {newOrdersCount + lowStockCount}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 ${
                          activeTab === tab.id ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600' : 'text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span>{tab.name}</span>
                        </div>
                        {tab.badge > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {tab.badge}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">New Orders</p>
                          <p className="text-3xl font-bold text-orange-600">{newOrdersCount}</p>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Today&apos;s Revenue</p>
                          <p className="text-3xl font-bold text-green-600">R{(orders.reduce((sum, order) => sum + order.total, 0)).toFixed(2)}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Menu Items</p>
                          <p className="text-3xl font-bold text-blue-600">{menuItems.length}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Shop Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{shopData.address}, {shopData.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cuisine Type</p>
                        <p className="font-medium">{shopData.cuisine}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-medium">{shopData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Owner</p>
                        <p className="font-medium">{shopData.ownerName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.customerName} • R{order.total}</p>
                          </div>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{order.id}</h4>
                            <p className="text-sm text-gray-600">
                              {order.customerName} • {new Date(order.orderTime).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>R{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 font-medium">
                            Total: R{order.total.toFixed(2)}
                          </div>
                        </div>
                        
                        {order.specialInstructions && (
                          <div className="mb-4 p-2 bg-yellow-50 rounded text-sm">
                            <strong>Special Instructions:</strong> {order.specialInstructions}
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          {order.status === 'new' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleOrderStatusUpdate(order.id, 'preparing')}
                            >
                              Accept Order
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleOrderStatusUpdate(order.id, 'completed')}
                            >
                              Mark Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Menu */}
            {activeTab === 'menu' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Menu Management
                    <Button size="sm" onClick={openAddMenuModal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {menuItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No menu items yet</p>
                      <Button onClick={openAddMenuModal}>Add Your First Item</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {menuItems.map(item => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-lg">{item.name}</h4>
                                <Badge variant={item.available ? "default" : "secondary"}>
                                  {item.available ? 'Available' : 'Unavailable'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                              {item.description && (
                                <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                              )}
                              <p className="text-lg font-bold text-orange-600">R{item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAvailability(item.id)}
                              >
                                {item.available ? 'Mark Unavailable' : 'Mark Available'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditMenuModal(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMenuItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {activeTab === 'ingredients' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Ingredient Management
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ingredients.map(ingredient => {
                      const stockStatus = getStockStatus(ingredient)
                      const StatusIcon = stockStatus.icon
                      
                      return (
                        <div key={ingredient.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{ingredient.name}</h4>
                            <p className="text-sm text-gray-600">
                              {ingredient.stock} {ingredient.unit} remaining
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-1 ${stockStatus.color}`}>
                              <StatusIcon className="h-4 w-4" />
                              <span className="text-sm">{stockStatus.status}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIngredientUpdate(ingredient.id, Math.max(0, ingredient.stock - 1))}
                              >
                                -
                              </Button>
                              <span className="w-12 text-center">{ingredient.stock}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIngredientUpdate(ingredient.id, ingredient.stock + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Restaurant Name</Label>
                        <Input defaultValue={shopData.businessName} className="mt-1" />
                      </div>
                      <div>
                        <Label>Contact Phone</Label>
                        <Input defaultValue={shopData.phone} className="mt-1" />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input defaultValue={shopData.address} className="mt-1" />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input defaultValue={shopData.city} className="mt-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Banking Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Bank Name</Label>
                        <Input defaultValue={shopData.bankName} className="mt-1" disabled />
                      </div>
                      <div>
                        <Label>Account Holder</Label>
                        <Input defaultValue={shopData.accountHolder} className="mt-1" disabled />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Contact support to update banking information</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Operating Hours</h3>
                    <div className="space-y-2">
                      {Object.entries(shopData.operatingHours || {}).map(([day, hours]) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span className="capitalize font-medium">{day}</span>
                          <span className="text-gray-600">
                            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>New order notifications</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Low stock alerts</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </label>
                    </div>
                  </div>
                  
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Menu Item Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={closeMenuModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {menuErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {menuErrors.general}
                </div>
              )}

              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={menuFormData.name}
                  onChange={handleMenuInputChange}
                  placeholder="e.g., Classic Beef Burger"
                  className="mt-1"
                />
                {menuErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{menuErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (R) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={menuFormData.price}
                    onChange={handleMenuInputChange}
                    placeholder="89.00"
                    className="mt-1"
                  />
                  {menuErrors.price && (
                    <p className="text-sm text-red-600 mt-1">{menuErrors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={menuFormData.category}
                    onChange={handleMenuInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select category</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Sides">Sides</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Kota">Kota</option>
                    <option value="Dagwood">Dagwood</option>
                    <option value="Hotdog">Hotdog</option>
                  </select>
                  {menuErrors.category && (
                    <p className="text-sm text-red-600 mt-1">{menuErrors.category}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={menuFormData.description}
                  onChange={handleMenuInputChange}
                  placeholder="Describe your item (optional)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={menuFormData.available}
                  onChange={handleMenuInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Label htmlFor="available" className="mb-0">
                  Available for customers
                </Label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <Button
                variant="outline"
                onClick={closeMenuModal}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMenuItem}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}