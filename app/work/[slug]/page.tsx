import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getContent } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";
import { RelayPreview } from "@/components/sections/ProjectCard";
import { MotionDirector } from "@/components/motion/MotionDirector";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getContent();
  const project = data.projects.find((p) => p.slug === slug && p.published);
  return project
    ? {
        title: project.title,
        description: project.description,
        alternates: { canonical: `/work/${slug}` },
        openGraph: {
          title: project.title,
          description: project.description,
          url: `/work/${slug}`,
        },
      }
    : { title: "Project not found" };
}
export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const { data } = await getContent();
  const published = data.projects.filter((p) => p.published);
  const p = published.find((p) => p.slug === slug);
  if (!p) notFound();
  const next = published[(published.indexOf(p) + 1) % published.length];
  return (
    <>
      <Header />
      <MotionDirector />
      <main id="main" className={`case-page theme-${p.theme}`}>
        <section className="case-hero section-pad">
          <Link href="/#work" className="text-button">
            <ArrowLeft size={17} /> Back to work
          </Link>
          <div className="case-heading">
            <div>
              <span className="mono">
                {p.category} / {p.year}
                {p.concept ? " / STUDIO CONCEPT" : ""}
              </span>
              <h1>{p.title}</h1>
              <p>{p.headline}</p>
            </div>
            <span className="case-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="case-image">
            {p.image ? (
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                priority
                sizes="100vw"
              />
            ) : (
              <RelayPreview />
            )}
          </div>
          <div className="case-meta">
            <div>
              <span className="mono">CLIENT</span>
              <p>{p.client}</p>
            </div>
            <div>
              <span className="mono">FOCUS</span>
              <p>{p.category}</p>
            </div>
            <div>
              <span className="mono">YEAR</span>
              <p>{p.year}</p>
            </div>
            <div>
              <span className="mono">SCOPE</span>
              <p>{p.scope.join(" / ")}</p>
            </div>
          </div>
        </section>
        <section className="case-story section-pad">
          <div className="case-story-lead" data-reveal>
            <span className="mono">THE IDEA</span>
            <h2>{p.description}</h2>
          </div>
          {[
            ["01 / THE CHALLENGE", p.challenge],
            ["02 / THE APPROACH", p.approach],
            ["03 / THE OUTCOME", p.outcome],
          ].map(([label, copy]) => (
            <div className="case-story-row" key={label} data-reveal>
              <h3 className="mono">{label}</h3>
              <p>{copy}</p>
            </div>
          ))}
          <div className="case-tech">
            <span className="mono">CREATIVE & TECHNICAL SCOPE</span>
            <div>
              {p.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          {p.concept && (
            <p className="concept-note">
              Self-initiated concept. Imagery and interface data are
              illustrative. No client endorsement or commercial results are
              implied.
            </p>
          )}
        </section>
        {next && next !== p && (
          <Link
            className="next-project section-pad"
            href={`/work/${next.slug}`}
          >
            <span className="mono">NEXT WEBSITE STORY</span>
            <span>{next.title}</span>
            <ArrowUpRight size={64} />
          </Link>
        )}
        <Contact
          location={data.contact.location}
          email={data.contact.email}
          project={p.title}
        />
      </main>
      <Footer />
    </>
  );
}
