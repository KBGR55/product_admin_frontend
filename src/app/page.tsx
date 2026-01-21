'use client'

import { useState, useEffect } from 'react'
import { Organization, OrganizationsResponse } from '@/types/organization'
import { peticionGet } from '@/utilities/api'
import Header from './components/Header'
import Hero from './components/Hero'
import OrganizationGrid from './components/OrganizationGrid'
import ProductGrid from './components/ProductGrid'
import CartSidebar from './components/CartSidebar'
import { Product, ProductsResponse } from '@/types/product'

interface CartItem {
  product: Product
  quantity: number
  org_id: number
}

export default function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await peticionGet<OrganizationsResponse>('public/organizations')
      if (response.ok && response.data?.organizations) {
        setOrganizations(response.data.organizations)
      }
    } catch (err) {
      console.error('Error fetching organizations:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async (orgId: number) => {
    try {
      setLoading(true)

      const response = await peticionGet<ProductsResponse>(
        `public/organizations/${orgId}/products`
      )
      if (response.ok && response.data?.products) {
        setProducts(response.data.products)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org)
    fetchProducts(org.id)
  }

  const addToCart = (product: Product) => {
    // Verificar stock antes de agregar
    const existingItem = cart.find(
      item => item.product.id === product.id && item.org_id === selectedOrg?.id
    )

    // Si ya existe, verificar que no exceda el stock
    if (existingItem && existingItem.quantity >= product.stock) {
      alert(`No hay más stock disponible. Máximo: ${product.stock}`)
      return
    }

    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.org_id === selectedOrg?.id
      )

      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.org_id === selectedOrg?.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { product, quantity: 1, org_id: selectedOrg!.id }]
    })
  }

  const updateQuantity = (productId: number, orgId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, orgId)
      return
    }

    // Obtener el producto para verificar stock
    const product = products.find(p => p.id === productId)
    
    if (product && quantity > product.stock) {
      alert(`No hay suficiente stock. Máximo: ${product.stock}`)
      return
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.org_id === orgId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (productId: number, orgId: number) => {
    setCart(prev =>
      prev.filter(item => !(item.product.id === productId && item.org_id === orgId))
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Convertir cart a formato { [productId]: quantity } para ProductGrid
  const getCartItemsForOrg = () => {
    if (!selectedOrg) return {}
    
    const orgCartItems: { [productId: number]: number } = {}
    
    cart.forEach(item => {
      if (item.org_id === selectedOrg.id) {
        orgCartItems[item.product.id] = item.quantity
      }
    })
    
    return orgCartItems
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header
        cartCount={cartCount}
        onCartClick={() => setShowCart(!showCart)}
        showCart={showCart}
      />
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedOrg ? (
          <OrganizationGrid
            organizations={organizations}
            loading={loading}
            onSelectOrg={handleSelectOrg}
          />
        ) : (
          <ProductGrid
            selectedOrg={selectedOrg}
            products={products}
            loading={loading}
            onBack={() => setSelectedOrg(null)}
            onAddToCart={addToCart}
            cartItems={getCartItemsForOrg()} // AÑADIDO: Pasar cartItems
          />
        )}
      </main>

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        total={getTotalPrice()}
        organizations={organizations}
      />

      {showCart && (
        <div
          onClick={() => setShowCart(false)}
          className="fixed inset-0 bg-black/80 z-30"
        />
      )}
    </div>
  )
}