"use client";

import { useState, useTransition } from "react";
import { requestMentorship } from "@/services/mentor/request-mentorship";

interface Mentor {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  skills: {
    id: string;
    name: string;
  }[];
}

interface Mentorship {
  id: string;
  topic: string;
  status: string;
  createdAt: Date;
  mentor: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };
  mentee: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };
}

export default function MentorshipClient({
  mentors,
  mentorships,
}: {
  mentors: Mentor[];
  mentorships: Mentorship[];
}) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitRequest() {
    if (!selectedMentor) return;

    setMessage("");

    startTransition(async () => {
      const result = await requestMentorship(
        selectedMentor.id,
        topic,
      );

      if (result.success) {
        setMessage("Mentorship request sent successfully.");
        setTopic("");
        setSelectedMentor(null);
      } else {
        setMessage(result.error ?? "Unable to send request.");
      }
    });
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Mentorship</h1>

        <p className="mt-2 text-zinc-400">
          Connect with experienced mentors and get guidance for your career.
        </p>

        {message && (
          <div className="mt-6 rounded-lg border p-4 text-sm text-zinc-300">
            {message}
          </div>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Available Mentors</h2>

          {mentors.length === 0 ? (
            <div className="mt-4 rounded-xl border p-6 text-zinc-400">
              No mentors are currently available.
            </div>
          ) : (
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="rounded-xl border p-5"
                >
                  <div>
                    <h3 className="font-semibold">
                      {mentor.fullName}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      @{mentor.username}
                    </p>

                    {mentor.headline && (
                      <p className="mt-3 text-sm text-zinc-300">
                        {mentor.headline}
                      </p>
                    )}

                    {mentor.bio && (
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                        {mentor.bio}
                      </p>
                    )}
                  </div>

                  {mentor.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {mentor.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setMessage("");
                    }}
                    className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Request Mentorship
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">
            My Mentorships
          </h2>

          {mentorships.length === 0 ? (
            <div className="mt-4 rounded-xl border p-6 text-zinc-400">
              You don't have any mentorship requests yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {mentorships.map((session) => (
                <div
                  key={session.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">
                        {session.topic}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        Mentor: {session.mentor.fullName}
                      </p>
                    </div>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs">
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">
              <h2 className="text-xl font-semibold">
                Request mentorship
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Requesting mentorship from{" "}
                <span className="font-medium text-zinc-200">
                  {selectedMentor.fullName}
                </span>
              </p>

              <textarea
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="What would you like guidance with?"
                maxLength={300}
                rows={5}
                className="mt-5 w-full rounded-lg border bg-transparent p-3 text-sm outline-none focus:border-blue-500"
              />

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isPending || !topic.trim()}
                  onClick={submitRequest}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isPending ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
