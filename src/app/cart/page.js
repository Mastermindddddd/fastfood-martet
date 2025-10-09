"use client"
import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Minus, Trash2, MapPin, CreditCard, Shield, Lock, AlertCircle } from 'lucide-react'
import Image from "next/image";

// Sample Data
const SAMPLE_USER = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+27 82 123 4567',
  addresses: [
    { address: '123 Main Street, Cape Town, 8001' }
  ]
}

const SAMPLE_RESTAURANT = {
  id: 'rest-001',
  name: 'The Burger House',
  cuisine: 'American, Burgers',
  image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
  deliveryFee: 25.00,
  rating: 4.5,
  deliveryTime: '30-45 min'
}

const SAMPLE_CART_ITEMS = [
  {
    id: 'item-001',
    name: 'Classic Beef Burger',
    price: 89.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    customizations: {
      size: { name: 'Regular' },
      extras: { name: 'Extra Cheese, Bacon' }
    }
  },
  {
    id: 'item-002',
    name: 'Crispy Chicken Wings',
    price: 65.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=200&fit=crop',
    customizations: {
      sauce: { name: 'BBQ' }
    }
  },
  {
    id: 'item-003',
    name: 'Loaded Fries',
    price: 45.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
    customizations: {}
  }
]

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Secure payment via PayFast',
    processingFee: 0.035,
    available: true
  },
  {
    id: 'eft',
    name: 'Instant EFT',
    description: 'Bank transfer via Ozow',
    processingFee: 0.025,
    available: true
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    processingFee: 0,
    available: true
  }
]

export default function EnhancedCartPage() {
  const [user] = useState(SAMPLE_USER)
  const [currentRestaurant] = useState(SAMPLE_RESTAURANT)
  const [cartItems, setCartItems] = useState(SAMPLE_CART_ITEMS)
  
  const [formData, setFormData] = useState({
    deliveryAddress: SAMPLE_USER.addresses[0].address,
    paymentMethod: 'card',
    promoCode: '',
    customerNotes: ''
  })
  
  const [validationErrors, setValidationErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods] = useState(PAYMENT_METHODS)
  const [processingFees, setProcessingFees] = useState({})
  const [securityChecks, setSecurityChecks] = useState({
    addressValidated: true,
    paymentSecure: true,
    dataEncrypted: true
  })

  useEffect(() => {
    const fees = {}
    paymentMethods.forEach(method => {
      if (method.available) {
        fees[method.id] = method.processingFee
      }
    })
    setProcessingFees(fees)
  }, [paymentMethods])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prev => prev.map(cartItem => 
      cartItem.id === item.id 
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    ))
  }

  const handleRemoveItem = (item) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.id !== item.id))
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.deliveryAddress || formData.deliveryAddress.length < 10) {
      errors.deliveryAddress = 'Please enter a valid delivery address'
    }
    
    if (formData.customerNotes && formData.customerNotes.length > 500) {
      errors.customerNotes = 'Customer notes must be less than 500 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = currentRestaurant?.deliveryFee || 0
    const processingFee = processingFees[formData.paymentMethod] 
      ? Math.round(subtotal * processingFees[formData.paymentMethod] * 100) / 100 
      : 0
    const total = subtotal + deliveryFee + processingFee
    
    return { subtotal, deliveryFee, processingFee, total }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      const { total } = calculateTotals()
      
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        customer: user,
        restaurant: currentRestaurant,
        items: cartItems,
        amount: total,
        deliveryAddress: formData.deliveryAddress,
        customerNotes: formData.customerNotes,
        paymentMethod: formData.paymentMethod,
        timestamp: new Date().toISOString()
      }
      
      console.log('Order placed successfully:', orderData)
      alert(`Order placed successfully! Order ID: ${orderData.orderId}\nTotal: R${total.toFixed(2)}`)
      
      // Clear cart after successful order
      setCartItems([])
      
    } catch (error) {
      console.error('Order placement failed:', error)
      setValidationErrors({ 
        general: 'Order placement failed. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
              <h1 className="text-xl font-semibold">Your Cart</h1>
              <div></div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items from our restaurants to get started!</p>
            <button 
              onClick={() => setCartItems(SAMPLE_CART_ITEMS)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Add Sample Items
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { subtotal, deliveryFee, processingFee, total } = calculateTotals()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-semibold">Secure Checkout</h1>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600">SSL Protected</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 border border-green-200 bg-green-50 rounded-lg">
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <Lock className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <h3 className="font-medium text-green-800">Secure Checkout</h3>
                <div className="flex items-center space-x-4 text-sm text-green-700 mt-1">
                  <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${securityChecks.addressValidated ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    Address {securityChecks.addressValidated ? 'Validated' : 'Pending'}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Payment Secure
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Data Encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {validationErrors.general && (
          <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-red-800 text-sm">{validationErrors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentRestaurant && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={currentRestaurant.image}
                      alt={currentRestaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{currentRestaurant.name}</h3>
                      <p className="text-gray-600">{currentRestaurant.cuisine}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Order Items</h2>
              </div>
              <div className="p-6 space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                    <Image
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {Object.keys(item.customizations).length > 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          {Object.entries(item.customizations).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-orange-600 font-semibold mt-1">R{item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Address
                </h2>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your delivery address"
                  className={`w-full px-3 py-2 border rounded-lg ${validationErrors.deliveryAddress ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.deliveryAddress && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.deliveryAddress}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {paymentMethods.filter(method => method.available).map(method => (
                  <label key={method.id} className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="text-orange-600"
                      />
                      <div>
                        <span className="font-medium">{method.name}</span>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {method.processingFee > 0 && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {(method.processingFee * 100).toFixed(1)}% fee
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Special Instructions (Optional)</h2>
              </div>
              <div className="p-6">
                <textarea
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order..."
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex justify-between mt-2">
                  {validationErrors.customerNotes && (
                    <p className="text-sm text-red-600">{validationErrors.customerNotes}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.customerNotes.length}/500
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>R{deliveryFee.toFixed(2)}</span>
                </div>
                {processingFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee</span>
                    <span>R{processingFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <label htmlFor="promo" className="block text-sm font-medium mb-1">Promo Code</label>
                  <div className="flex space-x-2">
                    <input
                      id="promo"
                      type="text"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleInputChange}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Apply</button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                  disabled={isLoading || !securityChecks.addressValidated}
                >
                  {isLoading ? 'Processing...' : `Place Order - R${total.toFixed(2)}`}
                </button>

                <div className="text-xs text-gray-500 text-center pt-4 border-t">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Lock className="h-3 w-3" />
                    <span>Your payment information is secure</span>
                  </div>
                  <p>We use industry-standard encryption to protect your data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}