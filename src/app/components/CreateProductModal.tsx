'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { peticionPost } from '@/ utilities/api'

interface CreateProductModalProps {
  orgId: string
  token: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateProductModal({
  orgId,
  token,
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    cost: '',
    stock: '0',
    photo_url: '',
    is_active: true,
  })
  const [attributes, setAttributes] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' },
  ])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleAttributeChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newAttributes = [...attributes]
    newAttributes[index][field] = value
    setAttributes(newAttributes)
  }

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  }

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      // Crear preview local
      const reader = new FileReader()
      reader.onload = e => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Crear FormData y subir
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al subir foto')
        return
      }

      // Guardar URL de la foto
      setFormData(prev => ({
        ...prev,
        photo_url: data.url,
      }))
    } catch {
      setError('Error de conexión al subir foto')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convertir atributos a objeto
      const attributesObj: Record<string, string> = {}
      attributes.forEach(attr => {
        if (attr.key.trim() && attr.value.trim()) {
          attributesObj[attr.key.trim()] = attr.value.trim()
        }
      })

      const payload = {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock: parseInt(formData.stock, 10),
        photo_url: formData.photo_url,
        is_active: formData.is_active,
        attributes: attributesObj,
      }

      const response = await peticionPost(`organizations/${orgId}/products`, payload, token)

      if (!response.ok) {
        setError(response.error || response.message || 'Error al crear producto')
        return
      }

      // Limpiar formulario y cerrar modal
      setFormData({
        name: '',
        description: '',
        sku: '',
        price: '',
        cost: '',
        stock: '0',
        photo_url: '',
        is_active: true,
      })
      setAttributes([{ key: '', value: '' }])

      onSuccess()
      onClose()
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] md:w-[80%] lg:w-[70%]  max-h-[85%] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Crear Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Name and SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Lana Merino"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Ej: LM-001"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price, Cost and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Precio de Venta *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                Costo
              </label>
              <input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Foto del Producto
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="px-4 py-3 border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {uploading ? 'Subiendo...' : 'Haz clic para seleccionar foto'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (máx 5MB)</p>
                  </div>
                </label>
              </div>
              {photoPreview && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {formData.photo_url && (
              <p className="text-xs text-green-600 mt-2">✓ Foto subida: {formData.photo_url}</p>
            )}
          </div>

          {/* Active Status */}
          <div>
            <label htmlFor="is_active" className="flex items-center gap-3">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Producto Activo</span>
            </label>
          </div>

          {/* Attributes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Atributos Especiales
            </label>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: color"
                    value={attr.key}
                    onChange={e => handleAttributeChange(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Ej: rojo"
                    value={attr.value}
                    onChange={e => handleAttributeChange(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  {attributes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAttribute}
                className="w-full mt-2 px-4 py-2 border-2 border-dashed border-indigo-300 hover:border-indigo-500 text-indigo-600 hover:text-indigo-700 rounded-lg transition-colors font-medium text-sm"
              >
                + Agregar Atributo
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ej: Material: Algodón, Color: Azul, Tamaño: Grande
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}