import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UsernameForm } from "@/components/profile/UsernameForm";

export default async function SetupProfilePage() {
  const session = await requireAuth();

  const existingProfile = await prisma.profile.findUnique({
    where: { clerkId: session.userId },
    select: { isOnboarded: true },
  });

  if (existingProfile?.isOnboarded) {
    redirect("/feed");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-xl rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Complete Your Nexus Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Claim your username and set your academic credentials to unlock campus placement & networking tools.
          </p>
        </div>
        <UsernameForm />
      </div>
    </div>
  );
}
