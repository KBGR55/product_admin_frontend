'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, IdentificationIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { establecerToken, peticionPost } from '@/utilities/api'

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
  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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

      const accountResponse = await peticionPost('accounts/register', {
        user_id: userId,
        email: formData.email,
        password: formData.password,
      })

      if (!accountResponse.ok) {
        setError(accountResponse.message || 'Error al crear cuenta')
        return
      }

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
    <div className="auth-form-wrapper">
      <div className="auth-form-card auth-form-card-lg">
        {/* Header */}
        <div className="auth-form-header">
          <h1 className="auth-form-title">Crear Cuenta</h1>
          <p className="auth-form-subtitle">
            {step === 1
              ? 'Paso 1: Datos Personales'
              : 'Paso 2: Cuenta y Contraseña'}
          </p>

          <div className="auth-form-stepper">
            <div className={`auth-form-step ${step === 1 ? 'auth-form-step-active' : ''}`} />
            <div className={`auth-form-step ${step === 2 ? 'auth-form-step-active' : ''}`} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="auth-form-error">
            <span>⚠️</span>
            <p className="auth-form-error-text">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="auth-form">
            {/* STEP 1: Datos Personales */}
            {step === 1 && (
              <>
                {/* Names Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="auth-form-group">
                    <label className="auth-form-label">Nombre</label>
                    <div className="auth-form-input-wrapper">
                      <UserIcon className="auth-form-input-icon" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Juan"
                        required
                        className="auth-form-input"
                      />
                    </div>
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-form-label">Apellido</label>
                    <div className="auth-form-input-wrapper">
                      <UserIcon className="auth-form-input-icon" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Pérez"
                        required
                        className="auth-form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Birth Date */}
                <div className="auth-form-group">
                  <label className="auth-form-label">Fecha de Nacimiento</label>
                  <div className="auth-form-input-wrapper">
                    <CalendarIcon className="auth-form-input-icon" />
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      className="auth-form-input"
                    />
                  </div>
                </div>

                {/* Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="auth-form-group">
                    <label className="auth-form-label">Tipo de Identidad</label>
                    <select
                      id="identityType"
                      name="identityType"
                      value={formData.identityType}
                      onChange={handleChange}
                      className="auth-form-input"
                    >
                      <option value="FOREIGN_ID">Cédula Extranjera</option>
                      <option value="PASSPORT">Pasaporte</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-form-label">Número de Identidad</label>
                    <div className="auth-form-input-wrapper">
                      <IdentificationIcon className="auth-form-input-icon" />
                      <input
                        id="identityNumber"
                        name="identityNumber"
                        type="text"
                        value={formData.identityNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                        required
                        className="auth-form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="auth-form-group">
                  <label className="auth-form-label">Género</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="auth-form-input"
                  >
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>

                <button type="submit" className="auth-form-submit">
                  Siguiente →
                </button>
              </>
            )}

            {/* STEP 2: Cuenta y Contraseña */}
            {step === 2 && (
              <>
                {/* Email */}
                <div className="auth-form-group">
                  <label className="auth-form-label">Correo Electrónico</label>
                  <div className="auth-form-input-wrapper">
                    <EnvelopeIcon className="auth-form-input-icon" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="auth-form-input"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="auth-form-group">
                  <label className="auth-form-label">Contraseña</label>
                  <div className="auth-form-input-wrapper">
                    <LockClosedIcon className="auth-form-input-icon" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="auth-form-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-form-input-action"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="auth-form-input-hint">Mínimo 8 caracteres</p>
                </div>

                {/* Confirm Password */}
                <div className="auth-form-group">
                  <label className="auth-form-label">Confirmar Contraseña</label>
                  <div className="auth-form-input-wrapper">
                    <LockClosedIcon className="auth-form-input-icon" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="auth-form-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-form-input-action"
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
                <button type="submit" disabled={loading} className="auth-form-submit">
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                {/* Back Button */}
                <button type="button" onClick={handlePrevStep} className="auth-form-secondary-button">
                  ← Atrás
                </button>
              </>
            )}
          </form>

          <div className="auth-form-divider">
            <div className="absolute inset-0 flex items-center">
              <div className="auth-form-divider-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="auth-form-divider-text">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <Link href="/auth/login" className="auth-form-secondary-button">
            Inicia Sesión
          </Link>
        </div>
      </div>
  )
}