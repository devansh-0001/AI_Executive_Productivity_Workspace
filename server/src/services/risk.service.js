// Risk & Urgency Detection Engine for LeadDesk

export function calculateRisk(commitment, evaluationDate = new Date("2026-09-23T09:00:00.000Z")) {
  const reasons = [];
  let score = 0; // 0-1: LOW, 2-3: MEDIUM, 4-5: HIGH, >=6: CRITICAL

  const status = commitment.status || "PENDING";
  const ownershipStatus = commitment.ownershipStatus || "CONFIRMED";
  const isUnassigned = commitment.isUnassigned || ownershipStatus === "UNASSIGNED" || !commitment.ownerId;
  const isAmbiguous = ownershipStatus === "AMBIGUOUS" || ownershipStatus === "UNCONFIRMED";
  
  const dueDate = commitment.dueDate ? new Date(commitment.dueDate) : null;
  const now = new Date(evaluationDate);

  // If completed, risk is low
  if (status === "COMPLETED") {
    return { riskLevel: "LOW", reasons: ["Task completed successfully"] };
  }

  // Overdue check
  let isOverdue = false;
  if (dueDate && dueDate.getTime() < now.getTime()) {
    isOverdue = true;
    score += 4;
    reasons.push("Task has passed its target deadline without completion");
  }

  // Approaching deadline check
  if (dueDate && !isOverdue) {
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours <= 24) {
      score += 3;
      reasons.push(`Deadline is approaching within ${Math.round(diffHours)} hours`);
    } else if (diffHours <= 48) {
      score += 2;
      reasons.push("Deadline is approaching within 48 hours");
    }
  }

  // Ownership risks
  if (isUnassigned) {
    score += 3;
    reasons.push("Task has no confirmed owner assigned");
  } else if (isAmbiguous) {
    score += 2;
    reasons.push("Ownership is unconfirmed or ambiguous between parties");
  }

  // Status flags
  if (status === "AT_RISK") {
    score += 2;
    reasons.push("Manually or heuristically flagged as At Risk");
  }

  if (status === "OVERDUE") {
    score += 3;
    reasons.push("Status is explicitly set to Overdue");
  }

  // Revised deadline check (if original != current)
  if (commitment.originalDueDate && commitment.dueDate) {
    const orig = new Date(commitment.originalDueDate).getTime();
    const curr = new Date(commitment.dueDate).getTime();
    if (curr > orig) {
      score += 2;
      reasons.push("Task deadline has been delayed from original commitment");
    }
  }

  // Classify score into Risk Level
  let riskLevel = "LOW";
  if (score >= 6 || (isOverdue && (isUnassigned || isAmbiguous))) {
    riskLevel = "CRITICAL";
  } else if (score >= 4) {
    riskLevel = "HIGH";
  } else if (score >= 2) {
    riskLevel = "MEDIUM";
  }

  return { riskLevel, reasons };
}
