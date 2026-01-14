'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, IdentificationIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { establecerToken, peticionPost } from '@/ utilities/api'

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
      setLoading(true)
      setError('')

      /* =====================
       * STEP 1: Crear usuario
       * ===================== */
      const userResponse = await peticionPost<{
        user_id: number
      }>('users', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: formData.birthDate,
        identity_number: formData.identityNumber,
        identity_type: formData.identityType,
        gender: formData.gender,
      })

      if (!userResponse.ok || !userResponse.data) {
        setError(userResponse.message || 'Error al crear usuario')
        return
      }

      const userId = userResponse.data.user_id

      /* ==========================
       * STEP 2: Crear cuenta
       * ========================== */
      const accountResponse = await peticionPost('accounts/register', {
        user_id: userId,
        email: formData.email,
        password: formData.password,
      })

      if (!accountResponse.ok) {
        setError(accountResponse.message || 'Error al crear cuenta')
        return
      }

      /* ==========================
       * STEP 3: Login automático
       * ========================== */
      const loginResponse = await peticionPost<{
        token: string
        user_id: number
      }>('accounts/login', {
        email: formData.email,
        password: formData.password,
      })

      if (!loginResponse.ok || !loginResponse.data) {
        setError(loginResponse.message || 'Error en el inicio de sesión')
        return
      }

      /* ==========================
       * STEP 4: Guardar sesión
       * ========================== */
      establecerToken(loginResponse.data.token, loginResponse.data.user_id)
      router.push('/organizations')
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">
              {step === 1
                ? 'Paso 1: Datos Personales'
                : 'Paso 2: Cuenta y Contraseña'}
            </p>

            <div className="stepper">
              <div className={`step ${step === 1 ? 'step-active' : ''}`} />
              <div className={`step ${step === 2 ? 'step-active' : ''}`} />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-error">
              <span>⚠️</span>
              <p className="auth-error-text">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
            {/* STEP 1: Datos Personales */}
            {step === 1 && (
              <>
                {/* Names Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <div className="input-wrapper">
                      <UserIcon className="input-icon" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Juan"
                        required
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <div className="input-wrapper">
                      <UserIcon className="input-icon" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Pérez"
                        required
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/* Birth Date */}
                <div className="form-group">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <div className="input-wrapper">
                    <CalendarIcon className="input-icon" />
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                {/* Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Tipo de Identidad</label>
                    <select
                      id="identityType"
                      name="identityType"
                      value={formData.identityType}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="FOREIGN_ID">Cédula Extranjera</option>
                      <option value="PASSPORT">Pasaporte</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Número de Identidad</label>
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
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label className="form-label">Género</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>

                <button type="submit" className="btn-auth">
                  Siguiente →
                </button>
              </>
            )}

            {/* STEP 2: Cuenta y Contraseña */}

            {step === 2 && (
              <>
                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Correo Electrónico</label>
                  <div className="input-wrapper">
                    <EnvelopeIcon className="input-icon" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">  Contraseña  </label>
                  <div className="input-wrapper">
                    <LockClosedIcon className="input-icon" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="input input-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-action"                    >
                      {showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña
                  </label>
                  <div className="input-wrapper">
                    <LockClosedIcon className="input-icon" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="input input-password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="input-action"                    >
                      {showConfirmPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} className="btn-auth">
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                {/* Back Button */}
                <button type="button" onClick={handlePrevStep} className="btn-auth-secondary"                >
                  ← Atrás
                </button>
              </>
            )}
          </form>

          <div className="auth-divider">
            <div className="absolute inset-0 flex items-center">
              <div className="auth-divider-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="auth-divider-text">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <Link href="/auth/login" className="btn-auth-secondary">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}