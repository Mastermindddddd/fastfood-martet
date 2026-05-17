"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ShoppingBag, CheckCircle, Loader, ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { CartContext } from '@/components/AppContext'

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Support both named hook and context directly
  const cartCtx = useContext(CartContext)
  const cartProducts = cartCtx?.cartProducts ?? []
  const removeCartProduct = cartCtx?.removeCartProduct
  const clearCart = cartCtx?.clearCart

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')

  const SERVICE_FEE = 2
  const subtotal = cartProducts.reduce((total, p) => total + (p.price || 0), 0)
  const total = subtotal + SERVICE_FEE

  // Group items by shop so multi-shop carts create separate orders
  const groupedCart = cartProducts.reduce((acc, item, index) => {
    const shopId = item.shopId || 'unknown'
    if (!acc[shopId]) {
      acc[shopId] = { shopId, shopName: item.shopName || 'Restaurant', items: [] }
    }
    acc[shopId].items.push({ ...item, _cartIndex: index })
    return acc
  }, {})

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent('/cart')}`)
      return
    }

    // Debug: log the cart so you can see what's in it
    console.log('Cart products at checkout:', cartProducts)

    if (!cartProducts || cartProducts.length === 0) {
      setError('Your cart is empty — add some items first.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const createdOrders = []

      for (const shopGroup of Object.values(groupedCart)) {
        // Build cartProducts in the format the API and Order model expect
        const cartProductsPayload = shopGroup.items.map(item => ({
          _id: item._id || item.id || item.menuItemId || '',
          name: item.name || 'Item',
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
          image: item.image || '',
          size: item.size || null,
          extras: item.extras || [],
        }))

        const orderData = {
          shopId: shopGroup.shopId !== 'unknown' ? shopGroup.shopId : undefined,
          cartProducts: cartProductsPayload,
          paymentMethod,
          notes,
          serviceFee: SERVICE_FEE,
          // Address fields (blank for now — extend if you add address inputs back)
          phone: '',
          streetAddress: '',
          city: '',
          postalCode: '',
          country: 'South Africa',
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.message || 'Failed to place order')
        createdOrders.push(data.order)
      }

      setSuccess(true)
      clearCart?.()

      setTimeout(() => {
        router.push('/orders')
      }, 1500)
    } catch (err) {
      console.error('Order error:', err)
      setError(err.message || 'Something went wrong placing your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  // ── Not signed in ────────────────────────────────────────────────────────

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Sign in to checkout</h2>
          <p className="text-gray-500 text-sm mb-6">You need an account to place an order.</p>
          <button
            onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent('/cart')}`)}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // ── Success state ────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm">Redirecting to your orders…</p>
        </div>
      </div>
    )
  }

  // ── Empty cart ───────────────────────────────────────────────────────────

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Add something delicious to get started.</p>
          <button
            onClick={() => router.push('/restaurents')}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  // ── Main cart ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="mb-7">
          <h1 className="text-2xl font-black text-gray-900">Your Cart</h1>
          <p className="text-sm text-gray-400 mt-0.5">{cartProducts.length} item{cartProducts.length !== 1 ? 's' : ''}</p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* ── Cart Items ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {Object.values(groupedCart).map(shopGroup => (
              <div key={shopGroup.shopId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Shop header */}
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                  <p className="font-bold text-sm text-gray-800">{shopGroup.shopName}</p>
                </div>

                {/* Items */}
                <ul className="divide-y divide-gray-100">
                  {shopGroup.items.map(item => (
                    <li
                      key={item._cartIndex}
                      className="grid px-5 py-4"
                      style={{ gridTemplateColumns: '56px 1fr auto', gap: '12px', alignItems: 'start' }}
                    >
                      {/* Thumbnail — fixed 56×56, never shrinks */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 56, height: 56, borderRadius: 12,
                            background: '#fff7ed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <ShoppingBag style={{ width: 22, height: 22, color: '#fdba74' }} />
                        </div>
                      )}

                      {/* Text column — stretches, truncates if needed */}
                      <div style={{ minWidth: 0 }}>
                        <p
                          className="font-bold text-gray-900"
                          style={{ fontSize: 14, lineHeight: '20px', marginBottom: 2 }}
                        >
                          {item.name}
                        </p>

                        {item.size?.name && (
                          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>
                            Size: {item.size.name}
                          </p>
                        )}

                        {item.extras?.length > 0 && (
                          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>
                            Extras: {item.extras.map(e => e.name).join(', ')}
                          </p>
                        )}

                        <p
                          className="font-black text-orange-600"
                          style={{ fontSize: 15, marginTop: 4 }}
                        >
                          R{(item.price || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove button — aligned to top-right */}
                      <button
                        onClick={() => removeCartProduct?.(item._cartIndex)}
                        aria-label="Remove item"
                        style={{
                          padding: 6, borderRadius: 10, border: 'none',
                          background: 'transparent', cursor: 'pointer',
                          color: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginTop: 2,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db' }}
                      >
                        <Trash2 style={{ width: 16, height: 16 }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Payment Method</p>
              <div className="space-y-2">
                {[
                  { value: 'cash', label: 'Cash on Pickup', emoji: '💵' },
                  //{ value: 'card', label: 'Card Payment',   emoji: '💳' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === opt.value
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="accent-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{opt.emoji} {opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-2">Special Instructions</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requests or instructions…"
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Order Summary</p>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartProducts.length} item{cartProducts.length !== 1 ? 's' : ''})</span>
                  <span className="font-semibold text-gray-900">R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service fee</span>
                  <span className="font-semibold text-gray-900">R{SERVICE_FEE.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex justify-between font-black text-base">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600">R{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-5 w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-500/20"
              >
                {loading ? (
                  <><Loader className="h-4 w-4 animate-spin" />Placing Order…</>
                ) : (
                  <>Place Order · R{total.toFixed(2)} <ChevronRight className="h-4 w-4" /></>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                By placing your order you agree to our terms
              </p>
            </div>

            {/* View past orders */}
            <button
              onClick={() => router.push('/orders')}
              className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-orange-600 border border-gray-200 hover:border-orange-200 rounded-xl transition-all"
            >
              View Past Orders →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}