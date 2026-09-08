# Executive dashboard

SCRUM-83 replaces the Overview placeholder with a filterable decision-intelligence surface. It reads catalog and dashboard snapshots through the service layer and uses TanStack Query for request lifecycle, caching, retry, and refresh behavior.

The first saved commodity and region from SCRUM-82 initialize the filters for the active organization. Commodity, region, horizon, and prototype-state controls all participate in the query key, so every change requests a new validated mock snapshot.

The prototype-state control deliberately exposes success, empty, stale, low-confidence, partial, critical-risk, and error fixtures. This makes the states repeatable for design review without coupling product components to fixture construction. A future backend can replace the service adapter while leaving the dashboard component and domain validation boundary intact.
