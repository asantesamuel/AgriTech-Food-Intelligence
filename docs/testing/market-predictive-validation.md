# Market & Predictive Intelligence validation plan

| Metadata | Value |
| --- | --- |
| Status | Automated SCRUM-84 evidence recorded; interactive browser pass blocked |
| Owner | QA Lead |
| Last reviewed | 2026-09-13 |
| Jira scope | SCRUM-71, SCRUM-84–90 |
| Current focus | SCRUM-84 Commodity Explorer |

This plan defines the evidence needed to move an intelligence ticket to review.
Passing a build alone does not prove behavior, accessibility, responsive layout,
or request semantics.

## 1. Required quality gates per ticket

1. Jira acceptance criteria reconciled with the feature specification.
2. Domain and response schemas covered by focused tests.
3. Mock handler semantics covered for success and relevant failure conditions.
4. Component or feature behavior covered for critical interactions.
5. Type checking, linting, unit/integration tests, and production build pass.
6. Important desktop and small-screen journeys are manually verified.
7. Keyboard navigation, focus visibility, labels, and non-color signals are
   manually checked.
8. Git diff is reviewed for unrelated work, fixture imports, secrets, and debug
   code.

## 2. SCRUM-84 verification matrix

| ID | Check | Level | Expected evidence | Status |
| --- | --- | --- | --- | --- |
| MV-84-01 | Search by commodity name | Component/integration | Matching result set and URL state | Implemented; URL control requires browser recheck |
| MV-84-02 | Search by alias | Service/component | Alias match without case sensitivity | Passed automated service test |
| MV-84-03 | Combine category, region, risk, and direction filters | Handler/integration | Correct intersection and applied-query response | Passed automated service test |
| MV-84-04 | Change sort field and direction | Handler/component | Stable ordered results and announced sort state | Implemented; browser recheck pending |
| MV-84-05 | Navigate pages and reset page after filter changes | Integration | Correct range, URL, boundaries, and restored state | Contract passed; browser recheck pending |
| MV-84-06 | Render every required comparison field | Component | Price, period, movement, volatility, forecast, confidence, risk | Implemented and type checked |
| MV-84-07 | Open commodity detail | Integration | Correct commodity ID | Route generated and production build passed |
| MV-84-08 | Loading condition | Component | Stable skeleton layout and no false empty message | Implemented; browser recheck pending |
| MV-84-09 | Empty catalog condition | Component | Catalog-specific explanation | Implemented; scenario factory test passed |
| MV-84-10 | Filtered no-results condition | Component | Clear filters/reset action remains available | Implemented; browser recheck pending |
| MV-84-11 | Request or schema error | Service/component | Explicit error and working retry | Implemented; existing service-failure contract covered |
| MV-84-12 | Stale, partial, and low-confidence conditions | Handler/component | Qualified data, no silent zero or certainty language | Scenario factory tests passed |
| MV-84-13 | Keyboard-only workflow | Manual/component | Search, filters, sort, results, and pagination operable | Pending interactive browser pass |
| MV-84-14 | Assistive semantics | Component/manual | Named controls, headings, status text, sort state | Static implementation complete; manual check pending |
| MV-84-15 | Narrow and wide layouts | Manual | No lost fields, overlap, or inaccessible horizontal content | Responsive branches implemented; manual check pending |

### 2026-09-13 execution evidence

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: 8 files and 32 tests passed.
- `npm run build`: passed; `/intelligence/commodities` route generated in the
  client and server bundles.
- HTTP route smoke check: development server returned status 200.
- Interactive browser verification: not completed because the computer-use
  helper could not initialize its kernel asset path after one reset and retry.

## 3. Contract cases

- Reject a forecast point outside its lower/upper interval.
- Reject confidence outside 0–1 or unsupported bands.
- Reject negative prices, risk volumes, or invalid pagination values.
- Preserve missing comparison data as unavailable, not zero.
- Verify applied-query normalization and total/page consistency.
- Verify deterministic output for a fixed mock scenario and query.

## 4. Mock scenario coverage

At minimum SCRUM-84 should demonstrate:

- success with multiple commodities;
- no catalog data;
- no matches for valid filters;
- stale observations;
- partial comparison data;
- low-confidence forecast data;
- request failure;
- delayed loading.

Critical-risk presentation may reuse the existing named demo condition when the
explorer read model contains a critical item.

## 5. Commands

Run from the repository root:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Record exact command results in the Jira ticket or review handoff. Do not report
browser, provider, backend, or production behavior unless that check was actually
performed.

## 6. Review evidence template

```text
Ticket:
Commit:
Acceptance criteria verified:
Automated commands and results:
Manual routes and viewport sizes:
Keyboard/accessibility checks:
Mock conditions exercised:
Known limitations:
Reviewer:
Date:
```
