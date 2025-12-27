"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useCartContext } from '@/components/AppContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import MapboxAddressInput from '@/components/layout/MapboxAddressInput'

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { cartProducts, removeCartProduct, clearCart } = useCartContext()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  // Delivery details
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')

  const deliveryFee = 15
  
  // Calculate subtotal from cartProducts
  const subtotal = cartProducts.reduce((total, product) => {
    return total + (product.price || 0)
  }, 0)
  
  const total = subtotal + deliveryFee

  // Group cart items by shop
  const groupedCart = cartProducts.reduce((acc, item, index) => {
    const shopId = item.shopId || 'unknown'
    const shopName = item.shopName || 'Unknown Shop'
    
    if (!acc[shopId]) {
      acc[shopId] = {
        shopId: shopId,
        shopName: shopName,
        items: []
      }
    }
    acc[shopId].items.push({...item, originalIndex: index})
    return acc
  }, {})

  const handlePlaceOrder = async () => {
    if (!session) {
      alert('Please sign in to place an order')
      router.push('/auth/signin')
      return
    }

    if (cartProducts.length === 0) {
      setError('Your cart is empty')
      return
    }

    // Validate pickup address
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.phone) {
      setError('Please fill in all pickup details')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Place order for each shop separately
      for (const shopGroup of Object.values(groupedCart)) {
        const orderData = {
          shopId: shopGroup.shopId,
          items: shopGroup.items.map(item => ({
            menuItemId: item._id || item.id,
            name: item.name,
            quantity: 1 // Since your cart doesn't store quantity separately
          })),
          deliveryAddress,
          paymentMethod,
          notes,
          deliveryFee
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || 'Failed to place order')
        }
      }

      setSuccess(true)
      clearCart()
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        router.push('/orders')
      }, 2000)
    } catch (err) {
      console.error('Error placing order:', err)
      setError(err.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your cart</p>
            <Button onClick={() => router.push('/auth/signin')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Redirecting to your orders...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {cartProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
              <Button onClick={() => router.push('/restaurents')}>Browse Restaurants</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.values(groupedCart).map(shopGroup => (
                <Card key={shopGroup.shopId}>
                  <CardHeader>
                    <CardTitle>{shopGroup.shopName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {shopGroup.items.map((item) => (
                      <div key={item.originalIndex} className="flex items-center justify-between py-4 border-b last:border-b-0">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-orange-600 font-medium">R{item.price?.toFixed(2) || '0.00'}</p>
                          {item.size && (
                            <p className="text-sm text-gray-600">Size: {item.size.name}</p>
                          )}
                          {item.extras && item.extras.length > 0 && (
                            <p className="text-sm text-gray-600">
                              Extras: {item.extras.map(e => e.name).join(', ')}
                            </p>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCartProduct(item.originalIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary & Checkout */}
            <div className="space-y-6">
              {/* Pickup Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Pickup Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MapboxAddressInput
                    value={deliveryAddress.street}
                    onChange={(value) => setDeliveryAddress({...deliveryAddress, street: value})}
                    onSelect={(addressData) => {
                      setDeliveryAddress({
                        ...deliveryAddress,
                        street: addressData.streetAddress || deliveryAddress.street,
                        city: addressData.city || deliveryAddress.city,
                        postalCode: addressData.postalCode || deliveryAddress.postalCode
                      })
                    }}
                    placeholder="Start typing your address..."
                    label="Street Address"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      placeholder="Johannesburg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <Input
                      value={deliveryAddress.postalCode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, postalCode: e.target.value})}
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                      placeholder="0812345678"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="cash">Cash on Pickup</option>
                    <option value="card">Card Payment</option>
                    <option value="wallet">E-Wallet</option>
                  </select>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions?"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartProducts.length} items)</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>R{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}