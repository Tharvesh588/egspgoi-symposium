
import { events } from "@/lib/data";
import { notFound } from "next/navigation";
import EventDetailPage from "@/app/admin/events/[eventId]/event-detail-page";

export async function generateStaticParams() {
  return events.map((event) => ({
    eventId: event.id,
  }));
}

export default function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
  const event = events.find((e) => e.id === params.eventId);

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} />;
}
