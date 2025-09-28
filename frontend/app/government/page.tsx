"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { governmentApi, User, GovernmentDashboard, PharmacyStock, ApiError } from "@/lib/api"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#0088FE", "#FF8042", "#FFBB28", "#A569BD"]

const demoDoctors = [
  { id: "demo1", name: "Dr. Arjun Mehta", specialization: "Cardiologist", hospital: "Nabha - Central", patients: 1250 },
  { id: "demo2", name: "Dr. Kavya Nair", specialization: "Pediatrician", hospital: "Nabha - Central", patients: 980 },
  { id: "demo3", name: "Dr. Rohit Singh", specialization: "Orthopedic", hospital: "Nabha - Central", patients: 750 },
  { id: "demo4", name: "Dr. Simran Kaur", specialization: "Gynecologist", hospital: "Nabha - City Hospital", patients: 600 },
  { id: "demo5", name: "Dr. Harpreet Singh", specialization: "ENT", hospital: "Nabha - Central Clinic", patients: 450 },
  { id: "demo6", name: "Dr. Meera Sharma", specialization: "Dermatologist", hospital: "Nabha - Skin Care Center", patients: 520 },
  { id: "demo7", name: "Dr. Raghav Verma", specialization: "Neurologist", hospital: "Nabha - Brain Clinic", patients: 300 },
]

const demoAppointments = [
  { doctor: "Dr. Arjun Mehta", count: 10 },
  { doctor: "Dr. Kavya Nair", count: 8 },
  { doctor: "Dr. Rohit Singh", count: 5 },
  { doctor: "Dr. Simran Kaur", count: 6 },
  { doctor: "Dr. Harpreet Singh", count: 4 },
  { doctor: "Dr. Meera Sharma", count: 7 },
  { doctor: "Dr. Raghav Verma", count: 3 },
]

