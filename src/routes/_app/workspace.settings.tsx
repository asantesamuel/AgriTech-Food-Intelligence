import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/features/workspace'

export const Route = createFileRoute('/_app/workspace/settings')({ component: SettingsPage })
