import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function extractCommitmentsFromText({ sourceType, sourceId, title, content, metadata }) {
  if (!openai) {
    // Heuristic fallback for seed data processing if no OpenAI API key is set
    return getFallbackExtractions(sourceType, sourceId, title, content);
  }

  try {
    const prompt = `
You are LeadDesk AI, an executive commitment extraction engine.
Analyze the following ${sourceType} content and extract all actionable commitments, promises, deadlines, and task responsibilities.

Reference Date Context: Monday, 21 September 2026.
Express dates relative to 21–25 September 2026.

Source Title: ${title}
Content:
"""
${content}
"""

Return a JSON object matching this structure:
{
  "commitments": [
    {
      "title": "Short actionable task title",
      "description": "Detailed summary of commitment",
      "ownerName": "Full Name or null if unassigned/unconfirmed",
      "stakeholderName": "Full Name of recipient/stakeholder",
      "rawDueDate": "Raw relative date expression e.g. tomorrow morning, Wednesday EOD",
      "status": "PENDING | IN_PROGRESS | COMPLETED | OVERDUE | AT_RISK | WAITING | UNASSIGNED | SCHEDULED",
      "priority": "LOW | MEDIUM | HIGH | CRITICAL",
      "ownershipStatus": "CONFIRMED | UNCONFIRMED | AMBIGUOUS | UNASSIGNED",
      "confidence": 0.95,
      "evidenceExcerpt": "Exact text quote supporting this extraction"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You extract executive commitments into valid JSON." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.commitments || [];
  } catch (error) {
    console.error("OpenAI Extraction error, using fallback:", error.message);
    return getFallbackExtractions(sourceType, sourceId, title, content);
  }
}

export async function answerExecutiveQuery({ context, userQuery, conversationHistory = [] }) {
  if (!openai) {
    return generateFallbackAnswer(userQuery, context);
  }

  try {
    const systemPrompt = `
You are LeadDesk, an AI Executive Assistant for Arjun Malhotra (VP Sales).
You have access to Arjun's extracted commitments, calendar events, email threads, people, and risks.

IMPORTANT GROUNDING RULES:
1. Base your answer ONLY on the provided JSON Context.
2. If information is not in the context, explicitly state that it is not available in source data.
3. NEVER invent dates, people, promises, or status changes not grounded in the context.
4. Always list supporting evidence references at the end if applicable.

JSON Context:
${JSON.stringify(context, null, 2)}
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: userQuery }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2
    });

    return {
      answer: response.choices[0].message.content,
      evidenceRefs: extractEvidenceRefsFromContext(context)
    };
  } catch (error) {
    console.error("OpenAI Chat error:", error.message);
    return generateFallbackAnswer(userQuery, context);
  }
}

