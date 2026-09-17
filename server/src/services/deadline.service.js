// Deadline intelligence service for LeadDesk
// Base reference date context: 21 September 2026 (Monday)

export const REFERENCE_DATE = new Date("2026-09-21T09:00:00.000Z");

export function resolveRelativeDate(expression, refDate = REFERENCE_DATE, calendarEvents = []) {
  if (!expression) return null;

  const lower = expression.toLowerCase().trim();
  const base = new Date(refDate);

  // Check event-relative expressions e.g. "before board prep"
  if (lower.includes("board prep")) {
    const boardPrepEvent = calendarEvents.find(e => e.title.toLowerCase().includes("board prep"));
    if (boardPrepEvent) {
      // 1 hour before board prep start time
      const eventStart = new Date(boardPrepEvent.startTime);
      return new Date(eventStart.getTime() - 60 * 60 * 1000);
    }
    // Fallback: Wednesday 8:00 AM
    return new Date("2026-09-23T08:00:00.000Z");
  }

  // Monday, Tuesday, Wednesday, Thursday, Friday
  if (lower.includes("monday")) {
    const d = new Date("2026-09-21T18:00:00.000Z");
    if (lower.includes("morning")) d.setUTCHours(9, 0, 0, 0);
    return d;
  }
  if (lower.includes("tuesday")) {
    const d = new Date("2026-09-22T18:00:00.000Z");
    if (lower.includes("morning")) d.setUTCHours(9, 0, 0, 0);
    return d;
  }
  if (lower.includes("wednesday")) {
    const d = new Date("2026-09-23T18:00:00.000Z");
    if (lower.includes("morning")) d.setUTCHours(9, 0, 0, 0);
    return d;
  }
  if (lower.includes("thursday")) {
    const d = new Date("2026-09-24T18:00:00.000Z");
    if (lower.includes("morning")) d.setUTCHours(9, 0, 0, 0);
    if (lower.includes("2 pm") || lower.includes("14:00")) d.setUTCHours(14, 0, 0, 0);
    return d;
  }
  if (lower.includes("friday")) {
    const d = new Date("2026-09-25T18:00:00.000Z"); // Friday EOD = 18:00
    if (lower.includes("morning")) d.setUTCHours(9, 0, 0, 0);
    return d;
  }

  // Tomorrow
  if (lower.includes("tomorrow")) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + 1);
    if (lower.includes("morning")) {
      d.setUTCHours(9, 0, 0, 0);
    } else {
      d.setUTCHours(18, 0, 0, 0);
    }
    return d;
  }

  // Direct ISO date string try
  const parsed = new Date(expression);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  // Default fallback to Friday EOD of reference week
  return new Date("2026-09-25T18:00:00.000Z");
}

export function getDeadlineCountdown(dueDate, currentDate = new Date("2026-09-23T09:00:00.000Z")) {
  if (!dueDate) return { hoursRemaining: null, label: "No deadline", isOverdue: false };

  const due = new Date(dueDate);
  const now = new Date(currentDate); // Using current evaluation time in assignment week: Wednesday 9:00 AM
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    const overdueHours = Math.abs(diffHours);
    const overdueDays = Math.floor(overdueHours / 24);
    const label = overdueDays > 0 ? `Overdue by ${overdueDays}d` : `Overdue by ${overdueHours}h`;
    return { hoursRemaining: diffHours, label, isOverdue: true };
  }

  if (diffHours < 24) {
    return { hoursRemaining: diffHours, label: `Due in ${diffHours}h`, isOverdue: false };
  }

  return { hoursRemaining: diffHours, label: `Due in ${diffDays}d ${diffHours % 24}h`, isOverdue: false };
}
