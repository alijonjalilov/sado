import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** Знак: стилизованный микрофон-«V» в бордовом круге + словесный знак. */
export function Logo({ className, href = "/", light = false }: { className?: string; href?: string; light?: boolean }) {
  return (
    <Link href={href} className={cn("group inline-flex shrink-0 items-center gap-3", className)} aria-label={`${site.brand} — на главную`}>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-white shadow-gold transition duration-300 ease-spring group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 5l7 14 7-14" />
          <circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={cn("block text-[15px] font-black italic tracking-[0.08em]", light ? "text-white" : "text-milk")}>{site.brand}</span>
        <span className={cn("mt-1 block text-[9px] font-bold uppercase tracking-[0.24em]", light ? "text-white/60" : "text-milk/45")}>{site.role}</span>
      </span>
    </Link>
  );
}
