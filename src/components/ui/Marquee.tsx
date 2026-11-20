import { cn } from "@/lib/utils";

/** Бегущая строка. Контент дублируется, чтобы прокрутка была бесконечной. */
export function Marquee({
  items,
  className,
  itemClassName,
  reverse = false,
  fast = false,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  reverse?: boolean;
  fast?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden>
      <div
        className={cn("flex w-max items-center", fast ? "animate-marquee-fast" : "animate-marquee")}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row.map((t, i) => (
          <span key={i} className={cn("flex shrink-0 items-center gap-6 px-3", itemClassName)}>
            {t}
            <span className="h-2 w-2 rounded-full bg-champagne" />
          </span>
        ))}
      </div>
    </div>
  );
}
