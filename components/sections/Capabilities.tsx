import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
export function Capabilities({
  services,
}: {
  services: SiteContent["services"];
}) {
  return (
    <section id="expertise" className="capabilities section-pad">
      <div className="section-kicker mono">
        <span>02 / WHAT WE DO</span>
        <span>FROM FIRST IDEA TO LIVE WEBSITE</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2>
          More than a look.
          <br />
          <span className="muted">A way forward.</span>
        </h2>
        <p>
          We make websites that express who you are,
          <br className="desktop-only" /> help people find what they need,
          <br className="desktop-only" /> and give your business room to grow.
        </p>
      </div>
      <div className="service-list">
        {services.map((service, i) => (
          <details key={service.subtitle} className="service" open={i === 0}>
            <summary>
              <span className="mono">0{i + 1}</span>
              <h3>{service.subtitle}</h3>
              <Plus className="service-plus" size={27} />
            </summary>
            <div className="service-body">
              <div>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <Link href="/#contact" className="text-button">
                  Discuss your website <ArrowUpRight size={16} />
                </Link>
              </div>
              <ul>
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
