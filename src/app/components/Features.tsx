'use client'

import { CubeIcon, ShoppingCartIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const features = [
  {
    icon: CubeIcon,
    title: 'Miles de Productos',
    description: 'Explora catálogos completos de múltiples organizaciones con diversidad de opciones',
    color: 'from-blue-600 to-cyan-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: ShoppingCartIcon,
    title: 'Carrito Inteligente',
    description: 'Agrega productos de diferentes organizaciones y compra en pocos clics',
    color: 'from-purple-600 to-pink-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Compra Segura',
    description: 'Contacta directamente por WhatsApp con confirmación y soporte en tiempo real',
    color: 'from-emerald-600 to-teal-600',
    bgColor: 'bg-emerald-50',
  },
]

const benefits = [
  'Sin comisiones ocultas',
  'Atención al cliente 24/7',
  'Garantía de satisfacción',
  'Envíos rápidos',
  'Productos verificados',
  'Pago seguro',
]

export default function Features() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-white py-20 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
            ¿Por qué elegir
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Product Admin?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plataforma más completa para explorar, comparar y comprar productos de forma segura
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <button
                key={idx}
                onClick={() => setHoveredIdx(hoveredIdx === idx ? null : idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden text-left h-full"
              >
                {/* Gradient top border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}
                />

                {/* Background glow on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.bgColor}`}
                />

                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl w-fit`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {feature.description}
                  </p>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </button>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl p-12 mb-16 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24" />

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Más razones para confiar en nosotros
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 group/item"
                  style={{
                    animation: `slideIn 0.5s ease-out ${idx * 0.1}s backwards`,
                  }}
                >
                  <CheckCircleIcon className="h-6 w-6 text-white flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="text-white font-semibold text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  )
}