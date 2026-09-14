import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getContent, siteUrl } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LinkButton } from "@/components/ui/LinkButton";
import { Experience } from "@/components/three/Experience";
import { MotionDirector } from "@/components/motion/MotionDirector";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Capabilities } from "@/components/sections/Capabilities";
import { AssemblyLab } from "@/components/sections/AssemblyLab";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
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
  const projects = data.projects.filter((p) => p.published);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Astra",
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
            <span>
              <i /> INDEPENDENT WEBSITE DESIGN & DEVELOPMENT
            </span>
            <span className="hero-coordinate">STUDIO 001 / WORLDWIDE</span>
          </div>
          <div className="hero-content">
            <h1 aria-label="Websites. Built to move you.">
              <span className="line-mask">
                <span data-hero-line>WEBSITES.</span>
              </span>
              <span className="line-mask">
                <span data-hero-line>BUILT TO</span>
              </span>
              <span className="line-mask">
                <span data-hero-line>
                  MOVE <em>YOU.</em>
                </span>
              </span>
            </h1>
            <div className="hero-intro">
              <p>
                We turn ambitious businesses into
                <br />
                unforgettable websites.
              </p>
              <LinkButton href="#work" light>
                Explore our work
              </LinkButton>
            </div>
          </div>
          <div className="hero-artifact-anchor" aria-hidden="true" />
          <div className="artifact-caption mono">
            <span className="crosshair">+</span>
            <span>
              THE ASSEMBLY
              <br />
              STRATEGY × DESIGN × DEVELOPMENT
            </span>
            <span>001—∞</span>
          </div>
          <div className="hero-bottom">
            <a href="#unfold" className="scroll-cue mono">
              <ArrowDown size={17} />
              <span>SCROLL TO UNFOLD</span>
            </a>
            <p>
              Beautiful to experience.
              <br />
              Built to do business.
            </p>
            <span className="mono hero-end">
              A LITTLE DIFFERENT.
              <br />
              BY DESIGN.
            </span>
          </div>
        </section>
        <section id="unfold" className="unfold">
          <div className="unfold-sticky section-pad">
            <span className="mono">THE ASSEMBLY / FROM IDEA TO EXPERIENCE</span>
            <div className="unfold-copy">
              <h2>
                Every part.
                <br />
                <span className="serif">Working as one.</span>
              </h2>
              <p>
                Clear strategy. Distinctive design.
                <br />
                Development that brings it all together.
              </p>
            </div>
            <div className="unfold-artifact-anchor" aria-hidden="true" />
            <div className="unfold-foot mono">
              <span>01 / STRATEGY</span>
              <span>02 / DESIGN</span>
              <span>03 / DEVELOPMENT</span>
            </div>
          </div>
        </section>
        <section id="statement" className="statement section-pad">
          <div className="section-kicker mono">
            <span>THE THINKING BEHIND THE MAKING</span>
            <span>ASTRA / AT A GLANCE</span>
          </div>
          <div className="statement-layout">
            <span className="statement-mark" aria-hidden="true">
              ↗
            </span>
            <div>
              <h2 data-reveal>
                A website should
                <br />
                do more than
                <br />
                <span className="serif">just look the part.</span>
              </h2>
              <div className="statement-bottom" data-reveal>
                <p>
                  It should tell your story. Earn trust. Make the next step feel
                  natural. We connect thoughtful design with precise development
                  to make every part work harder.
                </p>
                <a className="text-button" href="#expertise">
                  Meet your website team <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </div>
          <div className="discipline-bar mono">
            <span>STRATEGY WITH DIRECTION</span>
            <span>DESIGN WITH CHARACTER</span>
            <span>CODE WITH PURPOSE</span>
          </div>
        </section>
        <section id="work" className="work section-pad">
          <div className="section-kicker mono">
            <span>01 / SELECTED DIRECTIONS</span>
            <span>WEBSITE DESIGN IN PRACTICE</span>
          </div>
          <div className="section-heading work-heading" data-reveal>
            <h2>
              Different worlds.
              <br />
              <span className="serif">Same obsession.</span>
            </h2>
            <div>
              <p>A glimpse into the websites we imagine, design and build.</p>
              <span className="mono work-disclosure">
                SELF-INITIATED STUDIO CONCEPTS /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="work-list">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
          <div className="work-outro">
            <p>
              Your business has its own story.
              <br />
              Let’s give it a website to match.
            </p>
            <LinkButton href="#contact">Make the next one yours</LinkButton>
          </div>
        </section>
        <Capabilities services={data.services} />
        <AssemblyLab />
        <Process />
        {data.testimonials.length > 0 && (
          <section className="testimonials section-pad">
            <span className="mono">IN THEIR WORDS</span>
            {data.testimonials.map((t) => (
              <figure key={t.name}>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  {t.name} — {t.role}
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
