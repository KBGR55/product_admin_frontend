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
    <section className="features-section">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="features-header">
          <h2 className="features-title">
            ¿Por qué elegir
            <span className="features-title-highlight">
              Product Admin?
            </span>
          </h2>
          <p className="features-subtitle">
            La plataforma más completa para explorar, comparar y comprar productos de forma segura
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="features-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <button
                key={idx}
                onClick={() => setHoveredIdx(hoveredIdx === idx ? null : idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group feature-card-interactive"
              >
                {/* Gradient top border */}
                <div
                  className={`feature-card-border bg-gradient-to-r ${feature.color}`}
                />

                {/* Background glow on hover */}
                <div
                  className={`feature-card-glow ${feature.bgColor}`}
                />

                {/* Content */}
                <div className="feature-card-content">
                  {/* Icon */}
                  <div
                    className={`feature-icon-wrapper bg-gradient-to-br ${feature.color}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="feature-card-title">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="feature-card-description">
                    {feature.description}
                  </p>
                </div>

                {/* Shine effect */}
                <div className="feature-card-shine" />
              </button>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          {/* Decorative elements */}
          <div className="benefits-glow-1" />
          <div className="benefits-glow-2" />

          <div className="benefits-content">
            <h3 className="benefits-title">
              Más razones para confiar en nosotros
            </h3>

            <div className="benefits-grid">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="benefit-item"
                  style={{
                    animation: `slideIn 0.5s ease-out ${idx * 0.1}s backwards`,
                  }}
                >
                  <CheckCircleIcon className="benefit-icon" />
                  <span className="benefit-text">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}