# Executive dashboard

SCRUM-83 presents a Procurement Executive Brief rather than a generic dashboard.
Its default tomato and Greater Accra scope leads with one purchase-timing decision,
the expected financial value protected, a concise operating pulse, a combined
observed/forecast price chart, the Ashanti-to-Accra corridor, and an action queue.
It reads catalog and dashboard snapshots through the service layer and uses TanStack
Query for request lifecycle, caching, retry, and refresh behavior.

The first saved commodity and region from SCRUM-82 initialize the filters for the active organization. Commodity, region, horizon, and prototype-state controls all participate in the query key, so every change requests a new validated mock snapshot.

Stakeholder scenarios live in the separately branded Demo Controls drawer. Success,
empty, stale, low-confidence, partial, critical-risk, and error states remain
repeatable without mixing debug controls into the product experience. A future
backend can replace the service adapter while leaving the dashboard component and
domain validation boundary intact.
