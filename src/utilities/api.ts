// src/utilities/api.ts
import { ApiResponse } from "@/types/api"

const API_BASE_URL =  'http://localhost:6543/api'

/**
 * Obtener token del localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

/**
 * Headers por defecto con autenticación
 */
const getHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const authToken = token || getToken()
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  return headers
}

/**
 * Manejo centralizado de errores
 */
const handleError = (error: unknown): ApiResponse<never> => {
  console.error('Error en petición:', error)

  if (error instanceof TypeError) {
    return {
      status: 0,
      ok: false,
      error: 'Error de conexión con el servidor',
    }
  }

  return {
    status: 500,
    ok: false,
    error: 'Error desconocido',
  }
}

/* ==================== PETICIONES HTTP ==================== */

/**
 * GET - Obtener datos
 */
export const peticionGet = async <T = unknown>(
  endpoint: string,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: getHeaders(token),
    })

    const data = (await response.json()) as Record<string, unknown>

    return {
      status: response.status,
      ok: response.ok,
      data: data as T,
      message: (data.message as string) || (data.error as string),
    }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * POST - Crear datos
 */
export const peticionPost = async <T = unknown>(
  endpoint: string,
  bodyData: Record<string, unknown>,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(bodyData),
    })

    const data = (await response.json()) as Record<string, unknown>

    return {
      status: response.status,
      ok: response.ok,
      data: data as T,
      message: (data.message as string) || (data.error as string),
    }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * PUT - Actualizar datos completos
 */
export const peticionPut = async <T = unknown>(
  endpoint: string,
  bodyData: Record<string, unknown>,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(bodyData),
    })

    const data = (await response.json()) as Record<string, unknown>

    return {
      status: response.status,
      ok: response.ok,
      data: data as T,
      message: (data.message as string) || (data.error as string),
    }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * PATCH - Actualizar datos parciales
 */
export const peticionPatch = async <T = unknown>(
  endpoint: string,
  bodyData: Record<string, unknown>,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(bodyData),
    })

    const data = (await response.json()) as Record<string, unknown>

    return {
      status: response.status,
      ok: response.ok,
      data: data as T,
      message: (data.message as string) || (data.error as string),
    }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * DELETE - Eliminar datos
 */
export const peticionDelete = async <T = unknown>(
  endpoint: string,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    })

    const data = (await response.json()) as Record<string, unknown>

    return {
      status: response.status,
      ok: response.ok,
      data: data as T,
      message: (data.message as string) || (data.error as string),
    }
  } catch (error) {
    return handleError(error)
  }
}
/* ==================== HELPERS ==================== */

/**
 * Limpiar token (logout)
 */
export const limpiarToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
  }
}

/**
 * Establecer token (login)
 */
export const establecerToken = (token: string, userId: string | number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
    localStorage.setItem('user_id', String(userId))
  }
}

/**
 * Obtener user_id del localStorage
 */
export const obtenerUserId = (): number | null => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('user_id')
    return userId ? parseInt(userId, 10) : null
  }
  return null
}

/**
 * Verificar si hay token (usuario autenticado)
 */
export const estaAutenticado = (): boolean => {
  return getToken() !== null
}