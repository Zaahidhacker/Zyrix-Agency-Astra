import { LinkButton } from "@/components/ui/LinkButton";
export default function NotFound() {
  return (
    <main className="error-page">
      <span className="mono">404 / OUTSIDE THE FRAME</span>
      <h1>
        This page
        <br />
        isn’t here.
      </h1>
      <p>Let’s get you back to something worth exploring.</p>
      <LinkButton href="/" light>
        Back to Astra
      </LinkButton>
    </main>
  );
}
