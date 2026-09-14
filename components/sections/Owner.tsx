import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function Owner() {
  return (
    <section id="owner" className="owner section-pad">
      <div className="owner-layout">
        <div className="owner-copy" data-reveal>
          <span className="mono">FOUNDER &amp; OWNER</span>
          <h2>
            Zaahid
            <br />
            Zaman.
          </h2>
          <p>Direct access to the person responsible for your website.</p>
          <a className="owner-phone" href="tel:+94720551707">
            +94 72 055 1707 <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="owner-portrait">
          <Image
            src="/images/zaahid-zaman.webp"
            alt="Zaahid Zaman, founder and owner of Zyrix"
            fill
            sizes="(max-width: 760px) 100vw, 48vw"
          />
        </div>
      </div>
    </section>
  );
}
