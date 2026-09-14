"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SiteContent, Enquiry } from "@/lib/schema";
import seed from "@/data/content.json";
type Collection = "projects" | "services" | "testimonials" | "team";
type Tab = Collection | "settings" | "enquiries";
export function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    try {
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (!r.ok) setError(d.error);
      else router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-shell">
      <Link href="/" className="wordmark">
        astra✳
      </Link>
      <form className="admin-login" onSubmit={login}>
        <span className="mono">STUDIO WORKSPACE</span>
        <h1>Behind the scenes.</h1>
        <p>Sign in to manage website content and project enquiries.</p>
        <label htmlFor="password">
          Studio password
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            maxLength={256}
          />
        </label>
        {error && (
          <p role="alert" className="admin-message error">
            {error}
          </p>
        )}
        <button className="button button-light" disabled={busy}>
          {busy ? "Signing in…" : "Enter workspace"}
        </button>
      </form>
    </main>
  );
}
function Field({
  label,
  value,
  onChange,
  multiline = false,
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`admin-field ${full ? "full" : ""}`}>
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
export function AdminPanel({
  initial,
  initialVersion,
  initialEnquiries,
  metrics,
}: {
  initial: SiteContent;
  initialVersion: number;
  initialEnquiries: Enquiry[];
  metrics: { name: string; count: number; average: number }[];
}) {
  const [data, setData] = useState(initial);
  const [version, setVersion] = useState(initialVersion);
  const [tab, setTab] = useState<Tab>("enquiries");
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  function notice(text: string, failed = false) {
    setMessage(text);
    setError(failed);
  }
  function update(
    collection: Collection,
    index: number,
    key: string,
    value: unknown,
  ) {
    setData(
      (current) =>
        ({
          ...current,
          [collection]: current[collection].map((entry, i) =>
            i === index ? { ...entry, [key]: value } : entry,
          ),
        }) as SiteContent,
    );
    setDirty(true);
  }
  function remove(collection: Collection, index: number) {
    setData(
      (current) =>
        ({
          ...current,
          [collection]: current[collection].filter((_, i) => i !== index),
        }) as SiteContent,
    );
    setDirty(true);
  }
  function add(collection: Collection) {
    const entry =
      collection === "projects"
        ? {
            ...seed.projects[0],
            slug: `new-project-${Date.now().toString(36)}`,
            title: "New project",
            published: false,
          }
        : collection === "services"
          ? {
              title: "New service",
              subtitle: "Service name",
              description:
                "Describe the service and what it helps a customer achieve.",
              deliverables: ["First deliverable"],
            }
          : collection === "testimonials"
            ? {
                quote: "Add an approved client quote.",
                name: "Client name",
                role: "Role and organization",
              }
            : {
                name: "Team member",
                role: "Role",
                bio: "Introduce this team member.",
              };
    setData(
      (current) =>
        ({
          ...current,
          [collection]: [...current[collection], entry],
        }) as SiteContent,
    );
    setDirty(true);
  }
  async function save() {
    setBusy(true);
    notice("");
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, version }),
      });
      const result = await response.json();
      if (!response.ok) {
        notice(result.error, true);
        return;
      }
      setVersion(result.version);
      setDirty(false);
      notice("Published. Your website now uses the updated content.");
      router.refresh();
    } catch {
      notice(
        "Connection interrupted. Your unsaved edits are still here.",
        true,
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (
      dirty &&
      !window.confirm("You have unpublished edits. Sign out without saving?")
    )
      return;
    await fetch("/api/session", { method: "DELETE" });
    router.refresh();
  }
  async function status(id: string, status: string) {
    try {
      const r = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok) throw new Error();
      setEnquiries((current) =>
        current.map((e) =>
          e.id === id ? { ...e, status: status as Enquiry["status"] } : e,
        ),
      );
      notice("Enquiry updated.");
    } catch {
      notice("Could not update this enquiry. Please try again.", true);
    }
  }
  async function deleteEnquiry(id: string) {
    if (
      !window.confirm(
        "Permanently delete this enquiry and its contact information? This cannot be undone.",
      )
    )
      return;
    try {
      const r = await fetch("/api/enquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) throw new Error();
      setEnquiries((current) => current.filter((e) => e.id !== id));
      notice("Enquiry permanently deleted.");
    } catch {
      notice("Could not delete the enquiry.", true);
    }
  }
  async function upload(index: number, file: File) {
    setBusy(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const r = await fetch("/api/media", { method: "POST", body });
      const result = await r.json();
      if (!r.ok) {
        notice(result.error, true);
        return;
      }
      update("projects", index, "image", result.url);
      notice("Image uploaded. Publish your changes to use it on the website.");
    } catch {
      notice("Image upload failed. Please try again.", true);
    } finally {
      setBusy(false);
    }
  }
  const tabs: Tab[] = [
    "enquiries",
    "projects",
    "services",
    "testimonials",
    "team",
    "settings",
  ];
  return (
    <main className="admin-shell">
      <div className="admin-top">
        <h1>Astra / Studio workspace</h1>
        <div>
          <Link href="/" target="_blank">
            View website ↗
          </Link>
          <button className="text-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
      <div
        className="admin-tabs"
        role="tablist"
        aria-label="Workspace sections"
      >
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            id={`tab-${t}`}
            onClick={() => {
              setTab(t);
              notice("");
            }}
          >
            {t[0].toUpperCase() + t.slice(1)}
            {t === "enquiries"
              ? ` (${enquiries.filter((e) => e.status === "new").length})`
              : ""}
          </button>
        ))}
      </div>
      {message && (
        <p
          className={`admin-message ${error ? "error" : ""}`}
          role={error ? "alert" : "status"}
        >
          {message}
        </p>
      )}
      <section
        className="admin-editor"
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
      >
        {tab === "enquiries" ? (
          <>
            <h2>Project enquiries</h2>
            <p className="admin-description">
              The most recent 200 enquiries. Update their status as you follow
              up. Contact details stay in this authenticated workspace.
            </p>
            {metrics.length > 0 && (
              <div className="metric-grid">
                {metrics.map((m) => (
                  <div key={m.name}>
                    <span>{m.name} / AVERAGE</span>
                    <strong>
                      {m.name === "CLS"
                        ? m.average.toFixed(3)
                        : `${Math.round(m.average)} ms`}
                    </strong>
                    <span>
                      {m.count} opt-in measurements in the last 30 days
                    </span>
                  </div>
                ))}
              </div>
            )}
            {!enquiries.length ? (
              <p className="admin-message">
                No enquiries yet. New submissions will appear here.
              </p>
            ) : (
              <div className="enquiry-list">
                {enquiries.map((e) => (
                  <article key={e.id} className="enquiry-card">
                    <div className="enquiry-head">
                      <div>
                        <h3>{e.name}</h3>
                        <a href={`mailto:${e.email}`}>{e.email}</a>
                      </div>
                      <select
                        aria-label={`Status for ${e.name}`}
                        value={e.status}
                        onChange={(event) =>
                          void status(e.id, event.target.value)
                        }
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <p className="mono">
                      {e.service} / {e.budget} / {e.timeline}
                      <br />
                      {new Date(e.createdAt)
                        .toISOString()
                        .replace("T", " ")
                        .slice(0, 16)}{" "}
                      UTC
                    </p>
                    <p style={{ whiteSpace: "pre-wrap" }}>{e.message}</p>
                    <button
                      className="admin-remove"
                      onClick={() => void deleteEnquiry(e.id)}
                    >
                      Delete personal data
                    </button>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : tab === "settings" ? (
          <>
            <h2>Website settings</h2>
            <p className="admin-description">
              Page-level project metadata is generated from each project. The
              canonical domain is set by SITE_URL on your hosting provider.
            </p>
            <Field
              label="Homepage SEO title"
              value={data.seo.title}
              onChange={(v) => {
                setData({ ...data, seo: { ...data.seo, title: v } });
                setDirty(true);
              }}
            />
            <Field
              label="Homepage SEO description"
              multiline
              value={data.seo.description}
              onChange={(v) => {
                setData({ ...data, seo: { ...data.seo, description: v } });
                setDirty(true);
              }}
            />
            <Field
              label="Public enquiry email (optional)"
              value={data.contact.email}
              onChange={(v) => {
                setData({ ...data, contact: { ...data.contact, email: v } });
                setDirty(true);
              }}
            />
            <Field
              label="Studio location / working style"
              value={data.contact.location}
              onChange={(v) => {
                setData({ ...data, contact: { ...data.contact, location: v } });
                setDirty(true);
              }}
            />
          </>
        ) : (
          <>
            <h2>{tab[0].toUpperCase() + tab.slice(1)}</h2>
            <p className="admin-description">
              Edit the fields below, then publish. Lists accept one item per
              line. Only add real client quotes and accurate team details.
              Initial projects are labeled concepts.
            </p>
            {tab === "projects"
              ? data.projects.map((p, i) => (
                  <details key={i} className="admin-entry" open={i === 0}>
                    <summary>
                      {p.title}
                      {!p.published ? " · Draft" : ""}
                    </summary>
                    <div className="admin-entry-body admin-fields">
                      {(
                        [
                          "title",
                          "slug",
                          "category",
                          "client",
                          "year",
                          "headline",
                        ] as const
                      ).map((k) => (
                        <Field
                          key={k}
                          label={k[0].toUpperCase() + k.slice(1)}
                          value={p[k]}
                          onChange={(v) => update("projects", i, k, v)}
                        />
                      ))}
                      {(
                        [
                          "description",
                          "challenge",
                          "approach",
                          "outcome",
                        ] as const
                      ).map((k) => (
                        <Field
                          key={k}
                          label={k[0].toUpperCase() + k.slice(1)}
                          value={p[k]}
                          multiline
                          full
                          onChange={(v) => update("projects", i, k, v)}
                        />
                      ))}
                      <Field
                        label="Technologies / one per line"
                        value={p.technologies.join("\n")}
                        multiline
                        onChange={(v) =>
                          update("projects", i, "technologies", v.split("\n"))
                        }
                      />
                      <Field
                        label="Scope / one per line"
                        value={p.scope.join("\n")}
                        multiline
                        onChange={(v) =>
                          update("projects", i, "scope", v.split("\n"))
                        }
                      />
                      <label className="admin-field">
                        Visual theme
                        <select
                          value={p.theme}
                          onChange={(e) =>
                            update("projects", i, "theme", e.target.value)
                          }
                        >
                          <option value="mineral">Mineral / dark text</option>
                          <option value="architectural">
                            Architectural / light text
                          </option>
                          <option value="electric">Electric / interface</option>
                        </select>
                      </label>
                      <label className="admin-field">
                        Image
                        <select
                          value={
                            p.image.startsWith("/media/") ? "custom" : p.image
                          }
                          onChange={(e) => {
                            if (e.target.value !== "custom")
                              update("projects", i, "image", e.target.value);
                          }}
                        >
                          <option value="/images/forma.webp">
                            Forma product image
                          </option>
                          <option value="/images/monument.webp">
                            Monument architecture image
                          </option>
                          <option value="">Relay interface preview</option>
                          {p.image.startsWith("/media/") && (
                            <option value="custom">Uploaded image</option>
                          )}
                        </select>
                      </label>
                      <label className="admin-field">
                        Upload project image (JPEG, PNG, WebP, max 4 MB)
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={busy}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void upload(i, f);
                          }}
                        />
                      </label>
                      <Field
                        label="Image description / alt text"
                        value={p.imageAlt}
                        onChange={(v) => update("projects", i, "imageAlt", v)}
                      />
                      <label className="admin-field check">
                        <input
                          type="checkbox"
                          checked={p.concept}
                          onChange={(e) =>
                            update("projects", i, "concept", e.target.checked)
                          }
                        />
                        Self-initiated concept
                      </label>
                      <label className="admin-field check">
                        <input
                          type="checkbox"
                          checked={p.published}
                          onChange={(e) =>
                            update("projects", i, "published", e.target.checked)
                          }
                        />
                        Published
                      </label>
                      <button
                        className="admin-remove"
                        onClick={() => remove("projects", i)}
                      >
                        Remove from draft
                      </button>
                    </div>
                  </details>
                ))
              : tab === "services"
                ? data.services.map((s, i) => (
                    <details className="admin-entry" key={i} open={i === 0}>
                      <summary>{s.subtitle}</summary>
                      <div className="admin-entry-body">
                        <Field
                          label="Service name"
                          value={s.subtitle}
                          onChange={(v) => update("services", i, "subtitle", v)}
                        />
                        <Field
                          label="Headline"
                          value={s.title}
                          onChange={(v) => update("services", i, "title", v)}
                        />
                        <Field
                          label="Description"
                          multiline
                          value={s.description}
                          onChange={(v) =>
                            update("services", i, "description", v)
                          }
                        />
                        <Field
                          label="Deliverables / one per line"
                          multiline
                          value={s.deliverables.join("\n")}
                          onChange={(v) =>
                            update("services", i, "deliverables", v.split("\n"))
                          }
                        />
                        <button
                          className="admin-remove"
                          onClick={() => remove("services", i)}
                        >
                          Remove from draft
                        </button>
                      </div>
                    </details>
                  ))
                : tab === "testimonials"
                  ? data.testimonials.map((t, i) => (
                      <div className="admin-entry" key={i}>
                        <Field
                          label="Approved quote"
                          multiline
                          value={t.quote}
                          onChange={(v) =>
                            update("testimonials", i, "quote", v)
                          }
                        />
                        <Field
                          label="Name"
                          value={t.name}
                          onChange={(v) => update("testimonials", i, "name", v)}
                        />
                        <Field
                          label="Role and company"
                          value={t.role}
                          onChange={(v) => update("testimonials", i, "role", v)}
                        />
                        <button
                          className="admin-remove"
                          onClick={() => remove("testimonials", i)}
                        >
                          Remove from draft
                        </button>
                      </div>
                    ))
                  : data.team.map((t, i) => (
                      <div className="admin-entry" key={i}>
                        <Field
                          label="Name"
                          value={t.name}
                          onChange={(v) => update("team", i, "name", v)}
                        />
                        <Field
                          label="Role"
                          value={t.role}
                          onChange={(v) => update("team", i, "role", v)}
                        />
                        <Field
                          label="Bio"
                          multiline
                          value={t.bio}
                          onChange={(v) => update("team", i, "bio", v)}
                        />
                        <button
                          className="admin-remove"
                          onClick={() => remove("team", i)}
                        >
                          Remove from draft
                        </button>
                      </div>
                    ))}
            <button className="text-button" onClick={() => add(tab)}>
              + Add{" "}
              {tab === "projects"
                ? "project"
                : tab === "services"
                  ? "service"
                  : tab === "team"
                    ? "team member"
                    : "testimonial"}
            </button>
          </>
        )}
      </section>
      {tab !== "enquiries" && (
        <div className="admin-action-row">
          <button
            className="admin-save"
            onClick={() => void save()}
            disabled={busy || !dirty}
          >
            {busy
              ? "Saving…"
              : dirty
                ? "Publish changes"
                : "All changes published"}
          </button>
          <span className="mono">VERSION {version}</span>
        </div>
      )}
    </main>
  );
}
