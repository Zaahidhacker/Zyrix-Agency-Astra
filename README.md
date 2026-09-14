# Astra — Websites. Built to move you.

An original agency website for a business that designs and develops websites, online stores and web applications. Built in `Zaahidhacker/Zyrix-Agency-Astra`.

**Status:** implemented with passing build, lint and 11 functional tests. Desktop visuals, the CSS 3D scroll fallback and a successful enquiry were checked in-browser. Native WebGL output, mobile/device performance and production configuration remain launch gates. See [QA](docs/QA.md).

## What is included

- Server-rendered Next.js App Router homepage, three case-study routes, privacy controls, metadata, OpenGraph image, sitemap and robots.
- Original “Assembly” art direction: procedural metallic frames, scroll/pointer response, an interactive separation control and native scrolling.
- Responsive layouts, native service disclosures, mobile navigation dialog, reduced-motion support, self-hosted fonts and optimized WebP artwork.
- Persistent validated enquiries with idempotency, spam protection and an authenticated owner workspace.
- A lightweight CMS for projects, services, testimonials, team, SEO/contact content and portfolio image uploads.
- PostgreSQL production adapter; local/single-instance SQLite option; security headers; opt-in first-party Core Web Vitals.
- TypeScript, ESLint, tests, CI workflow and a non-root standalone Docker build.

Initial portfolio content is explicitly labeled studio-concept work. There are no fabricated client testimonials, awards or conversion statistics.

## Quick start

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Use Node 24. Open `http://localhost:3000`. Run `npm run admin:hash` and set the generated secrets in `.env.local` to enable `/admin`.

## Architecture

| Area                   | Responsibility                                                                |
| ---------------------- | ----------------------------------------------------------------------------- |
| `app/`                 | Server routes, metadata, error/loading states and authenticated API endpoints |
| `components/sections/` | Website-specific editorial sections and enquiry UI                            |
| `components/three/`    | Dynamic scene, geometry, assembly and shared scroll state                     |
| `components/motion/`   | Scoped GSAP entrances and opt-in metrics                                      |
| `components/layout/`   | Navigation and footer                                                         |
| `components/admin/`    | Content editor, image uploads and enquiry management                          |
| `lib/`                 | Shared validation, persistence, content versioning and security               |
| `data/`                | Honest seed content                                                           |
| `public/images/`       | Original generated concept artwork, optimized as WebP                         |
| `tests/`               | Critical validation, security, persistence and concurrency checks             |

The stack deliberately avoids overlapping animation libraries, an external CMS subscription, and a dependency on transactional email for lead capture. PostgreSQL is the recommended production database. Tailwind is not necessary for this authored visual system; shared CSS tokens define the design instead.

## Documentation

- [Benchmark analysis and original creative direction](docs/BENCHMARK.md)
- [Design system, WebGL and motion](docs/DESIGN-SYSTEM.md)
- [Development, environment variables, CMS and production deployment](docs/OPERATIONS.md)
- [QA results and remaining acceptance checks](docs/QA.md)

## Optional extensions

Transactional lead notifications; CRM integration; object storage for large media libraries; CMS audit history/rollback and additional editor accounts; approved real client case studies; authenticated staging; field percentile reporting and hardware-specific performance tuning after browser validation.
