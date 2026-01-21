import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon, } from '@heroicons/react/24/outline'
import { SendIcon } from 'lucide-react'
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

interface CartItem {
  product: Product
  quantity: number
  org_id: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (productId: number, orgId: number, quantity: number) => void
  onRemoveItem: (productId: number, orgId: number) => void
  total: number
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  total,
}: CartSidebarProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleSendToWhatsApp = () => {
    if (cart.length === 0) return

    const message = cart
      .map(
        item =>
          `${item.product.name} (${item.product.sku}) - Cantidad: ${item.quantity} - Precio: $${(item.product.price * item.quantity).toFixed(2)}`
      )
      .join('\n')

    const whatsappMessage = `Hola, quiero realizar un pedido:\n\n${message}\n\nTotal: $${total.toFixed(2)}`
    const encodedMessage = encodeURIComponent(whatsappMessage)

    window.open(`https://wa.me/5930980735353?text=${encodedMessage}`, '_blank')
  }

  const handleRemove = (productId: number, orgId: number) => {
    const key = `${productId}-${orgId}`
    setRemovingId(key)
    setTimeout(() => {
      onRemoveItem(productId, orgId)
      setRemovingId(null)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Header Glassmorphism */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-5 border-b border-slate-200/50 backdrop-blur-xl pt-20 sm:pt-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
              <ShoppingBagIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Tu Compra
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200 text-slate-600 hover:text-slate-900"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Items Container */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBagIcon className="h-10 w-10 text-slate-400" />
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-900 mb-2">
              Tu carrito está vacío
            </p>
            <p className="text-sm text-slate-600">
              Explora nuestros productos y agrega tus favoritos
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {cart.map(item => {
              const itemKey = `${item.product.id}-${item.org_id}`
              const isRemoving = removingId === itemKey

              return (
                <div
                  key={itemKey}
                  className={`group relative bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200/60 hover:border-indigo-300/50 transition-all duration-300 p-4 overflow-hidden ${
                    isRemoving ? 'opacity-0 translate-x-full' : 'opacity-100'
                  }`}
                >
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Title and Delete */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm group-hover:text-indigo-600 transition-colors">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          {item.product.sku}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.product.id, item.org_id)}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Price and Quantity Row */}
                    <div className="flex items-end justify-between mb-3 pt-2 border-t border-slate-200/50">
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          Precio unitario
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          Subtotal
                        </p>
                        <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg p-1.5 border border-slate-200/50">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            item.org_id,
                            item.quantity - 1
                          )
                        }
                        className="p-2 hover:bg-white rounded-md transition-all duration-200 text-slate-600 hover:text-indigo-600 hover:shadow-sm"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900 w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            item.org_id,
                            Math.min(item.quantity + 1, item.product.stock)
                          )
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="p-2 hover:bg-white rounded-md transition-all duration-200 text-slate-600 hover:text-indigo-600 hover:shadow-sm disabled:text-slate-300 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer - Purchase Section */}
      {cart.length > 0 && (
        <div className="border-t border-slate-200/50 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-6 space-y-4">
          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200/50 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-slate-900 font-semibold">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Impuesto</span>
              <span className="text-slate-900 font-semibold">
                ${(total * 0.12).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-slate-200/50 pt-3 flex justify-between items-center">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ${(total * 1.12).toFixed(2)}
              </span>
            </div>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={handleSendToWhatsApp}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl active:scale-95 text-base relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              COMPRAR
              <SendIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>


          {/* Info message */}
          <p className="text-xs text-slate-600 text-center">
            Se abrirá WhatsApp para confirmar tu pedido
          </p>
        </div>
      )}
    </div>
  )
}