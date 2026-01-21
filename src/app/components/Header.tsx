import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { getToken } from '@/utilities/api'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  showCart: boolean
}

export default function Header({ cartCount, onCartClick, showCart }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            PA
          </div>
          <div>
            <span className="block text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              Product Admin
            </span>
            <span className="block text-xs text-gray-500 font-medium">Catálogo Inteligente</span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!getToken() && (
            <Link
              href="/auth/login"
              className="px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition duration-200"
            >
              Iniciar sesión
            </Link>
          )}

          <button
            onClick={onCartClick}
            className={`relative p-2.5 rounded-lg transition duration-200 ${
              showCart
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}