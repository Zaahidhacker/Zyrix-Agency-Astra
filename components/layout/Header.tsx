"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, X } from "lucide-react";
const links = [
  ["Work", "/#work"],
  ["Expertise", "/#expertise"],
  ["Studio", "/#studio"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <Link href="/" aria-label="Astra home" className="wordmark">
          astra
          <span className="brand-star" aria-hidden="true">
            ✳
          </span>
        </Link>
        <span className="header-note mono">
          INDEPENDENT
          <br />
          WEB STUDIO
        </span>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, url]) => (
            <Link href={url} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/#contact">
          Let’s talk <ArrowUpRight size={17} />
        </Link>
        <button
          className="menu-toggle"
          ref={trigger}
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <Plus size={22} />
        </button>
      </header>
      <dialog
        ref={dialog}
        className="nav-dialog"
        onCancel={close}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="nav-dialog-inner">
          <div className="nav-top">
            <span className="wordmark">astra✳</span>
            <button
              onClick={close}
              className="icon-button"
              aria-label="Close navigation"
            >
              <X />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {[...links, ["Start a project", "/#contact"]].map(
              ([label, url], i) => (
                <Link key={label} href={url} onClick={close}>
                  <span className="mono">0{i + 1}</span>
                  {label}
                  <ArrowUpRight />
                </Link>
              ),
            )}
          </nav>
          <p className="mono">GOOD WEBSITES START WITH A CONVERSATION.</p>
        </div>
      </dialog>
    </>
  );
}
