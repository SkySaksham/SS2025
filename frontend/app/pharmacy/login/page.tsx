"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function PharmacyLogin() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRefresh = () => {
    // Clear error messages but preserve form data
    setError("")
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(formData.username, formData.password)
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed. Please try again.")
    }

    setLoading(false)
  }

  const fillCredentials = (username: string, password: string) => {
    setFormData({ username, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <button 
              onClick={handleRefresh} 
              className="btn btn-outline text-sm"
              title="Clear messages and reset form state"
            >
              🔄 Refresh
            </button>
          </div>
          <h1 className="text-2xl font-bold">SehatSathi Web Portal</h1>
          <p className="text-muted-foreground mt-2">Pharmacy & Government Access</p>
          <div className="bg-blue-900/50 border border-blue-700/50 rounded-lg p-3 mt-4">
            <p className="text-blue-200 text-xs leading-relaxed">
              Supporting healthcare delivery across 173 rural villages in Nabha region. This portal helps coordinate
              medicine availability and reduce patient travel.
            </p>
          </div>
        </div>

        {error && <div className="bg-red-900 text-red-100 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="input w-full"
              placeholder="Enter your pharmacy name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input w-full"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Quick Login Buttons */}
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-center text-muted-foreground">Quick Access:</p>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => fillCredentials("rajesh_medicals", "pharmacy123")}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">💊</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">Rajesh Medicals</div>
                  <div className="text-xs opacity-90">rajesh_medicals / pharmacy123</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => fillCredentials("apollo_pharmacy_delhi", "pharmacy123")}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🏥</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">Apollo Pharmacy Delhi</div>
                  <div className="text-xs opacity-90">apollo_pharmacy_delhi / pharmacy123</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => fillCredentials("medplus_bangalore", "pharmacy123")}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">💊</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">MedPlus Bangalore</div>
                  <div className="text-xs opacity-90">medplus_bangalore / pharmacy123</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => fillCredentials("govt_admin", "govt123")}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🏛️</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">Government Admin</div>
                  <div className="text-xs opacity-90">govt_admin / govt123</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Register your pharmacy
            </Link>
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            <Link href="/government/login" className="text-primary hover:underline">
              Government Portal
            </Link>
          </p>
          <div className="mt-4 p-3 bg-gray-800/50 rounded text-xs">
            <p className="text-gray-300">
              <strong>Note:</strong> Patients and doctors use the separate SehatSathi mobile app. This web portal is for
              pharmacy and government use only.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded text-sm">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <p>Government: admin / admin123</p>
          <p>Pharmacy: MedPlus Nabha / password123</p>
          <p className="text-xs text-gray-400 mt-2">
            New pharmacies need government approval before accessing the system.
          </p>
        </div>
      </div>
    </div>
  )
}
