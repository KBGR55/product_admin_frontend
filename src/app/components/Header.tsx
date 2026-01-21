'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { getToken, limpiarToken } from '@/utilities/api'
import { useState } from 'react'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  showCart: boolean
}

export default function Header({ cartCount, onCartClick, showCart }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const token = getToken()

  const handleLogout = () => {
    limpiarToken()
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:shadow-xl transition-shadow">
              PA
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Product Admin
              </span>
              <span className="block text-xs text-gray-500 font-semibold">Catálogo</span>
            </div>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors group relative">
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/organizations" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors group relative">
              Organizaciones
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
              <Link href="/about-us" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors group relative">
              Sobre Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>


          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className={`relative p-2.5 rounded-lg transition-all duration-300 group ${showCart
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <ShoppingCartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-xl animate-pulse">
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
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg border border-indigo-200/50 transition-all duration-200 group"
                  >
                    <UserCircleIcon className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-indigo-600">Cuenta</span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-top duration-200 z-50">
                      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">Mi Cuenta</p>
                        <p className="text-xs text-gray-600">usuario@example.com</p>
                      </div>

                      <div className="space-y-1 p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          Mi Perfil
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                          Configuración
                        </Link>

                        <div className="border-t border-gray-200 my-1" />

                        <button
                          onClick={() => {
                            setProfileMenuOpen(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          Salir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition-all duration-200 group border border-transparent hover:border-indigo-200"
              >
                <UserIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Iniciar sesión
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
          <div className="md:hidden border-t border-gray-200/50 py-4 space-y-3 animate-in slide-in-from-top duration-300">
            <Link
              href="/"
              className="block px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#"
              className="block px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tiendas
            </Link>
            <Link
              href="/organizations"
              className="block px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Organizaciones
            </Link>

            {token ? (
              <>
                <div className="border-t border-gray-200/50 pt-3 space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Mi Perfil
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Configuración
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all font-semibold"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg transition-all font-semibold hover:shadow-lg"
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