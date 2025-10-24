"use client"
import { useState, useEffect } from 'react'
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
  Save,
  AlertCircle as AlertIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ShopOwnerDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuItems, setMenuItems] = useState([])
  const [ingredients, setIngredients] = useState([])
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
    selectedIngredients: []
  })
  const [menuErrors, setMenuErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Ingredient modal states
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [ingredientFormData, setIngredientFormData] = useState({
    name: '',
    stock: '',
    unit: 'pieces',
    lowStockThreshold: '10'
  })
  const [ingredientErrors, setIngredientErrors] = useState({})

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
      await Promise.all([
        loadMenuItems(data.shop._id),
        loadIngredients(data.shop._id)
      ])
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
      }
    } catch (err) {
      console.error('Error loading menu items:', err)
    }
  }

  const loadIngredients = async (shopId) => {
    try {
      const res = await fetch(`/api/ingredients?shopId=${shopId}`)
      const data = await res.json()
      
      if (data.success) {
        setIngredients(data.ingredients.map(ing => ({
          ...ing,
          id: ing._id
        })))
      }
    } catch (err) {
      console.error('Error loading ingredients:', err)
    }
  }

  // Menu Management
  const openAddMenuModal = () => {
    setEditingItem(null)
    setMenuFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      selectedIngredients: []
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
      selectedIngredients: item.ingredients?.map(ing => ing._id || ing) || []
    })
    setMenuErrors({})
    setShowMenuModal(true)
  }

  const handleMenuInputChange = (e) => {
    const { name, value } = e.target
    setMenuFormData(prev => ({ ...prev, [name]: value }))
    if (menuErrors[name]) {
      setMenuErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleIngredientSelection = (ingredientId) => {
    setMenuFormData(prev => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.includes(ingredientId)
        ? prev.selectedIngredients.filter(id => id !== ingredientId)
        : [...prev.selectedIngredients, ingredientId]
    }))
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
      const payload = {
        name: menuFormData.name,
        price: parseFloat(menuFormData.price),
        category: menuFormData.category,
        description: menuFormData.description,
        ingredients: menuFormData.selectedIngredients
      }

      let res
      if (editingItem) {
        res = await fetch(`/api/menu-items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/menu-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, shopId: shopData._id })
        })
      }

      const data = await res.json()
      
      if (data.success) {
        await loadMenuItems(shopData._id)
        setShowMenuModal(false)
      } else {
        setMenuErrors({ general: data.message })
      }
    } catch (err) {
      setMenuErrors({ general: 'Failed to save menu item' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMenuItem = async (itemId) => {
    if (!confirm('Delete this menu item?')) return

    try {
      const res = await fetch(`/api/menu-items/${itemId}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (data.success) {
        setMenuItems(menuItems.filter(item => item.id !== itemId))
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert('Failed to delete menu item')
    }
  }

  const handleToggleAvailability = async (itemId) => {
    try {
      const res = await fetch(`/api/menu-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' })
      })

      const data = await res.json()
      
      if (data.success) {
        await loadMenuItems(shopData._id)
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert('Failed to update availability')
    }
  }

  // Ingredient Management
  const openAddIngredientModal = () => {
    setEditingIngredient(null)
    setIngredientFormData({
      name: '',
      stock: '',
      unit: 'pieces',
      lowStockThreshold: '10'
    })
    setIngredientErrors({})
    setShowIngredientModal(true)
  }

  const openEditIngredientModal = (ingredient) => {
    setEditingIngredient(ingredient)
    setIngredientFormData({
      name: ingredient.name,
      stock: ingredient.stock.toString(),
      unit: ingredient.unit,
      lowStockThreshold: ingredient.lowStockThreshold.toString()
    })
    setIngredientErrors({})
    setShowIngredientModal(true)
  }

  const handleIngredientInputChange = (e) => {
    const { name, value } = e.target
    setIngredientFormData(prev => ({ ...prev, [name]: value }))
    if (ingredientErrors[name]) {
      setIngredientErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateIngredientForm = () => {
    const errors = {}
    if (!ingredientFormData.name.trim()) errors.name = 'Name is required'
    if (ingredientFormData.stock === '' || parseFloat(ingredientFormData.stock) < 0) 
      errors.stock = 'Valid stock is required'
    if (!ingredientFormData.unit) errors.unit = 'Unit is required'
    setIngredientErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveIngredient = async () => {
    if (!validateIngredientForm()) return

    setIsSaving(true)
    try {
      const payload = {
        name: ingredientFormData.name,
        stock: parseFloat(ingredientFormData.stock),
        unit: ingredientFormData.unit,
        lowStockThreshold: parseFloat(ingredientFormData.lowStockThreshold)
      }

      let res
      if (editingIngredient) {
        res = await fetch(`/api/ingredients/${editingIngredient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, shopId: shopData._id })
        })
      }

      const data = await res.json()
      
      if (data.success) {
        await Promise.all([
          loadIngredients(shopData._id),
          loadMenuItems(shopData._id) // Refresh menu items to update availability
        ])
        setShowIngredientModal(false)
      } else {
        setIngredientErrors({ general: data.message })
      }
    } catch (err) {
      setIngredientErrors({ general: 'Failed to save ingredient' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteIngredient = async (ingredientId) => {
    if (!confirm('Delete this ingredient? Menu items using it will be affected.')) return

    try {
      const res = await fetch(`/api/ingredients/${ingredientId}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (data.success) {
        await Promise.all([
          loadIngredients(shopData._id),
          loadMenuItems(shopData._id)
        ])
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert('Failed to delete ingredient')
    }
  }

  const handleStockUpdate = async (ingredientId, operation) => {
    try {
      const res = await fetch(`/api/ingredients/${ingredientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, amount: 1 })
      })

      const data = await res.json()
      
      if (data.success) {
        await Promise.all([
          loadIngredients(shopData._id),
          loadMenuItems(shopData._id) // Refresh to update menu availability
        ])
      }
    } catch (err) {
      console.error('Failed to update stock')
    }
  }

  const getStockStatus = (ingredient) => {
    if (ingredient.stock <= 0) {
      return { color: 'text-red-600', icon: AlertTriangle, status: 'Out of Stock', bgColor: 'bg-red-50' }
    }
    if (ingredient.stock <= ingredient.lowStockThreshold) {
      return { color: 'text-orange-600', icon: AlertTriangle, status: 'Low Stock', bgColor: 'bg-orange-50' }
    }
    return { color: 'text-green-600', icon: CheckCircle, status: 'In Stock', bgColor: 'bg-green-50' }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const lowStockCount = ingredients.filter(ing => ing.stock <= ing.lowStockThreshold).length
  const outOfStockCount = ingredients.filter(ing => ing.stock <= 0).length
  const unavailableMenuItems = menuItems.filter(item => !item.available)

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-5 w-5 animate-spin text-orange-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error || !shopData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'No Shop Registered'}
          </h2>
          <Button onClick={() => router.push(error ? '/' : '/shop-registration')}>
            {error ? 'Go Home' : 'Register Shop'}
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'menu', name: 'Menu', icon: Package, badge: unavailableMenuItems.length },
    { id: 'ingredients', name: 'Ingredients', icon: Package, badge: lowStockCount }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-orange-600">FoodHub SA</h1>
              <span className="ml-4 font-medium">{shopData.businessName}</span>
            </div>
            
            <div className="flex items-center space-x-4">
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

          <div className="lg:col-span-4">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Menu Items</p>
                          <p className="text-3xl font-bold text-blue-600">{menuItems.length}</p>
                          {unavailableMenuItems.length > 0 && (
                            <p className="text-xs text-red-600 mt-1">{unavailableMenuItems.length} unavailable</p>
                          )}
                        </div>
                        <Package className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Ingredients</p>
                          <p className="text-3xl font-bold text-green-600">{ingredients.length}</p>
                          {lowStockCount > 0 && (
                            <p className="text-xs text-orange-600 mt-1">{lowStockCount} low stock</p>
                          )}
                        </div>
                        <Package className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Out of Stock</p>
                          <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {(lowStockCount > 0 || unavailableMenuItems.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertIcon className="h-5 w-5 text-orange-600" />
                        <span>Alerts</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {outOfStockCount > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="font-medium text-red-800">{outOfStockCount} ingredient(s) out of stock</p>
                          <p className="text-sm text-red-600 mt-1">Restock immediately to avoid menu disruptions</p>
                        </div>
                      )}
                      {lowStockCount > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="font-medium text-orange-800">{lowStockCount} ingredient(s) running low</p>
                          <p className="text-sm text-orange-600 mt-1">Consider restocking soon</p>
                        </div>
                      )}
                      {unavailableMenuItems.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="font-medium text-yellow-800">{unavailableMenuItems.length} menu item(s) unavailable</p>
                          <p className="text-sm text-yellow-600 mt-1">Due to ingredient shortages</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

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
                              <p className="text-lg font-bold text-orange-600 mb-2">R{item.price.toFixed(2)}</p>
                              
                              {item.ingredients && item.ingredients.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-gray-600 mb-1">Ingredients:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.ingredients.map((ing, idx) => {
                                      const ingredient = ingredients.find(i => i.id === ing._id || i.id === ing)
                                      const isLowStock = ingredient && ingredient.stock <= ingredient.lowStockThreshold
                                      const isOutOfStock = ingredient && ingredient.stock <= 0
                                      
                                      return (
                                        <Badge 
                                          key={idx} 
                                          variant="outline"
                                          className={
                                            isOutOfStock ? 'bg-red-50 text-red-700 border-red-200' :
                                            isLowStock ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            'bg-gray-50'
                                          }
                                        >
                                          {ing.name || ingredient?.name || 'Unknown'}
                                          {ingredient && ` (${ingredient.stock})`}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {!item.available && item.unavailableReason && (
                                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                  {item.unavailableReason}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAvailability(item.id)}
                              >
                                {item.available ? 'Disable' : 'Enable'}
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

            {activeTab === 'ingredients' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Ingredient Management
                    <Button size="sm" onClick={openAddIngredientModal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ingredients.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No ingredients yet</p>
                      <Button onClick={openAddIngredientModal}>Add Your First Ingredient</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ingredients.map(ingredient => {
                        const stockStatus = getStockStatus(ingredient)
                        const StatusIcon = stockStatus.icon
                        
                        return (
                          <div key={ingredient.id} className={`border rounded-lg p-4 ${stockStatus.bgColor}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-1">
                                  <h4 className="font-medium">{ingredient.name}</h4>
                                  <div className={`flex items-center space-x-1 ${stockStatus.color}`}>
                                    <StatusIcon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{stockStatus.status}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {ingredient.stock} {ingredient.unit} remaining
                                  {ingredient.stock <= ingredient.lowStockThreshold && 
                                    ` (Low threshold: ${ingredient.lowStockThreshold})`
                                  }
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStockUpdate(ingredient.id, 'subtract')}
                                    disabled={ingredient.stock <= 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-12 text-center font-medium">{ingredient.stock}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStockUpdate(ingredient.id, 'add')}
                                  >
                                    +
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditIngredientModal(ingredient)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteIngredient(ingredient.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
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
              <button onClick={() => setShowMenuModal(false)} className="text-gray-400 hover:text-gray-600">
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
                {menuErrors.name && <p className="text-sm text-red-600 mt-1">{menuErrors.name}</p>}
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
                  {menuErrors.price && <p className="text-sm text-red-600 mt-1">{menuErrors.price}</p>}
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
                    <option value="Kota">Kota</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Sides">Sides</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                  {menuErrors.category && <p className="text-sm text-red-600 mt-1">{menuErrors.category}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={menuFormData.description}
                  onChange={handleMenuInputChange}
                  placeholder="Describe your item"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Select Ingredients</Label>
                <div className="mt-2 border rounded-lg p-4 max-h-48 overflow-y-auto">
                  {ingredients.length === 0 ? (
                    <p className="text-sm text-gray-500">No ingredients available. Add ingredients first.</p>
                  ) : (
                    <div className="space-y-2">
                      {ingredients.map(ingredient => {
                        const isSelected = menuFormData.selectedIngredients.includes(ingredient.id)
                        const isLowStock = ingredient.stock <= ingredient.lowStockThreshold
                        const isOutOfStock = ingredient.stock <= 0
                        
                        return (
                          <label
                            key={ingredient.id}
                            className={`flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                              isOutOfStock ? 'opacity-50' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleIngredientSelection(ingredient.id)}
                              className="h-4 w-4"
                            />
                            <span className="flex-1">{ingredient.name}</span>
                            <span className="text-sm text-gray-500">
                              {ingredient.stock} {ingredient.unit}
                            </span>
                            {isOutOfStock && (
                              <Badge variant="secondary" className="text-red-600">Out</Badge>
                            )}
                            {!isOutOfStock && isLowStock && (
                              <Badge variant="secondary" className="text-orange-600">Low</Badge>
                            )}
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Item availability will be automatically managed based on ingredient stock
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <Button variant="outline" onClick={() => setShowMenuModal(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveMenuItem} disabled={isSaving}>
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

      {/* Ingredient Modal */}
      {showIngredientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
              </h2>
              <button onClick={() => setShowIngredientModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {ingredientErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {ingredientErrors.general}
                </div>
              )}

              <div>
                <Label htmlFor="ing-name">Ingredient Name *</Label>
                <Input
                  id="ing-name"
                  name="name"
                  value={ingredientFormData.name}
                  onChange={handleIngredientInputChange}
                  placeholder="e.g., Beef Patties"
                  className="mt-1"
                />
                {ingredientErrors.name && <p className="text-sm text-red-600 mt-1">{ingredientErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={ingredientFormData.stock}
                    onChange={handleIngredientInputChange}
                    placeholder="50"
                    className="mt-1"
                  />
                  {ingredientErrors.stock && <p className="text-sm text-red-600 mt-1">{ingredientErrors.stock}</p>}
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <select
                    id="unit"
                    name="unit"
                    value={ingredientFormData.unit}
                    onChange={handleIngredientInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="grams">Grams</option>
                    <option value="liters">Liters</option>
                    <option value="ml">Milliliters</option>
                    <option value="units">Units</option>
                    <option value="packs">Packs</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="threshold">Low Stock Alert Threshold</Label>
                <Input
                  id="threshold"
                  name="lowStockThreshold"
                  type="number"
                  min="0"
                  value={ingredientFormData.lowStockThreshold}
                  onChange={handleIngredientInputChange}
                  placeholder="10"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You&apos;ll be alerted when stock falls below this level
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <Button variant="outline" onClick={() => setShowIngredientModal(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveIngredient} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingIngredient ? 'Update' : 'Add'}
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