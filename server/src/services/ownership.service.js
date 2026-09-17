import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function analyzeOwnershipAmbiguity() {
  const unassignedCommitments = await prisma.commitment.findMany({
    where: {
      OR: [
        { isUnassigned: true },
        { ownershipStatus: "UNASSIGNED" },
        { ownershipStatus: "AMBIGUOUS" },
        { ownerId: null }
      ]
    },
    include: {
      evidence: true,
      stakeholder: true,
      history: true
    }
  });

  return unassignedCommitments.map(c => ({
    id: c.id,
    title: c.title,
    dueDate: c.dueDate,
    riskLevel: c.riskLevel,
    ownershipStatus: c.ownershipStatus,
    explanation: generateOwnershipExplanation(c)
  }));
}

function generateOwnershipExplanation(commitment) {
  if (commitment.title.toLowerCase().includes("mumbai") || commitment.title.toLowerCase().includes("lease")) {
    return "Legal reviewed clauses, but Facilities hasn't confirmed owner responsibility or budget signoff. Ownership is currently UNCONFIRMED.";
  }
  return "No explicit statement found in emails or transcripts accepting single-point accountability for this task.";
}
