# Content/evidence ledger

This build preserves public content from the user's supplied portfolio archive, rather than inventing new claims. The data source is `modules/projects.js`, the profile link source is `modules/profile.js`, and the CV filenames are checked against the local `Images/` directory. The baseline README explains how app screenshots differ from repository artwork.

| Item | Present source | Status | Publication action |
|---|---|---|---|
| Portfolio owner, role and public address | `README.md`, `index.html`, `modules/profile.js` | Published source record | Retained, needs current owner sign-off if changed |
| 10 project titles, roles and current outcome text | `modules/projects.js` | Published source record, not independently re-verified | Used verbatim for generated case studies |
| Food Fight stable and preview releases | `modules/projects.js` | Release tag and asset names verified through the connected GitHub repository (2026-11-22) | Retained. Full binary downloads not exercised locally |
| Ittehad Food Industries | `modules/projects.js` | Working public source record | Keep separate from academic MillX ERP name |
| Real screenshots for third-party app repos | Original source/README | Not supplied for many projects | Label covers `Repository Asset`, `Product Artwork` or `Learning Artwork` |
| CV PDF and DOCX | `Images/` | Files in archive | Keep existing links; owner responsible for current personal data review |
| Submitted reviews/testimonials | Firestore moderation flow | Not readable in offline build | Never display unmoderated/without explicit consent |
| Blog links and external contacts | `index.html` / profile module | Published source record | No fabricated articles or endorsements |

No fabricated usage metrics, client quotations, awards, user counts, star ratings, or production-readiness assertions were added.
