import { events } from "@/lib/data";
import { notFound } from "next/navigation";
import EventDetailClientPage from "./event-detail-client-page";

export async function generateStaticParams() {
  return events.map((event) => ({
    eventId: event.id,
  }));
}

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const event = events.find((e) => e.id === params.eventId);

  if (!event) {
    notFound();
  }

  return <EventDetailClientPage event={event} />;
}
