"use client"

import React from "react"
import Link from "next/link"

export default function HomePage(): JSX.Element {
  const handleRefresh: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("cached_data")
      } catch {
        /* ignore */
      }
      window.location.reload()
    }
  }

  const stats = [
    { label: "Villages", value: "173" },
    { label: "Doctors", value: "11 / 23" },
    { label: "Realtime stock", value: "Enabled" },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-purple-50 text-slate-800 overflow-hidden">

      {/* Background watermark */}
      <img
        src="/logo_watermark.png"
        alt="Watermark"
        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
      />

      {/* Header with logo */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo_header.png" alt="SehatSathi Logo" className="h-16 w-auto" />
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">SehatSathi</h1>
            <p className="text-sm text-slate-600 mt-1">Web portal for government & pharmacies</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:opacity-90 transition"
        >
          🔄 Refresh
        </button>
      </header>

      <main className="relative z-10 container mx-auto px-6 pb-16 flex flex-col justify-center min-h-[calc(100vh-120px)]">
        {/* Hero */}
        <section className="grid gap-6 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
              Coordinate medicine supply. <span className="text-purple-700">Reduce travel. Save time.</span>
            </h2>

            <p className="mt-4 text-slate-600 max-w-xl">
              Minimal, secure portal connecting government authorities and registered pharmacies to keep medicines in stock.
            </p>

            {/* Buttons under hero text */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:scale-[1.02] transition"
              >
                📝 Register
              </Link>

              <Link
                href="/pharmacy/login"
                className="px-5 py-3 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 transition"
              >
                💊 Pharmacy Login
              </Link>

              <Link
                href="/government/login"
                className="px-5 py-3 rounded-lg border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition"
              >
                🏛️ Government Portal
              </Link>
            </div>
          </div>

          {/* Snapshot card */}
          <aside className="p-6 bg-white rounded-2xl shadow-md border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-900">Snapshot</h3>
                <p className="text-sm text-slate-500 mt-1">Nabha pilot</p>
              </div>
              <div className="text-xs text-slate-400">Live</div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-semibold text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} SehatSathi</div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
