# Deployment

Publish portfolio-next as a separate repository root, without overwriting the old portfolio. Enable Pages with GitHub Actions. Run the included manual workflow. It computes account origin and project base path; an account.github.io repository uses `/`. For a custom domain change SITE_URL and BASE_PATH and configure DNS separately.

Run check, lint, unit tests, browser tests and build first. Upload only dist. Canonicals and sitemap require SITE_URL. After deployment verify direct case-study URLs, back navigation, themes, résumé downloads and contact handling. Confirm actual contact delivery with owner inbox access; mocked tests cannot prove delivery. No deployment has been performed.

Other static hosts can serve dist built with their exact origin/base. GitHub Pages cannot set arbitrary response headers; HTML includes CSP. Add host-level headers where supported.
