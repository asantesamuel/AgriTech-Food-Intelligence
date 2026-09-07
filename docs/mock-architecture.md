# Mock API architecture

The browser starts MSW only when `VITE_DATA_MODE=mock`. Service adapters always
call `/api/*` and validate responses with Zod. Feature components depend on those
service interfaces, so switching `VITE_DATA_MODE` and the adapter target later does
not change UI code.

Each mock request accepts a named scenario and bounded artificial latency. Named
scenarios cover success, empty, stale, low-confidence, partial, critical-risk, and
error behavior. Factories use a seeded generator and a fixed clock so tests and
demos remain reproducible.
