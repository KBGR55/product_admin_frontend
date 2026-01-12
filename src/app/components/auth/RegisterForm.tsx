'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, IdentificationIcon, CalendarIcon } from '@heroicons/react/24/outline'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543'

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    identityNumber: '',
    identityType: 'FOREIGN_ID',
    gender: 'MALE',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Datos personales, 2: Cuenta

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validar paso 1
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.identityNumber) {
      setError('Por favor completa todos los campos')
      return
    }

    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (!formData.email) {
      setError('El correo es requerido')
      return
    }

    setLoading(true)

    try {
      // Step 1: Crear usuario
      console.log('Creando usuario...')
      const userResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          birth_date: formData.birthDate,
          identity_number: formData.identityNumber,
          identity_type: formData.identityType,
          gender: formData.gender,
        }),
      })

      const userData = await userResponse.json()
      console.log('Response usuario:', userData)

      if (!userResponse.ok) {
        setError(userData.error || 'Error al crear usuario')
        setLoading(false)
        return
      }

      const userId = userData.user_id

      // Step 2: Crear cuenta con email y contraseña
      console.log('Creando cuenta...')
      const accountResponse = await fetch(`${API_URL}/accounts/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          email: formData.email,
          password: formData.password,
        }),
      })

      const accountData = await accountResponse.json()
      console.log('Response cuenta:', accountData)

      if (!accountResponse.ok) {
        setError(accountData.error || 'Error al crear cuenta')
        setLoading(false)
        return
      }

      // Step 3: Login automático
      console.log('Iniciando sesión...')
      const loginResponse = await fetch(`${API_URL}/accounts/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const loginData = await loginResponse.json()
      console.log('Response login:', loginData)

      if (!loginResponse.ok) {
        setError(loginData.error || 'Error en el login')
        setLoading(false)
        return
      }

      // Guardar token y redirigir
      localStorage.setItem('token', loginData.token)
      localStorage.setItem('user_id', loginData.user_id)
      
      // Redirigir al dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="text-gray-600 mt-2">
              {step === 1 ? 'Paso 1: Datos Personales' : 'Paso 2: Cuenta y Contraseña'}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className={`h-2 w-24 rounded ${step === 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`h-2 w-24 rounded ${step === 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <div className="text-red-600 mt-0.5">⚠️</div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
            {/* STEP 1: Datos Personales */}
            {step === 1 && (
              <>
                {/* Names Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Juan"
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Pérez"
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="identityType" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Identidad
                    </label>
                    <select
                      id="identityType"
                      name="identityType"
                      value={formData.identityType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="FOREIGN_ID">Cédula Extranjera</option>
                      <option value="PASSPORT">Pasaporte</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="identityNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Identidad
                    </label>
                    <div className="relative">
                      <IdentificationIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        id="identityNumber"
                        name="identityNumber"
                        type="text"
                        value={formData.identityNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Género
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>

                {/* Next Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
                >
                  Siguiente →
                </button>
              </>
            )}

            {/* STEP 2: Cuenta y Contraseña */}
            {step === 2 && (
              <>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2.5 rounded-lg transition-colors duration-200"
                >
                  ← Atrás
                </button>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/auth/login"
            className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2.5 rounded-lg transition-colors duration-200"
          >
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}