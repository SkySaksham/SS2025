"use client"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-2xl font-bold">SehatSathi</h1>
            <p className="text-blue-200 text-sm">Healthcare Management System</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-outline text-sm"
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
          <h1 className="text-6xl font-bold text-white mb-6">SehatSathi</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Bridging Healthcare Gaps in Rural India through Digital Innovation
          </p>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Addressing critical healthcare challenges in Nabha and surrounding rural areas where the Civil Hospital
            operates at less than 50% capacity, serving 173 villages with only 11 out of 23 sanctioned doctors.
          </p>

          {/* Problem Statement Section */}
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-red-100 mb-3">Healthcare Crisis in Rural Punjab</h3>
            <p className="text-red-200 text-sm leading-relaxed">
              Patients from 173 villages travel long distances, often missing work, only to find specialists unavailable
              or medicines out of stock. This web portal enables government authorities and pharmacies to coordinate
              better healthcare delivery and medicine availability.
            </p>
          </div>

          {/* Access Restriction Notice */}
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
            <p className="text-amber-200 text-sm">
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
          <div className="card p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-5xl mb-6">🏥</div>
            <h3 className="text-xl font-semibold mb-4 text-white">Government Dashboard</h3>
            <p className="text-blue-100 leading-relaxed">
              Monitor pharmacy approvals, track medicine availability across 173 villages, and ensure healthcare
              delivery to underserved rural populations in Nabha region.
            </p>
          </div>

          <div className="card p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-5xl mb-6">💊</div>
            <h3 className="text-xl font-semibold mb-4 text-white">Pharmacy Management</h3>
            <p className="text-blue-100 leading-relaxed">
              Real-time medicine stock updates to prevent patients from traveling long distances only to find medicines
              unavailable. Coordinate with government for better rural healthcare.
            </p>
          </div>

          <div className="card p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-5xl mb-6">📊</div>
            <h3 className="text-xl font-semibold mb-4 text-white">Rural Healthcare Analytics</h3>
            <p className="text-blue-100 leading-relaxed">
              Track healthcare delivery across rural villages, monitor medicine shortages, and analyze patient access
              patterns to improve healthcare outcomes for daily-wage workers and farmers.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">173</div>
            <div className="text-blue-200 text-sm">Villages Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">11/23</div>
            <div className="text-blue-200 text-sm">Doctors Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">31%</div>
            <div className="text-blue-200 text-sm">Rural Internet Access</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-200 text-sm">Medicine Tracking</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">How SehatSathi Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Register</h3>
              <p className="text-blue-200 text-sm">
                Pharmacies register with their license details and wait for government approval
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Approve</h3>
              <p className="text-blue-200 text-sm">Government authorities review and approve pharmacy applications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Manage</h3>
              <p className="text-blue-200 text-sm">
                Approved pharmacies manage inventory while government monitors healthcare data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-800 bg-blue-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-blue-200 mb-4">
              © 2025 SehatSathi - Ministry of Health & Family Welfare, Government of India
            </p>
            <div className="flex justify-center gap-6 text-sm text-blue-300">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
              <Link href="/help" className="hover:text-white">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
