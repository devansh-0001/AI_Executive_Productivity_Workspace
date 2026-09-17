import { PrismaClient } from "@prisma/client";
import { answerExecutiveQuery } from "./openai.service.js";

const prisma = new PrismaClient();

export async function processChatMessage({ conversationId, message }) {
  // 1. Ensure conversation exists
  let conversation;
  if (conversationId) {
    conversation = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: "asc" } } }
    });
  }

  if (!conversation) {
    conversation = await prisma.chatConversation.create({
      data: {
        userId: "Arjun Malhotra",
        title: message.slice(0, 30) + "..."
      },
      include: { messages: true }
    });
  }

  // 2. Save user message
  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: message
    }
  });

  // 3. Build focused DB context based on query
  const context = await buildDbContextForQuery(message);

  // 4. Call OpenAI / fallback grounded reasoning engine
  const history = conversation.messages.map(m => ({ role: m.role, content: m.content }));
  const aiResult = await answerExecutiveQuery({
    context,
    userQuery: message,
    conversationHistory: history
  });

  // 5. Save assistant response
  const assistantMsg = await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: aiResult.answer,
      evidenceRefs: aiResult.evidenceRefs ? JSON.stringify(aiResult.evidenceRefs) : null
    }
  });

  return {
    conversationId: conversation.id,
    message: assistantMsg,
    evidenceRefs: aiResult.evidenceRefs || []
  };
}

export async function getConversations() {
  return prisma.chatConversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "asc" } }
    }
  });
}

async function buildDbContextForQuery(query) {
  const commitments = await prisma.commitment.findMany({
    include: { owner: true, stakeholder: true, evidence: true }
  });

  const calendarEvents = await prisma.calendarEvent.findMany();
  const people = await prisma.person.findMany();

  return {
    referenceDate: "2026-09-23T09:00:00.000Z",
    commitments,
    calendarEvents,
    people
  };
}
