import { PrismaClient } from "@prisma/client";
import { calculateRisk } from "./risk.service.js";
import { getDeadlineCountdown } from "./deadline.service.js";

const prisma = new PrismaClient();

export async function getAllCommitments(filters = {}) {
  const { status, priority, ownerId, stakeholderId, riskLevel, isUnassigned, search, sortBy } = filters;

  const where = {};

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (ownerId) where.ownerId = ownerId;
  if (stakeholderId) where.stakeholderId = stakeholderId;
  if (riskLevel) where.riskLevel = riskLevel;
  if (isUnassigned === "true" || isUnassigned === true) where.isUnassigned = true;

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } }
    ];
  }

  let orderBy = { dueDate: "asc" };
  if (sortBy === "priority") orderBy = { priority: "desc" };
  if (sortBy === "riskLevel") orderBy = { riskLevel: "desc" };
  if (sortBy === "updatedAt") orderBy = { updatedAt: "desc" };

  const commitments = await prisma.commitment.findMany({
    where,
    orderBy,
    include: {
      owner: true,
      stakeholder: true,
      evidence: true,
      history: { orderBy: { changedAt: "desc" } },
      dependencies: { include: { dependsOnPerson: true } }
    }
  });

  // Calculate live countdown & dynamic risk evaluation for current state
  return commitments.map(c => {
    const riskEval = calculateRisk(c);
    const countdown = getDeadlineCountdown(c.dueDate);
    return {
      ...c,
      riskLevel: riskEval.riskLevel,
      riskReasons: riskEval.reasons,
      countdown
    };
  });
}

export async function getCommitmentById(id) {
  const commitment = await prisma.commitment.findUnique({
    where: { id },
    include: {
      owner: true,
      stakeholder: true,
      evidence: true,
      history: { orderBy: { changedAt: "desc" } },
      dependencies: { include: { dependsOnPerson: true } }
    }
  });

  if (!commitment) return null;

  const riskEval = calculateRisk(commitment);
  const countdown = getDeadlineCountdown(commitment.dueDate);

  return {
    ...commitment,
    riskLevel: riskEval.riskLevel,
    riskReasons: riskEval.reasons,
    countdown
  };
}

export async function createCommitment(data) {
  const commitment = await prisma.commitment.create({
    data: {
      title: data.title,
      description: data.description || data.title,
      ownerId: data.ownerId || null,
      stakeholderId: data.stakeholderId || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      originalDueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: data.status || "PENDING",
      priority: data.priority || "MEDIUM",
      riskLevel: data.riskLevel || "LOW",
      ownershipStatus: data.ownerId ? "CONFIRMED" : "UNASSIGNED",
      isUnassigned: !data.ownerId,
      sourceType: data.sourceType || "MANUAL",
      sourceId: data.sourceId || "user-created",
      notes: data.notes || null
    }
  });

  await prisma.commitmentHistory.create({
    data: {
      commitmentId: commitment.id,
      changedField: "created",
      newValue: commitment.status,
      reason: "Manual task creation",
      changedBy: "Arjun Malhotra"
    }
  });

  return getCommitmentById(commitment.id);
}

export async function updateCommitment(id, patch) {
  const existing = await prisma.commitment.findUnique({ where: { id } });
  if (!existing) throw new Error("Commitment not found");

  const updatedData = { ...patch };

  if (patch.ownerId !== undefined) {
    updatedData.isUnassigned = !patch.ownerId;
    updatedData.ownershipStatus = patch.ownerId ? "CONFIRMED" : "UNASSIGNED";
  }

  if (patch.dueDate && patch.dueDate !== existing.dueDate?.toISOString()) {
    updatedData.dueDate = new Date(patch.dueDate);
  }

  const updated = await prisma.commitment.update({
    where: { id },
    data: updatedData
  });

  // Track changed fields in CommitmentHistory
  for (const key of Object.keys(patch)) {
    if (String(existing[key]) !== String(patch[key])) {
      await prisma.commitmentHistory.create({
        data: {
          commitmentId: id,
          changedField: key,
          oldValue: String(existing[key] || "none"),
          newValue: String(patch[key]),
          reason: "Manual user update",
          changedBy: "Arjun Malhotra"
        }
      });
    }
  }

  return getCommitmentById(id);
}

export async function deleteCommitment(id) {
  return prisma.commitment.delete({ where: { id } });
}
