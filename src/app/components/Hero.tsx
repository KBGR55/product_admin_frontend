export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Descubre nuestros
          <span className="block bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">
            productos exclusivos
          </span>
        </h1>

        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Explora múltiples organizaciones y encuentra los mejores productos con precios competitivos. 
          Compra de forma segura directamente por WhatsApp.
        </p>
      </div>
    </section>
  )
}