export default function GovernmentDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState<GovernmentDashboard | null>(null)
  const [pendingPharmacies, setPendingPharmacies] = useState<User[]>([])
  const [allStocks, setAllStocks] = useState<Array<PharmacyStock & { pharmacy_name: string; address: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || (user.user_type !== 'government' && user.user_type !== 'admin'))) {
      router.push('/government/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && (user.user_type === 'government' || user.user_type === 'admin')) {
      fetchDashboardData()
      fetchPendingPharmacies()
      fetchAllStocks()
    }
  }, [user])

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
      console.error(error)
      setError(error instanceof ApiError ? error.message : "Failed to fetch dashboard data")
    }
  }

  const fetchPendingPharmacies = async () => {
    try {
      const data = await governmentApi.getPendingUsers()
      setPendingPharmacies(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAllStocks = async () => {
    try {
      const data = await governmentApi.getAllStocks()
      setAllStocks(data)
    } catch (error) {
      console.error(error)
    }
  }

  const approvePharmacy = async (pharmacyId: number) => {
    setLoading(true)
    try {
      await governmentApi.approveUser(pharmacyId)
      fetchPendingPharmacies()
      fetchDashboardData()
    } catch (error) {
      console.error(error)
      setError(error instanceof ApiError ? error.message : "Failed to approve pharmacy")
    }
    setLoading(false)
  }

  const analyticsData = {
    pharmacyGrowth: [
      { name: "Approved", count: dashboardData?.statistics.total_pharmacies || 0 },
      { name: "Pending", count: dashboardData?.statistics.pending_approvals || 0 },
    ],
    medicineTrends: [
      { day: "Mon", total: dashboardData?.statistics.total_medicines || 0, low: dashboardData?.statistics.low_stock_count || 0 },
      { day: "Tue", total: (dashboardData?.statistics.total_medicines || 0) + 50, low: (dashboardData?.statistics.low_stock_count || 0) + 10 },
      { day: "Wed", total: (dashboardData?.statistics.total_medicines || 0) + 100, low: (dashboardData?.statistics.low_stock_count || 0) + 5 },
      { day: "Thu", total: (dashboardData?.statistics.total_medicines || 0) + 120, low: (dashboardData?.statistics.low_stock_count || 0) + 15 },
      { day: "Fri", total: (dashboardData?.statistics.total_medicines || 0) + 150, low: (dashboardData?.statistics.low_stock_count || 0) + 20 },
    ],
    appointments: demoAppointments,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.user_type !== 'government' && user.user_type !== 'admin')) return null

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* Header */}
      <header className="border-b border-blue-200 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-blue-900">SehatSathi Government Dashboard</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleRefresh} className="px-3 py-1 text-blue-700 border border-blue-300 rounded hover:bg-blue-100">🔄 Refresh</button>
            <span className="text-blue-700 font-medium">Welcome, {user?.username}</span>
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-900 text-sm">Production</span>
            <button onClick={logout} className="px-3 py-1 text-white bg-blue-700 rounded hover:bg-blue-800">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-blue-900 p-4 rounded-r-xl shadow">
          <nav className="space-y-2">
            {[
              { key: "overview", label: "📊 Overview" },
              { key: "pending", label: `⏰ Pending Approvals (${pendingPharmacies.length})` },
              { key: "approved", label: `✅ Approved Pharmacies (${dashboardData?.statistics.total_pharmacies || 0})` },
              { key: "medicines", label: `💊 Medicine Inventory (${allStocks.length})` },
              { key: "appointments", label: `📅 Appointments (${demoAppointments.length})` },
              { key: "analytics", label: "📈 Analytics" },
              { key: "doctors", label: `👨‍⚕️ Registered Doctors (${demoDoctors.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`w-full text-left p-3 rounded-l-lg font-medium transition-colors duration-300 ${
                  activeTab === tab.key ? "bg-blue-600 text-white font-semibold" : "text-white hover:bg-blue-700"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          {/* Overview */}
          {activeTab === "overview" && dashboardData && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ 
                  { title: "Total Pharmacies", value: dashboardData.statistics.total_pharmacies, status: "Approved" },
                  { title: "Pending Approvals", value: dashboardData.statistics.pending_approvals, status: "Requires attention" },
                  { title: "Total Medicines", value: dashboardData.statistics.total_medicines, status: "In stock" },
                  { title: "Low Stock Alerts", value: dashboardData.statistics.low_stock_count, status: "Need attention" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded shadow flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-blue-700">{stat.title}</h3>
                    <div className="text-2xl font-bold text-blue-800">{stat.value}</div>
                    <p className="text-blue-600 text-xs">{stat.status}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Pharmacy Approvals</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.pharmacyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1D4ED8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Medicine Stock Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analyticsData.medicineTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="low" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Pending Approvals */}
          {activeTab === "pending" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Pending Approvals</h2>
              {pendingPharmacies.length === 0 ? (
                <div className="bg-white p-6 rounded shadow text-center text-blue-900">No pending pharmacy applications</div>
              ) : (
                <div className="space-y-4">
                  {pendingPharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="bg-white p-6 rounded shadow flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">{pharmacy.pharmacy_name || pharmacy.username}</h3>
                        <p className="text-blue-700 text-sm">Email: {pharmacy.email}</p>
                        <p className="text-blue-700 text-sm">License: {pharmacy.license_number}</p>
                        <p className="text-blue-700 text-sm">Address: {pharmacy.address}</p>
                        <p className="text-blue-700 text-sm">Phone: {pharmacy.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approvePharmacy(pharmacy.id)} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                          {loading ? "Approving..." : "Approve"}
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Approved Pharmacies */}
          {activeTab === "approved" && dashboardData && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Approved Pharmacies</h2>
              <div className="space-y-4">
                {dashboardData.recent_pharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">{pharmacy.pharmacy_name || pharmacy.username}</h3>
                        <p className="text-blue-700 text-sm">Email: {pharmacy.email}</p>
                        <p className="text-blue-700 text-sm">License: {pharmacy.license_number}</p>
                        <p className="text-blue-700 text-sm">Address: {pharmacy.address}</p>
                        <p className="text-blue-700 text-sm">Phone: {pharmacy.phone}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-sm">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medicines */}
          {activeTab === "medicines" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Medicine Inventory</h2>
              <div className="bg-white p-4 rounded shadow overflow-x-auto">
                <table className="w-full text-blue-900">
                  <thead className="border-b border-blue-200">
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
                      <tr key={medicine.id} className="border-b border-blue-100">
                        <td className="p-4 font-medium">{medicine.medicine_name}</td>
                        <td className="p-4">{medicine.batch_number}</td>
                        <td className="p-4">{medicine.quantity?.toLocaleString()}</td>
                        <td className="p-4">₹{medicine.price}</td>
                        <td className="p-4">{medicine.expiry_date}</td>
                        <td className="p-4">{medicine.pharmacy_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Appointments</h2>
              <div className="bg-white p-4 rounded shadow overflow-x-auto">
                <table className="w-full text-blue-900">
                  <thead className="border-b border-blue-200">
                    <tr>
                      <th className="p-4 text-left">Doctor</th>
                      <th className="p-4 text-left">Appointments Fixed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoAppointments.map((appt, idx) => (
                      <tr key={idx} className="border-b border-blue-100">
                        <td className="p-4">{appt.doctor}</td>
                        <td className="p-4">{appt.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Pharmacy Growth</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.pharmacyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#1D4ED8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Medicine Stock Trends</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analyticsData.medicineTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#10B981" />
                      <Line type="monotone" dataKey="low" stroke="#F59E0B" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded shadow md:col-span-2">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Appointments Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.appointments}
                        dataKey="count"
                        nameKey="doctor"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analyticsData.appointments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Doctors */}
          {activeTab === "doctors" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Registered Doctors</h2>
              <div className="space-y-4">
                {demoDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white p-6 rounded shadow flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{doctor.name}</h3>
                      <p className="text-blue-700 text-sm">Specialization: {doctor.specialization}</p>
                      <p className="text-blue-700 text-sm">Hospital: {doctor.hospital}</p>
                      <p className="text-blue-700 text-sm">Patients: {doctor.patients.toLocaleString()}</p>
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
