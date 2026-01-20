'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import ProductDetailModal from '@/app/components/ProductDetailModal'
import { PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { getToken, peticionDelete, peticionGet } from '@/utilities/api'
import { Organization, OrganizationEmployee } from '@/types/organization'
import { Product, ProductsResponse } from '@/types/product'
import { PencilIcon } from 'lucide-react'
import FormProductModal from '@/app/components/FormProductModal'

export default function OrganizationProducts() {
    const router = useRouter()
    const params = useParams()
    const orgId = params?.id as string

    const [organization, setOrganization] = useState<Organization | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [token, setToken] = useState('')
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [isVendor, setIsVendor] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showFormEdit, setShowFormEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

const checkVendorRole = useCallback(async () => {
    if (!orgId) return

    try {
        const response = await peticionGet<{
            employees: OrganizationEmployee[]
        }>(`organizations/${orgId}/employees`)

        if (!response.ok) {
            setIsVendor(false)
            return
        }

        const employees = response.data?.employees || []

        const hasVendorRole = employees.some(emp =>
            emp.roles.some(role => role.toLowerCase() === 'vendedor')
        )

        setIsVendor(hasVendorRole)
    } catch {
        setIsVendor(false)
    }
}, [orgId])

const fetchData = useCallback(async () => {
    if (!orgId) return

    try {
        setLoading(true)

        const orgResponse = await peticionGet<Organization>(`organizations/${orgId}`)
        if (orgResponse.ok && orgResponse.data) {
            setOrganization(orgResponse.data)
        }

        const productsResponse = await peticionGet<ProductsResponse>(
            `organizations/${orgId}/products`
        )

        if (!productsResponse.ok) {
            setError(productsResponse.error || 'Error al cargar productos')
            return
        }

        setProducts(productsResponse.data?.products || [])
    } catch (err) {
        console.error('Fetch error:', err)
        setError('Error de conexión con el servidor')
    } finally {
        setLoading(false)
    }
}, [orgId])

useEffect(() => {
    if (!orgId) return

    const storedToken = getToken()
    if (!storedToken) {
        router.push('/auth/login')
        return
    }

    setToken(storedToken)
    checkVendorRole()
    fetchData()
}, [orgId, checkVendorRole, fetchData, router])

    const handleCreateProduct = () => {
        setShowCreateModal(true)
    }

    const handleEditProduct = () => {
        setShowFormEdit(true);
    }

    const handleCloseFormEdit = () => {
        setShowFormEdit(false);
    }

    const handleCloseModal = () => {
        setShowCreateModal(false)
    }

    const handleProductCreated = () => {
        // Recargar productos después de crear uno nuevo
        fetchData()
    }

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product)
        setShowDetailModal(true)
    }

    const handleCloseDetailModal = () => {
        setShowDetailModal(false)
        setSelectedProduct(null)
    }

    const handleDeleteProduct = async (productId: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return
        }

        setDeletingId(productId)

        try {
            const response = await peticionDelete<unknown>(
                `organizations/${orgId}/products/${productId}`
            )
            if (!response.ok) {
                setError(response.message || 'Error al eliminar producto')
                return
            }
            // Remover producto de la lista
            setProducts(products.filter(p => p.id !== productId))
        } catch (err) {
            console.error('Error en handleDeleteProduct:', err)
            setError('Error de conexión con el servidor')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    {organization && (
                        <div
                            className="rounded-lg p-6 text-white mb-6"
                            style={{
                                background: `linear-gradient(135deg, ${organization.primary_color} 0%, ${organization.secondary_color} 100%)`,
                            }}
                        >
                            <h1 className="text-3xl font-bold">{organization.name}</h1>
                            <p className="text-white text-opacity-90">{organization.org_type}</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
                            <p className="text-gray-600 mt-1">Administra los productos de tu organización</p>
                        </div>
                        <button
                            onClick={handleCreateProduct}
                            className="btn-primary flex items-center gap-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Nuevo
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="auth-error">
                        <p className="auth-error-text">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                        <p className="text-gray-600 mt-4">Cargando productos...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin productos</h2>
                        <p className="text-gray-600 mb-6">Aún no tienes productos. {isVendor ? 'Crea uno para comenzar.' : 'Solo los vendedores pueden crear productos.'}</p>
                        {isVendor && (
                            <button
                                onClick={handleCreateProduct}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Crear Primer Producto
                            </button>
                        )}
                    </div>
                )}

                {/* Products Table */}
                {!loading && products.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Producto</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Precio</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Stock</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Estado</th>
                                    <th className="text-center px-6 py-4 font-semibold text-gray-900">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-semibold">${product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {product.stock} unidades
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.is_active
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {product.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2 flex-wrap">
                                                <button
                                                    onClick={() => handleViewProduct(product)}
                                                    className="btn-primary"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product)
                                                        handleEditProduct()
                                                    }}
                                                    className="btn-secondary"
                                                    title="Editar producto"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    disabled={deletingId === product.id}
                                                    className="btn-danger"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Modal Crear Producto */}
            <FormProductModal
                orgId={orgId}
                token={token}
                isOpen={showCreateModal}
                onClose={handleCloseModal}
                onSuccess={handleProductCreated}
            />

            <FormProductModal
                orgId={orgId}
                productId={selectedProduct?.id?.toString() || undefined}
                token={token}
                isOpen={showFormEdit}
                onClose={handleCloseFormEdit}
                onSuccess={handleProductCreated}
            />

            {/* Modal Detalle Producto */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={showDetailModal}
                onClose={handleCloseDetailModal}
                onEdit={handleEditProduct}
            />
        </div>
    )
}