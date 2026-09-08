import { createFileRoute } from '@tanstack/react-router'
import { OrganizationAdmin } from '@/features/platform/admin/organization-admin'

export const Route = createFileRoute('/_app/workspace')({ component: WorkspacePage })
function WorkspacePage() { return <OrganizationAdmin /> }
