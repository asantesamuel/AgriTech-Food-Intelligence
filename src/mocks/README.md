# Mock boundary

MSW intercepts the same `/api/*` request boundary production adapters will use.
Deterministic factories validate their output with the shared Zod schemas.

Configure a request with `scenario` (`success`, `empty`, `stale`,
`low-confidence`, `partial`, `critical-risk`, or `error`) and a bounded `latency`
in milliseconds. Feature code calls service interfaces and must not import this
folder or fixture data directly.
