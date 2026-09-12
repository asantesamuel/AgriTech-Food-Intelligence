import { createFileRoute } from '@tanstack/react-router'
import { OrganizationAdmin } from '@/features/platform/admin/organization-admin'

export const Route = createFileRoute('/_app/workspace/people')({ component: OrganizationAdmin })
