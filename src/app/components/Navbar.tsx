
// src/app/components/Navbar.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftOnRectangleIcon, UserCircleIcon, Bars3Icon , XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    router.push('/auth/login')
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Product Admin</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
              Organizaciones
            </Link>
            <div className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-indigo-600 p-2">
                <UserCircleIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                Salir
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button className="text-gray-700 hover:text-indigo-600 p-2">
              <UserCircleIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 p-2"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon  className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link
              href="/dashboard"
              className="block text-gray-700 hover:text-indigo-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Organizaciones
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}