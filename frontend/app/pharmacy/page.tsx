"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { pharmacyApi, PharmacyStock, AddStockData, ApiError } from "@/lib/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts"
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi"

type Section = "overview" | "inventory" | "analytics" | "profile"

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
  const [activeSection, setActiveSection] = useState<Section>("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Summary calculations
  const totalMedicines = medicines.length
  const totalStock = medicines.reduce((sum, m) => sum + m.quantity, 0)
  const totalRevenue = medicines.reduce((sum, m) => sum + m.quantity * m.price, 0)

  useEffect(() => {
    if (user) fetchMedicines()
  }, [user])

  const handleRefresh = () => fetchMedicines()

  const fetchMedicines = async () => {
    try {
      const data = await pharmacyApi.getStocks()
      setMedicines(data)
    } catch (error) {
      console.error("Error fetching medicines:", error)
      setError(error instanceof ApiError ? error.message : "Failed to fetch medicines")
    }
  }

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await pharmacyApi.addStock(newMedicine)
      setNewMedicine({ medicine_name: "", quantity: 0, price: 0, expiry_date: "", batch_number: "" })
      setShowAddForm(false)
      fetchMedicines()
    } catch (error) {
      console.error("Error adding medicine:", error)
      setError(error instanceof ApiError ? error.message : "Failed to add medicine")
    }

    setLoading(false)
  }

  // Chart data
  const stockChartData = medicines.map(m => ({
    name: m.medicine_name,
    quantity: m.quantity,
    revenue: m.quantity * m.price,
  }))

  return (
    <ProtectedRoute allowedRoles={["pharmacy"]}>
      <div className="flex min-h-screen bg-purple-50">
        {/* Sidebar */}
        <aside className={`flex flex-col bg-purple-800 text-white transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}>
          <div className="flex items-center justify-between p-6 border-b border-purple-700">
            {!sidebarCollapsed && <div className="text-2xl font-bold text-white">SehatSathi</div>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white text-2xl p-1 rounded hover:bg-purple-700 transition"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {[
              { label: "Overview", key: "overview" },
              { label: "Inventory", key: "inventory" },
              { label: "Analytics", key: "analytics" },
              { label: "Profile", key: "profile" },
            ].map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-purple-700 transition ${
                  activeSection === item.key ? "bg-purple-900" : ""
                }`}
                onClick={() => setActiveSection(item.key as Section)}
              >
                {sidebarCollapsed ? item.label[0] : item.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="mt-6 w-full flex items-center gap-2 px-3 py-2 rounded bg-purple-700 hover:bg-purple-600 transition"
            >
              <FiLogOut /> {!sidebarCollapsed && "Logout"}
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Refresh + Welcome */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-800">Welcome, {user?.pharmacy_name || user?.username}</h1>
            <button onClick={handleRefresh} className="btn btn-outline text-sm">🔄 Refresh</button>
          </div>

          {/* Mini Overview Cards */}
          {activeSection === "overview" && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="card p-4 bg-white shadow rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Medicines</p>
                <p className="text-2xl font-bold text-purple-700">{totalMedicines}</p>
              </div>
              <div className="card p-4 bg-white shadow rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold text-purple-700">{totalStock}</p>
              </div>
              <div className="card p-4 bg-white shadow rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-700">₹{totalRevenue}</p>
              </div>
            </section>
          )}

          {/* Overview Charts */}
          {activeSection === "overview" && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card p-4 bg-white shadow-md rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Stock per Medicine</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stockChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: any) => [value, "Qty"]}/>
                    <Bar dataKey="quantity" fill="#7c3aed" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-4 bg-white shadow-md rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Revenue per Medicine</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stockChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: any) => [`₹${value}`, "Revenue"]}/>
                    <Bar dataKey="revenue" fill="#a855f7" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Inventory Section */}
          {activeSection === "inventory" && (
            <>
              <button
                onClick={() => setShowAddForm(true)}
                className="mb-4 px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-600 transition"
                disabled={!user?.is_approved}
              >
                Add New Medicine
              </button>
              <div className="card bg-white shadow-md rounded-lg overflow-x-auto">
                {medicines.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No medicines added yet.
                  </div>
                ) : (
                  <table className="w-full table-auto">
                    <thead className="border-b border-purple-300">
                      <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Batch</th>
                        <th className="p-3 text-left">Stock</th>
                        <th className="p-3 text-left">Price (₹)</th>
                        <th className="p-3 text-left">Expiry</th>
                        <th className="p-3 text-left">Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map(m => {
                        const expiryDays = Math.ceil((new Date(m.expiry_date).getTime() - Date.now()) / (1000*60*60*24))
                        return (
                          <tr key={m.id} className="border-b border-purple-100 hover:bg-purple-50 cursor-pointer relative group">
                            <td className="p-3 font-medium">{m.medicine_name}</td>
                            <td className="p-3 text-muted-foreground">{m.batch_number}</td>
                            <td className="p-3">{m.quantity}</td>
                            <td className="p-3">₹{m.price}</td>
                            <td className="p-3 text-muted-foreground">{m.expiry_date}</td>
                            <td className="p-3 text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td>
                            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity w-max max-w-xs bg-purple-700 text-white text-xs rounded py-1 px-2 z-10">
                              {`Expires in ${expiryDays} days • Batch: ${m.batch_number} • ₹${m.price * m.quantity} potential revenue`}
                            </span>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* Analytics Section */}
          {activeSection === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-4 bg-white shadow-md rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Stock Chart</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stockChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: any) => [value, "Qty"]}/>
                    <Bar dataKey="quantity" fill="#7c3aed" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-4 bg-white shadow-md rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Revenue Chart</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stockChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: any) => [`₹${value}`, "Revenue"]}/>
                    <Bar dataKey="revenue" fill="#a855f7" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold text-purple-700 mb-4">Profile</h2>
              <p className="text-muted-foreground mb-2">Pharmacy Name: {user?.pharmacy_name}</p>
              <p className="text-muted-foreground mb-2">Username: {user?.username}</p>
              <p className="text-muted-foreground mb-2">Approval Status: {user?.is_approved ? "Approved" : "Pending"}</p>
            </div>
          )}

          {/* Add Medicine Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="card p-6 w-full max-w-md bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-purple-700">Add New Medicine</h3>
                {!user?.is_approved && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-red-800 text-sm">
                      <strong>❌ Access Denied:</strong> You cannot add medicines until your account is approved.
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
                      <label className="block text-sm font-medium mb-1">Quantity</label>
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
                      className={`btn flex-1 ${user?.is_approved ? 'btn-primary bg-purple-700 hover:bg-purple-600 text-white' : 'btn-secondary'}`}
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 text-red-100 p-3 rounded mt-4">
              {error}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
