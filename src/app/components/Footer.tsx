import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold">
                PA
              </div>
              <span className="text-white font-bold">Product Admin</span>
            </div>
            <p className="text-sm text-gray-500">
              La plataforma inteligente para explorar y comprar productos
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors">
                  Organizaciones
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors">
                  Catálogo
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors">
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:info@productadmin.com"
                  className="hover:text-indigo-400 transition-colors"
                >
                  info@productadmin.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/593XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors"
                >
                  WhatsApp 💬
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>
              © {currentYear} Product Admin — Catálogo inteligente de productos
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-indigo-400 transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="hover:text-indigo-400 transition-colors">
                Términos
              </Link>
              <Link href="#" className="hover:text-indigo-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}