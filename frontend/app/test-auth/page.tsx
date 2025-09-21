"use client"

import { useAuth } from "@/contexts/AuthContext"

export default function TestAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="card p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Auth State:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                isLoading,
                isAuthenticated,
                user: user ? {
                  id: user.id,
                  username: user.username,
                  user_type: user.user_type,
                  is_approved: user.is_approved,
                  pharmacy_name: user.pharmacy_name
                } : null
              }, null, 2)}
            </pre>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quick Actions:</h3>
            <div className="flex gap-2">
              <a href="/pharmacy/login" className="btn btn-primary">
                Pharmacy Login
              </a>
              <a href="/government/login" className="btn btn-secondary">
                Government Login
              </a>
              <a href="/" className="btn btn-outline">
                Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
