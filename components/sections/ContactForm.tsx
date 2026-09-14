"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createRequestId } from "@/lib/request-id";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
export function ContactForm({ project }: { project?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string[]>>({});
  const [reference, setReference] = useState("");
  const [requestId, setRequestId] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFields({});
    setBusy(true);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const id = requestId || createRequestId();
      setRequestId(id);
      const response = await fetch("/api/enquiries", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent: data.consent === "on",
          requestId: id,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        setFields(result.fields || {});
        requestAnimationFrame(() =>
          document.getElementById("form-error")?.focus(),
        );
        return;
      }
      setReference(result.reference);
      requestAnimationFrame(() =>
        document.getElementById("form-success")?.focus(),
      );
    } catch {
      setError(
        "Your connection was interrupted. Please try again; your enquiry won’t be duplicated.",
      );
    } finally {
      setBusy(false);
    }
  }
  function fieldError(name: string) {
    return fields[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {fields[name][0]}
      </span>
    ) : null;
  }
  if (reference)
    return (
      <div
        className="form-success"
        id="form-success"
        tabIndex={-1}
        role="status"
      >
        <Check size={36} />
        <span className="mono">ENQUIRY RECEIVED / {reference}</span>
        <h3>A good beginning.</h3>
        <p>
          Your brief is safely with us. We’ll review your website goals and
          reply to the email you provided.
        </p>
        <button
          className="text-button"
          onClick={() => {
            setReference("");
            setRequestId("");
          }}
        >
          Send another enquiry <ArrowUpRight size={17} />
        </button>
      </div>
    );
  return (
    <form
      method="post"
      action="/api/enquiries"
      onSubmit={submit}
      className="contact-form"
    >
      <div className="form-row">
        <label htmlFor="name">
          Your name <span>*</span>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Alex Morgan"
            aria-invalid={!!fields.name}
            aria-describedby={fields.name ? "name-error" : undefined}
          />
          {fieldError("name")}
        </label>
        <label htmlFor="email">
          Email address <span>*</span>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="alex@yourcompany.com"
            aria-invalid={!!fields.email}
            aria-describedby={fields.email ? "email-error" : undefined}
          />
          {fieldError("email")}
        </label>
      </div>
      <label htmlFor="service">
        What can we build for you? <span>*</span>
        <select id="service" name="service" required defaultValue="">
          <option value="" disabled>
            Select your project
          </option>
          {[
            "Website design & development",
            "Website redesign",
            "E-commerce",
            "Web application",
            "Not sure yet",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        {fieldError("service")}
      </label>
      <div className="form-row">
        <label htmlFor="budget">
          Investment range <span>*</span>
          <select id="budget" name="budget" required defaultValue="">
            <option value="" disabled>
              Select a range (USD)
            </option>
            {[
              "Under $3,000",
              "$3,000–$10,000",
              "$10,000–$25,000",
              "$25,000+",
              "Let’s discuss",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label htmlFor="timeline">
          Your timeline <span>*</span>
          <select id="timeline" name="timeline" required defaultValue="">
            <option value="" disabled>
              When are you thinking?
            </option>
            {[
              "As soon as possible",
              "1–3 months",
              "3–6 months",
              "Exploring",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <label htmlFor="message">
        A little about your idea <span>*</span>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          rows={3}
          placeholder="Your business, your goals, and what you’d love your website to do."
          defaultValue={
            project
              ? `I’d like to discuss a website with a direction similar to ${project}. `
              : ""
          }
          aria-invalid={!!fields.message}
          aria-describedby={fields.message ? "message-error" : undefined}
        />
        {fieldError("message")}
      </label>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">
          Leave this blank
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree to the <Link href="/privacy">privacy notice</Link> so Astra
          can respond to this enquiry.
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert" id="form-error" tabIndex={-1}>
          {error}
        </p>
      )}
      <button
        className="button button-light submit"
        disabled={busy}
        type="submit"
      >
        <span>{busy ? "Sending your brief…" : "Let’s make it happen"}</span>
        {busy ? (
          <LoaderCircle className="spinner" size={18} />
        ) : (
          <ArrowUpRight size={19} />
        )}
      </button>
      <p className="form-footnote">
        A conversation first. A clear scope before anything starts.
      </p>
    </form>
  );
}
