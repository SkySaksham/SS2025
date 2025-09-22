"use client"
import Link from "next/link"

export default function HomePage() {
  const handleRefresh = () => {
    // Clear any cached data and refresh the page
    if (typeof window !== 'undefined') {
      // Clear localStorage cache if needed
      localStorage.removeItem('cached_data')
      // Reload the page
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-blue-900">
            <h1 className="text-2xl font-bold">SehatSathi</h1>
            <p className="text-blue-700 text-sm">Healthcare Management System</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleRefresh} 
              className="btn btn-outline text-sm border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
              title="Refresh page"
            >
              🔄 Refresh
            </button>
            <Link href="/pharmacy/login" className="btn btn-secondary">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-blue-900 mb-6">SehatSathi</h1>
          <p className="text-xl text-blue-800 mb-8 max-w-3xl mx-auto">
            Bridging Healthcare Gaps in Rural India through Digital Innovation
          </p>
          <p className="text-lg text-blue-700 mb-8 max-w-2xl mx-auto">
            Addressing critical healthcare challenges in Nabha and surrounding rural areas where the Civil Hospital
            operates at less than 50% capacity, serving 173 villages with only 11 out of 23 sanctioned doctors.
          </p>

          {/* Problem Statement Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto shadow-md">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Healthcare Crisis in Rural Punjab</h3>
            <p className="text-red-700 text-sm leading-relaxed">
              Patients from 173 villages travel long distances, often missing work, only to find specialists unavailable
              or medicines out of stock. This web portal enables government authorities and pharmacies to coordinate
              better healthcare delivery and medicine availability.
            </p>
          </div>

          {/* Access Restriction Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-3xl mx-auto shadow-md">
            <p className="text-amber-800 text-sm">
              <strong>🔒 Restricted Access Portal:</strong> This web portal is exclusively for Government/Admin
              authorities and registered pharmacies. Patients and doctors use the separate SehatSathi mobile app.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link href="/government/login" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              <span>🏛️</span>
              Government Portal
            </Link>
            <Link href="/pharmacy/login" className="btn btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2">
              <span>💊</span>
              Pharmacy Login
            </Link>
            <Link href="/signup" className="btn btn-success text-lg px-8 py-4 inline-flex items-center gap-2">
              <span>📝</span>
              Register Pharmacy
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="card p-8 text-center bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <div className="text-5xl mb-6">🏥</div>
            <h3 className="text-xl font-semibold mb-4 text-blue-900">Government Dashboard</h3>
            <p className="text-blue-700 leading-relaxed">
              Monitor pharmacy approvals, track medicine availability across 173 villages, and ensure healthcare
              delivery to underserved rural populations in Nabha region.
            </p>
          </div>

          <div className="card p-8 text-center bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <div className="text-5xl mb-6">💊</div>
            <h3 className="text-xl font-semibold mb-4 text-blue-900">Pharmacy Management</h3>
            <p className="text-blue-700 leading-relaxed">
              Real-time medicine stock updates to prevent patients from traveling long distances only to find medicines
              unavailable. Coordinate with government for better rural healthcare.
            </p>
          </div>

          <div className="card p-8 text-center bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <div className="text-5xl mb-6">📊</div>
            <h3 className="text-xl font-semibold mb-4 text-blue-900">Rural Healthcare Analytics</h3>
            <p className="text-blue-700 leading-relaxed">
              Track healthcare delivery across rural villages, monitor medicine shortages, and analyze patient access
              patterns to improve healthcare outcomes for daily-wage workers and farmers.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">173</div>
            <div className="text-blue-700 text-sm">Villages Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">11/23</div>
            <div className="text-blue-700 text-sm">Doctors Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">31%</div>
            <div className="text-blue-700 text-sm">Rural Internet Access</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">24/7</div>
            <div className="text-blue-700 text-sm">Medicine Tracking</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-12">How SehatSathi Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Register</h3>
              <p className="text-blue-700 text-sm">
                Pharmacies register with their license details and wait for government approval
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Approve</h3>
              <p className="text-blue-700 text-sm">Government authorities review and approve pharmacy applications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Manage</h3>
              <p className="text-blue-700 text-sm">
                Approved pharmacies manage inventory while government monitors healthcare data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-300 bg-blue-100/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-blue-800 mb-4">
              © 2025 SehatSathi - Ministry of Health & Family Welfare, Government of India
            </p>
            <div className="flex justify-center gap-6 text-sm text-blue-600">
              <Link href="/privacy" className="hover:text-blue-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-900">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-blue-900">
                Contact Us
              </Link>
              <Link href="/help" className="hover:text-blue-900">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
