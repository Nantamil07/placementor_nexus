import CreateEventForm from "@/components/events/CreateEventForm";

export const dynamic = "force-dynamic";

export default function CreateEventPage() {
  return (
    <main className="mx-auto w-full max-w-3xl p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Create an event</h1>
        <p className="mt-1 text-zinc-400">New events are submitted for admin approval before appearing publicly.</p>
      </div>
      <CreateEventForm />
    </main>
  );
}
