import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateEventForm } from "@/components/events/CreateEventForm";
export default async function CreateEventPage() { const { userId } = await auth(); if (!userId) redirect("/sign-in"); return <main className="mx-auto max-w-3xl px-4 py-8"><CreateEventForm /></main>; }
