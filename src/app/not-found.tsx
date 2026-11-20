import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <Logo />
        <p className="mt-12 text-[7rem] font-black italic leading-none text-gold-gradient md:text-[10rem]">404</p>
        <p className="mt-4 text-lg text-milk/60">Такой страницы нет — но праздник ещё впереди.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-outline">
            На главную
          </Link>
          <Link href="/booking" className="btn-gold">
            Оставить заявку
          </Link>
        </div>
      </div>
    </main>
  );
}
