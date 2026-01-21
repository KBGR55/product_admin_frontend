'use client'

import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react'
import { AlertCircle, CheckCircle, Loader2, Save } from 'lucide-react'
import { FormOrganizationRequest, Organization } from '@/types/organization'
import { peticionGet, peticionPost, peticionPut } from '@/utilities/api'
import Header from './Header'

const initialFormOrganizationRequest: FormOrganizationRequest = {
  name: '',
  email: '',
  legal_name: '',
  org_type: '',
  description: '',
  address: '',
  primary_color: '#4f46e5',
  secondary_color: '#bbe0ef',
  tertiary_color: '#f5f5f5',
  extra_data: {}
}

export default function OrganizationManagement({ orgId }: { orgId?: string | null }) {
  const mode: 'create' | 'edit' = orgId ? 'edit' : 'create'
  const [formData, setFormOrganizationRequest] = useState<FormOrganizationRequest>(initialFormOrganizationRequest)
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const orgTypes = ['EMPRESA', 'ONG', 'GOBIERNO', 'EDUCACION', 'SALUD', 'OTRO']

  const fetchOrganization = useCallback(async () => {
    if (!orgId) return

    setLoading(true)
    try {
      const response = await peticionGet<Organization>(`organizations/${orgId}`)

      if (!response.ok || !response.data) {
        throw new Error(response.error || 'Error al obtener la organización')
      }

      const data: Organization = response.data
      setFormOrganizationRequest({
        name: data.name || '',
        email: data.email || '',
        legal_name: data.legal_name || '',
        org_type: data.org_type || '',
        description: data.description || '',
        address: data.address || '',
        primary_color: data.primary_color || '#4f46e5',
        secondary_color: data.secondary_color || '#bbe0ef',
        tertiary_color: data.tertiary_color || '#f5f5f5',
        extra_data: data.extra_data || {}
      })
      if (data.extra_data) {
        const attrs = Object.entries(data.extra_data).map(([key, value]) => ({
          key,
          value: String(value)
        }))
        setAttributes(attrs.length ? attrs : [{ key: '', value: '' }])
      } else {
        setAttributes([{ key: '', value: '' }])
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    if (orgId && mode === 'edit') {
      fetchOrganization()
    }
  }, [orgId, mode, fetchOrganization])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormOrganizationRequest(prev => ({ ...prev, [name]: value }))
  }

  const handleAttributeChange = (index: number, field: 'key' | 'value', val: string) => {
    const newAttributes = [...attributes]
    newAttributes[index] = { ...newAttributes[index], [field]: val }
    setAttributes(newAttributes)
  }

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  }

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // construir extra_data
      const extra_data_obj = attributes.reduce((acc, attr) => {
        if (attr.key.trim()) {
          acc[attr.key] = attr.value
        }
        return acc
      }, {} as Record<string, string>)

      const payload = {
        ...formData,
        extra_data: extra_data_obj,
      }

      // decidir petición según modo
      const response =
        mode === 'create'
          ? await peticionPost<Organization>('organizations', payload)
          : await peticionPut<Organization>(`organizations/${orgId}`, payload)

      if (!response.ok || !response.data) {
        throw new Error(response.message || 'Error en la operación')
      }

      setSuccess(
        mode === 'create'
          ? 'Organización creada exitosamente'
          : 'Organización actualizada exitosamente'
      )

      if (mode === 'create') {
        setTimeout(() => {
          window.location.href = `/organizations`
        }, 1500)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <Header cartCount={0} onCartClick={() => {}} showCart={false} />
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border flex items-start gap-3" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-danger)' }} />
            <p style={{ color: 'var(--color-danger)' }}>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg border flex items-start gap-3" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#15803d' }} />
            <p style={{ color: '#15803d' }}>{success}</p>
          </div>
        )}

        {loading && mode === 'edit' && !success ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : (
          <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid #e5e7eb' }}>
            <div className="p-8" onSubmit={handleSubmit}>
              {/* Información Básica */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
                  Información Básica
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Tech Solutions"
                      className="w-full px-4 py-2 rounded-lg border outline-none transition focus:ring-2"
                      style={{
                        borderColor: '#e5e7eb'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      Email Corporativo *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="contacto@empresa.com"
                      className="w-full px-4 py-2 rounded-lg border outline-none transition focus:ring-2"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      Razón Social *
                    </label>
                    <input
                      type="text"
                      name="legal_name"
                      value={formData.legal_name}
                      onChange={handleChange}
                      required
                      placeholder="Nombre legal completo"
                      className="w-full px-4 py-2 rounded-lg border outline-none transition focus:ring-2"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      Tipo de Organización *
                    </label>
                    <select
                      name="org_type"
                      value={formData.org_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border outline-none transition focus:ring-2"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <option value="">Selecciona un tipo</option>
                      {orgTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe tu organización..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border outline-none transition focus:ring-2"
                    style={{ borderColor: '#e5e7eb' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Calle, ciudad, país"
                    className="w-full px-4 py-2 rounded-lg border outline-none transition focus:ring-2"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                </div>
              </div>

              {/* Marca */}
              <div className="border-t pt-8" style={{ borderColor: '#e5e7eb' }}>
                <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
                  Marca
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { key: 'primary_color' as const, label: 'Color Primario' },
                    { key: 'secondary_color' as const, label: 'Color Secundario' },
                    { key: 'tertiary_color' as const, label: 'Color Terciario' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                        {label}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                          className="w-12 h-12 rounded cursor-pointer border"
                          style={{ borderColor: '#e5e7eb' }}
                        />
                        <input
                          type="text"
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm font-mono transition focus:ring-2"
                          style={{ borderColor: '#e5e7eb' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vista Previa */}
                <div className="p-6 rounded-lg border" style={{ backgroundColor: formData.tertiary_color, borderColor: '#e5e7eb' }}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-lg border-4"
                      style={{
                        backgroundColor: formData.primary_color,
                        borderColor: formData.secondary_color
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Vista previa de marca</p>
                      <p className="text-xs" style={{ color: '#6b7280' }}>Primario • Secundario • Terciario</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Atributos Especiales */}
              <div className="border-t pt-8" style={{ borderColor: '#e5e7eb' }}>
                <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
                  Atributos Especiales
                </h2>

                <div className="space-y-3 p-4 rounded-lg border" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: color"
                        value={attr.key}
                        onChange={e => handleAttributeChange(index, 'key', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg outline-none text-sm transition focus:ring-2"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                      <input
                        type="text"
                        placeholder="Ej: rojo"
                        value={attr.value}
                        onChange={e => handleAttributeChange(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg outline-none text-sm transition focus:ring-2"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                      {attributes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(index)}
                          className="px-3 py-2 rounded-lg text-sm font-medium transition"
                          style={{ backgroundColor: '#fee2e2', color: 'var(--color-danger)' }}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="w-full mt-2 px-4 py-2 rounded-lg font-medium text-sm transition border-2"
                    style={{
                      borderStyle: 'dashed',
                      borderColor: 'var(--color-primary)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    + Agregar Atributo
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
                  Ej: Material: Algodón, Color: Azul, Tamaño: Grande
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleSubmit(e as unknown as FormEvent<HTMLDivElement>)
                  }}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {mode === 'create' ? 'Creando...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {mode === 'create' ? 'Crear Organización' : 'Guardar Cambios'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 rounded-lg font-semibold transition border"
                  style={{ borderColor: '#e5e7eb', color: 'var(--color-text)' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}