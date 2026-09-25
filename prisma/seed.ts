import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const skillsData = [
    "TypeScript",
    "Next.js",
    "React",
    "PostgreSQL",
    "Prisma",
    "Tailwind CSS",
    "Node.js",
    "System Design",
  ];

  const skillRecords = await Promise.all(
    skillsData.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  await prisma.profile.upsert({
    where: { clerkId: "seed_student_clerk_id" },
    update: {},
    create: {
      clerkId: "seed_student_clerk_id",
      email: "student.demo@nexus.edu",
      username: "alex_student",
      fullName: "Alex Rivera",
      headline: "CS Senior | Incoming SWE Intern",
      bio: "Passionate about full-stack development, distributed systems, and campus mentorship.",
      role: UserRole.STUDENT,
      isOnboarded: true,
      skills: {
        connect: skillRecords.slice(0, 4).map((s) => ({ id: s.id })),
      },
      education: {
        create: [
          {
            institution: "Nexus Institute of Technology",
            degree: "Bachelor of Technology",
            fieldOfStudy: "Computer Science and Engineering",
            startDate: new Date("2023-08-01"),
            endDate: new Date("2027-05-30"),
            grade: "8.9 CGPA",
          },
        ],
      },
      projects: {
        create: [
          {
            title: "Placementor Nexus Core",
            description: "Collaborative campus placement and professional networking hub.",
            repoUrl: "https://github.com/placementor/nexus",
            liveUrl: "https://placementor-nexus.internal",
            startDate: new Date("2026-01-10"),
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
