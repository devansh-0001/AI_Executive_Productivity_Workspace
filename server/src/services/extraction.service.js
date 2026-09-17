import { PrismaClient } from "@prisma/client";
import { extractCommitmentsFromText } from "./openai.service.js";
import { resolveRelativeDate } from "./deadline.service.js";
import { calculateRisk } from "./risk.service.js";

const prisma = new PrismaClient();

export async function processSourceExtraction({ sourceType, sourceId, title, content }) {
  // 1. Get raw extractions from AI / fallback
  const rawExtractions = await extractCommitmentsFromText({
    sourceType,
    sourceId,
    title,
    content
  });

  const people = await prisma.person.findMany();
  const calendarEvents = await prisma.calendarEvent.findMany();

  const processed = [];

  for (const item of rawExtractions) {
    // Resolve owner and stakeholder to Person IDs
    const owner = findPersonByName(item.ownerName, people);
    const stakeholder = findPersonByName(item.stakeholderName, people);

    // Resolve relative date to absolute ISO date
    const dueDate = resolveRelativeDate(item.rawDueDate, new Date("2026-09-21T09:00:00.000Z"), calendarEvents);
    
    // Determine initial ownership status
    let ownershipStatus = item.ownershipStatus || "CONFIRMED";
    if (!owner) {
      ownershipStatus = "UNASSIGNED";
    }

    // Check for existing matching commitment to prevent duplicate records
    const existing = await findDuplicateCommitment({
      title: item.title,
      ownerId: owner ? owner.id : null,
      stakeholderId: stakeholder ? stakeholder.id : null,
      sourceId
    });

    const isUnassigned = ownershipStatus === "UNASSIGNED" || !owner;
    
    // Initial risk check
    const riskEval = calculateRisk({
      status: item.status,
      ownershipStatus,
      isUnassigned,
      dueDate,
      priority: item.priority
    });

    let commitment;

    if (existing) {
      // Update existing commitment
      commitment = await prisma.commitment.update({
        where: { id: existing.id },
        data: {
          dueDate: dueDate || existing.dueDate,
          status: item.status || existing.status,
          riskLevel: riskEval.riskLevel,
          ownershipStatus,
          isUnassigned,
          updatedAt: new Date()
        }
      });

      // Record update history
      await prisma.commitmentHistory.create({
        data: {
          commitmentId: commitment.id,
          changedField: "status/dueDate",
          oldValue: existing.status,
          newValue: `${commitment.status} (Due: ${dueDate ? dueDate.toISOString() : "none"})`,
          reason: `Re-extracted from ${sourceType}: ${title}`,
          changedBy: "AI Extraction Engine"
        }
      });
    } else {
      // Create new commitment
      commitment = await prisma.commitment.create({
        data: {
          title: item.title,
          description: item.description || item.title,
          ownerId: owner ? owner.id : null,
          stakeholderId: stakeholder ? stakeholder.id : null,
          dueDate,
          originalDueDate: dueDate,
          status: item.status || (isUnassigned ? "UNASSIGNED" : "PENDING"),
          priority: item.priority || "MEDIUM",
          riskLevel: riskEval.riskLevel,
          confidence: item.confidence || 0.9,
          ownershipStatus,
          isUnassigned,
          sourceType,
          sourceId,
          notes: item.rawDueDate ? `Original raw deadline expression: "${item.rawDueDate}"` : null
        }
      });

      // Record creation history
      await prisma.commitmentHistory.create({
        data: {
          commitmentId: commitment.id,
          changedField: "created",
          oldValue: null,
          newValue: commitment.status,
          reason: `Initial extraction from ${sourceType}: ${title}`,
          changedBy: "AI Extraction Engine"
        }
      });
    }

    // Add source evidence excerpt link
    if (item.evidenceExcerpt) {
      await prisma.sourceEvidence.create({
        data: {
          commitmentId: commitment.id,
          sourceType,
          sourceId,
          excerpt: item.evidenceExcerpt,
          evidenceDate: new Date("2026-09-21T09:00:00.000Z"),
          confidence: item.confidence || 0.9
        }
      });
    }

    // Create dependency tracking record if applicable
    if (stakeholder && owner && owner.email.includes("arjun")) {
      await prisma.taskDependency.create({
        data: {
          commitmentId: commitment.id,
          dependsOnPersonId: stakeholder.id,
          type: "ASSIGNED_TO",
          expectedBy: dueDate
        }
      });
    } else if (owner && !owner.email.includes("arjun") && stakeholder && stakeholder.email.includes("arjun")) {
      await prisma.taskDependency.create({
        data: {
          commitmentId: commitment.id,
          dependsOnPersonId: owner.id,
          type: "WAITING_ON",
          expectedBy: dueDate
        }
      });
    }

    processed.push(commitment);
  }

  return processed;
}

function findPersonByName(nameStr, peopleList) {
  if (!nameStr) return null;
  const target = nameStr.toLowerCase().trim();
  return peopleList.find(p => p.name.toLowerCase().includes(target) || target.includes(p.name.toLowerCase().split(" ")[0])) || null;
}

async function findDuplicateCommitment({ title, ownerId, stakeholderId, sourceId }) {
  // Direct title or source match
  const commitments = await prisma.commitment.findMany({
    where: {
      OR: [
        { sourceId },
        { title: { contains: title.slice(0, 15) } }
      ]
    }
  });

  return commitments[0] || null;
}
