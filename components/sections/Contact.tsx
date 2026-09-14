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
      <div className="section-kicker mono">
        <span>05 / YOUR NEXT CHAPTER</span>
        <span>LET’S BUILD SOMETHING THAT MATTERS.</span>
      </div>
      <div className="contact-layout">
        <div className="contact-copy" data-reveal>
          <span className="eyebrow">
            <span className="availability-dot" /> START WITH A CONVERSATION
          </span>
          <h2>
            Your next
            <br />
            website.
            <br />
            <span className="serif">Our next obsession.</span>
          </h2>
          <p>
            Tell us where you want to go.
            <br />
            We’ll work out how your website can get you there.
          </p>
          {email && (
            <a className="contact-email" href={`mailto:${email}`}>
              {email} ↗
            </a>
          )}
          <div className="contact-note mono">
            WEBSITES / E-COMMERCE / WEB APPS
            <br />
            {location || "Independent studio. Working worldwide."}
          </div>
        </div>
        <ContactForm project={project} />
      </div>
    </section>
  );
}
