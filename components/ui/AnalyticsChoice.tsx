"use client";
import { useState } from "react";
export function AnalyticsChoice() {
  const [message, setMessage] = useState(
    "Optional analytics are off unless you enable them.",
  );
  function choose(value: string) {
    localStorage.setItem("astra-analytics", value);
    window.dispatchEvent(new Event("astra:analytics"));
    setMessage(
      value === "yes"
        ? "Anonymous performance measurement is enabled."
        : "Optional analytics are disabled.",
    );
  }
  return (
    <div className="analytics-choice">
      <p role="status">{message}</p>
      <button className="button button-light" onClick={() => choose("yes")}>
        Enable performance analytics
      </button>
      <button className="text-button" onClick={() => choose("no")}>
        Keep analytics off
      </button>
    </div>
  );
}
