# Deployment report

The Astro release uses the latest local source from commit 898c80b and the owner-supplied Irfan_Resume.pdf. The migration branches from the old main commit 2ba5ff09. GitHub retains that revision on backup/pre-astro-publish-2026-11-23.

GitHub Pages uses Actions. The workflow builds and validates the repository subdirectory and uploads dist. The contact form uses Formspree. Legacy Firebase configuration and owner assets remain in Git. GitHub Pages does not execute backend code.

[Repository](https://github.com/Ir786106/Muhammad_Irfan_Waseem_Portfolio) · [Public portfolio](https://ir786106.github.io/Muhammad_Irfan_Waseem_Portfolio/)

Local checks passed with zero Astro errors, two unit tests, and validation of 20 static pages under the public prefix. The initial Actions run found legacy CommonJS scripts in the Astro lint scope. The follow-up scopes those historical scripts out while retaining them in Git.
