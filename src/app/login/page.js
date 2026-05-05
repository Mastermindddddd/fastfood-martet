"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Strip any leading slash from the redirect param to avoid double slashes
  const rawRedirect = searchParams.get("redirect")
  const redirectTo = rawRedirect ? rawRedirect.replace(/^\/+/, "") : null

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Step 1: Sign in with credentials
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (!result?.ok || result?.error) {
        setErrors({ general: "Invalid email or password" })
        return
      }

      // Step 2: Flush the App Router cache so it recognises the new session.
      // Without this, router.push() fires but the middleware/layout still
      // sees the old (unauthenticated) state and can silently cancel the nav.
      router.refresh()

      // Step 3: If a redirect param was supplied, honour it immediately.
      if (redirectTo) {
        router.push(`/${redirectTo}`)
        return
      }

      // Step 4: No redirect param — decide destination based on shop existence.
      const checkRes = await fetch(
        `/api/check-shop?email=${encodeURIComponent(formData.email)}`
      )

      if (!checkRes.ok) {
        console.error("Shop check failed with status:", checkRes.status)
        // Use window.location as a hard fallback — guaranteed to navigate
        window.location.href = "/"
        return
      }

      const data = await checkRes.json()

      // Use window.location.href instead of router.push so the full page
      // reload picks up the new session cookie before protected layouts run.
      if (data.shopExists) {
        window.location.href = "/shop-dashboard"
      } else {
        window.location.href = "/"
      }
    } catch (err) {
      console.error("Login error:", err)
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Login</h2>
          <p className="mt-2 text-gray-600">Access your FoodHub SA account</p>
        </div>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pr-10 w-full"
                    autoComplete="current-password"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </span>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="text-center mt-6 text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-orange-600 font-semibold underline">
                Register here »
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}