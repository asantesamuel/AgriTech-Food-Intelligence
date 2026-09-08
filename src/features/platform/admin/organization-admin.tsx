import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, CheckCircle2, MailPlus, Search, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { inviteMemberInputSchema, updateOrganizationInputSchema, type User } from '@/domain'
import { platformService } from '@/services'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Field, FieldLabel, FieldMessage, Input, SemanticBadge, Skeleton, StatePanel, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/shared/ui'
import { useAuth } from '../auth/auth-context'
import { canManageWorkspace, filterMembers, summarizePermissions } from './admin-model'

const selectClass = 'h-10 w-full rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function OrganizationAdmin() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const platformQuery = useQuery({ queryKey: ['platform-admin'], queryFn: () => platformService.getPlatform() })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | User['status']>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [formError, setFormError] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRoleId, setInviteRoleId] = useState('role-analyst')
  const [profile, setProfile] = useState({ name: '', industry: '', regionIds: [] as string[] })
  const platform = platformQuery.data
  const organization = platform?.organizations.find((item) => item.id === auth.organization?.id) ?? auth.organization
  const canManage = canManageWorkspace(auth.role)

  useEffect(() => {
    if (organization) setProfile({ name: organization.name, industry: organization.industry, regionIds: organization.regionIds })
  }, [organization])

  const members = useMemo(() => platform && organization ? filterMembers(platform.users, organization.id, search, status) : [], [organization, platform, search, status])
  const selectedMember = platform?.users.find((member) => member.id === selectedId) ?? null

  async function refresh(message: string) {
    setSuccess(message)
    setFormError('')
    await queryClient.invalidateQueries({ queryKey: ['platform-admin'] })
    auth.reload()
  }

  const invite = useMutation({ mutationFn: (input: Parameters<typeof platformService.inviteMember>[0]) => platformService.inviteMember(input), onSuccess: () => { setInviteEmail(''); void refresh('Invitation created in the mock workspace.') } })
  const updateMember = useMutation({ mutationFn: ({ userId, input }: { userId: string; input: Parameters<typeof platformService.updateMember>[1] }) => platformService.updateMember(userId, input), onSuccess: () => void refresh('Member access updated.') })
  const removeMember = useMutation({ mutationFn: (userId: string) => platformService.removeMember(userId), onSuccess: () => { setSelectedId(null); void refresh('Member removed from the mock workspace.') } })
  const updateOrganization = useMutation({ mutationFn: ({ id, input }: { id: string; input: Parameters<typeof platformService.updateOrganization>[1] }) => platformService.updateOrganization(id, input), onSuccess: () => void refresh('Workspace settings saved.') })
  const mutationError = invite.error ?? updateMember.error ?? removeMember.error ?? updateOrganization.error

  function submitInvite(event: FormEvent) {
    event.preventDefault()
    if (!organization) return
    const parsed = inviteMemberInputSchema.safeParse({ organizationId: organization.id, email: inviteEmail, roleId: inviteRoleId })
    if (!parsed.success) { setFormError('Enter a valid work email and select a role.'); return }
    setSuccess(''); setFormError(''); invite.mutate(parsed.data)
  }

  function saveProfile(event: FormEvent) {
    event.preventDefault()
    if (!organization) return
    const parsed = updateOrganizationInputSchema.safeParse(profile)
    if (!parsed.success) { setFormError('Organization name, industry, and at least one operating region are required.'); return }
    setSuccess(''); setFormError(''); updateOrganization.mutate({ id: organization.id, input: parsed.data })
  }

  if (platformQuery.isPending) return <AdminLoading />
  if (platformQuery.isError || !platform || !organization) return <div className="p-4 sm:p-6"><StatePanel kind="error" title="Workspace administration unavailable" description="The mock organization service could not be loaded." action={{ label: 'Retry', onClick: () => void platformQuery.refetch() }} /></div>

  return <div className="grid min-w-0 gap-6 overflow-x-hidden px-4 py-6 sm:p-6">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><Badge tone="info">Workspace administration</Badge><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">People, access, and organization context.</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">A focused mock administration surface for {organization.name}; future identity, billing, and audit services remain outside this frontend boundary.</p></div><Badge tone={canManage ? 'success' : 'warning'}>{canManage ? 'Admin access' : 'Read-only persona'}</Badge></header>

    {success ? <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm" role="status"><CheckCircle2 className="size-4 text-success" />{success}</div> : null}
    {formError ? <FieldMessage error>{formError}</FieldMessage> : null}
    {mutationError ? <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">The mock action could not be completed. Check for a duplicate invitation or try again.</div> : null}

    <section className="grid min-w-0 gap-4 lg:grid-cols-5">
      <Card className="min-w-0 lg:col-span-3"><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="size-4 text-primary" />Organization profile</CardTitle><CardDescription>Workspace identity and operating coverage.</CardDescription></CardHeader><CardContent><form className="grid min-w-0 gap-4 sm:grid-cols-2" onSubmit={saveProfile}><Field className="min-w-0"><FieldLabel htmlFor="organization-name">Organization name</FieldLabel><Input id="organization-name" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} disabled={!canManage} /></Field><Field className="min-w-0"><FieldLabel htmlFor="industry">Industry / mandate</FieldLabel><Input id="industry" value={profile.industry} onChange={(event) => setProfile((current) => ({ ...current, industry: event.target.value }))} disabled={!canManage} /></Field><div className="sm:col-span-2"><p className="mb-2 text-sm font-medium">Operating regions</p><div className="flex flex-wrap gap-2">{profile.regionIds.map((regionId) => <Badge key={regionId}>{regionId.replace('region-', '').replaceAll('-', ' ')}</Badge>)}</div></div><div className="flex flex-wrap items-center gap-2 sm:col-span-2"><Button type="submit" disabled={!canManage || updateOrganization.isPending}>Save workspace</Button><span className="text-xs text-muted-foreground">Status: {organization.status} · Slug: {organization.slug}</span></div></form></CardContent></Card>
      <Card className="min-w-0 lg:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><MailPlus className="size-4 text-primary" />Invite a member</CardTitle><CardDescription>Create a pending invitation in the local mock service.</CardDescription></CardHeader><CardContent><form className="grid min-w-0 gap-4" onSubmit={submitInvite}><Field className="min-w-0"><FieldLabel htmlFor="invite-email">Work email</FieldLabel><Input id="invite-email" type="email" placeholder="colleague@organization.test" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} disabled={!canManage} /></Field><Field className="min-w-0"><FieldLabel htmlFor="invite-role">Starting role</FieldLabel><select id="invite-role" className={selectClass} value={inviteRoleId} onChange={(event) => setInviteRoleId(event.target.value)} disabled={!canManage}>{platform.roles.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}</select></Field><Button type="submit" disabled={!canManage || invite.isPending}>Create invitation</Button>{platform.invitations.filter((item) => item.organizationId === organization.id && item.status === 'pending').map((item) => <div key={item.id} className="min-w-0 rounded-lg border p-3 text-sm"><strong className="break-all">{item.email}</strong><p className="mt-1 text-xs text-muted-foreground">Pending · {platform.roles.find((role) => role.id === item.roleId)?.name}</p></div>)}</form></CardContent></Card>
    </section>

    <Card className="min-w-0"><CardHeader><CardTitle className="flex items-center gap-2"><UsersRound className="size-4 text-primary" />Workspace members</CardTitle><CardDescription>Search, filter, inspect, and change mock member access.</CardDescription></CardHeader><CardContent className="grid min-w-0 gap-4"><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]"><label className="relative"><span className="sr-only">Search members</span><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search name, email, or title" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label><span className="sr-only">Filter member status</span><select className={selectClass} value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="invited">Invited</option></select></label></div>{members.length ? <TableContainer className="min-w-0 max-w-full"><Table><TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>{members.map((member) => { const role = platform.roles.find((item) => item.id === member.roleIds[0]); return <TableRow key={member.id}><TableCell><strong className="block">{member.name}</strong><span className="text-xs text-muted-foreground">{member.email}</span></TableCell><TableCell>{role?.name ?? 'Unassigned'}</TableCell><TableCell><SemanticBadge signal="status" level={member.status === 'active' ? 'active' : 'inactive'} /></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => setSelectedId(member.id)}>Inspect</Button></TableCell></TableRow> })}</TableBody></Table></TableContainer> : <StatePanel kind="empty" title="No members match" description="Clear the search or choose a different status filter." />}</CardContent></Card>

    {selectedMember ? <Card><CardHeader className="flex-row items-start justify-between"><div><CardTitle className="flex items-center gap-2"><UserRound className="size-4 text-primary" />{selectedMember.name}</CardTitle><CardDescription>{selectedMember.title} · {selectedMember.email}</CardDescription></div><Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>Close</Button></CardHeader><CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]"><Field><FieldLabel htmlFor="member-role">Assigned role</FieldLabel><select id="member-role" className={selectClass} value={selectedMember.roleIds[0]} disabled={!canManage || selectedMember.id === auth.user?.id || updateMember.isPending} onChange={(event) => updateMember.mutate({ userId: selectedMember.id, input: { roleId: event.target.value } })}>{platform.roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></Field><div className="flex flex-wrap items-end gap-2"><Button variant="outline" disabled={!canManage || selectedMember.id === auth.user?.id || updateMember.isPending} onClick={() => updateMember.mutate({ userId: selectedMember.id, input: { status: selectedMember.status === 'active' ? 'inactive' : 'active' } })}>{selectedMember.status === 'active' ? 'Deactivate' : 'Activate'}</Button><Button variant="danger" disabled={!canManage || selectedMember.id === auth.user?.id || removeMember.isPending} onClick={() => removeMember.mutate(selectedMember.id)}>Remove</Button></div></CardContent></Card> : null}

    <section className="min-w-0"><div className="mb-3"><h2 className="text-xl font-semibold">Roles and permissions</h2><p className="mt-1 text-sm text-muted-foreground">The same role objects power this summary and the mock persona switcher.</p></div><div className="grid min-w-0 gap-4 md:grid-cols-2">{platform.roles.map((role) => <Card className="min-w-0" key={role.id}><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />{role.name}</CardTitle><CardDescription>{role.description}</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{summarizePermissions(role).map((permission) => <Badge key={permission}>{permission}</Badge>)}</div><p className="mt-4 text-xs text-muted-foreground">Persona: {role.persona.replaceAll('-', ' ')}</p></CardContent></Card>)}</div></section>
  </div>
}

function AdminLoading() { return <div className="grid gap-4 p-4 sm:p-6" aria-label="Loading workspace administration" aria-busy="true"><Skeleton className="h-24" /><div className="grid gap-4 xl:grid-cols-5"><Skeleton className="h-72 xl:col-span-3" /><Skeleton className="h-72 xl:col-span-2" /></div><Skeleton className="h-80" /></div> }
