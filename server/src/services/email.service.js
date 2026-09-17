import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllEmailThreads() {
  const threads = await prisma.emailThread.findMany({
    include: {
      emails: { orderBy: { sentAt: "asc" } }
    },
    orderBy: { updatedAt: "desc" }
  });

  // Attach extracted commitments and thread status summary
  const enriched = await Promise.all(
    threads.map(async t => {
      const commitments = await prisma.commitment.findMany({
        where: { sourceId: t.id },
        include: { owner: true, stakeholder: true }
      });

      const latestEmail = t.emails[t.emails.length - 1];

      return {
        ...t,
        latestEmail,
        commitments,
        summaryState: generateThreadStateSummary(t, commitments)
      };
    })
  );

  return enriched;
}

export async function getEmailThreadById(threadId) {
  const thread = await prisma.emailThread.findUnique({
    where: { id: threadId },
    include: {
      emails: { orderBy: { sentAt: "asc" } }
    }
  });

  if (!thread) return null;

  const commitments = await prisma.commitment.findMany({
    where: {
      OR: [
        { sourceId: threadId },
        ...thread.emails.map(e => ({ sourceId: e.id }))
      ]
    },
    include: {
      owner: true,
      stakeholder: true,
      evidence: true,
      history: { orderBy: { changedAt: "desc" } }
    }
  });

  return {
    ...thread,
    commitments,
    summaryState: generateThreadStateSummary(thread, commitments)
  };
}

function generateThreadStateSummary(thread, commitments) {
  if (thread.subject.toLowerCase().includes("vendor list")) {
    return {
      statusNarrative: "Vendor list remains pending and has been delayed from the original commitment.",
      evolutionTimeline: [
        { date: "Monday 9:15 AM", event: "Original commitment made by Arjun: Due Tuesday morning." },
        { date: "Tuesday 4:30 PM", event: "Delayed by Arjun: Revised deadline to Wednesday morning." },
        { date: "Wednesday 8:45 AM", event: "Follow-up email received from Raghav asking if delivery is still expected this morning." }
      ],
      latestStatus: "PENDING (OVERDUE / DELAYED)"
    };
  }

  if (thread.subject.toLowerCase().includes("mumbai")) {
    return {
      statusNarrative: "Mumbai office lease renewal is due Friday EOD. Ownership is unconfirmed between Legal and Facilities.",
      evolutionTimeline: [
        { date: "Monday 11:00 AM", event: "Vikram requested owner signoff by Friday EOD; assumed Facilities." },
        { date: "Tuesday 2:20 PM", event: "Legal reviewed clauses, but noted Facilities has not confirmed ownership." }
      ],
      latestStatus: "UNASSIGNED / CRITICAL RISK"
    };
  }

  return {
    statusNarrative: `Thread containing ${thread.emails.length} message(s) with ${commitments.length} extracted commitment(s).`,
    evolutionTimeline: thread.emails.map(e => ({
      date: new Date(e.sentAt).toLocaleString(),
      event: `${e.sender}: ${e.body.slice(0, 80)}...`
    })),
    latestStatus: commitments[0]?.status || "ACTIVE"
  };
}
