'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, BuildingOfficeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Organization } from '@/types/organization'
import { getToken, peticionDelete, peticionGet } from '@/utilities/api'
import Header from '../components/Header'

interface OrganizationsResponse {
  organizations: Organization[]
}

export default function Dashboard() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetchOrganizations()
  }, [router])

  /**
   * Obtener organizaciones del usuario
   */
  const fetchOrganizations = async (): Promise<void> => {
    try {
      setLoading(true)
      setError('')

      const response = await peticionGet<OrganizationsResponse>('organizations')

      if (!response.ok) {
        setError(response.message || 'Error al cargar organizaciones')
        return
      }

      setOrganizations(response.data?.organizations || [])
    } catch (err) {
      console.error('Error en fetchOrganizations:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Crear nueva organización
   */
  const handleCreateOrg = (): void => {
    router.push('/organizations/form')
  }

  /**
   * Editar organización
   */
  const handleEditOrg = (e: React.MouseEvent, orgId: number): void => {
    e.stopPropagation()
    router.push(`/organizations/form/${orgId}`)
  }

  /**
   * Eliminar organización
   */
  const handleDeleteOrg = (e: React.MouseEvent, orgId: number): void => {
    e.stopPropagation()
    setShowDeleteConfirm(orgId)
  }

  /**
   * Confirmar eliminación
   */
  const confirmDelete = async (): Promise<void> => {
    if (!showDeleteConfirm) return

    setDeleting(true)
    try {
      const response = await peticionDelete(
        `organizations/${showDeleteConfirm}`
      )

      if (!response.ok) {
        throw new Error(response.message || 'Error al eliminar la organización')
      }

      setOrganizations(orgs =>
        orgs.filter(org => org.id !== showDeleteConfirm)
      )
      setShowDeleteConfirm(null)
    } catch (err) {
      console.error('Error al eliminar:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error de conexión al eliminar'
      )
    } finally {
      setDeleting(false)
    }
  }

  /**
   * Seleccionar organización
   */
  const handleSelectOrg = (orgId: number): void => {
    router.push(`/organizations/${orgId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={0} onCartClick={() => {}} showCart={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Organizaciones</h1>
              <p className="text-gray-600 mt-2">
                Selecciona una organización para administrar productos
              </p>
            </div>
            <button
              onClick={handleCreateOrg}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Nueva Organización
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Cargando organizaciones...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && organizations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin organizaciones</h2>
            <p className="text-gray-600 mb-6">
              Aún no tienes organizaciones. Crea una nueva para comenzar.
            </p>
            <button
              onClick={handleCreateOrg}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Crear Primera Organización
            </button>
          </div>
        )}

        {/* Organizations Grid */}
        {!loading && organizations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map(org => (
              <div
                key={org.id}
                onClick={() => handleSelectOrg(org.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer border border-gray-200 hover:border-indigo-400 group"
              >
                {/* Color Header con botones */}
                <div
                  className="h-24 relative"
                  style={{
                    background: `linear-gradient(135deg, ${org.primary_color} 0%, ${org.secondary_color} 100%)`,
                  }}
                >
                  {/* Botones flotantes */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleEditOrg(e, org.id)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-indigo-50 transition-colors duration-200"
                      title="Editar organización"
                    >
                      <PencilIcon className="h-5 w-5 text-indigo-600" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteOrg(e, org.id)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors duration-200"
                      title="Eliminar organización"
                    >
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{org.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{org.org_type}</p>

                  {/* Description */}
                  {org.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{org.description}</p>
                  )}

                  {/* Stats */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Razón Social:</span>
                      <span className="font-medium text-gray-900 text-xs">{org.legal_name}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Email:</span>
                      <span className="font-medium text-gray-900 text-xs">{org.email}</span>
                    </div>
                  </div>

                  {/* Created Date */}
                  <p className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                    Creado: {new Date(org.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ¿Eliminar organización?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Esta acción no se puede deshacer. Se eliminarán todos los empleados, roles y productos asociados.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}