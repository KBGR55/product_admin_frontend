// src/types/api.ts
export interface ApiResponse<T = unknown> {
  status: number
  ok: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiErrorResponse {
  error: string
  status: number
  timestamp?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}