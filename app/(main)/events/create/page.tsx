import Link from "next/link";
import CreateEventForm from "@/components/events/CreateEventForm";

export const dynamic = "force-dynamic";

export default function CreateEventPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to all events
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Create an event</h1>
        <p className="mt-1 text-xs text-muted-foreground">New events are submitted for admin approval before appearing publicly.</p>
      </div>
      <CreateEventForm />
    </main>
  );
}
