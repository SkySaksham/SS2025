"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { pharmacyApi, ApiError } from "@/lib/api"
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
  const [animateCard, setAnimateCard] = useState(false)

  useEffect(() => setAnimateCard(true), [])

  const handleRefresh = () => {
    setMessage("")
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await pharmacyApi.signup(formData)

      try {
        await login(response.credentials.username, formData.password)
        setMessage("✅ Registered successfully! Pending government approval.")
        setTimeout(() => router.push("/pharmacy"), 1500)
      } catch {
        setMessage(`✅ Registered! Username: ${response.credentials.username}`)
        setTimeout(() => router.push("/pharmacy/login"), 2000)
      }
    } catch (error) {
      console.error("Signup error:", error)
      if (error instanceof ApiError) setMessage(`❌ ${error.message}`)
      else setMessage("❌ Failed to submit. Check backend connection.")
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
            <h1 className="text-2xl font-bold text-purple-700 drop-shadow-sm">Pharmacy Signup</h1>
            <p className="text-purple-500 mt-1 text-sm">SehatSathi Portal</p>
          </div>

          {/* Message Box */}
          {message && (
            <div
              className={`p-3 rounded mb-4 text-sm border shadow-inner ${
                message.startsWith("✅")
                  ? "bg-purple-50 text-purple-800 border-purple-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-700">Pharmacy Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                placeholder="Enter pharmacy name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-purple-700">Owner</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                placeholder="Owner name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-purple-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                  placeholder="City/Area"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-purple-700">License #</label>
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleChange}
                  className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                  placeholder="Pharmacy license"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-purple-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                  placeholder="Phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-purple-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-purple-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-md transition"
                placeholder="Choose password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all shadow-md"
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-600 text-sm">
              <Link href="/pharmacy/login" className="hover:underline">Already have an account? Login</Link>
            </p>
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
      `}</style>
    </div>
  )
}
