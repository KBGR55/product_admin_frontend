import OrganizationManagement from '../../../components/OrganizationForm'

interface PageProps {
  params: {
    orgId: string
  }
}

export default function Page({ params }: PageProps) {
  return <OrganizationManagement orgId={params.orgId} />
}