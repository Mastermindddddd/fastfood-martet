"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 5) newErrors.password = "Password must be at least 5 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Registration failed")
      }

      router.push("/login")
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Register</h2>
          <p className="mt-2 text-gray-600">Create your FoodHub SA account</p>
        </div>

        {/* Register Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>


              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>

            <div className="text-center mt-6 text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-600 font-semibold underline">
                Login here »
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
