# Muhammad Irfan Waseem — portfolio-next

Original static-first Astro portfolio. Requires Node 22.12+.

```sh
npm ci
npm run dev
npm run check
npm run lint
npm test
npm run build
npm run preview
```

If restricted Windows user configuration blocks Astro telemetry, set `ASTRO_TELEMETRY_DISABLED=1`. Browser tests: `npx playwright install chromium`, then `npm run test:e2e`.

Set `SITE_URL` to the actual deployment origin and `BASE_PATH` to `/` or `/repository-name/` before production builds. No secrets required. Public Formspree endpoint is in `src/data/profile.ts`; confirm inbox ownership and domain authorization before launch. Content is in `src/data`, routes in `src/pages`, progressive enhancement in `src/scripts`, styling in `src/styles`. Authorized assets and résumé files live in `public/images`. Research snapshots are ignored and never deployed.

See docs for evidence, QA, deployment and remaining owner inputs.

## GitHub Pages

Pushes to main trigger the Pages workflow. The same workflow supports manual dispatch. It runs the checks, builds for the repository subdirectory and deploys dist. Set the Pages source to GitHub Actions.

[Public portfolio](https://ir786106.github.io/Muhammad_Irfan_Waseem_Portfolio/)

## Published homepage

The standalone V4 homepage and its assets live in the site directory. The Pages workflow builds and validates the Astro routes first, then overlays the V4 homepage.
