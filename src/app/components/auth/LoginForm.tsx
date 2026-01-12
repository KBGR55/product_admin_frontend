'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, } from '@heroicons/react/24/outline'
import { establecerToken, peticionPost } from '@/ utilities/api'

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
      router.push('/dashboard')
    } catch {
      setError('Error inesperado al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Bienvenido</h1>
          <p className="auth-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            <span className="text-red-600">⚠️</span>
            <p className="auth-error-text">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <EnvelopeIcon className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <LockClosedIcon className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-action"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-auth">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <div className="absolute inset-0 flex items-center">
            <div className="auth-divider-line"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="auth-divider-text">¿No tienes cuenta?</span>
          </div>
        </div>

        <Link href="/auth/register" className="btn-auth-secondary">Crear una cuenta </Link>
      </div>
    </div>
  )
}
