import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllSources(req, res, next) {
  try {
    const emails = await prisma.emailThread.findMany({ include: { emails: true } });
    const meetings = await prisma.meeting.findMany();
    const voiceNotes = await prisma.voiceNote.findMany();
    const calendarEvents = await prisma.calendarEvent.findMany();
    const evidence = await prisma.sourceEvidence.findMany({ include: { commitment: true } });

    res.json({
      data: {
        emails,
        meetings,
        voiceNotes,
        calendarEvents,
        evidenceCount: evidence.length
      }
    });
  } catch (error) {
    next(error);
  }
}
