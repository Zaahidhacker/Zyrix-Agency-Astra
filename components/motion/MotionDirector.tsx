"use client";
import { useEffect } from "react";
export function MotionDirector() {
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    async function init() {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from("[data-hero-line]", {
          yPercent: 105,
          opacity: 0,
          duration: 1.05,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) =>
          gsap.fromTo(
            el,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          ),
        );
      });
      cleanup = () => ctx.revert();
    }
    void init();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  return null;
}
