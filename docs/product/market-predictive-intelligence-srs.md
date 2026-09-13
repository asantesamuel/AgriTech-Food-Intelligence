# Market & Predictive Intelligence software requirements specification

| Metadata | Value |
| --- | --- |
| Status | Active implementation baseline |
| Owner | Product Lead |
| Contributors | UX/UI, Architecture, Data/ML, Frontend, QA |
| Last reviewed | 2026-09-13 |
| Jira scope | SCRUM-71, SCRUM-84–90 |
| First vertical slice | Tomato flows between Ashanti and Greater Accra |
| Default persona | Procurement Manager |

## 1. Purpose

Market & Predictive Intelligence helps a customer understand what is happening
in food markets, what is likely to happen next, where an imbalance is forming,
and whether the evidence is strong enough to support a decision. It supplies the
evidence used by Waste Intelligence and the Decision Lifecycle; it does not
execute procurement, transport, storage, or trading operations.

## 2. Scope and status

### Current

The frontend currently provides:

- a Procurement Manager-oriented Market Pulse;
- a searchable, filterable, sortable, and paginated Commodity Explorer backed
  by a validated task read model;
- a tomato intelligence page linking observed prices, a 30-day modeled price
  outlook, model confidence, risk, the Ashanti-to-Greater Accra corridor, and a
  purchase-timing decision;
- validated domain schemas for catalog entities, prices, forecasts, confidence,
  freshness, supply-demand balance, waste risk, and decisions;
- service-mediated requests intercepted by deterministic MSW handlers;
- repeatable success, empty, stale, partial, low-confidence, critical-risk, and
  error demo conditions where supported by the active feature.

### Planned next in this epic

- SCRUM-85: reusable commodity intelligence across commodities, regions, and
  forecast horizons;
- SCRUM-86: geographic Market Explorer with a non-map fallback;
- SCRUM-87: cross-commodity Forecast Center;
- SCRUM-88: combined Supply & Demand workspace;
- SCRUM-89: typed shortage and glut detection;
- SCRUM-90: prediction-versus-actual performance and trust views.

The existing tomato page and forecast chart are foundations to generalize, not
parallel experiences to rebuild.

## 3. Users and decisions

### Primary user

The Procurement Manager needs to decide when, where, and at what exposure to
purchase food. Their primary journey is:

`Market Pulse -> Commodity Explorer -> Commodity Intelligence -> Forecast or Supply & Demand -> Imbalance -> Waste Risk -> Decision`

### Supporting users

- Market analysts compare commodities, regions, and forecast evidence.
- Food processors assess supply availability and price exposure.
- Public food-security analysts investigate regional market pressure.
- Platform and data analysts inspect evidence quality and forecast performance.

## 4. Functional requirements

| ID | Requirement | Jira |
| --- | --- | --- |
| MPI-FR-001 | Users can search, filter, sort, and page through supported commodities. | SCRUM-84 |
| MPI-FR-002 | Commodity summaries show current price, movement, volatility, forecast direction, model confidence, and risk without presenting predictions as certainty. | SCRUM-84 |
| MPI-FR-003 | A commodity result opens its intelligence detail while preserving applicable scope. | SCRUM-84, SCRUM-85 |
| MPI-FR-004 | Commodity intelligence supports region and 7/14/30/60-day horizon selection when data exists. | SCRUM-85 |
| MPI-FR-005 | Users can explore market and regional differences geographically and through an equivalent list or table. | SCRUM-86 |
| MPI-FR-006 | Forecasts can be compared by commodity, region, horizon, confidence, direction, and expected impact. | SCRUM-87 |
| MPI-FR-007 | Supply and demand are presented together with a derived balance, major drivers, time window, and region. | SCRUM-88 |
| MPI-FR-008 | Shortages and gluts are distinct typed conditions with quantity, severity, confidence, timing, and an intervention window. | SCRUM-89 |
| MPI-FR-009 | Users can compare historical forecasts with actual observations by commodity and horizon. | SCRUM-90 |
| MPI-FR-010 | Model confidence, data freshness, data completeness, and historical accuracy are labeled as separate concepts wherever more than one is shown. | SCRUM-84–90 |
| MPI-FR-011 | Every actionable signal links to its supporting intelligence or decision context. | SCRUM-84–90 |
| MPI-FR-012 | Loading, empty, error, stale, partial, low-confidence, and insufficient-history states are explicit when applicable. | SCRUM-84–90 |

## 5. Non-functional requirements

- **Accessibility:** Keyboard operation, visible focus, semantic headings,
  non-color signal labels, chart descriptions, and a list/table alternative to
  maps are required.
- **Responsiveness:** Core investigation and comparison tasks must remain usable
  on small screens without hiding decision-critical evidence.
- **Contract safety:** Unknown API or mock responses are validated before a
  feature consumes them.
- **Replaceability:** Feature components depend on hooks and service interfaces,
  not fixture imports or MSW implementation details.
- **Traceability:** Forecasts and imbalances retain identifiers required to link
  supporting evidence, downstream recommendations, and eventual outcomes.
- **Performance:** Search/filter input must remain responsive. Pagination must
  bound rendered result sets when the catalog grows.
- **Determinism:** Mock scenarios must remain reproducible for review and tests.

## 6. Product and data semantics

- An **observation** is measured or received market data.
- A **forecast** is a model expectation with a horizon, interval, and model
  confidence.
- A **simulation** is an assumption-driven scenario and must not be labeled as a
  forecast.
- An **imbalance** is a derived shortage or glut based on supply and demand for a
  defined commodity, region, and period.
- **Model confidence** describes the model output. **Freshness** describes the
  age of evidence. **Completeness** describes coverage. **Historical accuracy**
  describes measured past performance.

Data/ML Lead approval is required before production thresholds, confidence
interpretation, or performance metrics are treated as authoritative. Values in
the current prototype are illustrative mock data.

## 7. Constraints and assumptions

- Production backend, data ingestion, and model-serving systems do not yet exist
  in this repository.
- Mock data is suitable for product validation, not operational procurement.
- Ghana is the current geographic scope; identifiers and service boundaries must
  not prevent later West African expansion.
- Tomato remains the priority slice, while SCRUM-84 must demonstrate that the
  interaction and contracts generalize to other supported commodities.
- The product recommends and records decisions; it is not a marketplace or a
  logistics operator.

## 8. Out of scope for SCRUM-84

- Editing the commodity catalog;
- live purchasing or supplier contracting;
- production forecast generation;
- map implementation;
- alert delivery;
- optimization or scenario simulation;
- model-performance calculation.

## 9. Traceability and acceptance

Jira owns ticket-level acceptance criteria. This SRS owns shared requirements and
semantic consistency. Implementation evidence for this epic is recorded in
[Market & Predictive Intelligence validation](../testing/market-predictive-validation.md).