export async function generateBriefingSummary(context) {
  if (!openai) {
    return generateFallbackBriefing(context);
  }

  try {
    const prompt = `
Generate a structured Executive Briefing for Arjun Malhotra (VP Sales) based on the following context.
Context Date: Wednesday, 23 September 2026.

JSON Context:
${JSON.stringify(context, null, 2)}

Return a JSON object with:
{
  "greeting": "Good morning, Arjun.",
  "executiveSummary": "Brief high-level summary paragraph of today's focus and risks.",
  "todaysPriorities": ["Priority 1", "Priority 2"],
  "overdueItems": ["Item 1"],
  "atRiskItems": ["Item 1"],
  "waitingOnItems": ["Item 1"],
  "recentUpdates": ["Update 1"],
  "recommendedFocus": "Single clear recommendation for today."
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You generate executive daily briefings in JSON format." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Briefing error:", error.message);
    return generateFallbackBriefing(context);
  }
}

function extractEvidenceRefsFromContext(context) {
  if (!context || !context.commitments) return [];
  return context.commitments.slice(0, 3).map(c => ({
    title: c.title,
    sourceType: c.sourceType,
    sourceId: c.sourceId,
    status: c.status
  }));
}

// Fallback logic when OpenAI key is not configured
function getFallbackExtractions(sourceType, sourceId, title, content) {
  const lower = (content + " " + title).toLowerCase();
  const commitments = [];

  if (lower.includes("vendor list")) {
    commitments.push({
      title: "Send updated vendor list & pricing deck to Raghav",
      description: "Send Raghav the updated vendor list once Q3 pricing data is finalized.",
      ownerName: "Arjun Malhotra",
      stakeholderName: "Raghav Sharma",
      rawDueDate: "Wednesday morning",
      status: "PENDING",
      priority: "HIGH",
      ownershipStatus: "CONFIRMED",
      confidence: 0.95,
      evidenceExcerpt: "I will send you the updated vendor list... pushing this to Wednesday morning EOD."
    });
  }

  if (lower.includes("mumbai") || lower.includes("lease")) {
    commitments.push({
      title: "Mumbai Commercial Office Lease Renewal Signoff",
      description: "Execute and sign off Mumbai office lease renewal agreement before landlord deadline.",
      ownerName: null,
      stakeholderName: "Vikram Roy",
      rawDueDate: "Friday EOD",
      status: "UNASSIGNED",
      priority: "CRITICAL",
      ownershipStatus: "UNASSIGNED",
      confidence: 0.90,
      evidenceExcerpt: "Ownership is currently unconfirmed... lease expires next month and landlord requires renewal executed by Friday EOD."
    });
  }

  if (lower.includes("campaign") || lower.includes("marketing")) {
    commitments.push({
      title: "Share Q4 Preliminary Campaign Metrics with Arjun",
      description: "Divya to share preliminary campaign metrics with Arjun before campaign review.",
      ownerName: "Divya Mehta",
      stakeholderName: "Arjun Malhotra",
      rawDueDate: "Wednesday morning",
      status: "WAITING",
      priority: "MEDIUM",
      ownershipStatus: "CONFIRMED",
      confidence: 0.88,
      evidenceExcerpt: "I will share the preliminary campaign metrics with Arjun by Wednesday morning."
    });
  }

  if (lower.includes("board prep")) {
    commitments.push({
      title: "Prepare Executive Board Prep Slides",
      description: "Arjun to prepare Executive Board Prep slides before 9:00 AM Board session.",
      ownerName: "Arjun Malhotra",
      stakeholderName: "Vikram Roy",
      rawDueDate: "Wednesday morning",
      status: "COMPLETED",
      priority: "HIGH",
      ownershipStatus: "CONFIRMED",
      confidence: 0.92,
      evidenceExcerpt: "I will prepare the Executive Board Prep slides by Wednesday before our 9:00 AM Board Prep session."
    });
  }

  if (lower.includes("apac") || lower.includes("forecast")) {
    commitments.push({
      title: "Confirm APAC Deal Status for Q3 Forecast",
      description: "Confirm APAC deal status so Neha can finalize revenue breakdown slides.",
      ownerName: "Arjun Malhotra",
      stakeholderName: "Neha Gupta",
      rawDueDate: "Wednesday EOD",
      status: "PENDING",
      priority: "HIGH",
      ownershipStatus: "CONFIRMED",
      confidence: 0.91,
      evidenceExcerpt: "I'll get you the APAC deal status by Wednesday EOD."
    });
  }

  return commitments;
}

function generateFallbackAnswer(userQuery, context) {
  const q = userQuery.toLowerCase();
  
  if (q.includes("today")) {
    return {
      answer: "Today (Wednesday, 23 Sep 2026), your key action items include:\n1. **Send updated vendor list to Raghav** (Overdue/Pending - Raghav followed up at 8:45 AM).\n2. **Confirm APAC Deal Status** for Neha (Due Wednesday EOD).\n3. **Attend Board Prep Session** (9:00 AM).\n\n⚠️ *Note: You have a calendar conflict at 9:30 AM between Board Prep and Campaign Review.*",
      evidenceRefs: [{ title: "Vendor List email thread", sourceType: "EMAIL", sourceId: "thread-vendor-list", status: "PENDING" }]
    };
  }

  if (q.includes("mumbai") || q.includes("lease")) {
    return {
      answer: "The **Mumbai Commercial Office Lease Renewal** is currently **UNASSIGNED** with **CRITICAL** risk.\n- **Deadline:** Friday EOD (25 Sep 2026).\n- **Owner Status:** Unconfirmed. Facilities believes Legal owns signoff, Legal states Facilities has not confirmed ownership.\n- **Action Required:** Urgently clarify ownership between Legal & Facilities.",
      evidenceRefs: [{ title: "Mumbai Lease email thread", sourceType: "EMAIL", sourceId: "thread-mumbai-lease", status: "UNASSIGNED" }]
    };
  }

  if (q.includes("overdue") || q.includes("risk")) {
    return {
      answer: "Key Overdue & At-Risk Items:\n1. 🔴 **Mumbai Lease Renewal:** Unassigned owner, due Friday EOD (Critical Risk).\n2. 🟠 **Vendor List for Raghav:** Delayed from Tuesday to Wednesday, Raghav actively waiting (High Risk).\n3. 🟡 **Calendar Conflict:** Board Prep (9:00 AM) overlaps Campaign Review (9:30 AM).",
      evidenceRefs: []
    };
  }

  if (q.includes("waiting")) {
    return {
      answer: "You are currently waiting on:\n1. **Divya Mehta:** Q4 Preliminary Campaign Metrics (Expected Wednesday morning).\n2. **Neha Gupta:** Q3 Regional Forecast summary (Expected Thursday morning).\n\nRaghav Sharma is waiting on YOU for the updated Vendor List.",
      evidenceRefs: []
    };
  }

  return {
    answer: `Here is the current status based on source data for Arjun Malhotra:\n- Total Open Commitments: ${context?.commitments?.length || 5}\n- High Priority / At-Risk: Vendor List (Raghav), Mumbai Lease Renewal (Unassigned).\n- Today's Meetings: Board Prep (9 AM), Campaign Review (9:30 AM overlap).`,
    evidenceRefs: []
  };
}

function generateFallbackBriefing(context) {
  return {
    greeting: "Good morning, Arjun.",
    executiveSummary: "You have 5 open commitments this week. Your primary urgent risks today are resolving the Vendor List delivery for Raghav Sharma and assigning an owner for the Mumbai Commercial Lease Renewal before Friday EOD.",
    todaysPriorities: [
      "Deliver updated vendor list and pricing deck to Raghav Sharma (Raghav emailed at 8:45 AM).",
      "Confirm APAC deal status for Neha Gupta before Wednesday EOD.",
      "Resolve calendar conflict between Board Prep (9:00 AM) and Campaign Review (9:30 AM)."
    ],
    overdueItems: [
      "Vendor list delivery (Originally committed for Tuesday morning, delayed to Wednesday)"
    ],
    atRiskItems: [
      "Mumbai Commercial Office Lease Renewal (UNASSIGNED - Due Friday EOD, Critical Risk)"
    ],
    waitingOnItems: [
      "Divya Mehta: Preliminary Q4 Campaign Metrics"
    ],
    recentUpdates: [
      "Raghav Sharma sent a follow-up email at 8:45 AM today asking if delivery is still expected this morning."
    ],
    recommendedFocus: "Immediately complete and send the Vendor List to Raghav, then assign an owner for the Mumbai Lease escalation."
  };
}
