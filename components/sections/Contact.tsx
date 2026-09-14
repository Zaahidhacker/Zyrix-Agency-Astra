import { ContactForm } from "./ContactForm";
export function Contact({
  email,
  project,
  location,
}: {
  email?: string;
  project?: string;
  location?: string;
}) {
  return (
    <section id="contact" className="contact section-pad">
      <div className="contact-layout">
        <div className="contact-copy" data-reveal>
          <span className="eyebrow">START WITH A CONVERSATION</span>
          <h2>
            Your next
            <br />
            website.
            <br />
            <em>Built better.</em>
          </h2>
          <p>Tell us what your website needs to do.</p>
          {email && (
            <a className="contact-email" href={`mailto:${email}`}>
              {email} ↗
            </a>
          )}
          <a className="contact-email" href="tel:+94720551707">
            +94 72 055 1707 ↗
          </a>
          <div className="contact-note mono">
            WEBSITES / E-COMMERCE / WEB APPS
            <br />
            {location || "Sri Lanka / +94 72 055 1707"}
          </div>
        </div>
        <ContactForm project={project} />
      </div>
    </section>
  );
}
