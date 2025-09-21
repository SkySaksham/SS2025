"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { pharmacyApi, ApiError, authApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function PharmacySignup() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    location: "",
    license: "",
    phone: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("") // Clear previous messages

    try {
      console.log("Submitting pharmacy registration:", formData)
      const response = await pharmacyApi.signup(formData)
      console.log("Registration response:", response)
      
      // Auto-login the newly registered pharmacy
      try {
        await login(response.credentials.username, formData.password)
        setMessage("Registration successful! You are now logged in. Your account is pending government approval.")
        // Redirect to pharmacy dashboard after a short delay
        setTimeout(() => router.push("/pharmacy"), 2000)
      } catch (loginError) {
        console.error("Auto-login failed:", loginError)
        setMessage(`Registration successful! Your credentials are: Username: ${response.credentials.username}, Password: [Your chosen password]. Please login manually.`)
        setTimeout(() => router.push("/pharmacy/login"), 3000)
      }
    } catch (error) {
      console.error("Signup error:", error)
      if (error instanceof ApiError) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage("Error submitting application. Please check if the backend is running on port 8000.")
      }
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <div className="flex justify-between items-start mb-8">
              <div></div>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-outline text-sm"
                title="Refresh page"
              >
                🔄 Refresh
              </button>
            </div>
            <h1 className="text-3xl font-bold text-center mb-8">Pharmacy Registration</h1>

            {message && (
              <div
                className={`p-4 rounded mb-6 ${message.includes("successfully") ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pharmacy Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Owner Name</label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">License Number</label>
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Choose a secure password"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
