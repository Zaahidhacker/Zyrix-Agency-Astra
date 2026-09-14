import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsChoice } from "@/components/ui/AnalyticsChoice";
export const metadata: Metadata = {
  title: "Privacy & analytics",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <>
      <Header />
      <main id="main" className="legal-page section-pad">
        <span className="mono">ZYRIX / YOUR INFORMATION</span>
        <h1>
          Privacy,
          <br />
          in plain language.
        </h1>
        <h2>When you contact us</h2>
        <p>
          We store the name, email address and project details you submit so we
          can review your enquiry and respond. Your enquiry is available only to
          the authenticated website administrator. We do not sell enquiry data
          or use it for advertising.
        </p>
        <h2>Storage and your choices</h2>
        <p>
          Enquiries remain in the studio’s database until the administrator
          removes them. You can request access, correction or deletion through
          the contact form, using the email address associated with your
          enquiry. Please avoid sending passwords, payment details or other
          sensitive information.
        </p>
        <h2>Essential storage</h2>
        <p>
          The admin area uses a secure session cookie when an administrator
          signs in. Public visitors do not need an account. Short-lived, hashed
          request identifiers help limit spam and repeated login attempts.
        </p>
        <h2>Optional performance measurement</h2>
        <p>
          With your choice below, we collect page-level loading, layout
          stability and interaction timing (LCP, CLS and INP). These
          measurements do not contain your name, email, enquiry, query string or
          a persistent visitor ID. Measurements are retained for 30 days. We
          respect the browser’s Do Not Track signal.
        </p>
        <AnalyticsChoice />
        <h2>Your analytics preference</h2>
        <p>
          Your choice is saved in this browser’s local storage. You can change
          it here at any time or clear it in your browser settings.
        </p>
      </main>
      <Footer />
    </>
  );
}
