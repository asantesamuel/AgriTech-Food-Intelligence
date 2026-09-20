# ADR-0001: Task-oriented read models with service-boundary validation

| Metadata | Value |
| --- | --- |
| Status | Accepted |
| Decision date | 2026-09-13 |
| Owner | Architecture Lead |
| Related Jira | SCRUM-76, SCRUM-78, SCRUM-79, SCRUM-84–90 |

## Context

Market intelligence pages combine catalog identity, observations, forecasts,
risks, recommendations, and evidence quality. Returning only storage-oriented
entities would force React components to join collections, interpret missing
data, and reproduce business presentation rules. Importing fixture objects into
features would also couple the prototype to MSW and make production API adoption
expensive.

The existing Market Pulse and commodity detail already use validated,
task-oriented snapshots through feature hooks and service interfaces. SCRUM-84–90
will add several more analytical tasks, making an explicit decision necessary to
prevent contract drift.

## Decision

Each major intelligence task will consume a task-oriented read model through a
service interface. Unknown transport data will be validated by a Zod schema
before it is returned to a feature hook.

The dependency direction is:

```text
route -> feature component -> feature hook -> service interface
      -> request adapter -> MSW today / production API later
      -> runtime schema validation -> typed task read model
```

Task read models may compose canonical IDs and render-ready summaries, including
explicit state, generated time, confidence, freshness, and unavailable sections.
Canonical domain primitives remain shared; task snapshots are not permission to
duplicate entity definitions.

Filtering, sorting, and pagination semantics are part of the service contract and
are emulated by MSW. Feature components do not import fixture data or reconstruct
task responses from unrelated raw endpoints.

## Consequences

### Positive

- Feature components stay independent of the mock implementation.
- The production backend can replace MSW without rewriting page composition.
- Runtime validation prevents malformed external data from silently reaching the
  analytical UI.
- Loading, empty, stale, partial, low-confidence, and error states can be modeled
  explicitly per task.
- API contracts can optimize for user decisions while retaining canonical IDs for
  traceability.

### Costs and risks

- Additional snapshot schemas and mapping logic must be maintained.
- Similar read models can drift if shared primitives are copied instead of reused.
- Large task responses can over-fetch if boundaries are defined too broadly.
- Backend teams must understand that read models are API contracts, not database
  table representations.

Mitigation: create a new snapshot only for a distinct user task, reuse canonical
schemas, keep route-specific query inputs explicit, and cover mapping/validation
with focused tests.

## Alternatives considered

### Components import fixture JSON

Rejected because it couples UI behavior to the prototype data source and bypasses
request lifecycle and contract validation.

### Components join canonical entity endpoints

Rejected as the default because each component would reproduce composition,
missing-data, ranking, and pagination logic. Canonical endpoints remain useful for
reference data and administrative selection.

### One universal intelligence response

Rejected because a growing catch-all contract would over-fetch, blur ownership,
and couple unrelated pages.

### GraphQL introduced now

Deferred. It could support client-selected composition later, but it does not
remove the need for task semantics and would add unjustified prototype
infrastructure.

## Current evidence

- `src/services/intelligence-service.ts` exposes Market Pulse, Commodity
  Explorer, and commodity intelligence operations.
- `src/domain/snapshots.ts` validates their task-oriented snapshots.
- `src/features/intelligence/intelligence-hooks.ts` owns query lifecycle.
- `src/mocks/handlers.ts` supplies the same HTTP boundary during development.

SCRUM-84 extends this accepted pattern with a paged Commodity Explorer read model
and server-style query semantics emulated by MSW.
