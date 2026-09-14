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
    let sections: { el: HTMLElement; chapter: typeof state.chapter }[] = [];
    const measure = () => {
      sections = ["hero", "unfold", "statement", "lab", "contact"].flatMap(
        (id) => {
          const el = document.getElementById(id);
          return el ? [{ el, chapter: id as typeof state.chapter }] : [];
        },
      );
      state.mobile = mobile.matches;
      update();
    };
    const update = () => {
      const center = innerHeight * 0.5;
      const match = sections.find(({ el }) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= center && rect.bottom >= center;
      });
      state.visible = !!match;
      state.reduced = reduced.matches;
      if (match) {
        const rect = match.el.getBoundingClientRect();
        state.chapter = match.chapter;
        const anchor = match.el.querySelector<HTMLElement>(
          match.chapter === "lab"
            ? ".lab-spatial"
            : match.chapter === "unfold"
              ? ".unfold-artifact-anchor"
              : ".hero-artifact-anchor",
        );
        if (anchor) {
          const a = anchor.getBoundingClientRect();
          state.targetY = 0.5 - (a.top + a.height / 2) / innerHeight;
        }
        state.progress = Math.max(
          0,
          Math.min(
            1,
            -rect.top /
              Math.max(
                match.chapter === "unfold"
                  ? rect.height - innerHeight
                  : rect.height,
                1,
              ),
          ),
        );
      }
      if (wrapper.current) {
        wrapper.current.style.opacity = state.visible ? "1" : "0";
        wrapper.current.dataset.chapter = state.chapter;
        const spread =
          state.chapter === "lab"
            ? state.assembly
            : state.chapter === "unfold"
              ? state.progress
              : state.progress * 0.7 + 0.18;
        wrapper.current.style.setProperty("--assembly-spread", String(spread));
        wrapper.current.style.setProperty(
          "--assembly-y",
          state.mobile ? `${(0.5 - state.targetY) * 100}%` : "50%",
        );
        wrapper.current.style.setProperty(
          "--assembly-x",
          state.mobile ? "50%" : state.chapter === "lab" ? "27%" : "73%",
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
    };
    const pointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || state.reduced) return;
      state.pointerX = (e.clientX / innerWidth - 0.5) * 2;
      state.pointerY = (e.clientY / innerHeight - 0.5) * 2;
      update();
    };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    reduced.addEventListener("change", update);
    window.addEventListener("astra:assembly", update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", pointer);
      reduced.removeEventListener("change", update);
      window.removeEventListener("astra:assembly", update);
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
