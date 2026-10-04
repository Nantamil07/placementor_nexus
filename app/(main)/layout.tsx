import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MainNavbar } from "@/components/layout/MainNavbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: session.userId },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      isOnboarded: true,
    },
  });

  if (!profile || !profile.isOnboarded) {
    redirect("/setup-profile");
  }

  const unreadCount = await prisma.notification.count({
    where: {
      recipientId: profile.id,
      isRead: false,
    },
  });

  return (
    <div className="min-h-screen bg-muted/20">
      <MainNavbar
        currentProfile={{
          id: profile.id,
          username: profile.username,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          role: profile.role,
        }}
        unreadNotificationsCount={unreadCount}
      />
      <div className="w-full">{children}</div>
    </div>
  );
}
