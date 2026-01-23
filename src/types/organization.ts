// src/types/organization.ts

export interface Organization {
  id: number
  name: string
  email: string
  legal_name: string
  org_type: string
  description?: string
  country_id: number
  owner_id: number
  primary_color: string
  secondary_color: string
  tertiary_color: string
  employee_count: number
  address?: string
  telephone?: string
  extra_data?: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface FormOrganizationRequest {
  name: string
  email: string
  legal_name: string
  org_type: string
  country_id: number
  description?: string
  telephone?: string
  primary_color?: string
  secondary_color?: string
  tertiary_color?: string
  address?: string
  extra_data?: Record<string, unknown>
}

export interface OrganizationsResponse {
  organizations: Organization[]
  count?: number
}

export interface OrganizationRole {
  id: number
  org_id: number
  name: string
  description?: string
  created_at: string
}

export interface OrganizationEmployee {
  employee_id: number
  user_id: number
  first_name?: string
  last_name?: string
  roles: string[]
}

export interface OrganizationEmployeesResponse {
  employees: OrganizationEmployee[]
}

export interface Role {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface RolesResponse {
  roles: Role[]
}