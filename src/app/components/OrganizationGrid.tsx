import { Organization } from '@/types/organization'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

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
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    )
  }

  if (organizations.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">
          Inicia sesión para explorar nuestras organizaciones
        </p>
      </div>
    )
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Nuestras Organizaciones
        </h2>
        <p className="text-gray-600">
          Selecciona una organización para ver sus productos disponibles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map(org => (
          <button
            key={org.id}
            onClick={() => onSelectOrg(org)}
            className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left overflow-hidden border border-gray-100 hover:border-indigo-300"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-indigo-600 to-indigo-700" />

            {/* Color banner */}
            <div
              className="h-32 rounded-lg mb-4 group-hover:shadow-lg transition-shadow duration-300"
              style={{
                background: `linear-gradient(135deg, ${org.primary_color} 0%, ${org.secondary_color} 100%)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {org.name}
              </h3>

              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-3">
                {org.org_type}
              </span>

              {org.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {org.description}
                </p>
              )}

              {/* CTA */}
              <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:gap-3 gap-2 transition-all duration-300">
                Ver productos
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}