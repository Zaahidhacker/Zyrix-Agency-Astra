import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

const packages = [
  {
    name: "Launch",
    market: "LKR 50,000",
    price: "LKR 25,000",
    note: "For a focused landing page",
    items: [
      "1 custom page",
      "Mobile responsive",
      "Basic SEO",
      "Contact integration",
    ],
  },
  {
    name: "Business",
    market: "LKR 85,000",
    price: "LKR 42,500",
    note: "For a complete company website",
    items: [
      "Up to 10 pages",
      "Custom design",
      "CMS included",
      "Analytics setup",
    ],
    featured: true,
  },
  {
    name: "Commerce",
    market: "LKR 185,000",
    price: "LKR 92,500",
    note: "For selling products online",
    items: [
      "Up to 100 products",
      "Payment gateway",
      "Stock management",
      "Training included",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="pricing section-pad">
      <div className="pricing-heading" data-reveal>
        <h2>
          Half the rate.
          <br />
          Not half the quality.
        </h2>
        <p>
          Comparable local packages start at LKR 50,000. Zyrix starts at LKR
          25,000.
        </p>
      </div>
      <div className="pricing-story">
        <aside
          className="price-ratio"
          aria-label="Zyrix charges half the typical market rate"
        >
          <strong>½</strong>
          <span>
            THE COST.
            <br />
            FULL ATTENTION.
          </span>
        </aside>
        <div className="pricing-stack">
          {packages.map((item) => (
            <article
              className={item.featured ? "price-card featured" : "price-card"}
              key={item.name}
            >
              <div className="price-top">
                <span className="mono">{item.name}</span>
                {item.featured && (
                  <span className="price-badge mono">MOST POPULAR</span>
                )}
              </div>
              <p className="market-price">
                Typical market <s>{item.market}</s>
              </p>
              <strong>{item.price}</strong>
              <p className="price-note">{item.note}</p>
              <ul>
                {item.items.map((feature) => (
                  <li key={feature}>
                    <Check size={15} /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/#contact" className="price-link">
                Choose {item.name} <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </div>
      <details className="price-method">
        <summary>How we compare prices</summary>
        <p>
          Compared with published Sri Lankan package rates checked in September
          2026. Final scope is agreed before work begins. Hosting, domains and
          paid third-party services are separate. See published examples for
          <a
            href="https://www.webivox.lk/web-design-prices/"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            websites
          </a>{" "}
          and
          <a
            href="https://www.app-dev.lk/pricing"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            e-commerce
          </a>
          .
        </p>
      </details>
    </section>
  );
}
