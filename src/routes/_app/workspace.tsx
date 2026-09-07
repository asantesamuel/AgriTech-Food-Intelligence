import { createFileRoute } from '@tanstack/react-router'
import { Settings2 } from 'lucide-react'
import { SectionPlaceholder } from '@/features/platform'

export const Route = createFileRoute('/_app/workspace')({ component: WorkspacePage })
function WorkspacePage() { return <SectionPlaceholder eyebrow="Workspace" title="Configure the intelligence environment." description="Manage alerts, data sources, integrations, organization access, users, and platform settings." icon={Settings2} capabilities={['Alerts and data sources', 'Integrations', 'Organization, users, and settings']} /> }
