import { Organization } from '@/types/organization'
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon, } from '@heroicons/react/24/outline'
import { SendIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

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
  organizations?: Organization[]
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  organizations = [],
}: CartSidebarProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Asegurar que solo se renderiza en cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Obtener el número de WhatsApp del carrito (si hay items de una organización)
  const getWhatsAppNumber = (): string => {
    if (cart.length === 0) return ''

    const firstOrgId = cart[0].org_id
    const organization = organizations.find(org => org.id === firstOrgId)

    console.log('Organization found:', organization)
    console.log('Code telephone:', organization?.code_telephone)
    console.log('Telephone:', organization?.telephone)

    if (organization?.code_telephone && organization?.telephone) {
      const cleanPhone = organization.telephone.replace(/\s|-|\.|\(|\)/g, '')
      const finalNumber = `${organization.code_telephone}${cleanPhone}`
      console.log('Final WhatsApp number:', finalNumber)
      return finalNumber
    }

    console.log('Using fallback number')
    return '5930980735353'
  }

  const handleSendToWhatsApp = () => {
    if (cart.length === 0) return

    const whatsappNumber = getWhatsAppNumber()
    const firstOrgId = cart[0].org_id
    const organization = organizations.find(org => org.id === firstOrgId)

    // Filtrar solo items de la organización actual
    const orgItems = cart.filter(item => item.org_id === firstOrgId)

    if (orgItems.length === 0) {
      alert('No hay productos de esta organización en el carrito')
      return
    }

    // Calcular total solo de esta organización
    const orgTotal = orgItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const message = orgItems
      .map(
        item =>
          `${item.product.name} (${item.product.sku}) - Cantidad: ${item.quantity} - Precio: $${(item.product.price * item.quantity).toFixed(2)}`
      )
      .join('\n')

    const companyName = organization?.name || 'Product Admin'
    const finalTotal = (orgTotal * 1.12).toFixed(2)
    const whatsappMessage = `Hola ${companyName}, quiero realizar un pedido:\n\n${message}\n\nSubtotal: $${orgTotal.toFixed(2)}\nImpuesto (12%): $${(orgTotal * 0.12).toFixed(2)}\nTotal: $${finalTotal}`
    const encodedMessage = encodeURIComponent(whatsappMessage)

    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleRemove = (productId: number, orgId: number) => {
    const key = `${productId}-${orgId}`
    setRemovingId(key)
    setTimeout(() => {
      onRemoveItem(productId, orgId)
      setRemovingId(null)
    }, 300)
  }

  if (!isOpen || !isClient) return null

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
          {/* Organization Info */}
          {(() => {
            const firstOrgId = cart[0].org_id
            const organization = organizations.find(org => org.id === firstOrgId)
            const orgItems = cart.filter(item => item.org_id === firstOrgId)
            const orgTotal = orgItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

            return (
              <>
                {/* Organization Name */}
                {organization && (
                  <div className="text-sm font-semibold text-indigo-600 mb-3">
                    📦 {organization.name}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200/50 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Subtotal</span>
                    <span className="text-slate-900 font-semibold">
                      ${orgTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Impuesto</span>
                    <span className="text-slate-900 font-semibold">
                      ${(orgTotal * 0.12).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200/50 pt-3 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      ${(orgTotal * 1.12).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Info Message */}
                {cart.length > orgItems.length && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    ⚠️ Tienes productos de múltiples organizaciones. Se enviará solo de: {organization?.name}
                  </p>
                )}
              </>
            )
          })()}

          {/* WhatsApp Button */}
          <button
            onClick={handleSendToWhatsApp}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl active:scale-95 text-base relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.93 1.242c-1.527.756-2.938 1.831-4.084 3.165C5.51 8.602 4.863 10.16 4.863 11.788c0 1.908.474 3.74 1.38 5.368l-1.508 5.512 5.657-1.483c1.5.823 3.21 1.257 4.923 1.257 5.449 0 9.886-4.438 9.886-9.886 0-2.657-.975-5.165-2.75-7.151-1.776-1.986-4.144-3.15-6.694-3.15" />
            </svg>
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