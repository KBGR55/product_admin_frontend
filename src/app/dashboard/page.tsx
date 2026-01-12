'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'

import { PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { Organization } from '@/types/organization'
import { getToken, peticionGet } from '@/ utilities/api'

interface OrganizationsResponse {
  organizations: Organization[]
}

export default function Dashboard() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    router.push('/organizations/create')
  }

  /**
   * Seleccionar organización
   */
  const handleSelectOrg = (orgId: number): void => {
    router.push(`/organizations/${orgId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200 hover:border-indigo-400"
              >
                {/* Color Header */}
                <div
                  className="h-24"
                  style={{
                    background: `linear-gradient(135deg, ${org.primary_color} 0%, ${org.secondary_color} 100%)`,
                  }}
                />

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
                      <span className="font-medium text-gray-900">{org.legal_name}</span>
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
    </div>
  )
}