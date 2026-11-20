import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3", className)} aria-label={`${site.brand} — на главную`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-full border border-gold/50 transition group-hover:border-gold">
        <span className="font-serif text-lg italic leading-none text-gold-gradient">V</span>
      </span>
      <span className="font-serif text-xl font-semibold tracking-[0.28em] text-milk">{site.brand}</span>
    </Link>
  );
}
