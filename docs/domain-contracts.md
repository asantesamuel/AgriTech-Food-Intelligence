# Domain and validation contracts

TypeScript types are inferred from Zod schemas so compile-time and runtime
contracts cannot drift. Every API or mock adapter validates unknown data at its
boundary before returning it to a feature.

Conventions:

- IDs are opaque 3–100 character identifiers using letters, numbers, `_`, or `-`.
- Dates use ISO `YYYY-MM-DD`; instants use ISO 8601 with an explicit UTC offset.
- Money is `{ amount, currency }`, currently supporting GHS and USD.
- Quantities always carry a unit; prices carry both currency and quantity unit.
- Percentages use 0–100 and probabilities/confidence scores use 0–1.
- Locations reference a region and may add district and WGS84 latitude/longitude.

Markets and intelligence are the primary product domains. Farm, field, and sensor
contracts in `sources.ts` remain supporting upstream evidence entities and must not
drive top-level navigation or product-module ownership.

## Decision contract

The MVP purchase-timing decision supports every approved state: recommended,
accepted, dismissed, modified, assigned, approved, in progress, and completed.
Transitions retain actor and timestamp history. Completion requires the actual
financial value protected and its measurement time; the expected value is required
from the initial decision. Model confidence is external-facing, while freshness and
coverage remain distinct evidence dimensions inside the intelligence experience.
