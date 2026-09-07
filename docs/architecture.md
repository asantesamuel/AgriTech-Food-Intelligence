# Frontend architecture

This TanStack Start application uses file-based routing and feature-oriented
modules. Route files stay intentionally thin: they compose feature entry points,
while business state and data access remain inside their owning feature.

## Boundaries

- `src/routes`: URL definitions, route guards, and page composition only.
- `src/features`: independently owned product capabilities. A feature may expose
  components, hooks, view models, and feature-local tests through its public index.
- `src/domain`: shared business entities and validation contracts with no React or
  transport dependencies.
- `src/services`: transport-independent interfaces and production/mock adapters.
- `src/mocks`: request handlers, deterministic factories, and named scenarios.
- `src/shared/ui`: reusable, accessible visual primitives with no domain behavior.
- `src/config`: validated environment and runtime configuration.
- `src/utils`: small framework-agnostic helpers.

## Dependency direction

Routes may import feature public APIs. Features may import shared UI, domain,
service contracts, configuration, and utilities. Domain code must not import React,
routes, mocks, or transport adapters. UI components must receive data through a
feature hook or service boundary and must not import fixture files.

The expected data flow is:

`route -> feature component -> feature hook -> service interface -> request adapter`

In development, MSW will intercept the adapter's HTTP request. Production APIs can
therefore replace mocks without changing feature components.

## Feature modules

The initial boundaries are markets, forecasts, waste, recommendations,
procurement, optimisation, scenarios, reports, and platform. A module should not
reach into another module's internal files; promote genuinely shared contracts to
`domain`, `services`, or `shared` instead.

## Conventions

- Keep TypeScript strict and use the `@/` aliases rather than deep relative imports.
- Export only intentional public APIs from feature `index.ts` files.
- Co-locate tests with their component, hook, service, or schema.
- Treat environment variables as untrusted input and centralize access in `config`.
- Add a shared abstraction only after at least one current requirement needs it.
