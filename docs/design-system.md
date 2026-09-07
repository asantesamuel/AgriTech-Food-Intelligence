# Design system

The interface uses semantic CSS variables exposed through Tailwind utilities.
Components consume tokens such as `background`, `card`, `primary`, `muted`, and
`border`; they do not embed feature-specific colors.

`data-theme="light"` on the root element switches to the light-ready token set.
Dark is the prototype default. Semantic meaning is expressed with text and icons in
addition to color.

## Semantic signals

- Risk and severity: low, medium, high, critical.
- Confidence: low, medium, high (the label supplies the meaning; color is secondary).
- Freshness: fresh or stale.
- Status: active or inactive.

Use `SemanticBadge` for compact signals and `StatePanel` for loading, empty, error,
and success states. Use `Skeleton` only while the final layout is known so loading
does not cause large layout shifts.

Shared primitives live in `src/shared/ui` and follow shadcn composition patterns:
Radix provides interaction behavior, CVA provides variants, and `cn` merges utility
classes safely. Feature-specific components belong in their feature module.
