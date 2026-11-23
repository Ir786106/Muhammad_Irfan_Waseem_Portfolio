# Deployment

Run `npm ci`, followed by `npm run check`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e`. Serve `dist/` with `npm run preview -- --port 4321` for local review. For project hosting, set `SITE_URL` and `BASE_PATH` as described in the [GitHub Pages guide](DEPLOYMENT_GUIDE.md). Confirm real contact delivery on the final domain.

Run `node scripts/check-pages.mjs` against the built output before uploading. Keep `SITE_URL` and `BASE_PATH` set to the same values used for the build. The GitHub Actions workflow already performs this check.
