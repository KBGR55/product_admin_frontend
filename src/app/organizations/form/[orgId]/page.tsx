'use client'

import { useParams } from 'next/navigation'
import OrganizationManagement from '../page'

export default function FormPage() {
  const params = useParams()
  const orgId = params.orgId as string | undefined

  return <OrganizationManagement orgId={orgId} />
}