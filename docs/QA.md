# QA — 14 September 2026

## Verified

- Production build succeeds after moving stale generated development types out of `.next/dev`.
- ESLint passes; 11 automated tests pass, covering validation, signed sessions, origin enforcement, body limits, rate limiting, enquiry persistence/idempotency, spam honeypot, optimistic CMS updates and portable client request IDs.
- Dependency audit: no production vulnerabilities reported on 13 September 2026.
- Desktop browser inspection: hero typography and hierarchy, original geometric assembly fallback, selected-work layout, contact/footer layout and normal anchor navigation.
- Scroll interaction: the dedicated sticky assembly chapter visibly transforms between closed and expanded states. The controller advanced from 0 to 0.843 spread during a keyboard page scroll; screenshots were inspected at both states.
- Public enquiry flow exercised in the browser with synthetic data. The form returned a persisted receipt (`F69A1BFA`) and focused the success message. No external email was sent.
- A browser-discovered HTTP-preview bug in `crypto.randomUUID` was fixed with cryptographic `getRandomValues` UUID generation; errors now remain inside the form's try/finally handling. The preview's exact origin was configured in an ignored development-only environment file.
- No horizontal overflow was detected at the review browser's desktop viewport.

## Remaining launch checks

The review browser does not expose WebGL2: the CSS 3D fallback was verified, while native Three.js GPU output remains unverified. Mobile/tablet viewports, real touch interactions, reduced-motion device behavior, and Lighthouse/field performance still require a browser/device acceptance pass. No 60 FPS or Lighthouse score is claimed.

PostgreSQL production connectivity, admin credentials, final domain, HTTPS and public enquiry email must be configured for the chosen host. SQLite enquiry persistence and CMS security are tested locally. End-to-end authenticated admin image upload and multi-device visual acceptance remain to be checked on staging.

Use at least 390×844, 768×1024, 1440×900 and 1920×1080. Check the hero, full unfold sequence, all project routes, service disclosures, assembly slider, mobile menu/Escape/focus return, form validation/retry/success, CMS publication, uploaded media and database persistence after restart. Test with WebGL on/off and reduced motion enabled.

This is an implemented, buildable checkpoint, not a claim that all production acceptance gates have passed.
