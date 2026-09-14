"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function Metrics() {
  const path = usePathname();
  useEffect(() => {
    let disposed = false;
    let started = false;
    const start = async () => {
      if (
        started ||
        localStorage.getItem("astra-analytics") !== "yes" ||
        navigator.doNotTrack === "1"
      )
        return;
      const { onCLS, onINP, onLCP } = await import("web-vitals");
      if (disposed) return;
      started = true;
      const send = ({ name, value }: { name: string; value: number }) => {
        if (disposed || localStorage.getItem("astra-analytics") !== "yes")
          return;
        void fetch("/api/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, value, route: path }),
          keepalive: true,
        }).catch(() => {});
      };
      onCLS(send);
      onINP(send);
      onLCP(send);
    };
    void start();
    window.addEventListener("astra:analytics", start);
    return () => {
      disposed = true;
      window.removeEventListener("astra:analytics", start);
    };
  }, [path]);
  return null;
}
