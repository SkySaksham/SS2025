"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { governmentApi, User, GovernmentDashboard, PharmacyStock, ApiError } from "@/lib/api"

// Demo data for doctors (not in backend yet)
const demoData = {
  doctors: [
    {
      id: "demo1",
      name: "Dr. Arjun Mehta",
      specialization: "Cardiologist",
      hospital: "AIIMS New Delhi",
      patients: 1250,
    },
    {
      id: "demo2",
      name: "Dr. Kavya Nair",
      specialization: "Pediatrician",
      hospital: "Apollo Hospital Chennai",
      patients: 980,
    },
    {
      id: "demo3",
      name: "Dr. Rohit Singh",
      specialization: "Orthopedic",
      hospital: "Fortis Hospital Mumbai",
      patients: 750,
    },
  ],
}

export default function GovernmentDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState<GovernmentDashboard | null>(null)
  const [pendingPharmacies, setPendingPharmacies] = useState<User[]>([])
  const [allStocks, setAllStocks] = useState<Array<PharmacyStock & { pharmacy_name: string; address: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && (!user || (user.user_type !== 'government' && user.user_type !== 'admin'))) {
      router.push('/government/login')
    }
  }, [user, isLoading, router])

  // Fetch data from backend
  useEffect(() => {
    if (user && (user.user_type === 'government' || user.user_type === 'admin')) {
      fetchDashboardData()
      fetchPendingPharmacies()
      fetchAllStocks()
    }
  }, [user])

  // Refresh function that maintains auth state
  const handleRefresh = () => {
    if (user && (user.user_type === 'government' || user.user_type === 'admin')) {
      fetchDashboardData()
      fetchPendingPharmacies()
      fetchAllStocks()
    }
  }

  const fetchDashboardData = async () => {
    try {
      const data = await governmentApi.getDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("Failed to fetch dashboard data")
      }
    }
  }

  const fetchPendingPharmacies = async () => {
    try {
      const data = await governmentApi.getPendingUsers()
      setPendingPharmacies(data)
    } catch (error) {
      console.error("Error fetching pending pharmacies:", error)
    }
  }

  const fetchAllStocks = async () => {
    try {
      const data = await governmentApi.getAllStocks()
      setAllStocks(data)
    } catch (error) {
      console.error("Error fetching all stocks:", error)
    }
  }

  const approvePharmacy = async (pharmacyId: number) => {
    setLoading(true)
    try {
      await governmentApi.approveUser(pharmacyId)
      // Refresh data
      fetchPendingPharmacies()
      fetchDashboardData()
    } catch (error) {
      console.error("Error approving pharmacy:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("Failed to approve pharmacy")
      }
    }
    setLoading(false)
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user || (user.user_type !== 'government' && user.user_type !== 'admin')) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-gray-700 bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">SehatSathi Government Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh} 
                className="btn btn-outline text-sm"
                title="Refresh data"
              >
                🔄 Refresh
              </button>
              <span className="text-muted-foreground">Welcome, {user?.username}</span>
              <span className="badge badge-success">Production</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-700 bg-card min-h-screen">
          <nav className="p-4 space-y-2">
            <button
              className={`w-full text-left p-3 rounded ${activeTab === "overview" ? "bg-primary text-white" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={`w-full text-left p-3 rounded ${activeTab === "pending" ? "bg-primary text-white" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("pending")}
            >
              ⏰ Pending Approvals ({pendingPharmacies.length})
            </button>
            <button
              className={`w-full text-left p-3 rounded ${activeTab === "approved" ? "bg-primary text-white" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("approved")}
            >
              ✅ Approved Pharmacies ({dashboardData?.statistics.total_pharmacies || 0})
            </button>
            <button
              className={`w-full text-left p-3 rounded ${activeTab === "medicines" ? "bg-primary text-white" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("medicines")}
            >
              💊 Medicine Inventory ({allStocks.length})
            </button>
            <button
              className={`w-full text-left p-3 rounded ${activeTab === "doctors" ? "bg-primary text-white" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("doctors")}
            >
              👨‍⚕️ Registered Doctors ({demoData.doctors.length})
            </button>
          </nav>
        </aside>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-red-100 p-3 rounded mb-4 mx-6">
            {error}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Dashboard Overview</h2>

              {dashboardData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pharmacies</h3>
                    <div className="text-2xl font-bold">{dashboardData.statistics.total_pharmacies}</div>
                    <p className="text-xs text-success">Approved</p>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Pending Approvals</h3>
                    <div className="text-2xl font-bold">{dashboardData.statistics.pending_approvals}</div>
                    <p className="text-xs text-warning">Requires attention</p>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Medicines</h3>
                    <div className="text-2xl font-bold">{dashboardData.statistics.total_medicines}</div>
                    <p className="text-xs text-success">In stock</p>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Low Stock Alerts</h3>
                    <div className="text-2xl font-bold">{dashboardData.statistics.low_stock_count}</div>
                    <p className="text-xs text-warning">Need attention</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading dashboard data...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Pending Approvals</h2>

              {pendingPharmacies.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-muted-foreground">No pending pharmacy applications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{pharmacy.pharmacy_name || pharmacy.username}</h3>
                          <p className="text-muted-foreground">Username: {pharmacy.username}</p>
                          <p className="text-muted-foreground">Email: {pharmacy.email}</p>
                          <p className="text-muted-foreground">License: {pharmacy.license_number}</p>
                          <p className="text-muted-foreground">Address: {pharmacy.address}</p>
                          <p className="text-muted-foreground">Phone: {pharmacy.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approvePharmacy(pharmacy.id)}
                            disabled={loading}
                            className="btn btn-success"
                          >
                            {loading ? "Approving..." : "Approve"}
                          </button>
                          <button className="btn btn-destructive">Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "approved" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Approved Pharmacies</h2>

              {dashboardData ? (
                <div className="space-y-4">
                  {dashboardData.recent_pharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{pharmacy.pharmacy_name || pharmacy.username}</h3>
                            <span className="badge badge-success">Active</span>
                          </div>
                          <p className="text-muted-foreground">Username: {pharmacy.username}</p>
                          <p className="text-muted-foreground">Email: {pharmacy.email}</p>
                          <p className="text-muted-foreground">License: {pharmacy.license_number}</p>
                          <p className="text-muted-foreground">Address: {pharmacy.address}</p>
                          <p className="text-muted-foreground">Phone: {pharmacy.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading approved pharmacies...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "medicines" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Medicine Inventory</h2>

              <div className="card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="p-4 text-left">Medicine Name</th>
                        <th className="p-4 text-left">Batch Number</th>
                        <th className="p-4 text-left">Stock</th>
                        <th className="p-4 text-left">Price (₹)</th>
                        <th className="p-4 text-left">Expiry Date</th>
                        <th className="p-4 text-left">Pharmacy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allStocks.map((medicine) => (
                        <tr key={medicine.id} className="border-b border-gray-700">
                          <td className="p-4 font-medium">{medicine.medicine_name}</td>
                          <td className="p-4 text-muted-foreground">{medicine.batch_number}</td>
                          <td className="p-4">{medicine.quantity?.toLocaleString()}</td>
                          <td className="p-4">₹{medicine.price}</td>
                          <td className="p-4 text-muted-foreground">{medicine.expiry_date}</td>
                          <td className="p-4 text-muted-foreground">{medicine.pharmacy_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "doctors" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Registered Doctors</h2>

              <div className="space-y-4">
                {demoData.doctors.map((doctor) => (
                  <div key={doctor.id} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{doctor.name}</h3>
                          <span className="badge badge-secondary">{doctor.specialization}</span>
                        </div>
                        <p className="text-muted-foreground">Hospital: {doctor.hospital}</p>
                        <p className="text-muted-foreground">Patients: {doctor.patients.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
