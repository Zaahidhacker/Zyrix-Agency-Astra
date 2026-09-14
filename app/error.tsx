"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <span className="mono">A MOMENTARY INTERRUPTION</span>
      <h1>
        Let’s try
        <br />
        that again.
      </h1>
      <p>
        We couldn’t load this page. Your browser is fine; please try again
        shortly.
      </p>
      <button className="button button-light" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
