'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import {
  UsersIcon,
  ShieldCheckIcon,
  CubeIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { getToken, peticionGet, peticionPost, peticionDelete } from '@/utilities/api'
import { Organization, Role, RolesResponse } from '@/types/organization'

export interface EmployeeRole {
  id: number
  name: string
  description?: string
}

export interface OrganizationEmployee {
  id: number
  user_id: number
  first_name: string
  last_name: string
  email?: string
  roles: EmployeeRole[]   // ✅ ahora coincide
  is_active: boolean
  created_at: string
}
export interface OrganizationEmployeeResponse {
  employees: OrganizationEmployee[]
}


export default function OrganizationDetails({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const orgId = params.id

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [employees, setEmployees] = useState<OrganizationEmployee[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modals
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showAddRole, setShowAddRole] = useState(false)
  const [showAssignRole, setShowAssignRole] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'employee' | 'role'
    id: number
  } | null>(null)

  // Forms
  const [newEmployeeUserId, setNewEmployeeUserId] = useState('')
  const [newRole, setNewRole] = useState({ name: '', description: '' })
  const [processing, setProcessing] = useState(false)
  const fetchOrgDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const orgResponse = await peticionGet<Organization>(
        `organizations/${orgId}`
      )

      if (!orgResponse.ok) {
        throw new Error(orgResponse.message || 'Error al cargar organización')
      }

      const orgData = orgResponse.data || null
      setOrganization(orgData)

      if (!orgData) {
        throw new Error('No se encontró la organización')
      }

      try {
        const empResponse = await peticionGet<OrganizationEmployeeResponse>(
          `organizations/${orgId}/employees`
        )

        if (empResponse.ok && empResponse.data) {
          setEmployees(empResponse.data.employees)
        }
      } catch (empErr) {
        console.error('Error fetching employees:', empErr)
        setEmployees([])
      }

      try {
        const rolesResponse = await peticionGet<RolesResponse>(
          `organizations/${orgId}/roles`
        )

        if (rolesResponse.ok && rolesResponse.data?.roles) {
          setRoles(rolesResponse.data.roles)
        }
      } catch (rolesErr) {
        console.error('Error fetching roles:', rolesErr)
        setRoles([])
      }
    } catch (err) {
      console.error('Error fetching organization details:', err)
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (orgId) {
      fetchOrgDetails()
    } else {
      setError('ID de organización no encontrado')
      setLoading(false)
    }
  }, [orgId, router, fetchOrgDetails])

  const handleAddEmployee = async () => {
    if (!newEmployeeUserId.trim()) return

    setProcessing(true)
    try {
      const response = await peticionPost(`organizations/${orgId}/employees`, {
        user_id: parseInt(newEmployeeUserId),
      })

      if (!response.ok) {
        throw new Error(response.message || 'Error al agregar empleado')
      }

      await fetchOrgDetails()
      setShowAddEmployee(false)
      setNewEmployeeUserId('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar empleado')
    } finally {
      setProcessing(false)
    }
  }

  const handleAddRole = async () => {
    if (!newRole.name.trim()) return

    setProcessing(true)
    try {
      const response = await peticionPost(`organizations/${orgId}/roles`, newRole)

      if (!response.ok) {
        throw new Error(response.message || 'Error al crear rol')
      }

      await fetchOrgDetails()
      setShowAddRole(false)
      setNewRole({ name: '', description: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear rol')
    } finally {
      setProcessing(false)
    }
  }

  const handleAssignRole = async (employeeId: number, roleId: number) => {
    setProcessing(true)
    try {
      const response = await peticionPost(
        `organizations/${orgId}/employees/${employeeId}/roles/${roleId}`,
        {}
      )

      if (!response.ok) {
        throw new Error(response.message || 'Error al asignar rol')
      }

      await fetchOrgDetails()
      setShowAssignRole(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar rol')
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteEmployee = async (employeeId: number) => {
    setProcessing(true)
    try {
      const response = await peticionDelete(
        `organizations/${orgId}/employees/${employeeId}`
      )

      if (!response.ok) {
        throw new Error(response.message || 'Error al eliminar empleado')
      }

      await fetchOrgDetails()
      setShowDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar empleado')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Organización no encontrada</h2>
            <button
              onClick={() => router.push('/organizations')}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Volver al dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Organization Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
          {/* Brand Header */}
          <div
            className="h-36 relative"
            style={{
              background: `linear-gradient(135deg, ${organization.primary_color} 0%, ${organization.secondary_color} 100%)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundColor: organization.tertiary_color }}
            />
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {organization.name}
                </h1>
                <p className="text-sm uppercase tracking-wide text-indigo-600 font-semibold mb-4">
                  {organization.org_type}
                </p>

                {organization.description && (
                  <p className="text-gray-700 mb-6 max-w-3xl">
                    {organization.description}
                  </p>
                )}

                {/* Main attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Razón Social</span>
                    <span className="font-medium text-gray-900">
                      {organization.legal_name}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">
                      {organization.email}
                    </span>
                  </div>

                  {organization.address && (
                    <div className="flex flex-col sm:col-span-2">
                      <span className="text-gray-500">Dirección</span>
                      <span className="font-medium text-gray-900">
                        {organization.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => router.push(`/organizations/${orgId}/products`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 shadow-sm transition"
                >
                  <CubeIcon className="h-5 w-5" />
                  Ver Productos
                </button>
              </div>
            </div>

            {/* Extra Attributes */}
            {organization.extra_data &&
              Object.keys(organization.extra_data).length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                    Atributos Adicionales
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(organization.extra_data).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          {key}
                        </p>
                        <p className="font-medium text-gray-900 break-words">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employees Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Empleados ({employees.length})
                </h2>
              </div>
              <button
                onClick={() => setShowAddEmployee(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Agregar
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {employees.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay empleados registrados
                </p>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAssignRole(employee.id)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Asignar rol"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            setShowDeleteConfirm({ type: 'employee', id: employee.id })
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar empleado"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Mostrar roles del empleado */}
                    {employee.roles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {employee.roles.map((role, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Roles Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Roles Disponibles ({roles.length})
                </h2>
              </div>
              <button
                onClick={() => setShowAddRole(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Crear
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {roles.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay roles creados
                </p>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{role.name}</h3>
                        {role.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {role.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Agregar Empleado
            </h3>
            <input
              type="number"
              value={newEmployeeUserId}
              onChange={(e) => setNewEmployeeUserId(e.target.value)}
              placeholder="ID del usuario"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddEmployee(false)
                  setNewEmployeeUserId('')
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEmployee}
                disabled={processing || !newEmployeeUserId.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {processing ? 'Agregando...' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Rol</h3>
            <input
              type="text"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Nombre del rol"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
            />
            <textarea
              value={newRole.description}
              onChange={(e) =>
                setNewRole({ ...newRole, description: e.target.value })
              }
              placeholder="Descripción (opcional)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddRole(false)
                  setNewRole({ name: '', description: '' })
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRole}
                disabled={processing || !newRole.name.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {processing ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignRole !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Asignar Rol
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleAssignRole(showAssignRole, role.id)}
                  disabled={processing}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">{role.name}</div>
                  {role.description && (
                    <div className="text-sm text-gray-600">{role.description}</div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAssignRole(null)}
              disabled={processing}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Eliminar {showDeleteConfirm.type === 'employee' ? 'empleado' : 'rol'}?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  showDeleteConfirm.type === 'employee'
                    ? handleDeleteEmployee(showDeleteConfirm.id)
                    : null
                }
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {processing ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}