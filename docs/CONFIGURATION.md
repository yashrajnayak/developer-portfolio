# Configuration

`config.json` is the only content source. Keep `"$schema": "./config.schema.json"` so editors such as VS Code can autocomplete fields and show schema errors inline.

## Required sections

- `schema_version`: use `2`.
- `site`: canonical HTTPS URL, language, title, description, keywords, and social image.
- `person`: name, headline, current role, organization, location, avatar, GitHub username, focus areas, and languages.
- `hero`: one value proposition plus primary and secondary CTAs.
- `impact_metrics`: one to six evidence-backed metrics.
- `navigation`: labels and rendered section targets (`impact`, `experience`, `proof`, `work`, or `contact`).
- `projects`: structured case studies with role, challenge, actions, outcomes, media, and evidence links.
- `experience`: chronological roles and the number to show before **Full career history**.
- `proof`: compressed capabilities and optional linked credentials.
- `open_source`: a curated list of tools or repositories. Add `stars` only when adoption is useful evidence.
- `contact`: focused CTA and public social links.
- `footer`: copyright and optional engine credit.

## URLs and assets

Public URLs must begin with `https://`. Hero buttons may also target a same-page ID such as `#impact`. Local images must use reusable paths beginning with `assets/` or `media/`; absolute computer paths are rejected.

Project media accepts `fit: "cover"` or `fit: "contain"`. Use `contain` for diagrams, screenshots, logos, and unusually wide artwork that should not be cropped.

## Backward compatibility

Version 2 can read the original v1 shape and normalizes it at build time. Run the explicit migration to review the new structure and remove compatibility warnings:

```bash
npm run migrate -- config.json config.v2.json
```

Legacy project fields `description`, `picture`, and `link` remain accepted in migrated projects for the v2 major release. New content should use `summary`, `media`, and `links[]`.

## Validation

```bash
npm run validate:config
npm run validate
npm run validate:all
```

Errors name the failing field and describe how to correct it. Do not bypass validation by disabling rules; fix the source content or asset path.
