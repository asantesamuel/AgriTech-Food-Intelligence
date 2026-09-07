# Mock authentication and organization context

The prototype loads identities through `PlatformService`, then stores only the
selected user, organization, and role IDs in browser local storage. Protected
routes wait for session restoration and redirect signed-out visitors to `/sign-in`.

The header selectors deliberately allow organization and persona changes for demos.
They are presentation controls, not authorization guarantees. Production work will
replace the service and local session implementation with an identity provider,
server-backed tenant membership, entitlements, and audited authorization.
