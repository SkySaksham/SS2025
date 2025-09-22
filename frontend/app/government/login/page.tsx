"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function GovernmentLogin() {
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
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
          <h1 className="text-2xl font-bold">Government Portal Access</h1>
          <p className="text-muted-foreground mt-2">Ministry of Health & Family Welfare</p>
          <div className="bg-green-900/50 border border-green-700/50 rounded-lg p-3 mt-4">
            <p className="text-green-200 text-xs leading-relaxed">
              Access restricted to authorized government officials and administrators only.
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
              placeholder="Enter your government username"
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
            {loading ? "Logging in..." : "Access Government Portal"}
          </button>
        </form>

        {/* Quick Login Buttons */}
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-center text-muted-foreground">Quick Access:</p>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => fillCredentials("govt_admin", "govt123")}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🏛️</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">Government Admin</div>
                  <div className="text-xs opacity-90">govt_admin / govt123</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => fillCredentials("admin", "admin123")}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">⚙️</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">System Admin</div>
                  <div className="text-xs opacity-90">admin / admin123</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            <Link href="/pharmacy/login" className="text-primary hover:underline">
              Pharmacy Login
            </Link>
            {" • "}
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded text-sm">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <p>Government Admin: govt_admin / govt123</p>
          <p>System Admin: admin / admin123</p>
          <p className="text-xs text-gray-400 mt-2">
            These are demo credentials for testing purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
