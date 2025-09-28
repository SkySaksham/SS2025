"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function PharmacyLogin() {
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
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-300 animate-gradient-x -z-20"></div>

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
        <div className="absolute inset-0 rounded-xl bg-white shadow-2xl opacity-20 -z-10"></div>

        <div
          className={`card p-8 w-full h-auto border-t-4 border-b-4 border-purple-600 bg-white shadow-xl rounded-lg transform transition-transform duration-500 ${
            animateCard ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          } hover:-translate-y-2 hover:shadow-2xl`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-between items-start mb-2">
              <div></div>
              <button
                onClick={handleRefresh}
                className="px-3 py-1 border border-purple-500 text-purple-600 rounded-md text-sm hover:bg-purple-50 transition"
                title="Clear messages"
              >
                🔄 Refresh
              </button>
            </div>
            <h1 className="text-2xl font-bold text-purple-700 drop-shadow-sm">Pharmacy Login</h1>
            <p className="text-purple-500 mt-1 text-sm">SehatSathi Portal</p>
          </div>

          {/* Error Box */}
          {error && (
            <div className="bg-purple-100 text-purple-800 p-3 rounded mb-4 border border-purple-300 shadow-inner text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-purple-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all shadow-md"
            >
              {loading ? "Logging in..." : "Access Portal"}
            </button>
          </form>

          {/* Quick Access Buttons */}
          <div className="mt-6">
            <p className="text-sm font-medium text-center text-purple-600 mb-3">Quick Access:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => fillCredentials("rajesh_medicals", "pharmacy123")}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-3 transition-all duration-300 transform hover:scale-105 hover:shadow-glow flex items-center space-x-3"
              >
                <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-lg">💊</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">Rajesh Medicals</div>
                  <div className="text-xs opacity-90">rajesh_medicals / pharmacy123</div>
                </div>
              </button>

              <button
                onClick={() => fillCredentials("apollo_pharmacy_delhi", "pharmacy123")}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-3 transition-all duration-300 transform hover:scale-105 hover:shadow-glow flex items-center space-x-3"
              >
                <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-lg">🏥</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">Apollo Pharmacy Delhi</div>
                  <div className="text-xs opacity-90">apollo_pharmacy_delhi / pharmacy123</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-purple-600 text-sm">
              <Link href="/signup" className="hover:underline">Register</Link> {" • "}
              <Link href="/government/login" className="hover:underline">Government Login</Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-purple-50 rounded text-sm border border-purple-200 shadow-inner">
            <p className="font-medium mb-1 text-purple-700">Demo:</p>
            <p className="text-purple-600 text-sm">Rajesh Medicals: rajesh_medicals / pharmacy123</p>
            <p className="text-purple-600 text-sm">Apollo Pharmacy Delhi: apollo_pharmacy_delhi / pharmacy123</p>
          </div>
        </div>
      </div>

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
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.6), 0 0 25px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  )
}
