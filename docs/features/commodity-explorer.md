# Commodity Explorer feature specification

| Metadata | Value |
| --- | --- |
| Status | Implemented for SCRUM-84 |
| Owner | Product Lead |
| UX owner | UX/UI Lead |
| Engineering owner | Frontend Lead |
| Last reviewed | 2026-09-13 |
| Parent epic | SCRUM-71 |
| Dependencies | SCRUM-79, SCRUM-80; existing catalog and intelligence boundaries |

## 1. User outcome

As a Procurement Manager or market analyst, the user can compare supported
commodities and identify which one needs investigation without opening every
commodity individually.

The explorer answers:

1. Which commodities are moving materially?
2. Is the movement supported by a forecast, and with what confidence?
3. Is value or food exposed to a meaningful risk?
4. Which commodity should the user investigate next?

## 2. Entry and exit points

### Entry

- Intelligence section navigation;
- a commodity link from Market Pulse or Overview;
- a preserved explorer URL shared by another user.

### Exit

- Commodity Intelligence detail;
- linked supporting risk or decision when supplied by the read model;
- later, Add to Watchlist through SCRUM-95.

## 3. Page hierarchy

1. Page header: “Compare commodity pressure” and current evidence time.
2. Scope bar: search, category, region, risk, and direction filters.
3. Results summary: result count and stale/partial qualification.
4. Comparison table on larger screens and semantically equivalent stacked rows
   on narrow screens.
5. Pagination with current range and total count.

Each result contains:

- commodity name, category, and unit;
- current scoped price and observation time;
- directional movement and comparison period;
- volatility with an explained period/meaning;
- forecast direction, horizon, interval summary, and model confidence;
- highest relevant risk;
- one primary action: “Open intelligence”.

Financial exposure or decision relevance may influence default sorting only when
the read model supplies those values. The UI must not invent a ranking.

## 4. Interaction behavior

- Search matches commodity names and aliases, case-insensitively.
- Filters can be combined and are reflected in the URL.
- Active filters remain visible in their controls with a clear-all action.
- Sorting is single-column and announces the active direction.
- Changing search or filters returns to page 1.
- Pagination does not lose the active scope.
- The explorer URL preserves the comparison state for navigation and sharing.
- Detail scope transfer is deferred to the generalized detail contract in
  SCRUM-85.
- A tomato result may be visually prioritized by current decision relevance, but
  tomato is not a hard-coded structural exception.

## 5. Default comparison

The initial Procurement Manager scope includes all available regions and sorts by
service-supplied procurement attention, descending. The data/service response
owns result ordering; the component does not reorder fixtures locally.

## 6. State requirements

| State | Required behavior |
| --- | --- |
| Loading | Preserve the expected header, controls, and row layout with skeletons |
| Success | Show scoped results, count, sort, and navigation |
| Empty catalog | Explain that no supported commodities are available |
| No matches | Retain filters and offer clear/reset actions |
| Error | Explain that intelligence could not be loaded and offer retry |
| Stale | Show observation age and advise verification without hiding results |
| Partial | Identify unavailable comparison fields; never substitute zero |
| Low confidence | Qualify the affected forecast and avoid positive/negative certainty language |

## 7. Accessibility and responsive behavior

- Search has an explicit accessible name.
- Every filter is keyboard operable and associated with its label.
- Sort controls expose column, direction, and state to assistive technology.
- Risk, movement, confidence, and freshness use text in addition to color.
- The result structure keeps a logical reading order at every breakpoint.
- Pagination announces the current page and disables unavailable navigation.
- A commodity result has one unambiguous primary link; nested interactive
  controls must not create invalid nested links.

## 8. Acceptance mapping

| SCRUM-84 acceptance criterion | Specification section | Validation |
| --- | --- | --- |
| Search, filtering, sorting, and pagination work | Sections 3–5 | MV-84-01 to MV-84-05 |
| Price, trend, volatility, forecast, and risk are visible | Section 3 | MV-84-06 |
| Results navigate to intelligence detail | Sections 2 and 4 | MV-84-07 |
| Loading, empty, error, and stale states | Section 6 | MV-84-08 to MV-84-12 |
| Responsive shared-component UI | Section 7 | MV-84-13 to MV-84-15 |

Validation identifiers refer to
[Market & Predictive Intelligence validation](../testing/market-predictive-validation.md).

## 9. Boundaries

SCRUM-84 does not provide catalog editing, live procurement, map exploration,
forecast generation, watchlist persistence, or model-performance evaluation. It
must use hooks and service contracts and must not import mock fixtures directly.
