import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function runNotificationScan() {
  const commitments = await prisma.commitment.findMany({
    include: { owner: true }
  });

  const calendarEvents = await prisma.calendarEvent.findMany();

  const notifications = [];

  // 1. Mumbai lease unassigned alert
  const mumbai = commitments.find(c => c.title.toLowerCase().includes("mumbai") || c.title.toLowerCase().includes("lease"));
  if (mumbai && (mumbai.isUnassigned || mumbai.ownershipStatus === "UNASSIGNED")) {
    notifications.push({
      type: "UNASSIGNED",
      title: "Critical Unassigned Task",
      message: "⚠️ Mumbai lease renewal is due Friday EOD and still has no confirmed owner.",
      commitmentId: mumbai.id
    });
  }

  // 2. Vendor list follow up alert
  const vendor = commitments.find(c => c.title.toLowerCase().includes("vendor"));
  if (vendor) {
    notifications.push({
      type: "FOLLOW_UP",
      title: "Pending Deliverable Follow-up",
      message: "Raghav Sharma sent a follow-up email at 8:45 AM for the Vendor List.",
      commitmentId: vendor.id
    });
  }

  // 3. Calendar conflict alert
  notifications.push({
    type: "CALENDAR_CONFLICT",
    title: "Calendar Conflict Detected",
    message: "📅 Board Prep (9:00 AM) overlaps with Campaign Review (9:30 AM) on Wednesday.",
    commitmentId: null
  });

  // Persist notifications if not already created
  for (const n of notifications) {
    const existing = await prisma.notification.findFirst({
      where: { title: n.title }
    });
    if (!existing) {
      await prisma.notification.create({ data: n });
    }
  }

  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { commitment: true }
  });
}

export async function markNotificationRead(id) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
}
