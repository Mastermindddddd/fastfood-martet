"use client"
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Package,
  MapPin,
  Bell,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  Loader,
} from 'lucide-react'

// ─── Order Status Steps ──────────────────────────────────────────────────────

const STATUS_STEPS = [
  { key: 'pending',   label: 'Order Received', icon: ShoppingBag, desc: 'Your order has been placed' },
  { key: 'confirmed', label: 'Confirmed',       icon: CheckCircle, desc: 'The shop confirmed your order' },
  { key: 'preparing', label: 'Preparing',       icon: ChefHat,     desc: 'Your food is being prepared' },
  { key: 'ready',     label: 'Ready',           icon: Package,     desc: 'Your order is ready for collection' },
  { key: 'completed', label: 'Completed',       icon: CheckCircle, desc: 'Order completed. Enjoy!' },
]

function OrderTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-red-50 rounded-2xl border border-red-100">
        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div>
          <p className="font-bold text-red-800 text-sm">Order Cancelled</p>
          <p className="text-xs text-red-400">This order has been cancelled</p>
        </div>
      </div>
    )
  }

  const currentIdx = STATUS_STEPS.findIndex(s => s.key === status)

  return (
    <div>
      {/* Horizontal stepper */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {STATUS_STEPS.map((step, idx) => {
          const done    = idx < currentIdx
          const current = idx === currentIdx
          const isLast  = idx === STATUS_STEPS.length - 1
          const Icon    = step.icon

          return (
            <div
              key={step.key}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
            >
              {/* Connector line between dots */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  top: 13,
                  left: '50%',
                  width: '100%',
                  height: 2,
                  background: done ? '#22c55e' : '#e5e7eb',
                  zIndex: 0,
                }} />
              )}

              {/* Icon dot */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: done ? '#22c55e' : current ? '#f97316' : '#f3f4f6',
                color: done || current ? '#fff' : '#9ca3af',
                boxShadow: current ? '0 0 0 4px #ffedd5' : 'none',
                transition: 'all 0.2s',
              }}>
                {done
                  ? <CheckCircle style={{ width: 12, height: 12 }} />
                  : <Icon style={{ width: 12, height: 12 }} />
                }
              </div>

              {/* Step label */}
              <p style={{
                marginTop: 6,
                fontSize: 10,
                fontWeight: current ? 700 : done ? 600 : 400,
                textAlign: 'center',
                lineHeight: '13px',
                color: current ? '#ea580c' : done ? '#16a34a' : '#9ca3af',
                maxWidth: 56,
                wordBreak: 'break-word',
              }}>
                {step.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Current step description pill */}
      {currentIdx >= 0 && (
        <div style={{
          marginTop: 14,
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 12,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 600, color: '#c2410c', margin: 0 }}>
            {STATUS_STEPS[currentIdx]?.desc}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, onSelect }) {
  const statusColor = {
    pending:   'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready:     'bg-teal-100 text-teal-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const total = order.cartProducts?.reduce((s, p) => s + (p.price || 0), 0) || 0

  return (
    <div
      onClick={() => onSelect(order)}
      className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:border-orange-200 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-black text-gray-900 text-sm">Order #{order._id?.slice(-6).toUpperCase()}</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${statusColor[order.status] || statusColor.pending}`}>
            {order.status || 'pending'}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {order.cartProducts?.slice(0, 3).map((p, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{p.name}</span>
        ))}
        {(order.cartProducts?.length || 0) > 3 && (
          <span className="text-xs text-gray-400 px-2 py-0.5">+{order.cartProducts.length - 3} more</span>
        )}
      </div>

      {total > 0 && (
        <p className="text-sm font-black text-orange-600">R{total.toFixed(2)}</p>
      )}
    </div>
  )
}

// ─── Main Customer Orders Page ────────────────────────────────────────────────

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [lastChecked, setLastChecked] = useState(new Date())

  const loadOrders = useCallback(async () => {
    if (!session?.user?.email) return
    try {
      // No query param needed — the API uses the session email automatically
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
        // Update selected order if detail drawer is open
        if (selectedOrder) {
          const updated = (data.orders || []).find(o => o._id === selectedOrder._id)
          if (updated) setSelectedOrder(updated)
        }
      }
    } catch {}
    setLastChecked(new Date())
  }, [session?.user?.email, selectedOrder])

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated') {
      loadOrders().then(() => setIsLoading(false))
    }
  }, [status, session, router, loadOrders])

  // Auto-refresh every 30 seconds for active orders
  useEffect(() => {
    const hasActiveOrders = orders.some(o =>
      ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
    )
    if (!hasActiveOrders) return
    const interval = setInterval(loadOrders, 30000)
    return () => clearInterval(interval)
  }, [orders, loadOrders])

  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status))

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 text-orange-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 mt-20">
      <div className="max-w-2xl mx-auto px-4">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
            <p className="text-xs text-gray-400 mt-0.5">Last updated {lastChecked.toLocaleTimeString()}</p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-white transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Active orders banner */}
        {activeOrders.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-sm">{activeOrders.length} active order{activeOrders.length > 1 ? 's' : ''}</p>
                <p className="text-xs text-orange-100">Refreshes automatically every 30 seconds</p>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold mb-1">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">Start by browsing our restaurants</p>
            <button
              onClick={() => router.push('/restaurents')}
              className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOrders.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Active Orders</h2>
                <div className="space-y-3">
                  {activeOrders.map(order => (
                    <OrderCard key={order._id} order={order} onSelect={setSelectedOrder} />
                  ))}
                </div>
              </section>
            )}

            {pastOrders.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Past Orders</h2>
                <div className="space-y-3">
                  {pastOrders.map(order => (
                    <OrderCard key={order._id} order={order} onSelect={setSelectedOrder} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-black text-gray-900">Order #{selectedOrder._id?.slice(-6).toUpperCase()}</h2>
                <p className="text-xs text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Order timeline */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <OrderTimeline status={selectedOrder.status || 'pending'} />
              </div>

              {/* Order items */}
              {selectedOrder.cartProducts && selectedOrder.cartProducts.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
                  <div className="space-y-2">
                    {selectedOrder.cartProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                        {p.price && <span className="text-sm font-bold text-orange-600">R{p.price.toFixed(2)}</span>}
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-bold text-gray-700">Total</span>
                      <span className="text-base font-black text-orange-600">
                        R{selectedOrder.cartProducts.reduce((s, p) => s + (p.price || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery address */}
              {selectedOrder.streetAddress && (
                <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                  <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-700">{selectedOrder.streetAddress}</p>
                    {selectedOrder.city && <p className="text-sm text-gray-700">{selectedOrder.city}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}