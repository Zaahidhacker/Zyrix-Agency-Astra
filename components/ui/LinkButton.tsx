import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function LinkButton({
  href,
  children,
  light = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`button ${light ? "button-light" : ""} ${className}`}
    >
      <span>{children}</span>
      <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  );
}
