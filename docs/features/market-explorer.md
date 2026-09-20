# Market Explorer feature specification

| Metadata | Value |
| --- | --- |
| Status | Implemented for SCRUM-86 |
| Owner | Product Lead |
| Contributors | UX/UI, Architecture, Data/ML, Frontend, QA |
| Last reviewed | 2026-09-13 |
| Parent epic | SCRUM-71 |

## User outcome

The Market Explorer helps an analyst compare where commodity price pressure and
financial risk differ across Ghana. It supports procurement investigation; it is
not a route-planning or logistics application.

## Experience

- `/intelligence/markets` stores commodity, risk, and selected-market state in
  validated URL parameters.
- The primary canvas is a lightweight Ghana geographic overview using geocoded
  market coordinates supplied by the read model.
- Each marker and the equivalent market-list row selects the same location.
- The selected summary shows current price, movement, freshness, risk severity,
  value at risk, and risk drivers.
- Commodity intelligence is the next investigation step.
- When map rendering is unavailable, the list and evidence panel remain usable.

The prototype boundary uses an inline schematic country shape and illustrative
coordinates rather than introducing a production map dependency. A future GIS
adapter may replace the geographic rendering while preserving the feature hook,
service operation, validated snapshot, URL semantics, and list fallback.

## States and accessibility

Loading, dataset-empty, filter-empty, request-error, stale, low-confidence,
critical-risk, partial-data, and unavailable-map conditions are explicit.
Markers are semantic buttons with location and risk names; selection is exposed
through `aria-pressed`. The visible-market list is always available and is the
complete keyboard and non-map alternative. Risk is expressed in text as well as
color.

## Boundaries

SCRUM-86 does not add live GIS tiles, regional boundary files, market editing,
route optimisation, procurement execution, or a dedicated market-detail domain.
Production coordinates, boundaries, prices, and risk estimates require their
respective data and backend services.
