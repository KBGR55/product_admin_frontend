import { CubeIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const features = [
  {
    icon: CubeIcon,
    title: 'Miles de Productos',
    description: 'Explora catálogos completos de múltiples organizaciones con diversidad de opciones',
  },
  {
    icon: ShoppingCartIcon,
    title: 'Carrito Inteligente',
    description: 'Agrega productos de diferentes organizaciones y compra en pocos clics',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Compra Segura',
    description: 'Contacta directamente por WhatsApp con confirmación y soporte en tiempo real',
  },
]

export default function Features() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir Product Admin?
          </h2>
          <p className="text-xl text-gray-600">
            La plataforma más completa para explorar y comprar productos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 border border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 via-indigo-600/0 to-indigo-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="inline-flex p-4 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl mb-4 group-hover:shadow-lg transition-shadow">
                    <Icon className="h-8 w-8 text-indigo-600" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}