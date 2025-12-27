"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react'
import MapboxAddressInput from '@/components/layout/MapboxAddressInput'

export default function ShopRegistration() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [shopAlreadyExists, setShopAlreadyExists] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessRegistrationNumber: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cuisine: '',
    description: '',
    operatingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '09:00', close: '22:00', closed: false }
    },
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  })
  
  const [errors, setErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)

  // Handle auth status, check for existing shop, and autofill
  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/register')
      return
    }

    if (status === 'authenticated' && session?.user) {
      // Check if user already has a registered shop
      checkExistingShop(session.user.email)
      
      setFormData(prev => ({
        ...prev,
        ownerName: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || ''
      }))
    }

    setIsLoading(false)
  }, [status, session, router])

  const checkExistingShop = async (email) => {
    try {
      const res = await fetch(`/api/check-shop?email=${encodeURIComponent(email)}`)
      const data = await res.json()

      if (data.shopExists) {
        console.log("Shop already exists for this email")
        setShopAlreadyExists(true)
      }
    } catch (err) {
      console.error("Error checking existing shop:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-5 w-5 animate-spin text-orange-600" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  // If shop already exists, show error message
  if (shopAlreadyExists) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <button onClick={() => router.back()} className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Shop Already Registered</h2>
            <p className="text-gray-600 text-center mb-6">
              A restaurant has already been registered with the email <strong>{formData.email}</strong>.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p className="text-sm text-blue-800">
                If this is your account, you can access your shop dashboard. If you need to register a different restaurant, please use a different email address.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/shop-dashboard')}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium"
              >
                Go to Shop Dashboard
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }))
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
        break
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.cuisine.trim()) newErrors.cuisine = 'Cuisine type is required'
        break
      case 3:
        if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required'
        if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required'
        if (!formData.accountHolder.trim()) newErrors.accountHolder = 'Account holder name is required'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return
    
    setSubmitLoading(true)
    
    try {
      const res = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert("Registration successful! Redirecting to dashboard...")
        router.push("/shop-dashboard")
      } else {
        setErrors({ general: data.message || "Registration failed." })
      }
    } catch (err) {
      console.error("Registration error:", err)
      setErrors({ general: "Registration failed. Please try again." })
    } finally {
      setSubmitLoading(false)
    }
  }

  const steps = [
    { id: 1, name: 'Business Info', description: 'Basic business information' },
    { id: 2, name: 'Location & Details', description: 'Address and restaurant details' },
    { id: 3, name: 'Banking & Hours', description: 'Payment and operating information' },
    { id: 4, name: 'Review', description: 'Review and submit' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <button onClick={() => router.back()} className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Register Your Restaurant</h2>
          <p className="mt-2 text-gray-600">Join FoodHub SA and start receiving orders</p>
          {session?.user && (
            <p className="mt-2 text-sm text-gray-500">Logged in as {session.user.email}</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                    currentStep > step.id ? 'bg-orange-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Step {currentStep}: {steps[currentStep - 1].name}</h3>
          
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {errors.general}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <p className="text-sm text-blue-800">Your details have been pre-filled from your account. You can edit them as needed.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g., Burger Palace"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="fast_food">Fast Food</option>
                    <option value="cafe">Cafe</option>
                    <option value="bakery">Bakery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number</label>
                <input
                  name="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    name="ownerName"
                    value={formData.ownerName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <MapboxAddressInput
                  value={formData.address}
                  onChange={(value) => {
                    setFormData({...formData, address: value})
                  }}
                  onSelect={(addressData) => {
                    setFormData({
                      ...formData,
                      address: addressData.streetAddress || formData.address,
                      city: addressData.city || formData.city,
                      postalCode: addressData.postalCode || formData.postalCode
                    })
                  }}
                  placeholder="Start typing your restaurant address..."
                  label="Restaurant Address *"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Cape Town"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="8001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type *</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select cuisine type</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Kota">Kota</option>
                  <option value="Dagwood">Dagwood</option>
                  <option value="Hotdog">Hotdog</option>
                  <option value="fries">Fries</option>
                  <option value="Steakhouse">Steakhouse</option>
                </select>
                {errors.cuisine && <p className="mt-1 text-sm text-red-600">{errors.cuisine}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your restaurant and what makes it special..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Banking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                    <input
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g., Standard Bank"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                    <input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Account number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                  <input
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    placeholder="Name on bank account"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.accountHolder && <p className="mt-1 text-sm text-red-600">{errors.accountHolder}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Operating Hours</h3>
                <div className="space-y-3">
                  {Object.entries(formData.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24 capitalize font-medium text-sm">{day}</div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <span className="text-sm">Closed</span>
                      </label>
                      {!hours.closed && (
                        <>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                          />
                          <span className="text-sm">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Information</h4>
                  <p className="text-gray-700 font-semibold">{formData.businessName}</p>
                  <p className="text-gray-600 text-sm">{formData.businessType && `Type: ${formData.businessType}`}</p>
                  <p className="text-gray-600 text-sm">{formData.ownerName} • {formData.email} • {formData.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">{formData.address}, {formData.city} {formData.postalCode}</p>
                  <p className="text-gray-600 text-sm">Cuisine: {formData.cuisine}</p>
                  {formData.description && <p className="text-gray-600 text-sm mt-2">{formData.description}</p>}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Banking</h4>
                  <p className="text-gray-700">{formData.bankName}</p>
                  <p className="text-gray-600 text-sm">Account: {formData.accountNumber} ({formData.accountHolder})</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  I agree to the Terms of Service and Restaurant Partner Agreement
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}