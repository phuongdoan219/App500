# Static HTML/CSS/JS package

Run `npm run export:static` from the project root. The generated `out/` directory contains deployable HTML, CSS, JavaScript, images, fonts, and Next.js runtime assets.

Serve the directory through an HTTP server; do not open `index.html` directly from the filesystem because asset paths are root-relative.

Examples:

- `npx serve out`
- Upload the complete contents of `out/` to a static host root.

Limitations:

- Static output has no Next.js server runtime.
- The current curriculum status request falls back to local sample data when `/api/curriculum` is unavailable.
- Real authentication, payments, referral tracking, and reward persistence require backend APIs described in `DEVELOPMENT_SPEC.md`.
