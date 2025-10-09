"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Mock data
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

const mockMenuItems = [
  {
    id: 1,
    name: 'Classic Beef Burger',
    price: 89,
    category: 'Burgers',
    available: true,
    ingredients: [1, 3, 4, 5]
  },
  {
    id: 2,
    name: 'Chicken Deluxe',
    price: 79,
    category: 'Burgers',
    available: true,
    ingredients: [2, 3, 4]
  },
  {
    id: 3,
    name: 'Veggie Burger',
    price: 75,
    category: 'Burgers',
    available: false,
    ingredients: [3, 4, 5]
  }
]

export default function ShopOwnerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState(mockOrders)
  const [ingredients, setIngredients] = useState(mockIngredients)
  const [menuItems, setMenuItems] = useState(mockMenuItems)
  const [shopOpen, setShopOpen] = useState(true)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)

  // ✅ Added a sample user
  const [user, setUser] = useState({
    id: 1,
    name: "Sample Shop Owner",
    email: "owner@example.com",
  })

  useEffect(() => {
  const updatedMenuItems = menuItems.map(item => {
    const hasLowStockIngredients = item.ingredients.some(ingredientId => {
      const ingredient = ingredients.find(ing => ing.id === ingredientId)
      return ingredient && ingredient.stock <= ingredient.lowStockThreshold
    })
    return {
      ...item,
      available: !hasLowStockIngredients
    }
  })

  // ✅ Only update if something actually changed
  const hasChanges = updatedMenuItems.some((item, i) => item.available !== menuItems[i].available)
  if (hasChanges) setMenuItems(updatedMenuItems)
}, [ingredients, menuItems])


  const handleLogout = () => {
    setUser(null)
    router.push("/")   // ✅ useRouter instead of useNavigate
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <Link href="/shop/login">
            <Button>Shop Owner Login</Button>
          </Link>
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
              <span className="ml-4 font-medium">{user.shopName}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Shop Status:</span>
                <Button
                  variant={shopOpen ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setShopOpen(!shopOpen)}
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
                          <p className="text-sm text-gray-600">Low Stock Items</p>
                          <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
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
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.category} • R{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={item.available ? "default" : "secondary"}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {activeTab === 'ingredients' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Ingredient Management
                    <Button size="sm" onClick={() => setShowIngredientModal(true)}>
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
                        <Input defaultValue={user.shopName} className="mt-1" />
                      </div>
                      <div>
                        <Label>Contact Phone</Label>
                        <Input defaultValue="+27 21 123 4567" className="mt-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Operating Hours</h3>
                    <p className="text-sm text-gray-600 mb-4">Configure your restaurant&apos;s operating hours</p>
                    <Button variant="outline">Edit Hours</Button>
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
    </div>
  )
}
