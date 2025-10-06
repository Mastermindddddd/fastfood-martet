"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ShopRegistration() {
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: '',
    businessRegistrationNumber: '',
    
    // Contact Information
    ownerName: '',
    email: '',
    phone: '',
    
    // Address Information
    address: '',
    city: '',
    postalCode: '',
    
    // Operating Information
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
    
    // Banking Information
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
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
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
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
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock registration success
      const mockShopOwner = {
        id: Date.now(),
        name: formData.ownerName,
        email: formData.email,
        shopName: formData.businessName,
        shopId: Date.now()
      }

      console.log("✅ Shop Registered:", mockShopOwner)
      router.push('/shop-dashboard')

    } catch (err) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
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
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Register Your Restaurant</h2>
          <p className="mt-2 text-gray-600">Join FoodHub SA and start receiving orders</p>
        </div>

        {/* Progress Steps */}
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

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].name}</CardTitle>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
                {errors.general}
              </div>
            )}

            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g., Burger Palace"
                      className="mt-1"
                    />
                    {errors.businessName && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
                  <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                  <Input
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="mt-1"
                    />
                    {errors.ownerName && (
                      <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="business@example.com"
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+27 12 345 6789"
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Location & Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="address">Restaurant Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="mt-1"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Cape Town"
                      className="mt-1"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="8001"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cuisine">Cuisine Type *</Label>
                  <select
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select cuisine type</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Kota">Kota</option>
                    <option value="Dagwood">Dagwood</option>
                    <option value="Hotdog">Hotdog</option>
                    <option value="fries">fries</option>
                    <option value="Steakhouse">Steakhouse</option>
                  </select>
                  {errors.cuisine && (
                    <p className="mt-1 text-sm text-red-600">{errors.cuisine}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Restaurant Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your restaurant and what makes it special..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Banking & Hours */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="e.g., Standard Bank"
                        className="mt-1"
                      />
                      {errors.bankName && (
                        <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Account number"
                        className="mt-1"
                      />
                      {errors.accountNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="accountHolder">Account Holder Name *</Label>
                    <Input
                      id="accountHolder"
                      name="accountHolder"
                      value={formData.accountHolder}
                      onChange={handleInputChange}
                      placeholder="Name on bank account"
                      className="mt-1"
                    />
                    {errors.accountHolder && (
                      <p className="mt-1 text-sm text-red-600">{errors.accountHolder}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Operating Hours</h3>
                  <div className="space-y-3">
                    {Object.entries(formData.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-20 capitalize">{day}</div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hours.closed}
                            onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                            className="mr-2"
                          />
                          Closed
                        </label>
                        {!hours.closed && (
                          <>
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                              className="w-32"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Review Your Information</h3>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-medium">Business Information</h4>
                    <p>{formData.businessName}</p>
                    <p>{formData.ownerName} • {formData.email} • {formData.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p>{formData.address}, {formData.city} {formData.postalCode}</p>
                    <p>Cuisine: {formData.cuisine}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Banking</h4>
                    <p>{formData.bankName} - {formData.accountNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="terms" className="ml-2 text-sm">
                    I agree to the{' '}
                    <a href="#" className="text-orange-600 hover:text-orange-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-orange-600 hover:text-orange-500">
                      Restaurant Partner Agreement
                    </a>
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/shop/login" className="text-orange-600 hover:text-orange-500 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
