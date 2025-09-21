"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { pharmacyApi, PharmacyStock, AddStockData, ApiError } from "@/lib/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function PharmacyDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [medicines, setMedicines] = useState<PharmacyStock[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMedicine, setNewMedicine] = useState<AddStockData>({
    medicine_name: "",
    quantity: 0,
    price: 0,
    expiry_date: "",
    batch_number: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      fetchMedicines()
    }
  }, [user])

  // Refresh function that maintains auth state
  const handleRefresh = () => {
    fetchMedicines()
  }

  const fetchMedicines = async () => {
    try {
      const data = await pharmacyApi.getStocks()
      setMedicines(data)
    } catch (error) {
      console.error("Error fetching medicines:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("Failed to fetch medicines")
      }
    }
  }

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await pharmacyApi.addStock(newMedicine)
      setNewMedicine({
        medicine_name: "",
        quantity: 0,
        price: 0,
        expiry_date: "",
        batch_number: "",
      })
      setShowAddForm(false)
      fetchMedicines()
    } catch (error) {
      console.error("Error adding medicine:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("Failed to add medicine")
      }
    }

    setLoading(false)
  }

  return (
    <ProtectedRoute allowedRoles={['pharmacy']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-gray-700 bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold">Pharmacy Dashboard</h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh} 
                className="btn btn-outline text-sm"
                title="Refresh data"
              >
                🔄 Refresh
              </button>
              <span className="text-muted-foreground">Welcome, {user?.pharmacy_name || user?.username}</span>
              {user?.is_approved ? (
                <span className="badge badge-success">Approved</span>
              ) : (
                <span className="badge badge-warning">Pending Approval</span>
              )}
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Medicine Inventory</h2>
            <p className="text-muted-foreground">Manage your pharmacy's medicine stock</p>
            {user && !user.is_approved && (
              <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Account Pending Approval:</strong> Your pharmacy account is awaiting government approval. 
                  You can view your inventory but cannot add new medicines until approved.
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowAddForm(true)} 
            className={`btn ${user?.is_approved ? 'btn-primary' : 'btn-secondary'}`}
            disabled={!user?.is_approved}
            title={!user?.is_approved ? 'Account must be approved by government to add medicines' : ''}
          >
            Add New Medicine
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-red-100 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Medicine Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add New Medicine</h3>
              
              {!user?.is_approved && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <strong>❌ Access Denied:</strong> You cannot add medicines until your account is approved by the government.
                  </p>
                </div>
              )}

              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={newMedicine.medicine_name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, medicine_name: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newMedicine.batch_number}
                    onChange={(e) => setNewMedicine({ ...newMedicine, batch_number: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={newMedicine.quantity}
                      onChange={(e) => setNewMedicine({ ...newMedicine, quantity: parseInt(e.target.value) || 0 })}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMedicine.price}
                      onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) || 0 })}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newMedicine.expiry_date}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiry_date: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading || !user?.is_approved} 
                    className={`btn flex-1 ${user?.is_approved ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {loading ? "Adding..." : "Add Medicine"}
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Medicine List */}
        <div className="card">
          {medicines.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No medicines added yet. Click "Add New Medicine" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="p-4 text-left">Medicine Name</th>
                    <th className="p-4 text-left">Batch Number</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-left">Price (₹)</th>
                    <th className="p-4 text-left">Expiry Date</th>
                    <th className="p-4 text-left">Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <tr key={medicine.id} className="border-b border-gray-700">
                      <td className="p-4 font-medium">{medicine.medicine_name}</td>
                      <td className="p-4 text-muted-foreground">{medicine.batch_number}</td>
                      <td className="p-4">{medicine.quantity}</td>
                      <td className="p-4">₹{medicine.price}</td>
                      <td className="p-4 text-muted-foreground">{medicine.expiry_date}</td>
                      <td className="p-4 text-muted-foreground">{new Date(medicine.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
