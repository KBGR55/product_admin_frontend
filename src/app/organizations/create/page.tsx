import Link from 'next/link'

export default function CreateOrganization() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 mb-4">
          ← Volver
        </Link>
        <h1 className="text-3xl font-bold">Crear Organización</h1>
        <p className="text-gray-600 mt-2">Formulario en construcción...</p>
      </div>
    </div>
  )
}