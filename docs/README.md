# Project documentation

| Metadata | Value |
| --- | --- |
| Status | Living index |
| Owner | Documentation Lead |
| Last reviewed | 2026-09-13 |
| Scope | Frontend prototype and its future integration boundaries |

This directory is the entry point for product, architecture, feature, and
validation documentation. Jira remains the implementation source of truth;
these documents explain the stable product intent, cross-ticket design, and
evidence needed to maintain the system.

## Start here

- [Market & Predictive Intelligence SRS](product/market-predictive-intelligence-srs.md)
  defines the requirements and boundaries for SCRUM-71 and SCRUM-84–90.
- [Intelligence system design](architecture/intelligence-system-design.md)
  describes the frontend modules, read-model boundaries, and request flow.
- [Commodity Explorer feature specification](features/commodity-explorer.md)
  is the implementation companion for SCRUM-84.
- [Market & Predictive Intelligence validation plan](testing/market-predictive-validation.md)
  defines the verification evidence expected for this phase.
- [Architecture decision records](adr/README.md) records durable technical
  decisions and their consequences.

## Existing implementation documentation

The following documents remain authoritative for the features they describe:

- [Frontend architecture](architecture.md)
- [Design system](design-system.md)
- [Domain and validation contracts](domain-contracts.md)
- [Mock architecture](mock-architecture.md)
- [Mock authentication](mock-authentication.md)
- [Executive dashboard](dashboard.md)
- [Onboarding](onboarding.md)
- [Organization administration](organization-administration.md)

## Documentation rules

- Distinguish implemented behavior from planned behavior.
- Link requirements to Jira keys and verification evidence.
- Put durable cross-cutting decisions in an ADR, not in feature notes.
- Keep API and domain statements aligned with the validated schemas and service
  interfaces in `src/domain` and `src/services`.
- Update the relevant feature specification and validation plan in the same
  ticket that changes user-visible behavior or a contract.
- Do not duplicate Jira acceptance criteria unless the document adds context,
  rationale, interaction detail, or cross-ticket traceability.
