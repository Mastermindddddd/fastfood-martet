"use client"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/navigation"
import { useSession, signOut } from 'next-auth/react'
import {
  BarChart3, Package, ShoppingBag, LogOut, Plus, Edit,
  CheckCircle, AlertTriangle, Loader, Trash2, X, Save,
  AlertCircle, Store, Bell, Clock, ChevronRight, RefreshCw,
  MapPin, Phone, Mail, Calendar, Eye, CheckCheck, Banknote,
  XCircle, ArrowRight, TrendingUp,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'completed']

const STATUS_META = {
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
  confirmed: { label: 'Confirmed', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
  preparing: { label: 'Preparing', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6' },
  ready:     { label: 'Ready',     color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', dot: '#14b8a6' },
  completed: { label: 'Completed', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
}

function nextStatus(current) {
  const idx = STATUS_FLOW.indexOf(current)
  return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null
}

// ─── Notification Bell ────────────────────────────────────────────────────────

function NotificationBell({ notifications, onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={S.bellBtn} className="bell-btn">
        <Bell size={18} />
        {unread > 0 && (
          <span style={S.bellBadge}>{unread}</span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={S.notifPanel}>
            <div style={S.notifHeader}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Notifications</p>
                {unread > 0 && <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{unread} unread</p>}
              </div>
              {unread > 0 && (
                <button onClick={onMarkAllRead} style={S.markAllBtn}>
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#bbb' }}>
                  <Bell size={28} style={{ marginBottom: 8 }} />
                  <p style={{ fontSize: 13 }}>No notifications</p>
                </div>
              ) : notifications.map(n => (
                <div key={n.id} onClick={() => onMarkRead(n.id)} style={{
                  ...S.notifItem,
                  background: n.read ? '#fff' : '#fffbf5',
                  borderBottom: '1px solid #f3f4f6',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: n.type === 'order' ? '#dbeafe' : n.type === 'out_of_stock' ? '#fee2e2' : '#ffedd5',
                    color: n.type === 'order' ? '#2563eb' : n.type === 'out_of_stock' ? '#dc2626' : '#ea580c',
                  }}>
                    {n.type === 'order' ? <ShoppingBag size={14} /> :
                     n.type === 'out_of_stock' ? <XCircle size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: '#222', lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{n.time}</p>
                  </div>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600,
      color: m.color, background: m.bg, border: `1px solid ${m.border}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  )
}

// ─── Order Status Stepper ─────────────────────────────────────────────────────

function StatusStepper({ status }) {
  if (status === 'cancelled') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px' }}>
        <XCircle size={16} style={{ color: '#dc2626' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>Order Cancelled</span>
      </div>
    )
  }

  const currentIdx = STATUS_FLOW.indexOf(status)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {STATUS_FLOW.map((step, idx) => {
          const m = STATUS_META[step]
          const done = idx < currentIdx
          const current = idx === currentIdx
          const isLast = idx === STATUS_FLOW.length - 1
          return (
            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {!isLast && (
                <div style={{ position: 'absolute', top: 10, left: '50%', width: '100%', height: 2, background: done ? '#22c55e' : '#e5e7eb', zIndex: 0 }} />
              )}
              <div style={{
                position: 'relative', zIndex: 1, width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#22c55e' : current ? m.dot : '#e5e7eb',
                boxShadow: current ? `0 0 0 3px ${m.dot}44` : 'none',
              }}>
                {done ? <CheckCircle size={11} style={{ color: '#fff' }} /> :
                 current ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} /> : null}
              </div>
              <p style={{
                marginTop: 6, fontSize: 10, fontWeight: current ? 700 : done ? 600 : 400,
                textAlign: 'center', color: current ? m.dot : done ? '#16a34a' : '#9ca3af',
                maxWidth: 52, wordBreak: 'break-word', lineHeight: '13px',
              }}>{m.label}</p>
            </div>
          )
        })}
      </div>
      {currentIdx >= 0 && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: STATUS_META[status].bg, border: `1px solid ${STATUS_META[status].border}`, borderRadius: 10, padding: '8px 14px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_META[status].dot, flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, color: STATUS_META[status].color, margin: 0 }}>
            {{ pending: 'Waiting for confirmation', confirmed: 'Confirmed — getting started', preparing: 'Food is being prepared', ready: 'Ready for collection!', completed: 'Order complete.' }[status]}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</p>
          <p style={{ fontSize: 30, fontWeight: 900, color: accent, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: '#aaa', marginTop: 5 }}>{sub}</p>}
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
    </div>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 360, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <AlertTriangle size={28} style={{ color: '#f59e0b', marginBottom: 12 }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 20, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', fontSize: 14, fontWeight: 600, color: '#555', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: '#ef4444', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

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
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null) // { message, onConfirm }

  // Menu modal state
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [menuForm, setMenuForm] = useState({ name: '', price: '', category: '', description: '', selectedIngredients: [] })
  const [menuErrors, setMenuErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Ingredient modal state
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [ingForm, setIngForm] = useState({ name: '', stock: '', unit: 'pieces', lowStockThreshold: '10' })
  const [ingErrors, setIngErrors] = useState({})

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ── Notifications ──────────────────────────────────────────────────────────

  const buildNotifications = useCallback((ings, ords) => {
    const notifs = []
    ings.forEach(ing => {
      if (ing.stock <= 0) notifs.push({ id: `out-${ing._id}`, type: 'out_of_stock', message: `${ing.name} is out of stock`, time: 'Now', read: false })
      else if (ing.stock <= ing.lowStockThreshold) notifs.push({ id: `low-${ing._id}`, type: 'low_stock', message: `${ing.name} running low (${ing.stock} ${ing.unit} left)`, time: 'Now', read: false })
    })
    ords.filter(o => Date.now() - new Date(o.createdAt).getTime() < 3600000).forEach(o => {
      notifs.push({ id: `order-${o._id}`, type: 'order', message: `New order #${o._id?.slice(-6).toUpperCase()}`, time: new Date(o.createdAt).toLocaleTimeString(), read: false })
    })
    return notifs
  }, [])

  // ── Data fetching ──────────────────────────────────────────────────────────

  const loadMenuItems = useCallback(async (shopId) => {
    try {
      const r = await fetch(`/api/menu-items?shopId=${shopId}`)
      const d = await r.json()
      if (d.success) setMenuItems(d.menuItems.map(i => ({ ...i, id: i._id })))
    } catch {}
  }, [])

  const loadIngredients = useCallback(async (shopId) => {
    try {
      const r = await fetch(`/api/ingredients?shopId=${shopId}`)
      const d = await r.json()
      if (d.success) { const ings = d.ingredients.map(i => ({ ...i, id: i._id })); setIngredients(ings); return ings }
    } catch {}
    return []
  }, [])

  const loadOrders = useCallback(async (shopId) => {
    try {
      const r = await fetch(`/api/orders?shopId=${shopId}`)
      const d = await r.json()
      if (d.success) { setOrders(d.orders || []); return d.orders || [] }
    } catch {}
    return []
  }, [])

  useEffect(() => {
    const init = async () => {
      if (status === 'loading') return
      if (status === 'unauthenticated') { router.push('/login'); return }
      try {
        const r = await fetch(`/api/check-shop?email=${encodeURIComponent(session.user.email)}`)
        const d = await r.json()
        if (!d.shopExists || !d.shop) { router.push('/shop-registration'); return }
        setShopData(d.shop)
        const [ings, ords] = await Promise.all([loadIngredients(d.shop._id), loadOrders(d.shop._id), loadMenuItems(d.shop._id)])
        setNotifications(buildNotifications(ings, ords))
      } catch { setError('Failed to load shop data') }
      finally { setIsLoading(false) }
    }
    init()
  }, [status, session, router, loadMenuItems, loadIngredients, loadOrders, buildNotifications])

  // ── Order status update — THE FIX ─────────────────────────────────────────
  // Previously the PATCH request hit /api/orders/[id] which had no handler.
  // This now correctly calls that endpoint and shows inline feedback.

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
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
      } else {
        alert(data.message || 'Failed to update order status')
      }
    } catch {
      alert('Network error — please try again')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const confirmCancel = (orderId) => {
    setConfirmDialog({
      message: 'Cancel this order? The customer will be notified.',
      onConfirm: () => { setConfirmDialog(null); handleUpdateOrderStatus(orderId, 'cancelled') },
    })
  }

  const filteredOrders = orders.filter(o => orderFilter === 'all' || o.status === orderFilter)

  // ── Menu helpers ───────────────────────────────────────────────────────────

  const openAddMenu = () => { setEditingItem(null); setMenuForm({ name: '', price: '', category: '', description: '', selectedIngredients: [] }); setMenuErrors({}); setShowMenuModal(true) }
  const openEditMenu = (item) => {
    setEditingItem(item)
    setMenuForm({ name: item.name, price: item.price.toString(), category: item.category, description: item.description || '', selectedIngredients: item.ingredients?.map(i => i._id || i) || [] })
    setMenuErrors({}); setShowMenuModal(true)
  }
  const toggleIngredientSel = (id) => setMenuForm(p => ({ ...p, selectedIngredients: p.selectedIngredients.includes(id) ? p.selectedIngredients.filter(x => x !== id) : [...p.selectedIngredients, id] }))
  const validateMenu = () => {
    const e = {}
    if (!menuForm.name.trim()) e.name = 'Name is required'
    if (!menuForm.price || parseFloat(menuForm.price) <= 0) e.price = 'Valid price required'
    if (!menuForm.category.trim()) e.category = 'Category is required'
    setMenuErrors(e); return !Object.keys(e).length
  }
  const handleSaveMenuItem = async () => {
    if (!validateMenu()) return
    setIsSaving(true)
    try {
      const payload = { name: menuForm.name, price: parseFloat(menuForm.price), category: menuForm.category, description: menuForm.description, ingredients: menuForm.selectedIngredients }
      const res = editingItem
        ? await fetch(`/api/menu-items/${editingItem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/menu-items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, shopId: shopData._id }) })
      const d = await res.json()
      if (d.success) { await loadMenuItems(shopData._id); setShowMenuModal(false) }
      else setMenuErrors({ general: d.message })
    } catch { setMenuErrors({ general: 'Failed to save item' }) }
    finally { setIsSaving(false) }
  }
  const handleDeleteMenuItem = (itemId) => setConfirmDialog({
    message: 'Permanently delete this menu item?',
    onConfirm: async () => {
      setConfirmDialog(null)
      const r = await fetch(`/api/menu-items/${itemId}`, { method: 'DELETE' })
      const d = await r.json()
      if (d.success) setMenuItems(menuItems.filter(i => i.id !== itemId))
    },
  })
  const handleToggleAvailability = async (itemId) => {
    const r = await fetch(`/api/menu-items/${itemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggle' }) })
    const d = await r.json()
    if (d.success) await loadMenuItems(shopData._id)
  }

  // ── Ingredient helpers ─────────────────────────────────────────────────────

  const openAddIng = () => { setEditingIngredient(null); setIngForm({ name: '', stock: '', unit: 'pieces', lowStockThreshold: '10' }); setIngErrors({}); setShowIngredientModal(true) }
  const openEditIng = (ing) => { setEditingIngredient(ing); setIngForm({ name: ing.name, stock: ing.stock.toString(), unit: ing.unit, lowStockThreshold: ing.lowStockThreshold.toString() }); setIngErrors({}); setShowIngredientModal(true) }
  const validateIng = () => {
    const e = {}
    if (!ingForm.name.trim()) e.name = 'Name is required'
    if (ingForm.stock === '' || parseFloat(ingForm.stock) < 0) e.stock = 'Valid stock required'
    setIngErrors(e); return !Object.keys(e).length
  }
  const handleSaveIngredient = async () => {
    if (!validateIng()) return
    setIsSaving(true)
    try {
      const payload = { name: ingForm.name, stock: parseFloat(ingForm.stock), unit: ingForm.unit, lowStockThreshold: parseFloat(ingForm.lowStockThreshold) }
      const res = editingIngredient
        ? await fetch(`/api/ingredients/${editingIngredient.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/ingredients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, shopId: shopData._id }) })
      const d = await res.json()
      if (d.success) { const ings = await loadIngredients(shopData._id); await loadMenuItems(shopData._id); setNotifications(buildNotifications(ings, orders)); setShowIngredientModal(false) }
      else setIngErrors({ general: d.message })
    } catch { setIngErrors({ general: 'Failed to save ingredient' }) }
    finally { setIsSaving(false) }
  }
  const handleDeleteIngredient = (id) => setConfirmDialog({
    message: 'Delete this ingredient? Menu items using it will be affected.',
    onConfirm: async () => { setConfirmDialog(null); const r = await fetch(`/api/ingredients/${id}`, { method: 'DELETE' }); const d = await r.json(); if (d.success) { await Promise.all([loadIngredients(shopData._id), loadMenuItems(shopData._id)]) } },
  })
  const handleStockUpdate = async (id, op) => {
    const r = await fetch(`/api/ingredients/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operation: op, amount: 1 }) })
    const d = await r.json()
    if (d.success) { const ings = await loadIngredients(shopData._id); await loadMenuItems(shopData._id); setNotifications(buildNotifications(ings, orders)) }
  }

  const stockMeta = (ing) => {
    if (ing.stock <= 0) return { label: 'Out of stock', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' }
    if (ing.stock <= ing.lowStockThreshold) return { label: 'Low stock', color: '#d97706', bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' }
    return { label: 'In stock', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────

  const lowStockCount = ingredients.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold).length
  const outOfStockCount = ingredients.filter(i => i.stock <= 0).length
  const unavailableItems = menuItems.filter(i => !i.available)
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const todayRevenue = todayOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.cartProducts?.reduce((s, p) => s + (p.price || 0), 0) || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  // ── Loading / error ────────────────────────────────────────────────────────

  if (status === 'loading' || isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #fed7aa' }}>
            <Store size={26} style={{ color: '#f97316' }} />
          </div>
          <p style={{ color: '#888', fontWeight: 500 }}>Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  if (error || !shopData) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle size={40} style={{ color: '#f87171', marginBottom: 16 }} />
          <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{error || 'No shop found'}</p>
          <button onClick={() => router.push(error ? '/' : '/shop-registration')} style={S.orangeBtn}>
            {error ? 'Go Home' : 'Register Shop'}
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Overview',     icon: BarChart3 },
    { id: 'orders',    label: 'Orders',       icon: ShoppingBag, badge: pendingCount },
    { id: 'menu',      label: 'Menu',         icon: Package,     badge: unavailableItems.length },
    { id: 'ingredients', label: 'Ingredients', icon: Package,    badge: outOfStockCount + lowStockCount },
    { id: 'shop',      label: 'Shop',         icon: Store },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <style>{css}</style>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={S.brandIcon}>
              <Store size={18} style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: '#111', lineHeight: 1 }}>{shopData.businessName}</p>
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>FoodHub SA · Owner Portal</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NotificationBell
              notifications={notifications}
              onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
              onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            />
            <button onClick={async () => { await signOut({ redirect: false }); router.push('/') }} style={S.logoutBtn} className="logout-btn">
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div style={S.layout}>
        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside style={S.sidebar}>
          <nav style={S.navCard}>
            {tabs.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...S.navItem, ...(active ? S.navItemActive : {}) }} className={`nav-item ${active ? 'nav-active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={15} style={{ flexShrink: 0, color: active ? '#f97316' : '#999' }} />
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#f97316' : '#666' }}>{tab.label}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 100, minWidth: 18, textAlign: 'center' }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────────── */}
        <main style={{ minWidth: 0, flex: 1 }}>

          {/* ── DASHBOARD ────────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div style={S.section}>
              <div style={{ marginBottom: 24 }}>
                <h1 style={S.pageTitle}>
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
                </h1>
                <p style={S.pageSub}>Here&apos;s what&apos;s happening at {shopData.businessName} today.</p>
              </div>

              <div style={S.statsGrid}>
                <StatCard label="Today's orders" value={todayOrders.length} sub={`${pendingCount} pending`} icon={ShoppingBag} accent="#2563eb" />
                <StatCard label="Today's revenue" value={`R${todayRevenue.toFixed(0)}`} sub="Completed orders" icon={Banknote} accent="#16a34a" />
                <StatCard label="Menu items" value={menuItems.length} sub={`${unavailableItems.length} unavailable`} icon={Package} accent="#7c3aed" />
                <StatCard label="Stock alerts" value={outOfStockCount + lowStockCount} sub={`${outOfStockCount} out of stock`} icon={AlertTriangle} accent={outOfStockCount > 0 ? '#dc2626' : '#d97706'} />
              </div>

              {/* Alerts */}
              {(outOfStockCount > 0 || lowStockCount > 0 || unavailableItems.length > 0) && (
                <div style={S.card}>
                  <div style={S.cardHeader}>
                    <AlertTriangle size={15} style={{ color: '#f97316' }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Active Alerts</span>
                  </div>
                  {outOfStockCount > 0 && (
                    <div style={S.alertRow}>
                      <div style={{ ...S.alertDot, background: '#ef4444' }} />
                      <div style={{ flex: 1 }}>
                        <p style={S.alertTitle}>{outOfStockCount} ingredient{outOfStockCount > 1 ? 's' : ''} out of stock</p>
                        <p style={S.alertSub}>Restock immediately to avoid menu disruptions</p>
                      </div>
                      <button onClick={() => setActiveTab('ingredients')} style={S.alertLink}>Manage <ChevronRight size={12} /></button>
                    </div>
                  )}
                  {lowStockCount > 0 && (
                    <div style={S.alertRow}>
                      <div style={{ ...S.alertDot, background: '#f59e0b' }} />
                      <div style={{ flex: 1 }}>
                        <p style={S.alertTitle}>{lowStockCount} ingredient{lowStockCount > 1 ? 's' : ''} running low</p>
                        <p style={S.alertSub}>Consider restocking soon</p>
                      </div>
                      <button onClick={() => setActiveTab('ingredients')} style={S.alertLink}>Manage <ChevronRight size={12} /></button>
                    </div>
                  )}
                  {unavailableItems.length > 0 && (
                    <div style={{ ...S.alertRow, borderBottom: 'none' }}>
                      <div style={{ ...S.alertDot, background: '#eab308' }} />
                      <div style={{ flex: 1 }}>
                        <p style={S.alertTitle}>{unavailableItems.length} menu item{unavailableItems.length > 1 ? 's' : ''} unavailable</p>
                        <p style={S.alertSub}>Due to ingredient shortages</p>
                      </div>
                      <button onClick={() => setActiveTab('menu')} style={S.alertLink}>View <ChevronRight size={12} /></button>
                    </div>
                  )}
                </div>
              )}

              {/* Recent orders */}
              <div style={S.card}>
                <div style={{ ...S.cardHeader, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingBag size={15} style={{ color: '#888' }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Orders</span>
                  </div>
                  <button onClick={() => setActiveTab('orders')} style={S.alertLink}>View all <ChevronRight size={12} /></button>
                </div>
                {orders.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#bbb' }}>
                    <ShoppingBag size={32} style={{ marginBottom: 10 }} />
                    <p style={{ fontSize: 14 }}>No orders yet</p>
                  </div>
                ) : orders.slice(0, 5).map(order => (
                  <div key={order._id} style={S.orderRow}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>#{order._id?.slice(-6).toUpperCase()}</p>
                      <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{order.userEmail}</p>
                    </div>
                    <StatusBadge status={order.status || 'pending'} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ────────────────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div style={S.section}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h1 style={S.pageTitle}>Orders</h1>
                  <p style={S.pageSub}>{orders.length} total · {pendingCount} pending</p>
                </div>
                <button onClick={async () => { const ords = await loadOrders(shopData._id); setNotifications(buildNotifications(ingredients, ords)) }} style={S.outlineBtn}>
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {/* Filter pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(f => (
                  <button key={f} onClick={() => setOrderFilter(f)} style={{
                    padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                    background: orderFilter === f ? '#f97316' : '#fff',
                    color: orderFilter === f ? '#fff' : '#666',
                    boxShadow: orderFilter === f ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
                  }}>
                    {f === 'all' ? `All (${orders.length})` : f}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '60px 20px' }}>
                  <ShoppingBag size={36} style={{ color: '#ddd', marginBottom: 12 }} />
                  <p style={{ color: '#aaa', fontSize: 14 }}>No orders in this category</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredOrders.map(order => {
                    const ns = nextStatus(order.status || 'pending')
                    const isUpdating = updatingOrderId === order._id
                    const canCancel = order.status === 'pending' || order.status === 'confirmed'
                    return (
                      <div key={order._id} style={S.card}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '18px 20px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                              <p style={{ fontWeight: 800, fontSize: 15, color: '#111' }}>#{order._id?.slice(-6).toUpperCase()}</p>
                              <StatusBadge status={order.status || 'pending'} />
                            </div>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#aaa' }}><Mail size={11} />{order.userEmail}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#aaa' }}><Clock size={11} />{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            {/* ── THE FIX: Mark <next> button with loading state ── */}
                            {ns && (() => {
                              const nsMeta = STATUS_META[ns]
                              return (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order._id, ns)}
                                  disabled={isUpdating}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '8px 14px', borderRadius: 10,
                                    border: `1.5px solid ${nsMeta.border}`,
                                    background: isUpdating ? nsMeta.bg : nsMeta.dot,
                                    color: isUpdating ? nsMeta.color : '#fff',
                                    fontSize: 12, fontWeight: 700,
                                    cursor: isUpdating ? 'default' : 'pointer',
                                    transition: 'all 0.2s', textTransform: 'capitalize',
                                    boxShadow: isUpdating ? 'none' : `0 2px 8px ${nsMeta.dot}55`,
                                  }}
                                >
                                  {isUpdating ? <Loader size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <ArrowRight size={12} />}
                                  {isUpdating ? 'Saving…' : `Mark ${ns}`}
                                </button>
                              )
                            })()}
                            {canCancel && (
                              <button onClick={() => confirmCancel(order._id)} disabled={isUpdating} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                Cancel
                              </button>
                            )}
                            <button onClick={() => setSelectedOrder(order)} style={{ padding: 8, borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', color: '#888' }}>
                              <Eye size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Items chips */}
                        {order.cartProducts?.length > 0 && (
                          <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {order.cartProducts.map((p, i) => (
                              <span key={i} style={{ fontSize: 12, background: '#f5f5f5', color: '#555', padding: '3px 10px', borderRadius: 100, fontWeight: 500 }}>{p.name}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── MENU ─────────────────────────────────────────────────── */}
          {activeTab === 'menu' && (
            <div style={S.section}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h1 style={S.pageTitle}>Menu</h1>
                  <p style={S.pageSub}>{menuItems.length} items · {unavailableItems.length} unavailable</p>
                </div>
                <button onClick={openAddMenu} style={S.orangeBtn}><Plus size={15} /> Add Item</button>
              </div>

              {menuItems.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '60px 20px' }}>
                  <Package size={36} style={{ color: '#ddd', marginBottom: 12 }} />
                  <p style={{ color: '#888', marginBottom: 16, fontSize: 14 }}>No menu items yet</p>
                  <button onClick={openAddMenu} style={S.orangeBtn}><Plus size={14} /> Add Your First Item</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {menuItems.map(item => (
                    <div key={item.id} style={S.card}>
                      <div style={{ display: 'flex', gap: 16, padding: '18px 20px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <p style={{ fontWeight: 800, fontSize: 15, color: '#111' }}>{item.name}</p>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: item.available ? '#dcfce7' : '#fee2e2', color: item.available ? '#16a34a' : '#dc2626' }}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: '#f5f5f5', color: '#777' }}>{item.category}</span>
                          </div>
                          {item.description && <p style={{ fontSize: 13, color: '#888', marginBottom: 8, lineHeight: 1.5 }}>{item.description}</p>}
                          <p style={{ fontSize: 20, fontWeight: 900, color: '#f97316', letterSpacing: '-0.03em' }}>R{item.price.toFixed(2)}</p>
                          {item.ingredients?.length > 0 && (
                            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                              {item.ingredients.map((ing, idx) => {
                                const found = ingredients.find(i => i.id === ing._id || i.id === ing)
                                const isOut = found && found.stock <= 0
                                const isLow = found && found.stock <= found.lowStockThreshold
                                return (
                                  <span key={idx} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, fontWeight: 600, background: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#f5f5f5', color: isOut ? '#dc2626' : isLow ? '#d97706' : '#666', border: `1px solid ${isOut ? '#fecaca' : isLow ? '#fde68a' : '#e5e7eb'}` }}>
                                    {ing.name || found?.name || 'Unknown'}{found ? ` · ${found.stock}` : ''}
                                  </span>
                                )
                              })}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <button onClick={() => handleToggleAvailability(item.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: item.available ? '#f5f5f5' : '#dcfce7', color: item.available ? '#555' : '#16a34a' }}>
                            {item.available ? 'Disable' : 'Enable'}
                          </button>
                          <button onClick={() => openEditMenu(item)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', color: '#888' }}><Edit size={14} /></button>
                          <button onClick={() => handleDeleteMenuItem(item.id)} style={{ padding: 8, borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', color: '#dc2626' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── INGREDIENTS ──────────────────────────────────────────── */}
          {activeTab === 'ingredients' && (
            <div style={S.section}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h1 style={S.pageTitle}>Ingredients</h1>
                  <p style={S.pageSub}>{ingredients.length} total · {outOfStockCount} out of stock</p>
                </div>
                <button onClick={openAddIng} style={S.orangeBtn}><Plus size={15} /> Add Ingredient</button>
              </div>

              {ingredients.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '60px 20px' }}>
                  <Package size={36} style={{ color: '#ddd', marginBottom: 12 }} />
                  <p style={{ color: '#888', marginBottom: 16, fontSize: 14 }}>No ingredients yet</p>
                  <button onClick={openAddIng} style={S.orangeBtn}><Plus size={14} /> Add First Ingredient</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ingredients.map(ing => {
                    const m = stockMeta(ing)
                    return (
                      <div key={ing.id} style={{ ...S.card, border: `1px solid ${m.border}`, background: m.bg }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{ing.name}</p>
                            <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{ing.stock} {ing.unit} · threshold {ing.lowStockThreshold}</p>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: m.color, marginRight: 8 }}>{m.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '4px 8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <button onClick={() => handleStockUpdate(ing.id, 'subtract')} disabled={ing.stock <= 0} style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'none', fontSize: 18, fontWeight: 700, color: '#555', cursor: ing.stock <= 0 ? 'default' : 'pointer', opacity: ing.stock <= 0 ? 0.3 : 1 }}>−</button>
                            <span style={{ width: 36, textAlign: 'center', fontWeight: 800, fontSize: 15, color: '#111' }}>{ing.stock}</span>
                            <button onClick={() => handleStockUpdate(ing.id, 'add')} style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'none', fontSize: 18, fontWeight: 700, color: '#555', cursor: 'pointer' }}>+</button>
                          </div>
                          <button onClick={() => openEditIng(ing)} style={{ padding: 7, borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', color: '#777' }}><Edit size={13} /></button>
                          <button onClick={() => handleDeleteIngredient(ing.id)} style={{ padding: 7, borderRadius: 8, border: '1px solid #fecaca', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', color: '#dc2626' }}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── SHOP ──────────────────────────────────────────────────── */}
          {activeTab === 'shop' && (
            <div style={S.section}>
              <h1 style={{ ...S.pageTitle, marginBottom: 20 }}>Shop Details</h1>
              <div style={S.card}>
                <div style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)', padding: '32px 28px', borderRadius: '16px 16px 0 0' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Store size={24} style={{ color: '#fff' }} />
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>{shopData.businessName}</h2>
                  {shopData.description && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{shopData.description}</p>}
                </div>
                <div style={{ padding: '20px 24px' }}>
                  {[
                    { icon: Mail, label: 'Email', value: shopData.email },
                    { icon: Phone, label: 'Phone', value: shopData.phone || shopData.contactNumber },
                    { icon: MapPin, label: 'Address', value: shopData.address },
                    { icon: Calendar, label: 'Member since', value: shopData.createdAt ? new Date(shopData.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }) : null },
                  ].filter(r => r.value).map(row => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <row.icon size={15} style={{ color: '#f97316' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111', marginTop: 2 }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
                {[
                  { value: menuItems.length, label: 'Menu Items', color: '#f97316' },
                  { value: orders.length, label: 'Total Orders', color: '#2563eb' },
                  { value: ingredients.length, label: 'Ingredients', color: '#16a34a' },
                ].map(s => (
                  <div key={s.label} style={{ ...S.card, textAlign: 'center', padding: '20px 16px' }}>
                    <p style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
                    <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Order Detail Modal ─────────────────────────────────────────────── */}
      {selectedOrder && (
        <div style={S.backdrop} onClick={() => setSelectedOrder(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <div>
                <p style={{ fontSize: 11, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Order Detail</p>
                <h2 style={{ fontWeight: 900, fontSize: 20, color: '#111' }}>#{selectedOrder._id?.slice(-6).toUpperCase()}</h2>
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={S.closeCircle}><X size={18} /></button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: 14, padding: '16px', marginBottom: 16 }}>
                <StatusStepper status={selectedOrder.status || 'pending'} />
              </div>

              {nextStatus(selectedOrder.status || 'pending') && (
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder._id, nextStatus(selectedOrder.status || 'pending'))}
                  disabled={updatingOrderId === selectedOrder._id}
                  style={{ ...S.orangeBtn, width: '100%', justifyContent: 'center', marginBottom: 16, textTransform: 'capitalize', opacity: updatingOrderId === selectedOrder._id ? 0.6 : 1 }}
                >
                  {updatingOrderId === selectedOrder._id
                    ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</>
                    : <>Mark as {nextStatus(selectedOrder.status || 'pending')} <ArrowRight size={14} /></>}
                </button>
              )}

              <div style={{ background: '#f9f9f9', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Customer</p>
                {[
                  { icon: Mail, val: selectedOrder.userEmail },
                  { icon: Phone, val: selectedOrder.phone },
                  { icon: MapPin, val: selectedOrder.streetAddress ? `${selectedOrder.streetAddress}, ${selectedOrder.city}` : null },
                ].filter(r => r.val).map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <r.icon size={13} style={{ color: '#aaa' }} />
                    <span style={{ fontSize: 13, color: '#444' }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {selectedOrder.cartProducts?.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Items</p>
                  {selectedOrder.cartProducts.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < selectedOrder.cartProducts.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{p.name}</span>
                      {p.price && <span style={{ fontSize: 14, fontWeight: 800, color: '#f97316' }}>R{p.price.toFixed(2)}</span>}
                    </div>
                  ))}
                </div>
              )}

              {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
                <button
                  onClick={() => { confirmCancel(selectedOrder._id); setSelectedOrder(null) }}
                  style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 20 }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Menu Modal ────────────────────────────────────────────────────── */}
      {showMenuModal && (
        <div style={S.backdrop} onClick={() => setShowMenuModal(false)}>
          <div style={{ ...S.modal, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={{ fontWeight: 900, fontSize: 18, color: '#111' }}>{editingItem ? 'Edit Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setShowMenuModal(false)} style={S.closeCircle}><X size={18} /></button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
              {menuErrors.general && <div style={S.errorBox}>{menuErrors.general}</div>}
              <div style={S.formGroup}>
                <Label style={S.label}>Item Name *</Label>
                <input value={menuForm.name} onChange={e => { setMenuForm(p => ({ ...p, name: e.target.value })); setMenuErrors(p => ({ ...p, name: '' })) }} placeholder="e.g. Classic Beef Burger" style={S.input} />
                {menuErrors.name && <p style={S.errText}>{menuErrors.name}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <Label style={S.label}>Price (R) *</Label>
                  <input type="number" step="0.01" min="0" value={menuForm.price} onChange={e => { setMenuForm(p => ({ ...p, price: e.target.value })); setMenuErrors(p => ({ ...p, price: '' })) }} placeholder="89.00" style={S.input} />
                  {menuErrors.price && <p style={S.errText}>{menuErrors.price}</p>}
                </div>
                <div>
                  <Label style={S.label}>Category *</Label>
                  <select value={menuForm.category} onChange={e => { setMenuForm(p => ({ ...p, category: e.target.value })); setMenuErrors(p => ({ ...p, category: '' })) }} style={S.select}>
                    <option value="">Select…</option>
                    {['Burgers','Kota','Pizza','Chicken','Sides','Drinks','Desserts'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {menuErrors.category && <p style={S.errText}>{menuErrors.category}</p>}
                </div>
              </div>
              <div style={S.formGroup}>
                <Label style={S.label}>Description</Label>
                <textarea value={menuForm.description} onChange={e => setMenuForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe this item…" rows={3} style={{ ...S.input, resize: 'vertical' }} />
              </div>
              <div style={S.formGroup}>
                <Label style={S.label}>Ingredients</Label>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, maxHeight: 200, overflowY: 'auto', padding: '8px' }}>
                  {ingredients.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#bbb', padding: '20px', textAlign: 'center' }}>No ingredients yet</p>
                  ) : ingredients.map(ing => {
                    const sel = menuForm.selectedIngredients.includes(ing.id)
                    const out = ing.stock <= 0
                    return (
                      <label key={ing.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', opacity: out ? 0.5 : 1, background: sel ? '#fff7ed' : 'transparent' }}>
                        <input type="checkbox" checked={sel} onChange={() => toggleIngredientSel(ing.id)} style={{ accentColor: '#f97316', width: 14, height: 14 }} />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#333' }}>{ing.name}</span>
                        <span style={{ fontSize: 12, color: '#aaa' }}>{ing.stock} {ing.unit}</span>
                        {out && <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '1px 6px', borderRadius: 100 }}>Out</span>}
                      </label>
                    )
                  })}
                </div>
                <p style={{ fontSize: 12, color: '#bbb', marginTop: 6 }}>Availability auto-managed based on stock</p>
              </div>
            </div>
            <div style={S.modalFooter}>
              <button onClick={() => setShowMenuModal(false)} style={S.outlineBtn} disabled={isSaving}>Cancel</button>
              <button onClick={handleSaveMenuItem} disabled={isSaving} style={{ ...S.orangeBtn, opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : <><Save size={14} /> {editingItem ? 'Update Item' : 'Add Item'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ingredient Modal ───────────────────────────────────────────────── */}
      {showIngredientModal && (
        <div style={S.backdrop} onClick={() => setShowIngredientModal(false)}>
          <div style={{ ...S.modal, maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={{ fontWeight: 900, fontSize: 18, color: '#111' }}>{editingIngredient ? 'Edit Ingredient' : 'Add Ingredient'}</h2>
              <button onClick={() => setShowIngredientModal(false)} style={S.closeCircle}><X size={18} /></button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
              {ingErrors.general && <div style={S.errorBox}>{ingErrors.general}</div>}
              <div style={S.formGroup}>
                <Label style={S.label}>Name *</Label>
                <input value={ingForm.name} onChange={e => { setIngForm(p => ({ ...p, name: e.target.value })); setIngErrors(p => ({ ...p, name: '' })) }} placeholder="e.g. Beef Patties" style={S.input} />
                {ingErrors.name && <p style={S.errText}>{ingErrors.name}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <Label style={S.label}>Stock Qty *</Label>
                  <input type="number" min="0" value={ingForm.stock} onChange={e => setIngForm(p => ({ ...p, stock: e.target.value }))} placeholder="50" style={S.input} />
                  {ingErrors.stock && <p style={S.errText}>{ingErrors.stock}</p>}
                </div>
                <div>
                  <Label style={S.label}>Unit *</Label>
                  <select value={ingForm.unit} onChange={e => setIngForm(p => ({ ...p, unit: e.target.value }))} style={S.select}>
                    {['pieces','kg','grams','liters','ml','units','packs'].map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div style={S.formGroup}>
                <Label style={S.label}>Low Stock Alert Threshold</Label>
                <input type="number" min="0" value={ingForm.lowStockThreshold} onChange={e => setIngForm(p => ({ ...p, lowStockThreshold: e.target.value }))} placeholder="10" style={S.input} />
                <p style={{ fontSize: 12, color: '#bbb', marginTop: 6 }}>Alert when stock falls below this level</p>
              </div>
            </div>
            <div style={S.modalFooter}>
              <button onClick={() => setShowIngredientModal(false)} style={S.outlineBtn} disabled={isSaving}>Cancel</button>
              <button onClick={handleSaveIngredient} disabled={isSaving} style={{ ...S.orangeBtn, opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : <><Save size={14} /> {editingIngredient ? 'Update' : 'Add Ingredient'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Dialog ─────────────────────────────────────────────────── */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  )
}

// ─── Style tokens ──────────────────────────────────────────────────────────────

const S = {
  // Layout
  header: { background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 30 },
  headerInner: { maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 },
  brandIcon: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #f97316, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  layout: { maxWidth: 1280, margin: '0 auto', padding: '24px 20px 20px', marginTop: 16, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 },
  sidebar: { position: 'sticky', top: 80, alignSelf: 'start' },
  navCard: { background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  navItem: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', borderLeft: '3px solid transparent', cursor: 'pointer', transition: 'all 0.15s' },
  navItemActive: { background: '#fff7ed', borderLeftColor: '#f97316' },
  section: { display: 'flex', flexDirection: 'column', gap: 16 },

  // Cards
  card: { background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid #f5f5f5' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 },

  // Alerts
  alertRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid #f5f5f5' },
  alertDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  alertTitle: { fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 2 },
  alertSub: { fontSize: 12, color: '#aaa' },
  alertLink: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 },

  // Orders
  orderRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid #f5f5f5' },

  // Typography
  pageTitle: { fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 },
  pageSub: { fontSize: 13, color: '#aaa', marginTop: 4 },

  // Buttons
  orangeBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#f97316', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  outlineBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#888', fontSize: 13, fontWeight: 600, cursor: 'pointer' },

  // Modals
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', overflow: 'hidden' },
  modalHeader: { padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 },
  modalFooter: { padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 10, background: '#fafafa', flexShrink: 0 },
  closeCircle: { width: 34, height: 34, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888', flexShrink: 0 },

  // Forms
  formGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14, color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  select: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14, color: '#111', outline: 'none', background: '#fff', fontFamily: 'inherit' },
  errText: { fontSize: 12, color: '#dc2626', marginTop: 4 },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 14 },

  // Notification panel
  bellBtn: { position: 'relative', padding: 8, borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', color: '#555' },
  bellBadge: { position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, minWidth: 16, height: 16, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' },
  notifPanel: { position: 'absolute', right: 0, top: 48, width: 340, background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 16px 48px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' },
  notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #f5f5f5' },
  markAllBtn: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' },
  notifItem: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 18px', cursor: 'pointer' },
}

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .nav-item:hover:not(.nav-active) { background: #fafafa !important; }
  .bell-btn:hover { background: #f9f9f9 !important; }
  .logout-btn:hover { background: #f9f9f9 !important; }

  @media (max-width: 768px) {
    div[style*="grid-template-columns: 200px"] {
      grid-template-columns: 1fr !important;
    }
    div[style*="grid-template-columns: repeat(2, 1fr)"] {
      grid-template-columns: 1fr !important;
    }
  }
`