# Wall Street public website

This is a standalone Astro site inside the WallStreet repository. It is intentionally separated from the React application and does not read the repository root, `.env` files, credential-bearing configuration, or model artifacts into its build.

## Local preview

Requirements: Node.js `>=22.23.4` and npm `>=9.6.5` (the versions declared by Astro 7.4.5 and this package).

```sh
cd website
npm ci
npm run dev
```

The site opens at `http://localhost:4321`. For a production-output check, run `npm run check`, `npm test`, and `npm run build` from `website/`.

## Routes

- `/` — source-led overview and the responsive pixel sequence
- `/product` — four prototype roles and non-transactional explainers
- `/engineering` — interactive source map, text equivalent, contract notes, and code map
- `/articles` — undated engineering notes
- `/docs` — repository setup, architecture, agents, contracts, and security boundaries
- `/about`, `/contact`, and the custom not-found page

`npm run build` writes the static site to `website/dist/`. Articles and documentation are authored as MDX collections in `src/content/`; their frontmatter owns titles, descriptions, ordering, navigation labels, tags, and section links. Source claims and reviewed paths are centralized in `src/data/project-facts.ts` and `src/data/engineering.ts`. The editable 12-motif sprite atlas is `public/assets/pixel/sprite-atlas.svg`; the responsive scene illustrations are local assets under `public/assets/pixel/`.

## Existing repository setup notes

The website has its own manifest and lockfile. It does not replace or start any of the existing application, API, Python, Celery, or contract packages. The existing repository has several independently declared services and Compose variants; this site does not claim one verified end-to-end launch path or run one by default.

Use placeholders when documenting local environment setup. Never copy a local value into a page, issue, build log, commit, or screenshot. Before publishing the wider repository, maintainers should review credential-like configuration privately. No credential values or private model artifacts are included in this site.

## Domain and indexing

Set the public deployment origin as `SITE_URL` at build time. With it configured, Astro emits canonical URLs and the sitemap integration; without it, the build avoids inventing a production domain. `robots.txt` remains available in either case.

## Verification record

The site records source claims against commit `b7207a8177b4d9a564bf3596b8c450372d5d050b` and labels prototype or simulated behavior explicitly. A successful static build is not a verification of the existing trading services, contracts, database, or wallet flows.

## Maintainer release checks

- Confirm the desired public domain and provide `SITE_URL` before production indexing.
- Confirm repository licensing and add a repository-level license file before describing the whole project as open source.
- Set up a private security-reporting channel before asking reporters to share sensitive findings.
- Audit tracked configuration before a public release; this website intentionally does not copy them.
