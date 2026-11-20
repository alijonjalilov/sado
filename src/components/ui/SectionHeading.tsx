import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <span className={cn("eyebrow", align === "center" && "justify-center")}>{eyebrow}</span>
      <h2 className="mt-4 text-[2rem] font-extrabold leading-[1.05] sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-relaxed text-milk/60 md:text-lg">{text}</p>}
    </Reveal>
  );
}
