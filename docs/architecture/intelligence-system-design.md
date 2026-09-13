# Intelligence frontend system design

| Metadata | Value |
| --- | --- |
| Status | Current architecture including SCRUM-84 |
| Owner | Architecture Lead |
| Last reviewed | 2026-09-13 |
| Related Jira | SCRUM-71, SCRUM-76, SCRUM-78, SCRUM-79, SCRUM-84–90 |
| Related ADR | [ADR-0001](../adr/ADR-0001-task-oriented-read-models.md) |

## 1. Design goal

Intelligence pages should answer a task-specific user question without coupling
React components to mock fixtures or to the future backend's storage model. The
frontend validates each read model at its request boundary and exposes it through
a feature hook.

## 2. Current module boundaries

```text
src/routes
  -> src/features/intelligence
      -> src/services
          -> request adapter
              -> MSW today / production API later
      -> src/domain
      -> src/shared/ui
```

- Routes define URLs and pass route/search parameters to feature entry points.
- Feature components own presentation and interaction state.
- Feature hooks own TanStack Query keys and request lifecycle.
- Service interfaces expose task-oriented operations.
- Zod schemas in `src/domain` validate unknown responses.
- MSW handlers and factories simulate external APIs and named conditions.

Current intelligence operations are:

- `GET /api/intelligence/market-pulse`;
- `GET /api/intelligence/commodities`;
- `GET /api/intelligence/commodities/:commodityId`.

The catalog operation is `GET /api/catalog`. It returns canonical regions,
markets, and commodities; the explorer uses its own task-oriented read model.

## 3. SCRUM-84 design

### Route

`/intelligence/commodities`

Search, filter, sort, and page state should be represented in URL search
parameters so results are linkable and navigation back from commodity detail can
restore the prior scope.

Recommended parameters:

| Parameter | Purpose | Default |
| --- | --- | --- |
| `q` | Name or alias search | Empty |
| `category` | Commodity category | All |
| `region` | Market-observation scope | All |
| `direction` | Rising, falling, or stable | All |
| `risk` | Risk severity | All |
| `confidence` | Model-confidence band | All |
| `sort` | Operational comparison field | Procurement attention |
| `order` | Ascending or descending order | Descending |
| `page` | One-based page | 1 |
| `pageSize` | Bounded result count | 10; options 10, 25, 50 |

Changing a scope parameter resets `page` to 1. The router should parse and
validate search parameters before the feature uses them.

### Read operation

Add a task-oriented service operation rather than deriving explorer rows inside
the component:

```text
IntelligenceService.getCommodityExplorer(query)
  -> GET /api/intelligence/commodities?...query
  -> CommodityExplorerSnapshot schema
```

The snapshot should include:

- generated time and result state;
- normalized applied query;
- result items with commodity identity and display unit;
- current scoped price and movement;
- volatility summary with an explicitly defined period;
- forecast direction, horizon, interval summary, and model confidence;
- highest relevant risk and decision relevance;
- total results, page, page size, and total pages;
- unavailable fields or sections for partial-data handling.

The explorer read model may reference canonical IDs, but it should already contain
the fields required to render a result. The component must not join several raw
collections or import fixture JSON.

## 4. Query and state flow

```text
Validated route search
  -> useCommodityExplorer(query)
  -> query key ['commodity-explorer', organizationId, query, demoCondition]
  -> IntelligenceService.getCommodityExplorer(query)
  -> requestJson(..., commodityExplorerSnapshotSchema)
  -> loading / success / empty / stale / partial / low-confidence / error UI
```

Server-side search, filtering, sorting, and pagination are the production
contract. MSW should emulate those semantics so the frontend does not require a
later architectural rewrite. The service remains free to use a mock or production
transport adapter.

## 5. Cross-feature links

- A result opens `/intelligence/commodities/$commodityId`.
- Carrying applicable region and horizon scope into the detail route remains
  planned with the generalized detail contract in SCRUM-85.
- Risk and recommendation links use IDs from the read model rather than labels.
- Returning to the explorer restores its URL-backed query.
- Watchlist controls are deferred to SCRUM-95 but the item contract should retain
  a stable commodity ID.

## 6. Current versus planned contracts

| Concern | Current | Planned |
| --- | --- | --- |
| Commodity catalog | Canonical catalog snapshot | Remains the source for setup/reference choices |
| Commodity comparison | Explorer-specific paged snapshot | Extend only when a new comparison field is approved |
| Commodity detail | Tomato-centered task read model | Generalized by SCRUM-85 |
| Forecast chart | Accessible observed/forecast component | Reused by detail and forecast center |
| Supply-demand | Domain entity only | Task snapshot and service in SCRUM-88 |
| Imbalance | General pulse signals only | Typed shortage/glut read model in SCRUM-89 |
| Forecast evaluation | Model metadata entity only | Prediction-versus-actual snapshot in SCRUM-90 |

## 7. Quality and operational boundaries

- Transport errors and schema failures must become an explicit error state.
- Empty results are not transport errors.
- Stale and low-confidence results remain usable but visibly qualified.
- Partial data identifies unavailable sections; missing evidence must not be
  silently converted to zero.
- Tenant and organization scope must come from authenticated workspace context,
  not an editable query parameter.
- Mock controls remain isolated in the Demo Controls drawer.
- No secrets, model internals, or sensitive source payloads belong in client-side
  fixtures or logs.

## 8. Evolution rules

- Add a new snapshot only when a user task requires a different composition.
- Reuse canonical primitives and entities rather than duplicating their schemas.
- Keep response schemas versionable and backward-compatible where practical.
- Document breaking contract changes in this file and, when the architectural
  choice changes, supersede the relevant ADR.
