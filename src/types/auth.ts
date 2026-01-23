// src/types/auth.ts
export interface User {
  id: number
  first_name: string
  last_name: string
  birth_date: string
  identity_number: string
  identity_type: 'RUC' | 'PASSPORT' | 'FOREIGN_ID'
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  created_at: string
}

export interface Account {
  id: number
  user_id: number
  email: string
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
  user_id: number
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  birth_date: string
  identity_number: string
  identity_type: 'RUC' | 'PASSPORT' | 'FOREIGN_ID'
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  email: string
  password: string
}
