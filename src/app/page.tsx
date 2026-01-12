import Link from 'next/link'
import {
  CubeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="brand">
          <div className="brand-icon">PA</div>
          <span className="text-xl">Product Admin</span>
        </div>

        <Link href="/auth/login" className="btn-primary">
          Iniciar sesión
        </Link>
      </header>

      {/* Hero */}
      <main className="landing-main">
        <div className="max-w-3xl text-center">
          <h1 className="landing-title">
            Gestiona los productos de tu organización
            <span className="text-indigo-600"> de forma simple</span>
          </h1>

          <p className="landing-subtitle">
            Product Admin te permite administrar productos, stock,
            precios y atributos personalizados por organización,
            todo desde un solo lugar.
          </p>

          <div className="mt-10 flex justify-center">
            <Link href="/auth/login" className="btn-primary-lg">
              Acceder al sistema
            </Link>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <CubeIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h3 className="feature-title">Gestión de Productos</h3>
            <p className="feature-text">
              Crea, edita y administra productos con precios,
              costos y stock.
            </p>
          </div>

          <div className="feature-card">
            <BuildingOfficeIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h3 className="feature-title">Organizaciones</h3>
            <p className="feature-text">
              Cada organización maneja su propio catálogo
              de productos.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheckIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h3 className="feature-title">Acceso Seguro</h3>
            <p className="feature-text">
              Sistema protegido con autenticación
              y control de acceso.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        © {new Date().getFullYear()} Product Admin — Gestión inteligente de productos
      </footer>
    </div>
  )
}
