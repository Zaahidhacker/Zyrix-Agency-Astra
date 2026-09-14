# Astra / The Assembly

A website design and development agency. The primary promise is **“Websites. Built to move you.”** The visual experience supports a clear business proposition: distinctive websites, online stores and custom web applications.

## Identity

| Token                  | Value / rule                                            |
| ---------------------- | ------------------------------------------------------- |
| Ink                    | `#101112`                                               |
| Mineral paper          | `#eeefe9`                                               |
| Soft white             | `#f4f4ee`                                               |
| Signal orange          | `#ff5a35`                                               |
| Display                | Barlow Condensed 600, self-hosted Latin WOFF2           |
| Body                   | Manrope variable 200–800, self-hosted Latin WOFF2       |
| Technical labels       | IBM Plex Mono 400, self-hosted, not preloaded           |
| Editorial counterpoint | System Georgia italic; no extra font download           |
| Gutter                 | 24–88 px fluid; 20 px on very narrow screens            |
| Content width          | 1,600 px maximum effective content span                 |
| Spacing rhythm         | 8 / 16 / 24 / 32 / 48 / 64 / 80 / 112                   |
| Borders                | 1 px; 19% white on dark, 20% ink on light               |
| Corners                | Square interface edges; circular project-entry controls |
| Breakpoints            | 380 / 760 / 1100 / 1600 px                              |
| Buttons                | Clear rectangular targets, 48–58 px minimum height      |

## Motion and depth

- Global ease: `cubic-bezier(.22,1,.36,1)`; GSAP `power3.out` for entrances.
- Control feedback: 180–350 ms. Text reveal: 1.05 s with 120 ms stagger. Section reveals: 850 ms, once.
- Native browser scrolling and normal anchors. No wheel interception, no mandatory loading gate.
- Images use modest 3% scroll translation, with reserved aspect ratios.
- Hero typography sits over a persistent scene; light editorial chapters intentionally occlude it. The same assembly reappears in the studio philosophy interaction.
- The assembly uses ten bevelled square frames on desktop and seven on mobile. These are procedural meshes, not borrowed models or textures.
- Brushed metal: high metalness, controlled roughness, thin clearcoat. Orange edge frames define the structure. Large neutral reflection cards and a cool rim light describe the planes.
- Scroll changes rotation, spread, camera distance and material response. Pointer position adds a restrained light-touch perspective response. The lab slider explicitly controls separation.
- Demand rendering runs for a bounded settling interval after input. Hidden sections and background documents stop scheduling frames. DPR caps at 1.6 / 1.25, with a reduction to 1 when initial active-frame timing is slow.
- Reduced motion renders a still composition and removes animated reveals, parallax and smoothing. Data-saving or unsupported-WebGL devices retain semantic content and a matching perspective-based CSS 3D assembly fallback.

## Mobile composition

The headline and primary action precede a reserved artifact area. The 3D position follows that area’s actual document position rather than remaining behind the text. Projects become full-width editorial panels. Service details stack. Process steps use two columns, then one on narrow screens. The final form uses native touch-friendly controls with 16 px input text. A native dialog supplies focus containment and Escape dismissal for the mobile menu.

## Original assets

`public/images/forma.webp` and `public/images/monument.webp` were generated with the built-in image generator for this project and compressed to 89 KB and 134 KB. The original briefs requested: (1) a brushed-aluminum over-ear headphone with terracotta woven pads on a mineral-grey studio surface; (2) an original brutalist concrete museum-like structure with a warm vertical aperture at dusk. Both excluded branding, interface chrome and watermarks. They are illustrative studio-concept assets, not actual clients or buildings. The Relay example is a code-native sample interface with explicitly illustrative data.

A dedicated 180svh desktop / 160svh mobile sticky chapter opens the assembly as the visitor scrolls. The CSS 3D fallback shares the same scroll and pointer state as the Three.js scene, preserving the concept on devices without WebGL.
