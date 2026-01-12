'use client'

import { Product } from '@/types/product'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onEdit: (product: Product) => void
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null

  const profit = product.price - product.cost
  const profitMargin = product.cost > 0 ? ((profit / product.cost) * 100).toFixed(1) : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[85%] sm:w-[80%] md:w-[70%]  max-h-[90%] sm:max-h-[85%] lg:max-h-[80%]   overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Detalle del Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Foto y Info Básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {/* Foto */}
            <div>
              {product.photo_url ? (
                <div className="rounded-lg overflow-hidden border border-gray-200 h-64 w-full">
                  <img
                    src={product.photo_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 h-64 w-full flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500 text-sm">Sin foto</p>
                </div>
              )}
            </div>

            {/* Info Básica */}
            <div >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-5">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 grap-x-6">
                {/* Nombre */}
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight break-words">
                    {product.name}
                  </p>
                </div>

                {/* SKU */}
                <div>
                  <p className="text-xs text-gray-500">SKU</p>
                  <p className="text-sm sm:text-base font-mono text-gray-900 ">
                    {product.sku}
                  </p>
                </div>

                {/* Stock */}
                <div>
                  <p className="text-xs text-gray-500">STOCK</p>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium  ${product.stock > 0
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {product.stock} uds
                  </span>
                </div>

                {/* Estado */}
                <div >
                  <p className="text-xs text-gray-500">Estado</p>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Descripción */}
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500">Descripción</p>
                  <p className="text-sm text-gray-700 mt-0.5 leading-snug">
                    {product.description || 'Sin descripción'}
                  </p>
                </div>
              </div>
            </div>

            {/* Atributos */}
            {Object.keys(product.attributes).length > 0 && (
              <div >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-5">
                  Atributos Especiales
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div
                      key={key}
                      className="group rounded-xl border border-gray-200/60 bg-white/70 backdrop-blur
                     p-4 transition-all hover:shadow-md hover:border-indigo-200"
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {key}
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900 break-words">
                        {typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Precios */}
          <div className=" pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Financiera</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Precio de Venta</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-600 font-medium">Costo</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">
                  ${product.cost.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-600 font-medium">Ganancia</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ${(product.price - product.cost).toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-1">{profitMargin}% margen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}