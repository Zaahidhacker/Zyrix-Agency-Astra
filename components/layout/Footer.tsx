import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p>
          Independent minds.
          <br />
          Exceptional websites.
        </p>
        <div>
          <Link href="/#work">
            Work <ArrowUpRight size={15} />
          </Link>
          <Link href="/#expertise">
            Expertise <ArrowUpRight size={15} />
          </Link>
          <Link href="/#contact">
            Contact <ArrowUpRight size={15} />
          </Link>
        </div>
        <a href="#top" className="back-top">
          Back to top <ArrowUp size={18} />
        </a>
      </div>
      <div className="footer-brand" aria-hidden="true">
        astra<span>✳</span>
      </div>
      <div className="footer-bottom mono">
        <span>© {new Date().getFullYear()} ASTRA STUDIO</span>
        <span>DESIGNED WITH INTENT. BUILT WITH CARE.</span>
        <Link href="/privacy">Privacy & analytics</Link>
      </div>
    </footer>
  );
}
