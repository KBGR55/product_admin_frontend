// src/types/organization.ts
export interface Organization {
  id: number
  name: string
  email: string
  legal_name: string
  org_type: string
  description: string
  owner_id: number
  primary_color: string
  secondary_color: string
  tertiary_color: string
  employee_count: number
  address: string
  extra_data?: Record<string, string>
  created_at: string
  updated_at: string
}

export interface FormOrganizationRequest {
  name: string
  email: string
  legal_name: string
  org_type: string
  description?: string
  primary_color?: string
  secondary_color?: string
  tertiary_color?: string
  address?: string,
  extra_data?: Record<string, string>
}

export interface OrganizationsResponse {
  organizations: Organization[]
}

export interface OrganizationRole {
  id: number
  org_id: number
  name: string
  description?: string
  created_at: string
}

export interface OrganizationEmployee {
  id: number
  user_id: number
  org_id: number
  first_name: string
  last_name: string
  email?: string
  roles: string[]
  created_at: string
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
