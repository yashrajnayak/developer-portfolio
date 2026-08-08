# Architecture

Developer Portfolio v2 separates reusable rendering logic from personal content.

## Build contract

1. `config.json` is loaded from the engine root or from `PORTFOLIO_CONFIG`.
2. Schema v1 inputs are normalized in memory by `scripts/lib/config.mjs`; schema v2 inputs are used directly.
3. JSON Schema, duplicate, navigation, HTTPS URL, and local-asset checks run before output is written.
4. `scripts/lib/render.mjs` escapes content and creates the complete HTML, JSON-LD, site README, and profile README.
5. `scripts/build.mjs` copies content-owned `assets/` and `media/`, then generates `dist/` including metadata, sitemap, robots, and web manifest.
6. GitHub Pages publishes `dist/` through OIDC-backed official Pages actions.

`src/app.js` is progressive enhancement only. Removing it leaves all professional content, case-study details, metadata, navigation targets, and contact links in the generated HTML.

## Personal overlay model

A live portfolio can pin a template release, check the engine out into a temporary workflow directory, point `PORTFOLIO_CONFIG` at the live repository, and publish the engine's generated `dist/`. That keeps personal configuration and media independent from engine upgrades and makes rollback a one-line template-version change.

## Trust boundaries

- Configuration is untrusted input and is escaped at every HTML and JSON-LD boundary.
- Public links must use HTTPS; only same-page fragment links bypass that rule.
- Local media must live under `assets/` or `media/` and must exist at validation time.
- Workflows use least-privilege permissions, concurrency guards, immutable action SHAs, and explicit generated-file allowlists.
