import { PrismaClient } from "@prisma/client";
import { calculateRisk } from "./risk.service.js";
import { getDeadlineCountdown } from "./deadline.service.js";

const prisma = new PrismaClient();

export async function getDashboardOverview(evaluationDate = new Date("2026-09-23T09:00:00.000Z")) {
  const commitments = await prisma.commitment.findMany({
    include: {
      owner: true,
      stakeholder: true,
      evidence: true,
      history: { orderBy: { changedAt: "desc" }, take: 3 }
    }
  });

  const evaluated = commitments.map(c => {
    const riskEval = calculateRisk(c, evaluationDate);
    const countdown = getDeadlineCountdown(c.dueDate, evaluationDate);
    return {
      ...c,
      riskLevel: riskEval.riskLevel,
      riskReasons: riskEval.reasons,
      countdown
    };
  });

  // Summary counts
  const totalOpen = evaluated.filter(c => c.status !== "COMPLETED").length;
  const dueToday = evaluated.filter(c => c.status !== "COMPLETED" && c.dueDate && isSameDay(c.dueDate, evaluationDate)).length;
  const overdue = evaluated.filter(c => c.status !== "COMPLETED" && c.countdown.isOverdue).length;
  const atRisk = evaluated.filter(c => c.status !== "COMPLETED" && (c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL")).length;
  const waitingOnOthers = evaluated.filter(c => c.status !== "COMPLETED" && (c.status === "WAITING" || (c.owner && !c.owner.email.includes("arjun")))).length;
  const unassigned = evaluated.filter(c => c.status !== "COMPLETED" && (c.isUnassigned || c.ownershipStatus === "UNASSIGNED")).length;

  // Priority action list: top items requiring attention
  const priorityActionList = [...evaluated]
    .filter(c => c.status !== "COMPLETED")
    .sort((a, b) => {
      const riskWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const rA = riskWeight[a.riskLevel] || 1;
      const rB = riskWeight[b.riskLevel] || 1;
      if (rB !== rA) return rB - rA;
      if (a.countdown.isOverdue && !b.countdown.isOverdue) return -1;
      if (b.countdown.isOverdue && !a.countdown.isOverdue) return 1;
      return (a.dueDate ? new Date(a.dueDate).getTime() : 9999999999999) - (b.dueDate ? new Date(b.dueDate).getTime() : 9999999999999);
    })
    .slice(0, 6);

  // Upcoming meetings
  const upcomingMeetings = await prisma.calendarEvent.findMany({
    orderBy: { startTime: "asc" },
    take: 5
  });

  // Recent activity
  const recentActivity = await prisma.commitmentHistory.findMany({
    orderBy: { changedAt: "desc" },
    take: 8,
    include: { commitment: true }
  });

  return {
    dateContext: {
      currentDate: "2026-09-23T09:00:00.000Z",
      displayDate: "Wednesday, 23 September 2026",
      weekLabel: "Week 39 (21 – 25 September 2026)"
    },
    summaryCards: {
      totalOpen,
      dueToday,
      overdue,
      atRisk,
      waitingOnOthers,
      unassigned
    },
    priorityActionList,
    upcomingMeetings,
    recentActivity
  };
}

function isSameDay(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return date1.getUTCFullYear() === date2.getUTCFullYear() &&
         date1.getUTCMonth() === date2.getUTCMonth() &&
         date1.getUTCDate() === date2.getUTCDate();
}
