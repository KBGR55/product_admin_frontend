'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, } from '@heroicons/react/24/outline'
import { establecerToken, peticionPost } from '@/utilities/api'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await peticionPost<{ token: string, user_id: number }>('accounts/login', { email, password, })

      if (!response.ok || !response.data) {
        setError(response.message || 'Error en el inicio de sesión')
        return
      }
      // Guardar token de forma centralizada
      establecerToken(response.data.token, response.data.user_id)
      router.push('/organizations')
    } catch {
      setError('Error inesperado al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-card auth-form-card-lg">
        {/* Header */}
        <div className="auth-form-header">
          <h1 className="auth-form-title">Bienvenido</h1>
          <p className="auth-form-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-form-error">
            <span className="text-red-600">⚠️</span>
            <p className="auth-form-error-text">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="auth-form-group">
            <label className="auth-form-label">Correo Electrónico</label>
            <div className="auth-form-input-wrapper">
              <EnvelopeIcon className="auth-form-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="auth-form-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label className="auth-form-label">Contraseña</label>
            <div className="auth-form-input-wrapper">
              <LockClosedIcon className="auth-form-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button type="submit" disabled={loading} className="auth-form-submit">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-form-divider">
          <div className="absolute inset-0 flex items-center">
            <div className="auth-form-divider-line"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="auth-form-divider-text">¿No tienes cuenta?</span>
          </div>
        </div>

        <Link href="/auth/register" className="auth-form-secondary-button">
          Crear una cuenta
        </Link>
      </div>
    </div>
  )
}