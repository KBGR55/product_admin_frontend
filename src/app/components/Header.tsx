'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { getToken, limpiarToken } from '@/utilities/api'
import { useEffect, useState } from 'react'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  showCart: boolean
}

export default function Header({ cartCount, onCartClick, showCart }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setToken(getToken())
  }, [])

  if (!mounted) return null

  const handleLogout = () => {
    limpiarToken()
    router.push('/auth/login')
  }

  return (
    <header className="header-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <div className="header-logo-icon">
              PA
            </div>
            <div className="hidden sm:block">
              <span className="logo-text-gradient">
                Product Admin
              </span>
              <span className="header-logo-subtitle">Catálogo</span>
            </div>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="nav-link">
              <span className="nav-link-text">Inicio</span>
              <span className="nav-indicator" />
            </Link>
            {token && (
              <Link href="/organizations" className="nav-link">
                <span className="nav-link-text">Organizaciones</span>
                <span className="nav-indicator" />
              </Link>
            )}
            <Link href="/about-us" className="nav-link">
              <span className="nav-link-text">Sobre Nosotros</span>
              <span className="nav-indicator" />
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className={`cart-button ${showCart ? 'cart-button-active' : ''}`}
            >
              <ShoppingCartIcon className="cart-icon" />
              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {token ? (
              <>
                {/* Profile Menu - Desktop */}
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="profile-button"
                  >
                    <UserCircleIcon className="profile-icon" />
                    <span className="profile-text">Cuenta</span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <p className="dropdown-title">Mi Cuenta</p>
                        <p className="dropdown-subtitle">usuario@example.com</p>
                      </div>

                      <div className="dropdown-list">
                        <Link
                          href="/profile"
                          className="dropdown-item"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <UserCircleIcon className="dropdown-item-icon" />
                          <span>Mi Perfil</span>
                        </Link>

                        <Link
                          href="/settings"
                          className="dropdown-item"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="dropdown-item-icon" />
                          <span>Configuración</span>
                        </Link>

                        <div className="dropdown-divider" />

                        <button
                          onClick={() => {
                            setProfileMenuOpen(false)
                            handleLogout()
                          }}
                          className="dropdown-item logout-item"
                        >
                          <ArrowRightOnRectangleIcon className="dropdown-item-icon" />
                          <span>Salir</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="login-button"
              >
                <UserIcon className="login-icon" />
                <span>Iniciar sesión</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="mobile-menu-icon" />
              ) : (
                <Bars3Icon className="mobile-menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link
              href="/"
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/about-us"
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            {token ? (
              <>
                <Link
                  href="/organizations"
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Organizaciones
                </Link>
                <div className="mobile-menu-section">
                  <Link
                    href="/profile"
                    className="mobile-menu-item-with-icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircleIcon className="mobile-menu-item-icon" />
                    <span>Mi Perfil</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="mobile-menu-item-with-icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Cog6ToothIcon className="mobile-menu-item-icon" />
                    <span>Configuración</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="mobile-logout-button"
                  >
                    <ArrowRightOnRectangleIcon className="mobile-logout-icon" />
                    <span>Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="mobile-login-button"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}