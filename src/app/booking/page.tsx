import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { isEventTypeId } from "@/lib/questionnaire/config";
import { todayIso } from "@/lib/questionnaire/logic";

export const metadata: Metadata = {
  title: "Давайте создадим ваше мероприятие",
  description: "Ответьте на несколько вопросов — и получите предложение по формату ведения вашего мероприятия.",
  alternates: { canonical: "/booking" },
};

type Props = { searchParams: Promise<{ type?: string | string[] }> };

export default async function BookingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const type = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  return (
    <BookingWizard
      initialType={isEventTypeId(type) ? type : undefined}
      serverToday={todayIso(process.env.APP_TIMEZONE ?? "Asia/Dushanbe")}
    />
  );
}
