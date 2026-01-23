// src/types/country.ts

export interface Country {
  id: number
  code: string
  name: string
  phone_code: string
  is_active: boolean
}

export interface CountriesResponse {
  countries: Country[]
}

export interface CreateCountryRequest {
  code: string
  name: string
  phone_code: string
}

export interface UpdateCountryRequest {
  name?: string
  phone_code?: string
  is_active?: boolean
}