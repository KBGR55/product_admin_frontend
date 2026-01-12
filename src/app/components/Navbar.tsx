'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    router.push('/auth/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="navbar-logo">
            <div className="navbar-logo-icon">PA</div>
            <span className="text-xl">Product Admin</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="nav-link">
              Organizaciones
            </Link>

            <div className="flex items-center gap-4">
              <button className="icon-btn">
                <UserCircleIcon className="h-6 w-6" />
              </button>

              <button onClick={handleLogout} className="btn-danger">
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                Salir
              </button>
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button className="icon-btn">
              <UserCircleIcon className="h-6 w-6" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link
              href="/dashboard"
              className="block nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Organizaciones
            </Link>

            <button onClick={handleLogout} className="btn-danger w-full">
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}