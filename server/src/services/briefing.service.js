import { PrismaClient } from "@prisma/client";
import { generateBriefingSummary } from "./openai.service.js";

const prisma = new PrismaClient();

export async function generateExecutiveBriefing() {
  const commitments = await prisma.commitment.findMany({
    include: { owner: true, stakeholder: true, evidence: true }
  });

  const meetings = await prisma.calendarEvent.findMany({
    orderBy: { startTime: "asc" }
  });

  const context = {
    date: "Wednesday, 23 September 2026",
    commitments,
    meetings
  };

  const briefing = await generateBriefingSummary(context);
  return briefing;
}
