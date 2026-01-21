'use client'

import { Organization } from '@/types/organization'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface OrganizationGridProps {
  organizations: Organization[]
  loading: boolean
  onSelectOrg: (org: Organization) => void
}

export default function OrganizationGrid({
  organizations,
  loading,
  onSelectOrg,
}: OrganizationGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    )
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map(org => (
          <button
            key={org.id}
            onClick={() => onSelectOrg(org)}
            onMouseEnter={() => setHoveredId(org.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 text-left"
          >
            {/* Top accent bar with organization colors */}
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(to right, ${org.primary_color}, ${org.secondary_color})`,
              }}
            />

            {/* Content */}
            <div className="p-6 flex flex-col h-full">
              {/* Header with icon and badge */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${org.primary_color}, ${org.secondary_color})`,
                  }}
                >
                  {org.name.charAt(0)}
                </div>
                <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
                  {org.org_type}
                </span>
              </div>

              {/* Organization name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                {org.name}
              </h3>

              {/* Description */}
              {org.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {org.description}
                </p>
              )}

              {/* Stats or features (if available) */}
              <div className="flex gap-4 mb-4 pt-4 border-t border-gray-100">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Estado</p>
                  <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    {org.is_active ? 'Activo' : 'Inactivo'}
                  </p>
                </div>

              </div>

              {/* CTA Button */}
              <button
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg active:scale-95"
                style={{
                  backgroundImage: hoveredId === org.id ? `linear-gradient(to right, ${org.primary_color}, ${org.secondary_color})` : undefined,
                }}
              >
                <span>Ver tienda</span>
                <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}