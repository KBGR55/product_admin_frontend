// src/types/product.ts
export interface Product {
  id: number
  name: string
  description: string
  sku: string
  price: number
  cost: number
  stock: number
  photo_url: string
  is_active: boolean
  attributes: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  sku: string
  price: number
  cost?: number
  stock?: number
  photo_url?: string
  is_active?: boolean
  attributes?: Record<string, unknown>
}

export interface ProductsResponse {
  products: Product[]
}

export interface ProductAttribute {
  key: string
  value: string
}

