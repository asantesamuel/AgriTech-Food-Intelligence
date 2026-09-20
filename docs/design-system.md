# Design system

The interface uses semantic CSS variables exposed through Tailwind utilities.
Components consume tokens such as `background`, `card`, `primary`, `muted`, and
`border`; they do not embed feature-specific colors.

The default is a light analytical canvas with white as the dominant surface.
Deep food-system green is the primary action color, blue represents observed data,
indigo represents forecasts, amber represents warnings, and red is reserved for
high-risk or destructive states. `data-theme="dark"` remains an optional token set.
Semantic meaning is expressed with text and icons in addition to color.

## Semantic signals

- Risk and severity: low, medium, high, critical.
- Confidence: low, medium, high (the label supplies the meaning; color is secondary).
- Freshness: fresh or stale.
- Status: active or inactive.
- Decision status: recommended, accepted, dismissed, modified, assigned, approved,
  in progress, or completed.

Forecasts and simulations must never share the same visual label. Observed and
forecast series use separate tokens; the Scenario Lab explicitly labels modeled
outputs as simulations.

Use `SemanticBadge` for compact signals and `StatePanel` for loading, empty, error,
and success states. Use `Skeleton` only while the final layout is known so loading
does not cause large layout shifts.

Shared primitives live in `src/shared/ui` and follow shadcn composition patterns:
Radix provides interaction behavior, CVA provides variants, and `cn` merges utility
classes safely. Feature-specific components belong in their feature module.
