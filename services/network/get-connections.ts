import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ConnectionStatus = "NONE" | "PENDING" | "ACCEPTED";

export interface NetworkUser {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  headline: string | null;
  role: string;
  mutualCount: number;
}

export interface ConnectionRequestItem {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
  sender: NetworkUser;
}

const globalForNetwork = globalThis as unknown as {
  nexusConnectionRequests: ConnectionRequestItem[] | undefined;
  nexusFollows: Set<string> | undefined;
};

export const defaultSuggestions: NetworkUser[] = [
  {
    id: "sugg_1",
    fullName: "Rohan Varma",
    username: "rohan_v",
    avatarUrl: null,
    headline: "Placement Representative | Final Year ECE",
    role: "STUDENT",
    mutualCount: 14,
  },
  {
    id: "sugg_2",
    fullName: "Priya Sundar",
    username: "priya_s",
    avatarUrl: null,
    headline: "Incoming SDE @ Microsoft | Alumni 2025",
    role: "ALUMNI",
    mutualCount: 22,
  },
  {
    id: "sugg_3",
    fullName: "Siddharth Nair",
    username: "sid_recruiter",
    avatarUrl: null,
    headline: "University Talent Acquisition Lead @ Atlassian",
    role: "RECRUITER",
    mutualCount: 8,
  },
];

export const connectionRequestsStore: ConnectionRequestItem[] =
  globalForNetwork.nexusConnectionRequests ?? [
    {
      id: "req_seed_1",
      senderId: "seed_student_2",
      receiverId: "current_user",
      status: "PENDING",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      sender: {
        id: "seed_student_2",
        fullName: "Ananya Iyer",
        username: "ananya_ai",
        avatarUrl: null,
        headline: "Research Intern in NLP | Senior CSE",
        role: "STUDENT",
        mutualCount: 19,
      },
    },
  ];

export const followsStore: Set<string> =
  globalForNetwork.nexusFollows ?? new Set<string>();

if (!globalForNetwork.nexusConnectionRequests) {
  globalForNetwork.nexusConnectionRequests = connectionRequestsStore;
}
if (!globalForNetwork.nexusFollows) {
  globalForNetwork.nexusFollows = followsStore;
}

export async function getNetworkData() {
  const { userId } = await auth();

  const profile = userId
    ? await prisma.profile.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      })
    : null;

  const currentProfileId = profile?.id ?? "current_user";

  const pendingRequests = connectionRequestsStore.filter(
    (req) => (req.receiverId === currentProfileId || req.receiverId === "current_user") && req.status === "PENDING"
  );

  const accepted = connectionRequestsStore
    .filter((req) => req.status === "ACCEPTED")
    .map((req) => req.sender);

  return {
    pendingRequests,
    connections: accepted,
    suggestions: defaultSuggestions,
  };
}
