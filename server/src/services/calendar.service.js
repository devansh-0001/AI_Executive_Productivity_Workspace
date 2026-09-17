import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCalendarEvents() {
  const events = await prisma.calendarEvent.findMany({
    orderBy: { startTime: "asc" }
  });

  const conflicts = detectCalendarConflicts(events);

  const enrichedEvents = await Promise.all(
    events.map(async evt => {
      const isConflicting = conflicts.some(c => c.eventA.id === evt.id || c.eventB.id === evt.id);

      // Find linked commitments
      const linkedCommitments = await prisma.commitment.findMany({
        where: {
          OR: [
            { sourceId: evt.id },
            { title: { contains: evt.title.split(" ")[0] } }
          ]
        }
      });

      return {
        ...evt,
        isConflicting,
        linkedCommitments
      };
    })
  );

  return {
    events: enrichedEvents,
    conflicts
  };
}

export function detectCalendarConflicts(events) {
  const conflicts = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];

      const startA = new Date(a.startTime).getTime();
      const endA = new Date(a.endTime).getTime();
      const startB = new Date(b.startTime).getTime();
      const endB = new Date(b.endTime).getTime();

      // Check for overlap: startA < endB && startB < endA
      if (startA < endB && startB < endA) {
        const overlapStart = Math.max(startA, startB);
        const overlapEnd = Math.min(endA, endB);
        const overlapMinutes = Math.round((overlapEnd - overlapStart) / (1000 * 60));

        conflicts.push({
          id: `conflict-${a.id}-${b.id}`,
          eventA: a,
          eventB: b,
          overlapMinutes,
          message: `Calendar Conflict: "${a.title}" overlaps with "${b.title}" by ${overlapMinutes} minutes.`
        });
      }
    }
  }

  return conflicts;
}
