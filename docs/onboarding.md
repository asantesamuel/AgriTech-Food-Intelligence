# Workspace onboarding

The protected `/onboarding` flow captures organization type, focus commodities,
regions and markets, and primary goals. Each step requires the minimum valid
selection and communicates progress and validation accessibly.

Preferences are validated with the shared domain schema and persisted per mock
organization in local storage. The executive dashboard reads the first selected
commodity and region as its initial filters; production persistence can replace the
storage adapter without changing the onboarding UI.
