# Organization administration

SCRUM-103 implements a frontend-only Workspace administration surface for organization profile data, members, invitations, roles, and permissions.

All reads and mutations cross `PlatformService`; MSW owns the mutable in-memory prototype state. The UI does not import factories or mutate fixtures directly, so tenant, identity-provider, RBAC, invitation, billing, and audit APIs can later replace the adapter.

The active role's shared permission objects determine whether controls are enabled. The organization administrator can edit profile data, invite a member, change a role, activate or deactivate another member, and remove another member. The current user cannot change their own role, deactivate themselves, or remove themselves. Search, status filtering, empty results, validation errors, request errors, loading, and success feedback are represented.
