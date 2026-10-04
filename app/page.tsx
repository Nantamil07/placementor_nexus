import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Briefcase,
  Users,
  GraduationCap,
  MessageSquare,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { isOnboarded: true },
    });

    if (!profile || !profile.isOnboarded) {
      redirect("/setup-profile");
    }

    redirect("/feed");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Public Landing Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Placementor <span className="text-primary">Nexus</span>
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_30%_at_50%_20%,hsl(var(--primary)/0.12),transparent)]" />
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              The Next-Gen Campus Placement & Career Ecosystem
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Connect. Learn. Get Placed with{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                Nexus
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Combining Reddit-style campus community feeds, LinkedIn-style alumni networking,
              verified college placement drives, 1-on-1 mentorship, and peer referrals into one unified platform.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/sign-up"
                className="w-full rounded-xl bg-primary px-6 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 sm:w-auto"
              >
                Join Your Campus Network
              </Link>
              <Link
                href="/sign-in"
                className="w-full rounded-xl border bg-card px-6 py-3.5 text-center text-sm font-semibold text-foreground shadow-xs transition hover:bg-muted sm:w-auto"
              >
                Sign In to Your Account
              </Link>
            </div>
          </div>
        </section>

        {/* Core Pillars Feature Grid */}
        <section className="border-t bg-muted/20 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Everything You Need For Campus Career Success
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Built specifically for college students, alumni mentors, recruiters, and placement cells.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">Interactive Campus Feed</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Share interview experiences, ask for resume reviews, upvote helpful insights, and engage in campus discussions.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">Alumni & Peer Network</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Connect with batchmates and seniors across top tech firms, request connection invites, and chat 1-on-1.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">Placement Drives & Jobs</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Browse verified campus hiring drives and off-campus internships with one-click applications.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">1-on-1 Mentorship</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Book mock interviews, system design guidance, and career planning sessions with experienced mentors.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">Referral Exchange</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Directly request job referrals from alumni working at target companies with your resume and portfolio.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">Placement Cell Management</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Placement officers and admins can manage drives, track student selections, verify recruiters, and moderate.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="border-t bg-card px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
        <p>© {new Date().getFullYear()} Placementor Nexus. All rights reserved.</p>
      </footer>
    </div>
  );
}
