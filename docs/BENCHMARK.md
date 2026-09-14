# Benchmark review — Zyrix → Astra

Reviewed 13 September 2026, before production implementation.

## Evidence and limits

Sources: the complete server-rendered homepage retrieved from https://www.zyrix-agency.online/ and the supplied 64.9-second, 392 × 850 mobile recording. The recording was sampled through its duration, covering the hero, transformation sequence, positioning, comparison, services, customer journey, example builds, pricing, risk reversal and contact introduction. The HTML supplies the FAQ, full form and footer content.

This is a recording-based visual audit, not a live desktop usability or performance measurement. Menu-open state, desktop cursor/hover behavior, form submission, keyboard behavior, reduced-motion handling and actual FPS are unverified. Exact easing curves, animation durations, 3D implementation and GPU cost cannot be established from video. The recording speed is controlled by its author. No claims about measured Lighthouse scores or other routes are made. Retrieved links are contact destinations rather than independent case-study pages.

## What makes it effective

| Experience                    | Observation                                                                                                                                       | Why it works                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Opening, approximately 0–10 s | A near-black stage, luminous metallic amber structure, centered condensed brand type, yellow CTA, compact fixed menu and floating contact control | Restrained palette and lighting create immediate depth; a real business offer remains visible |
| Transformation, 10–20 s       | The object gives way to an angled browser-like plane, then a positioning statement and a smaller recurring artifact                               | Continuity ties motion to a tangible website rather than disconnected decoration              |
| Positioning, 20–28 s          | Large words resolve from soft focus; selected terms use yellow                                                                                    | Sequential emphasis makes a short narrative legible without overwhelming copy                 |
| Comparison, 28–32 s           | A bright paper-like scene replaces the dark stage; price panels and a division marker explain the offer                                           | A strong tonal reset separates emotional value from commercial value                          |
| Capabilities, 32–42 s         | Large service titles, small technical labels and colorful interface examples; a thin progress line marks progression                              | Concrete outcomes ground the spectacle                                                        |
| Journey, 42–48 s              | Search, trust, WhatsApp and payments are presented as a connected customer flow                                                                   | Local relevance makes the pitch practical and credible                                        |
| Builds, 48–52 s               | Large framed storefront/ordering examples with clear categories                                                                                   | Visitors can recognize a use case without understanding technical language                    |
| Pricing and risk, 52–60 s     | Yellow pricing stage and pale reassurance section; clear delivery terms and ownership                                                             | Addresses budget, delivery and dependency objections before asking for contact                |
| Conversion, 60–65 s and HTML  | Dark final CTA, free-plan offer, name/email/project/message fields; WhatsApp and email alternatives                                               | One coherent next step with low perceived commitment                                          |

The typography system contrasts oversized condensed headlines with restrained mono-like labels and conventional body copy. Narrow borders, numerical markers and selective yellow underlines provide consistent visual grammar. The recording shows large, deliberate scroll scenes rather than an ordinary stack of equal cards. Small fixed controls keep the page navigable during long passages. The black/pale/yellow changes reset visual attention.

## Opportunities to outperform

1. **More immediate mobile readability.** The recorded opening leaves large dark areas above and below the central composition, while some technical labels are tiny. Give the new hero a more useful distribution of space and keep meaningful labels at 12–14 px or larger.
2. **Stronger project evidence.** The benchmark describes interactive example builds. Provide dedicated case-study routes with problem, role, design decisions, technical scope and honest outcomes. Label initial concept work and never fabricate clients, quotes or metrics.
3. **Less dependence on cinematic pacing.** Several states in the recording show partial, blurred or overlapping text during transition. Ensure Astra's content is present and readable without animation, with normal anchors and reduced-motion alternatives.
4. **A more specific creative metaphor.** Use a precision-built assembly that evolves into frames and modules, not the benchmark's amber organic ring or distinctive mockups.
5. **An enquiry workflow with operational continuity.** Validate on client and server, persist accepted enquiries, provide clear success/error states, protect against replay/spam and let an authenticated owner review and update leads.
6. **Credibility beyond price.** Lead with digital product craft, accessible engineering and transparent project scope. Avoid copying the 50%-of-market positioning or unverified numerical promises.
7. **A documented performance budget.** Dynamically load WebGL, cap DPR and geometry, stop idle rendering, pause hidden canvases and collect Core Web Vitals only with an explicit analytics choice. Measure rather than claim 60 FPS.

## Original creative direction: The Assembly

Astra is an independent creative technology studio. Its central artifact is a stack of precisely bevelled architectural frames. It begins as a compressed machine, opens into a spatial aperture, fans into separate planes, and resolves at the final enquiry. The same geometric vocabulary appears in chapter dividers, project framing and the interactive lab.

Visual identity: graphite/ink, soft mineral white, signal orange, brushed metal, broad directional highlights and cool rim light. Large, robust editorial sans-serif typography is paired with monospaced technical captions. No borrowed copy, branding, ring geometry, yellow system, project names or assets.

Narrative: opening promise → positioning → selected concept worlds → capabilities and service detail → interactive assembly philosophy → transparent process → enquiry → quiet typographic footer. Case-study pages deepen the work without lengthening the homepage unnecessarily. Testimonials and team content are supported by the CMS but remain unpublished until real material is supplied.

Motion: deliberate ease-out, 180–280 ms controls, 700–1000 ms reveals, scroll-linked transformations with limited damping. Native scrolling, no wheel interception, no forced preloader. The artifact renders when input changes and stops at rest. Reduced-motion mode presents an immediately legible still composition.

Engineering direction: Next.js App Router, TypeScript, server-rendered content, R3F/Three.js and GSAP; PostgreSQL in production, persistent SQLite for local development/self-hosting; a small authenticated internal content editor. No paid third-party CMS is required to operate the site.
