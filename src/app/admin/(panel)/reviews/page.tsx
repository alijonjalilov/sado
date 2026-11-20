import { ReviewManager } from "@/components/admin/ReviewManager";
import { prisma } from "@/lib/prisma";
import { formatDateRu } from "@/lib/utils";

export default async function ReviewsAdminPage() {
  const reviews = await prisma.review.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Отзывы</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Отзывы клиентов</h1>
        <p className="mt-3 max-w-2xl text-sm text-milk/50">
          Отзывы, оставленные на сайте, попадают сюда на модерацию. Опубликованные отзывы появляются на главной странице в течение 5 минут. Можно добавить отзыв вручную — например, перенести из Instagram.
        </p>
      </header>
      <ReviewManager
        reviews={reviews.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          eventLabel: r.eventLabel,
          text: r.text,
          rating: r.rating,
          photoUrl: r.photoUrl,
          status: r.status,
          createdAt: formatDateRu(r.createdAt, true),
        }))}
      />
    </div>
  );
}
