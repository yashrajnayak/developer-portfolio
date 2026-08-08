# Contributing

Thanks for improving Developer Portfolio.

## Development

1. Create a focused branch from `main`.
2. Run `npm ci`.
3. Make content-system changes in `scripts/`, UI changes in `src/`, and schema changes in `config.schema.json`.
4. Add or update unit and browser tests.
5. Run `npm run validate:all` before opening a pull request.

Pull requests should explain the user problem, the implementation, and any schema or migration impact. Include desktop and 390px screenshots for visible changes. Do not weaken validation, hide files from analysis, or commit `dist/`, Playwright reports, machine-specific paths, or secrets.

For breaking schema changes, add a migration, update `docs/CONFIGURATION.md`, and record the compatibility decision in `CHANGELOG.md`.
