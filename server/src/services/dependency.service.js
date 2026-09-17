import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDependencyTracking() {
  const arjun = await prisma.person.findFirst({
    where: { email: { contains: "arjun" } }
  });

  const arjunId = arjun ? arjun.id : "person-arjun";

  // 1. My Commitments (Arjun -> Others)
  const myCommitments = await prisma.commitment.findMany({
    where: { ownerId: arjunId },
    include: { stakeholder: true, evidence: true }
  });

  // 2. Waiting On Others (Others -> Arjun)
  const waitingOnOthers = await prisma.commitment.findMany({
    where: {
      OR: [
        { stakeholderId: arjunId, NOT: { ownerId: arjunId } },
        { status: "WAITING" }
      ]
    },
    include: { owner: true, evidence: true }
  });

  const dependencies = await prisma.taskDependency.findMany({
    include: {
      commitment: true,
      dependsOnPerson: true
    }
  });

  return {
    myCommitments: myCommitments.map(c => ({
      id: c.id,
      title: c.title,
      stakeholder: c.stakeholder?.name || "Stakeholder",
      dueDate: c.dueDate,
      status: c.status,
      riskLevel: c.riskLevel
    })),
    waitingOnOthers: waitingOnOthers.map(c => ({
      id: c.id,
      title: c.title,
      owner: c.owner?.name || "External Owner",
      dueDate: c.dueDate,
      status: c.status,
      riskLevel: c.riskLevel
    })),
    rawDependencies: dependencies
  };
}
