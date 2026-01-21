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
  total: number // AÑADIDO: Este prop se recibe pero no se usa
  organizations?: Organization[]
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  total, // AÑADIDO: Usar el total proporcionado
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
    return '5930980735353' // Número de respaldo si no hay configuración
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

    // Verificar que todos los productos tengan stock suficiente
    const outOfStockItems = orgItems.filter(item => {
      const currentInCart = orgItems.find(i => i.product.id === item.product.id)?.quantity || 0
      return currentInCart > item.product.stock
    })

    if (outOfStockItems.length > 0) {
      alert(`Algunos productos no tienen suficiente stock. Por favor, ajusta las cantidades.`)
      return
    }

    // Calcular total solo de esta organización
    const orgSubtotal = orgItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const message = orgItems
      .map(
        item =>
          `${item.product.name} (${item.product.sku}) - Cantidad: ${item.quantity} - Precio: $${(item.product.price * item.quantity).toFixed(2)}`
      )
      .join('\n')

    const companyName = organization?.name || 'Product Admin'
    const whatsappMessage = `Hola ${companyName}, quiero realizar un pedido:\n\n${message}\n\nTotal: $${orgSubtotal.toFixed(2)}`
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

  const handleIncreaseQuantity = (item: CartItem) => {
    // Verificar que no exceda el stock disponible
    if (item.quantity >= item.product.stock) {
      alert(`No hay más stock disponible. Máximo: ${item.product.stock}`)
      return
    }
    onUpdateQuantity(item.product.id, item.org_id, item.quantity + 1)
  }

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.org_id, item.quantity - 1)
    } else {
      // Si la cantidad es 1, preguntar si quiere eliminar
      if (window.confirm('¿Quieres eliminar este producto del carrito?')) {
        handleRemove(item.product.id, item.org_id)
      }
    }
  }

  if (!isOpen || !isClient) return null

  // Agrupar items por organización
  const itemsByOrg: { [orgId: number]: CartItem[] } = {}
  cart.forEach(item => {
    if (!itemsByOrg[item.org_id]) {
      itemsByOrg[item.org_id] = []
    }
    itemsByOrg[item.org_id].push(item)
  })

  const hasMultipleOrgs = Object.keys(itemsByOrg).length > 1

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
                {hasMultipleOrgs && ` • ${Object.keys(itemsByOrg).length} organizaciones`}
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
          <div className="p-4 space-y-4">
            {Object.entries(itemsByOrg).map(([orgId, orgItems]) => {
              const org = organizations.find(o => o.id === parseInt(orgId))
              const orgSubtotal = orgItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) 

              return (
                <div key={orgId} className="space-y-3">
                  {/* Organization Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="font-semibold text-indigo-700 text-sm">
                          {org?.name || `Organización ${orgId}`}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                        {orgItems.length} producto{orgItems.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {org?.telephone && (
                      <p className="text-xs text-gray-600 mt-1">
                        📞 Contacto: {org.code_telephone || ''} {org.telephone}
                      </p>
                    )}
                  </div>

              {/* Items de esta organización */}
              {orgItems.map(item => {
                const itemKey = `${item.product.id}-${item.org_id}`
                const isRemoving = removingId === itemKey
                const availableStock = item.product.stock
                const currentQuantity = item.quantity
                const canIncrease = currentQuantity < availableStock

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

                      {/* Stock Info */}
                      <div className="mb-3 text-xs">
                      {availableStock < 10 &&
  availableStock > 0 &&
  currentQuantity < availableStock && (
    <p className="text-amber-600 bg-amber-50 p-2 rounded-lg mb-2">
      ⚠️ Solo quedan {availableStock} disponible{availableStock !== 1 ? 's' : ''}
    </p>
)}

{currentQuantity >= availableStock && (
  <p className="text-red-600 bg-red-50 p-2 rounded-lg mb-2">
    ✕ Has alcanzado el stock máximo ({availableStock})
  </p>
)}

                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg p-1.5 border border-slate-200/50">
                        <button
                          onClick={() => handleDecreaseQuantity(item)}
                          className="p-2 hover:bg-white rounded-md transition-all duration-200 text-slate-600 hover:text-indigo-600 hover:shadow-sm"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900 w-6 text-center text-sm">
                            {currentQuantity}
                          </span>
                          <span className="text-xs text-gray-500">de {availableStock}</span>
                        </div>
                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={!canIncrease}
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

              {/* Resumen por organización */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total:</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    ${orgSubtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
    </div>
    )}

      {/* Footer - Purchase Section */}
      {cart.length > 0 && (
        <div className="border-t border-slate-200/50 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-6 space-y-4">
          {/* Total General */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">TOTAL GENERAL</span>
              <span className="text-2xl font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-slate-300">
              Incluye impuestos de todas las organizaciones
            </p>
          </div>

          {/* Advertencia de múltiples organizaciones */}
          {hasMultipleOrgs ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-800 mb-2">
                <span className="text-lg">⚠️</span>
                <span className="font-semibold">Múltiples organizaciones</span>
              </div>
              <p className="text-sm text-amber-700">
                Tienes productos de {Object.keys(itemsByOrg).length} organizaciones diferentes. 
                Deberás contactar a cada una por separado.
              </p>
            </div>
          ) : (
            // Info de organización única
            (() => {
              const firstOrgId = cart[0].org_id
              const organization = organizations.find(org => org.id === firstOrgId)
              const orgItems = cart.filter(item => item.org_id === firstOrgId)

              return (
                <div className="space-y-3">
                  {/* Organization Info */}
                  {organization && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Organización:</span>
                      <span className="font-semibold text-indigo-700">{organization.name}</span>
                    </div>
                  )}

                  {/* Verificar stock antes de comprar */}
                  {orgItems.some(item => item.quantity > item.product.stock) && (
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <span className="text-lg">✕</span>
                        <span className="font-semibold">Stock insuficiente</span>
                      </div>
                      <p className="text-sm text-red-700">
                        Algunos productos no tienen suficiente stock. Por favor, ajusta las cantidades.
                      </p>
                    </div>
                  )}
                </div>
              )
            })()
          )}

          {/* WhatsApp Button */}
          <button
            onClick={handleSendToWhatsApp}
            disabled={hasMultipleOrgs || cart.some(item => item.quantity > item.product.stock)}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl active:scale-95 text-base relative overflow-hidden group disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:active:scale-100"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              {hasMultipleOrgs ? 'CONTACTAR POR SEPARADO' : 'COMPRAR'}
              <SendIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Info message */}
          <p className="text-xs text-slate-600 text-center">
            {hasMultipleOrgs 
              ? 'Debes contactar a cada organización por separado' 
              : 'Se abrirá WhatsApp para confirmar tu pedido'}
          </p>
        </div>
      )}
    </div>
    </div>
  )
}