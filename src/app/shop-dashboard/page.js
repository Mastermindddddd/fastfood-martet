"use client"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/navigation"
import { useSession, signOut } from 'next-auth/react'
import {
  BarChart3,
  Package,
  ShoppingBag,
  LogOut,
  Plus,
  Edit,
  CheckCircle,
  AlertTriangle,
  Loader,
  Trash2,
  X,
  Save,
  AlertCircle,
  Store,
  Bell,
  Clock,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Eye,
  Filter,
  CheckCheck,
  Banknote,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// ─── Notification Bell Component ────────────────────────────────────────────

function NotificationBell({ notifications, onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl border border-orange-200 hover:bg-orange-50 transition-all"
      >
        <Bell className="h-5 w-5 text-orange-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                {unread > 0 && <p className="text-xs text-gray-500">{unread} unread</p>}
              </div>
              {unread > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 items-start ${!n.read ? 'bg-orange-50/40' : ''}`}
                  >
                    <div className={`mt-0.5 rounded-lg p-1.5 flex-shrink-0 ${
                      n.type === 'order' ? 'bg-blue-100 text-blue-600' :
                      n.type === 'low_stock' ? 'bg-orange-100 text-orange-600' :
                      n.type === 'out_of_stock' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {n.type === 'order' ? <ShoppingBag className="h-3.5 w-3.5" /> :
                       n.type === 'low_stock' ? <AlertTriangle className="h-3.5 w-3.5" /> :
                       n.type === 'out_of_stock' ? <XCircle className="h-3.5 w-3.5" /> :
                       <Bell className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Order Status Badge (compact pill for list rows) ─────────────────────────

function OrderStatusBadge({ status }) {
  const cfg = {
    pending:    { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
    confirmed:  { cls: 'bg-blue-100 text-blue-800 border-blue-200',       label: 'Confirmed' },
    preparing:  { cls: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Preparing' },
    ready:      { cls: 'bg-teal-100 text-teal-800 border-teal-200',       label: 'Ready' },
    completed:  { cls: 'bg-green-100 text-green-800 border-green-200',    label: 'Completed' },
    cancelled:  { cls: 'bg-red-100 text-red-800 border-red-200',          label: 'Cancelled' },
  }
  const { cls, label } = cfg[status] || cfg.pending
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  )
}

// ─── Order Status Stepper (horizontal tabs for the detail modal) ──────────────

const ORDER_STATUS_STEPS = [
  { key: 'pending',   label: 'Pending',   dot: '#eab308' },
  { key: 'confirmed', label: 'Confirmed', dot: '#3b82f6' },
  { key: 'preparing', label: 'Preparing', dot: '#a855f7' },
  { key: 'ready',     label: 'Ready',     dot: '#14b8a6' },
  { key: 'completed', label: 'Done',      dot: '#22c55e' },
]

function OrderStatusStepper({ status }) {
  if (status === 'cancelled') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fef2f2', border: '1px solid #fee2e2',
        borderRadius: 12, padding: '8px 14px',
      }}>
        <XCircle style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>Order Cancelled</span>
      </div>
    )
  }

  const currentIdx = ORDER_STATUS_STEPS.findIndex(s => s.key === status)

  return (
    <div>
      {/* Tab row */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {ORDER_STATUS_STEPS.map((step, idx) => {
          const done    = idx < currentIdx
          const current = idx === currentIdx
          const isLast  = idx === ORDER_STATUS_STEPS.length - 1

          return (
            <div
              key={step.key}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
            >
              {/* Connector line */}
              {!isLast && (
                <div style={{
                  position: 'absolute', top: 10, left: '50%',
                  width: '100%', height: 2,
                  background: done ? '#22c55e' : '#e5e7eb',
                  zIndex: 0,
                }} />
              )}

              {/* Dot */}
              <div style={{
                position: 'relative', zIndex: 1,
                width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                background: done ? '#22c55e' : current ? step.dot : '#e5e7eb',
                boxShadow: current ? `0 0 0 3px ${step.dot}33` : 'none',
                transition: 'all 0.2s',
              }}>
                {done && (
                  <CheckCircle style={{ width: 11, height: 11, color: '#fff' }} />
                )}
                {current && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
                )}
              </div>

              {/* Label */}
              <p style={{
                marginTop: 5,
                fontSize: 10,
                fontWeight: current ? 700 : done ? 600 : 400,
                textAlign: 'center',
                lineHeight: '13px',
                color: current ? step.dot : done ? '#16a34a' : '#9ca3af',
                maxWidth: 52,
                wordBreak: 'break-word',
              }}>
                {step.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Current status description */}
      {currentIdx >= 0 && (
        <div style={{
          marginTop: 10,
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff7ed', border: '1px solid #fed7aa',
          borderRadius: 10, padding: '7px 12px',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: ORDER_STATUS_STEPS[currentIdx]?.dot || '#f97316', flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, color: '#c2410c', margin: 0 }}>
            {{
              pending:   'Waiting for the shop to confirm',
              confirmed: 'Shop confirmed — getting started',
              preparing: 'Your food is being prepared',
              ready:     'Ready for collection!',
              completed: 'Order complete. Enjoy!',
            }[status] || ''}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'text-blue-500' },
    green:  { bg: 'bg-green-50',  text: 'text-green-600',  icon: 'text-green-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    red:    { bg: 'bg-red-50',    text: 'text-red-600',    icon: 'text-red-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
  }
  const c = colors[color] || colors.blue
  return (
    <div className={`rounded-2xl p-5 ${c.bg} border border-white`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-3xl font-black ${c.text}`}>{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-xl bg-white/60 ${c.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function ShopOwnerDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuItems, setMenuItems] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [orders, setOrders] = useState([])
  const [shopData, setShopData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderFilter, setOrderFilter] = useState('all')
  const [notifications, setNotifications] = useState([])

  // Menu modal
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [menuFormData, setMenuFormData] = useState({ name: '', price: '', category: '', description: '', selectedIngredients: [] })
  const [menuErrors, setMenuErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Ingredient modal
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [ingredientFormData, setIngredientFormData] = useState({ name: '', stock: '', unit: 'pieces', lowStockThreshold: '10' })
  const [ingredientErrors, setIngredientErrors] = useState({})

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ── Build notifications from current state ─────────────────────────────────

  const buildNotifications = useCallback((ings, ords) => {
    const notifs = []
    ings.forEach(ing => {
      if (ing.stock <= 0) {
        notifs.push({
          id: `out-${ing._id}`,
          type: 'out_of_stock',
          message: `${ing.name} is out of stock`,
          time: 'Just now',
          read: false,
        })
      } else if (ing.stock <= ing.lowStockThreshold) {
        notifs.push({
          id: `low-${ing._id}`,
          type: 'low_stock',
          message: `${ing.name} is running low (${ing.stock} ${ing.unit} left)`,
          time: 'Just now',
          read: false,
        })
      }
    })
    const recentOrders = ords.filter(o => {
      const d = new Date(o.createdAt)
      return Date.now() - d.getTime() < 3600000
    })
    recentOrders.forEach(o => {
      notifs.push({
        id: `order-${o._id}`,
        type: 'order',
        message: `New order #${o._id?.slice(-6).toUpperCase()} received`,
        time: new Date(o.createdAt).toLocaleTimeString(),
        read: false,
      })
    })
    return notifs
  }, [])

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadMenuItems = useCallback(async (shopId) => {
    try {
      const res = await fetch(`/api/menu-items?shopId=${shopId}`)
      const data = await res.json()
      if (data.success) setMenuItems(data.menuItems.map(i => ({ ...i, id: i._id })))
    } catch {}
  }, [])

  const loadIngredients = useCallback(async (shopId) => {
    try {
      const res = await fetch(`/api/ingredients?shopId=${shopId}`)
      const data = await res.json()
      if (data.success) {
        const ings = data.ingredients.map(i => ({ ...i, id: i._id }))
        setIngredients(ings)
        return ings
      }
    } catch {}
    return []
  }, [])

  const loadOrders = useCallback(async (shopId) => {
    try {
      const res = await fetch(`/api/orders?shopId=${shopId}`)
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
        return data.orders || []
      }
    } catch {}
    return []
  }, [])

  useEffect(() => {
    const init = async () => {
      if (status === 'loading') return
      if (status === 'unauthenticated') { router.push('/login'); return }
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const res = await fetch(`/api/check-shop?email=${encodeURIComponent(session.user.email)}`)
          const data = await res.json()
          if (!data.shopExists || !data.shop) { router.push('/shop-registration'); return }
          setShopData(data.shop)
          const [ings, ords] = await Promise.all([
            loadIngredients(data.shop._id),
            loadOrders(data.shop._id),
            loadMenuItems(data.shop._id),
          ])
          setNotifications(buildNotifications(ings, ords))
          setIsLoading(false)
        } catch {
          setError('Failed to load shop data')
          setIsLoading(false)
        }
      }
    }
    init()
  }, [status, session, router, loadMenuItems, loadIngredients, loadOrders, buildNotifications])

  // ── Order management ──────────────────────────────────────────────────────

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        if (selectedOrder?._id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }))
      }
    } catch {}
  }

  const filteredOrders = orders.filter(o => orderFilter === 'all' || o.status === orderFilter)

  // ── Menu management ───────────────────────────────────────────────────────

  const openAddMenuModal = () => {
    setEditingItem(null)
    setMenuFormData({ name: '', price: '', category: '', description: '', selectedIngredients: [] })
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
      selectedIngredients: item.ingredients?.map(ing => ing._id || ing) || [],
    })
    setMenuErrors({})
    setShowMenuModal(true)
  }

  const handleMenuInputChange = (e) => {
    const { name, value } = e.target
    setMenuFormData(prev => ({ ...prev, [name]: value }))
    if (menuErrors[name]) setMenuErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleIngredientSelection = (id) => {
    setMenuFormData(prev => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.includes(id)
        ? prev.selectedIngredients.filter(x => x !== id)
        : [...prev.selectedIngredients, id],
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
        ingredients: menuFormData.selectedIngredients,
      }
      const res = editingItem
        ? await fetch(`/api/menu-items/${editingItem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/menu-items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, shopId: shopData._id }) })
      const data = await res.json()
      if (data.success) { await loadMenuItems(shopData._id); setShowMenuModal(false) }
      else setMenuErrors({ general: data.message })
    } catch { setMenuErrors({ general: 'Failed to save menu item' }) }
    finally { setIsSaving(false) }
  }

  const handleDeleteMenuItem = async (itemId) => {
    if (!confirm('Delete this menu item?')) return
    try {
      const res = await fetch(`/api/menu-items/${itemId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) setMenuItems(menuItems.filter(i => i.id !== itemId))
    } catch {}
  }

  const handleToggleAvailability = async (itemId) => {
    try {
      const res = await fetch(`/api/menu-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      })
      const data = await res.json()
      if (data.success) await loadMenuItems(shopData._id)
    } catch {}
  }

  // ── Ingredient management ─────────────────────────────────────────────────

  const openAddIngredientModal = () => {
    setEditingIngredient(null)
    setIngredientFormData({ name: '', stock: '', unit: 'pieces', lowStockThreshold: '10' })
    setIngredientErrors({})
    setShowIngredientModal(true)
  }

  const openEditIngredientModal = (ingredient) => {
    setEditingIngredient(ingredient)
    setIngredientFormData({
      name: ingredient.name,
      stock: ingredient.stock.toString(),
      unit: ingredient.unit,
      lowStockThreshold: ingredient.lowStockThreshold.toString(),
    })
    setIngredientErrors({})
    setShowIngredientModal(true)
  }

  const validateIngredientForm = () => {
    const errors = {}
    if (!ingredientFormData.name.trim()) errors.name = 'Name is required'
    if (ingredientFormData.stock === '' || parseFloat(ingredientFormData.stock) < 0) errors.stock = 'Valid stock required'
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
        lowStockThreshold: parseFloat(ingredientFormData.lowStockThreshold),
      }
      const res = editingIngredient
        ? await fetch(`/api/ingredients/${editingIngredient.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/ingredients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, shopId: shopData._id }) })
      const data = await res.json()
      if (data.success) {
        const ings = await loadIngredients(shopData._id)
        await loadMenuItems(shopData._id)
        setNotifications(buildNotifications(ings, orders))
        setShowIngredientModal(false)
      } else setIngredientErrors({ general: data.message })
    } catch { setIngredientErrors({ general: 'Failed to save ingredient' }) }
    finally { setIsSaving(false) }
  }

  const handleDeleteIngredient = async (id) => {
    if (!confirm('Delete this ingredient? Menu items using it will be affected.')) return
    try {
      const res = await fetch(`/api/ingredients/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) { await Promise.all([loadIngredients(shopData._id), loadMenuItems(shopData._id)]) }
    } catch {}
  }

  const handleStockUpdate = async (id, operation) => {
    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, amount: 1 }),
      })
      const data = await res.json()
      if (data.success) {
        const ings = await loadIngredients(shopData._id)
        await loadMenuItems(shopData._id)
        setNotifications(buildNotifications(ings, orders))
      }
    } catch {}
  }

  const getStockStatus = (ing) => {
    if (ing.stock <= 0) return { color: 'text-red-600', status: 'Out of Stock', bg: 'bg-red-50 border-red-100', dot: 'bg-red-500' }
    if (ing.stock <= ing.lowStockThreshold) return { color: 'text-orange-600', status: 'Low Stock', bg: 'bg-orange-50 border-orange-100', dot: 'bg-orange-500' }
    return { color: 'text-green-600', status: 'In Stock', bg: 'bg-green-50 border-green-100', dot: 'bg-green-500' }
  }

  const handleLogout = async () => { await signOut({ redirect: false }); router.push('/') }

  // ── Derived stats ─────────────────────────────────────────────────────────

  const lowStockCount = ingredients.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold).length
  const outOfStockCount = ingredients.filter(i => i.stock <= 0).length
  const unavailableMenuItems = menuItems.filter(i => !i.available)
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const todayRevenue = todayOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => {
    const total = o.cartProducts?.reduce((s, p) => s + (p.price || 0), 0) || 0
    return sum + total
  }, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length

  // ── Loading / Error states ────────────────────────────────────────────────

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Store className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !shopData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error || 'No Shop Found'}</h2>
          <Button onClick={() => router.push(error ? '/' : '/shop-registration')}>
            {error ? 'Go Home' : 'Register Shop'}
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3 },
    { id: 'orders', name: 'Orders', icon: ShoppingBag, badge: pendingOrders },
    { id: 'menu', name: 'Menu', icon: Package, badge: unavailableMenuItems.length },
    { id: 'ingredients', name: 'Ingredients', icon: Package, badge: outOfStockCount + lowStockCount },
    { id: 'shop', name: 'Shop Details', icon: Store },
  ]

  const nextStatusMap = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready',
    ready: 'completed',
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm leading-none">{shopData.businessName}</p>
                <p className="text-xs text-gray-400 mt-0.5">FoodHub SA · Owner Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell
                notifications={notifications}
                onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
                onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside>
            <nav className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
              {tabs.map(tab => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all border-l-2 ${
                      active
                        ? 'bg-orange-50 text-orange-600 border-orange-500'
                        : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{tab.name}</span>
                    </div>
                    {tab.badge > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* ── Main Content ──────────────────────────────────────────────── */}
          <main className="min-w-0">

            {/* ── DASHBOARD TAB ─────────────────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋</h1>
                  <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening at {shopData.businessName} today.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Today's Orders" value={todayOrders.length} sub={`${pendingOrders} pending`} icon={ShoppingBag} color="blue" />
                  <StatCard label="Today's Revenue" value={`R${todayRevenue.toFixed(0)}`} sub="From completed orders" icon={Banknote} color="green" />
                  <StatCard label="Menu Items" value={menuItems.length} sub={`${unavailableMenuItems.length} unavailable`} icon={Package} color="purple" />
                  <StatCard label="Stock Alerts" value={outOfStockCount + lowStockCount} sub={`${outOfStockCount} out of stock`} icon={AlertTriangle} color={outOfStockCount > 0 ? 'red' : 'orange'} />
                </div>

                {/* Alerts */}
                {(outOfStockCount > 0 || lowStockCount > 0 || unavailableMenuItems.length > 0) && (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <h2 className="font-bold text-gray-900 text-sm">Active Alerts</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {outOfStockCount > 0 && (
                        <div className="flex items-center gap-4 px-5 py-4">
                          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">{outOfStockCount} ingredient{outOfStockCount > 1 ? 's' : ''} out of stock</p>
                            <p className="text-xs text-gray-500">Restock immediately to avoid menu disruptions</p>
                          </div>
                          <button onClick={() => setActiveTab('ingredients')} className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
                            Manage <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {lowStockCount > 0 && (
                        <div className="flex items-center gap-4 px-5 py-4">
                          <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">{lowStockCount} ingredient{lowStockCount > 1 ? 's' : ''} running low</p>
                            <p className="text-xs text-gray-500">Consider restocking soon</p>
                          </div>
                          <button onClick={() => setActiveTab('ingredients')} className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
                            Manage <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {unavailableMenuItems.length > 0 && (
                        <div className="flex items-center gap-4 px-5 py-4">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">{unavailableMenuItems.length} menu item{unavailableMenuItems.length > 1 ? 's' : ''} unavailable</p>
                            <p className="text-xs text-gray-500">Due to ingredient shortages</p>
                          </div>
                          <button onClick={() => setActiveTab('menu')} className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
                            View <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-sm">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
                      View all <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <ShoppingBag className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No orders yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map(order => (
                        <div key={order._id} className="flex items-center gap-4 px-5 py-3.5">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900">Order #{order._id?.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-400">{order.userEmail} · {new Date(order.createdAt).toLocaleTimeString()}</p>
                          </div>
                          <OrderStatusBadge status={order.status || 'pending'} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ─────────────────────────────────────────────── */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500">{orders.length} total orders</p>
                  </div>
                  <button
                    onClick={async () => { const ords = await loadOrders(shopData._id); setNotifications(buildNotifications(ingredients, ords)) }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(f => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                        orderFilter === f
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {f === 'all' ? `All (${orders.length})` : f}
                    </button>
                  ))}
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                    <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400">No orders in this category</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map(order => (
                      <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center gap-4 px-5 py-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-gray-900">#{order._id?.slice(-6).toUpperCase()}</p>
                              <OrderStatusBadge status={order.status || 'pending'} />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{order.userEmail}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {nextStatusMap[order.status || 'pending'] && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order._id, nextStatusMap[order.status || 'pending'])}
                                className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-xl hover:bg-orange-600 transition-colors capitalize"
                              >
                                Mark {nextStatusMap[order.status || 'pending']}
                              </button>
                            )}
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Order items preview */}
                        {order.cartProducts && order.cartProducts.length > 0 && (
                          <div className="px-5 pb-4 flex flex-wrap gap-2">
                            {order.cartProducts.map((p, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                                {p.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── MENU TAB ───────────────────────────────────────────────── */}
            {activeTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black text-gray-900">Menu Management</h1>
                    <p className="text-sm text-gray-500">{menuItems.length} items · {unavailableMenuItems.length} unavailable</p>
                  </div>
                  <button
                    onClick={openAddMenuModal}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                </div>

                {menuItems.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No menu items yet</p>
                    <button onClick={openAddMenuModal} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold">Add Your First Item</button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {menuItems.map(item => (
                      <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="flex items-start gap-4 p-5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h3 className="font-bold text-gray-900">{item.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.available ? 'Available' : 'Unavailable'}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                            </div>
                            {item.description && <p className="text-sm text-gray-500 mb-2">{item.description}</p>}
                            <p className="text-xl font-black text-orange-600">R{item.price.toFixed(2)}</p>

                            {item.ingredients && item.ingredients.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {item.ingredients.map((ing, idx) => {
                                  const ingredient = ingredients.find(i => i.id === ing._id || i.id === ing)
                                  const isOut = ingredient && ingredient.stock <= 0
                                  const isLow = ingredient && ingredient.stock <= ingredient.lowStockThreshold
                                  return (
                                    <span
                                      key={idx}
                                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                                        isOut ? 'bg-red-50 text-red-700 border-red-200' :
                                        isLow ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-gray-50 text-gray-600 border-gray-200'
                                      }`}
                                    >
                                      {ing.name || ingredient?.name || 'Unknown'}
                                      {ingredient && ` · ${ingredient.stock}`}
                                    </span>
                                  )
                                })}
                              </div>
                            )}

                            {!item.available && item.unavailableReason && (
                              <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100">{item.unavailableReason}</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleToggleAvailability(item.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                item.available
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {item.available ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={() => openEditMenuModal(item)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── INGREDIENTS TAB ────────────────────────────────────────── */}
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black text-gray-900">Ingredients</h1>
                    <p className="text-sm text-gray-500">{ingredients.length} total · {outOfStockCount} out of stock</p>
                  </div>
                  <button
                    onClick={openAddIngredientModal}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Ingredient
                  </button>
                </div>

                {ingredients.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No ingredients yet</p>
                    <button onClick={openAddIngredientModal} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold">Add First Ingredient</button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {ingredients.map(ingredient => {
                      const s = getStockStatus(ingredient)
                      return (
                        <div key={ingredient.id} className={`rounded-2xl border p-4 ${s.bg}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{ingredient.name}</p>
                                <p className="text-xs text-gray-500">
                                  {ingredient.stock} {ingredient.unit} remaining
                                  {ingredient.stock <= ingredient.lowStockThreshold && ` · Threshold: ${ingredient.lowStockThreshold}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className={`text-xs font-semibold ${s.color}`}>{s.status}</span>

                              <div className="flex items-center gap-1.5 bg-white/70 rounded-xl p-1">
                                <button
                                  onClick={() => handleStockUpdate(ingredient.id, 'subtract')}
                                  disabled={ingredient.stock <= 0}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 font-bold text-gray-700 transition-all"
                                >−</button>
                                <span className="w-10 text-center text-sm font-bold text-gray-900">{ingredient.stock}</span>
                                <button
                                  onClick={() => handleStockUpdate(ingredient.id, 'add')}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 font-bold text-gray-700 transition-all"
                                >+</button>
                              </div>

                              <button onClick={() => openEditIngredientModal(ingredient)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/70 rounded-lg transition-all">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteIngredient(ingredient.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-white/70 rounded-lg transition-all">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SHOP DETAILS TAB ───────────────────────────────────────── */}
            {activeTab === 'shop' && (
              <div className="space-y-4">
                <h1 className="text-xl font-black text-gray-900">Shop Details</h1>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Store className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-white">{shopData.businessName}</h2>
                    {shopData.description && <p className="text-orange-100 mt-1 text-sm">{shopData.description}</p>}
                  </div>

                  <div className="p-6 grid gap-4">
                    {[
                      { icon: Mail, label: 'Email', value: shopData.email },
                      { icon: Phone, label: 'Phone', value: shopData.phone || shopData.contactNumber },
                      { icon: MapPin, label: 'Address', value: shopData.address },
                      { icon: Calendar, label: 'Member Since', value: shopData.createdAt ? new Date(shopData.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                    ].filter(r => r.value).map(row => (
                      <div key={row.label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <row.icon className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{row.label}</p>
                          <p className="text-sm font-semibold text-gray-900">{row.value}</p>
                        </div>
                      </div>
                    ))}

                    {/* Shop type / category */}
                    {shopData.category && (
                      <div className="flex items-center gap-4 py-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <Package className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Category</p>
                          <p className="text-sm font-semibold text-gray-900">{shopData.category}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-black text-orange-600">{menuItems.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Menu Items</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-black text-blue-600">{orders.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Orders</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-black text-green-600">{ingredients.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Ingredients</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Order Detail Modal ──────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-black text-gray-900">Order #{selectedOrder._id?.slice(-6).toUpperCase()}</h2>
                <p className="text-xs text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Horizontal status stepper */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <OrderStatusStepper status={selectedOrder.status || 'pending'} />
              </div>

              {/* Next-status action button */}
              {nextStatusMap[selectedOrder.status || 'pending'] && (
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder._id, nextStatusMap[selectedOrder.status || 'pending'])}
                  className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors capitalize"
                >
                  Mark as {nextStatusMap[selectedOrder.status || 'pending']} →
                </button>
              )}

              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Customer</p>
                <div className="flex items-center gap-2 text-sm text-gray-700"><Mail className="h-4 w-4 text-gray-400" />{selectedOrder.userEmail}</div>
                {selectedOrder.phone && <div className="flex items-center gap-2 text-sm text-gray-700"><Phone className="h-4 w-4 text-gray-400" />{selectedOrder.phone}</div>}
                {selectedOrder.streetAddress && <div className="flex items-center gap-2 text-sm text-gray-700"><MapPin className="h-4 w-4 text-gray-400" />{selectedOrder.streetAddress}, {selectedOrder.city}</div>}
              </div>

              {selectedOrder.cartProducts && selectedOrder.cartProducts.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.cartProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm font-medium text-gray-900">{p.name}</span>
                        {p.price && <span className="text-sm font-bold text-orange-600">R{p.price.toFixed(2)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
                <button
                  onClick={() => { handleUpdateOrderStatus(selectedOrder._id, 'cancelled'); setSelectedOrder(null) }}
                  className="w-full py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-semibold transition-all border border-red-100"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Menu Item Modal ─────────────────────────────────────────────────── */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h2>
              <button onClick={() => setShowMenuModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {menuErrors.general && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{menuErrors.general}</div>
              )}

              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Item Name *</Label>
                <Input id="name" name="name" value={menuFormData.name} onChange={handleMenuInputChange} placeholder="e.g., Classic Beef Burger" className="mt-1.5 rounded-xl border-gray-200" />
                {menuErrors.name && <p className="text-xs text-red-500 mt-1">{menuErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price (R) *</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" value={menuFormData.price} onChange={handleMenuInputChange} placeholder="89.00" className="mt-1.5 rounded-xl border-gray-200" />
                  {menuErrors.price && <p className="text-xs text-red-500 mt-1">{menuErrors.price}</p>}
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category *</Label>
                  <select id="category" name="category" value={menuFormData.category} onChange={handleMenuInputChange}
                    className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Select category</option>
                    {['Burgers', 'Kota', 'Pizza', 'Chicken', 'Sides', 'Drinks', 'Desserts'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {menuErrors.category && <p className="text-xs text-red-500 mt-1">{menuErrors.category}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
                <Textarea id="description" name="description" value={menuFormData.description} onChange={handleMenuInputChange} placeholder="Describe your item" rows={3} className="mt-1.5 rounded-xl border-gray-200" />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Ingredients</Label>
                <div className="mt-1.5 border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto">
                  {ingredients.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No ingredients available. Add ingredients first.</p>
                  ) : (
                    <div className="space-y-1">
                      {ingredients.map(ingredient => {
                        const isSelected = menuFormData.selectedIngredients.includes(ingredient.id)
                        const isOut = ingredient.stock <= 0
                        const isLow = ingredient.stock <= ingredient.lowStockThreshold
                        return (
                          <label key={ingredient.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${isOut ? 'opacity-50' : ''}`}>
                            <input type="checkbox" checked={isSelected} onChange={() => handleIngredientSelection(ingredient.id)} className="h-4 w-4 accent-orange-500" />
                            <span className="flex-1 text-sm font-medium text-gray-700">{ingredient.name}</span>
                            <span className="text-xs text-gray-400">{ingredient.stock} {ingredient.unit}</span>
                            {isOut && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Out</span>}
                            {!isOut && isLow && <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">Low</span>}
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Availability is automatically managed based on ingredient stock</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 rounded-b-3xl px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowMenuModal(false)} disabled={isSaving} className="rounded-xl">Cancel</Button>
              <button onClick={handleSaveMenuItem} disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all text-sm">
                {isSaving ? <><Loader className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />{editingItem ? 'Update Item' : 'Add Item'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ingredient Modal ────────────────────────────────────────────────── */}
      {showIngredientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">{editingIngredient ? 'Edit Ingredient' : 'Add Ingredient'}</h2>
              <button onClick={() => setShowIngredientModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {ingredientErrors.general && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{ingredientErrors.general}</div>
              )}

              <div>
                <Label htmlFor="ing-name" className="text-sm font-semibold text-gray-700">Ingredient Name *</Label>
                <Input id="ing-name" name="name" value={ingredientFormData.name} onChange={e => { setIngredientFormData(p => ({ ...p, name: e.target.value })); if (ingredientErrors.name) setIngredientErrors(p => ({ ...p, name: '' })) }} placeholder="e.g., Beef Patties" className="mt-1.5 rounded-xl border-gray-200" />
                {ingredientErrors.name && <p className="text-xs text-red-500 mt-1">{ingredientErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">Stock Quantity *</Label>
                  <Input id="stock" name="stock" type="number" min="0" value={ingredientFormData.stock} onChange={e => setIngredientFormData(p => ({ ...p, stock: e.target.value }))} placeholder="50" className="mt-1.5 rounded-xl border-gray-200" />
                  {ingredientErrors.stock && <p className="text-xs text-red-500 mt-1">{ingredientErrors.stock}</p>}
                </div>
                <div>
                  <Label htmlFor="unit" className="text-sm font-semibold text-gray-700">Unit *</Label>
                  <select id="unit" name="unit" value={ingredientFormData.unit} onChange={e => setIngredientFormData(p => ({ ...p, unit: e.target.value }))}
                    className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {['pieces', 'kg', 'grams', 'liters', 'ml', 'units', 'packs'].map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="threshold" className="text-sm font-semibold text-gray-700">Low Stock Alert Threshold</Label>
                <Input id="threshold" name="lowStockThreshold" type="number" min="0" value={ingredientFormData.lowStockThreshold} onChange={e => setIngredientFormData(p => ({ ...p, lowStockThreshold: e.target.value }))} placeholder="10" className="mt-1.5 rounded-xl border-gray-200" />
                <p className="text-xs text-gray-400 mt-1.5">You&apos;ll be alerted when stock falls below this level</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-b-3xl px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowIngredientModal(false)} disabled={isSaving} className="rounded-xl">Cancel</Button>
              <button onClick={handleSaveIngredient} disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all text-sm">
                {isSaving ? <><Loader className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />{editingIngredient ? 'Update' : 'Add Ingredient'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}