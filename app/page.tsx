import type { Metadata } from "next";
import { getContent, siteUrl } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LinkButton } from "@/components/ui/LinkButton";
import { Experience } from "@/components/three/Experience";
import { MotionDirector } from "@/components/motion/MotionDirector";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Contact } from "@/components/sections/Contact";
import { Pricing } from "@/components/sections/Pricing";
import { Owner } from "@/components/sections/Owner";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getContent();
  return {
    title: { absolute: data.seo.title },
    description: data.seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: "/",
    },
  };
}
export default async function Home() {
  const { data } = await getContent();
  const projects = data.projects.filter((p) => p.published).slice(0, 2);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zyrix",
    url: siteUrl(),
    description: data.seo.description,
    ...(data.contact.email ? { email: data.contact.email } : {}),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <Experience />
      <MotionDirector />
      <main id="main">
        <section id="hero" className="hero section-pad">
          <div className="hero-kicker mono">
            <span>SRI LANKAN WEBSITE DESIGN &amp; DEVELOPMENT</span>
          </div>
          <div className="hero-content">
            <h1 aria-label="Better websites. Half the price.">
              <span className="line-mask">
                <span data-hero-line>BETTER WEBSITES.</span>
              </span>
              <span className="line-mask">
                <span data-hero-line>
                  HALF THE <em>PRICE.</em>
                </span>
              </span>
            </h1>
            <div className="hero-intro">
              <p>
                Premium websites at exactly half typical Sri Lankan agency
                rates.
              </p>
              <LinkButton href="#pricing" light>
                See pricing
              </LinkButton>
            </div>
          </div>
          <div className="hero-artifact-anchor" aria-hidden="true" />
        </section>
        <section id="unfold" className="unfold">
          <div className="unfold-sticky section-pad">
            <div className="unfold-copy">
              <h2>
                Every detail
                <br />
                moves together.
              </h2>
              <p>Strategy, design and code. One continuous build.</p>
            </div>
            <div className="unfold-artifact-anchor" aria-hidden="true" />
          </div>
        </section>
        <Pricing />
        <section id="work" className="work section-pad">
          <div className="section-heading work-heading" data-reveal>
            <h2>Work made to be remembered.</h2>
          </div>
          <div className="work-list">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
          <div className="work-outro">
            <p>Your business deserves its own direction.</p>
            <LinkButton href="#contact">Make the next one yours</LinkButton>
          </div>
        </section>
        <Owner />
        {data.testimonials.length > 0 && (
          <section className="testimonials section-pad">
            <span className="mono">IN THEIR WORDS</span>
            {data.testimonials.map((t) => (
              <figure key={t.name}>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  {t.name} | {t.role}
                </figcaption>
              </figure>
            ))}
          </section>
        )}
        {data.team.length > 0 && (
          <section className="team section-pad">
            <h2>The people behind the work.</h2>
            {data.team.map((t) => (
              <article key={t.name}>
                <h3>{t.name}</h3>
                <span className="mono">{t.role}</span>
                <p>{t.bio}</p>
              </article>
            ))}
          </section>
        )}
        <Contact location={data.contact.location} email={data.contact.email} />
      </main>
      <Footer />
    </>
  );
}
