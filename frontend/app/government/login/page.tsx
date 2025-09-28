"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function GovernmentLogin() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [animateCard, setAnimateCard] = useState(false)

  useEffect(() => {
    setAnimateCard(true)
  }, [])

  const handleRefresh = () => {
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
    <div className="min-h-screen flex items-center justify-center py-16 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 animate-gradient-x -z-20"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30 w-1.5 h-1.5 animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Outer glowing shadow behind card */}
        <div className="absolute inset-0 rounded-xl bg-white shadow-2xl opacity-20 -z-10"></div>

        {/* Card */}
        <div
          className={`card p-8 w-full h-auto border-t-4 border-b-4 border-blue-600 bg-white shadow-xl rounded-lg transform transition-transform duration-500 ${
            animateCard ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          } hover:-translate-y-2 hover:shadow-2xl`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-between items-start mb-4">
              <div></div>
              <button
                onClick={handleRefresh}
                className="px-3 py-1 border border-blue-500 text-blue-600 rounded-md text-sm hover:bg-blue-50 transition"
                title="Clear messages and reset form state"
              >
                🔄 Refresh
              </button>
            </div>
            <h1 className="text-2xl font-bold text-blue-700 drop-shadow-sm">Government Portal Access</h1>
            <p className="text-blue-500 mt-2">Ministry of Health & Family Welfare</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 shadow-inner">
              <p className="text-blue-700 text-xs leading-relaxed">
                Access restricted to authorized government officials and administrators only.
              </p>
            </div>
          </div>

          {/* Error Box */}
          {error && (
            <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4 border border-blue-300 shadow-inner">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-md transition"
                placeholder="Enter your government username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-blue-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-md transition"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all shadow-md"
            >
              {loading ? "Logging in..." : "Access Government Portal"}
            </button>
          </form>

          {/* Quick Access Buttons */}
          <div className="mt-6">
            <p className="text-sm font-medium text-center text-blue-600 mb-3">Quick Access:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => fillCredentials("govt_admin", "govt123")}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 transition-all duration-300 transform hover:scale-105 hover:shadow-glow flex items-center space-x-3"
              >
                <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-lg">🏛️</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">Government Admin</div>
                  <div className="text-xs opacity-90">govt_admin / govt123</div>
                </div>
              </button>

              <button
                onClick={() => fillCredentials("admin", "admin123")}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white p-3 transition-all duration-300 transform hover:scale-105 hover:shadow-glow flex items-center space-x-3"
              >
                <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-lg">⚙️</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">System Admin</div>
                  <div className="text-xs opacity-90">admin / admin123</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-blue-600 text-sm">
              <Link href="/pharmacy/login" className="hover:underline">Pharmacy Login</Link> {" • "}
              <Link href="/" className="hover:underline">Home</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Tailwind CSS Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }

        @keyframes particle-move {
          0% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(10px, -10px); opacity: 0.5; }
          100% { transform: translate(0, 0); opacity: 0.2; }
        }
        .animate-particle {
          animation: particle-move linear infinite;
        }

        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.6), 0 0 25px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  )
}
