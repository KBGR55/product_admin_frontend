import { Organization } from '@/types/organization'
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'

interface Product {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  photo_url?: string
  description?: string
}

interface ProductGridProps {
  selectedOrg: Organization
  products: Product[]
  loading: boolean
  onBack: () => void
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({
  selectedOrg,
  products,
  loading,
  onBack,
  onAddToCart,
}: ProductGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [addedId, setAddedId] = useState<number | null>(null)

  const handleAddToCart = (product: Product) => {
    onAddToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <p className="text-gray-600 text-center font-medium">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-12">
        <div
          className="h-56 rounded-xl mb-8 shadow-lg overflow-hidden relative group"
          style={{
            background: `linear-gradient(135deg, ${selectedOrg.primary_color} 0%, ${selectedOrg.secondary_color} 100%)`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 
             text-white/80 hover:text-white text-sm font-medium
             bg-white/10 hover:bg-white/20 backdrop-blur-md
             px-3 py-1.5 rounded-full transition-all duration-200"
          >

            <ArrowLeftIcon className="h-4 w-4" />
            Volver
          </button>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6 text-white">
            <div className="drop-shadow-lg max-w-3xl">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  Catálogo exclusivo
                </span>
              </div>

              <h2 className="text-4xl font-bold mb-2">
                {selectedOrg.name}
              </h2>

              {selectedOrg.description && (
                <p className="text-white/90 text-base leading-relaxed">
                  {selectedOrg.description}
                </p>
              )}

              <p className="text-xs opacity-75 mt-2">
                {products.length} productos disponibles
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-xl font-medium mb-2">
            No hay productos disponibles
          </p>
          <p className="text-gray-500">
            Pronto tendremos más opciones para ti
          </p>
        </div>
      ) : (
        <>
          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {products.map(product => (
              <div
                key={product.id}
                className="group h-full"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-300 h-full flex flex-col relative">
                  {/* Ribbon Badge */}
                  {product.stock > 0 && product.stock < 5 && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ¡Solo {product.stock}!
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.photo_url ? (
                      <>
                        <Image
                          src={product.photo_url}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay on hover */}
                        {hoveredId === product.id && (
                          <div className="absolute inset-0 bg-black/20 transition-colors duration-300" />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:via-purple-100 group-hover:to-pink-200 transition-colors duration-300">
                        <ShoppingCartIcon className="h-16 w-16 text-gray-400/50" />
                      </div>
                    )}

                    {/* Stock Overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🔒</div>
                          <span className="text-white font-bold text-lg">Sin stock</span>
                          <p className="text-white/80 text-sm mt-1">Próximamente</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 text-base">
                      {product.name}
                    </h3>

                    {/* SKU */}
                    <p className="text-xs text-gray-500 mb-3 font-mono bg-gray-50 px-2 py-1 rounded w-fit">
                      {product.sku}
                    </p>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {product.description}
                      </p>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-3" />

                    {/* Price & Stock Row */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Precio</span>
                        <span
                          className="text-2xl font-bold bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${selectedOrg.primary_color}, ${selectedOrg.secondary_color})`
                          }}
                        >
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs text-gray-500 font-medium">Stock</span>
                        {product.stock > 0 ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-green-600">
                              {product.stock}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-red-600">Agotado</span>
                        )}
                      </div>
                    </div>

                    {/* Button - FIXED HEIGHT */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-base font-medium mt-auto ${addedId === product.id
                          ? 'text-white shadow-lg'
                          : product.stock === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                            : 'text-white hover:shadow-xl active:scale-95'
                        }`}
                      style={{
                        backgroundColor: addedId === product.id
                          ? '#10b981'
                          : product.stock === 0
                            ? undefined
                            : selectedOrg.primary_color,
                        backgroundImage: addedId === product.id
                          ? 'linear-gradient(to right, #10b981, #059669)'
                          : product.stock === 0
                            ? undefined
                            : `linear-gradient(to right, ${selectedOrg.primary_color}, ${selectedOrg.secondary_color})`,
                      }}
                    >
                      {addedId === product.id ? (
                        <>
                          <span>✓</span>
                          ¡Añadido!
                        </>
                      ) : product.stock === 0 ? (
                        <>
                          <span>✕</span>
                          Sin stock
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon className="h-5 w-5" />
                          Agregar
                        </>
                      )}
                    </button>
                  </div>

                  {/* Shine effect on hover */}
                  {hoveredId === product.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Results Counter */}
          <div className="mt-12 text-center text-gray-600">
            <p className="font-medium">
              Mostrando <span className="text-indigo-600 font-bold">{products.length}</span> productos
            </p>
          </div>
        </>
      )}
    </section>
  )
}