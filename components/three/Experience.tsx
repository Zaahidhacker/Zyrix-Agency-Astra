"use client";
import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { storyState as state } from "./story-state";
const Scene = dynamic(() => import("./Scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function Experience() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let disposed = false;
    let disposeScroll = () => {};
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 760px)");
    state.reduced = reduced.matches;
    state.mobile = mobile.matches;
    const cn = navigator as Navigator & { connection?: { saveData?: boolean } };
    const probe = document.createElement("canvas");
    let supported = false;
    try {
      const gl = probe.getContext("webgl2");
      supported = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {}
    if (wrapper.current)
      wrapper.current.dataset.renderer = supported ? "webgl" : "css-3d";
    const timer = window.setTimeout(
      () => setEnabled(supported && !cn.connection?.saveData),
      80,
    );
    const sync = (
      chapter: typeof state.chapter,
      rawProgress: number,
      el: HTMLElement,
    ) => {
      const progress = reduced.matches ? 0.35 : rawProgress;
      state.visible = true;
      state.reduced = reduced.matches;
      state.mobile = mobile.matches;
      state.chapter = chapter;
      state.progress = Math.max(0, Math.min(1, progress));
      const anchor = el.querySelector<HTMLElement>(
        chapter === "unfold"
          ? ".unfold-artifact-anchor"
          : ".hero-artifact-anchor",
      );
      if (anchor) {
        const a = anchor.getBoundingClientRect();
        state.targetY = 0.5 - (a.top + a.height / 2) / innerHeight;
      }
      if (wrapper.current) {
        wrapper.current.style.opacity = "1";
        wrapper.current.dataset.chapter = state.chapter;
        const spread =
          state.chapter === "unfold"
            ? state.progress
            : state.progress * 0.7 + 0.18;
        wrapper.current.style.setProperty("--assembly-spread", String(spread));
        wrapper.current.style.setProperty(
          "--assembly-y",
          state.mobile ? `${(0.5 - state.targetY) * 100}%` : "50%",
        );
        wrapper.current.style.setProperty(
          "--assembly-x",
          state.mobile
            ? "50%"
            : state.chapter === "owner"
              ? "22%"
              : state.chapter === "contact"
                ? "50%"
                : state.chapter === "work"
                  ? `${73 - state.progress * 46}%`
                  : "73%",
        );
        wrapper.current.style.setProperty(
          "--pointer-x",
          `${state.reduced ? 0 : state.pointerX * 6}deg`,
        );
        wrapper.current.style.setProperty(
          "--pointer-y",
          `${state.reduced ? 0 : state.pointerY * 5}deg`,
        );
      }
      state.revision++;
      window.dispatchEvent(new Event("zyrix:frame"));
    };
    const pointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || state.reduced) return;
      state.pointerX = (e.clientX / innerWidth - 0.5) * 2;
      state.pointerY = (e.clientY / innerHeight - 0.5) * 2;
      const section = document.getElementById(state.chapter);
      if (section) sync(state.chapter, state.progress, section);
    };
    const resize = () => {
      state.mobile = mobile.matches;
      const section = document.getElementById(state.chapter);
      if (section) sync(state.chapter, state.progress, section);
    };
    async function initScroll() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const triggers = [
        "hero",
        "unfold",
        "pricing",
        "work",
        "owner",
        "contact",
      ].flatMap((id) => {
        const el = document.getElementById(id);
        if (!el) return [];
        const chapter = id as typeof state.chapter;
        return [
          ScrollTrigger.create({
            trigger: el,
            start: id === "hero" ? "top top" : "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (self.isActive) sync(chapter, self.progress, el);
            },
            onUpdate: (self) => {
              if (self.isActive) sync(chapter, self.progress, el);
            },
          }),
        ];
      });
      const hero = document.getElementById("hero");
      if (hero) sync("hero", 0, hero);
      ScrollTrigger.refresh();
      disposeScroll = () => triggers.forEach((trigger) => trigger.kill());
    }
    void initScroll();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    reduced.addEventListener("change", resize);
    mobile.addEventListener("change", resize);
    return () => {
      disposed = true;
      disposeScroll();
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      reduced.removeEventListener("change", resize);
      mobile.removeEventListener("change", resize);
    };
  }, []);
  return (
    <div ref={wrapper} className="experience" aria-hidden="true">
      <div className="assembly-fallback">
        <div className="assembly-core">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="assembly-plane"
              style={{ "--i": i } as CSSProperties}
            />
          ))}
        </div>
      </div>
      {enabled && (
        <SceneBoundary>
          <Scene />
        </SceneBoundary>
      )}
    </div>
  );
}
