import { PrismaClient } from "@prisma/client";
import {
  seedPeople,
  seedEmails,
  seedMeetings,
  seedCalendarEvents,
  seedVoiceNotes
} from "./seed-data.js";
import { processSourceExtraction } from "../services/extraction.service.js";
import { runNotificationScan } from "../services/notification.service.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting LeadDesk database seed...");

  // 1. Clear existing data
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.sourceEvidence.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.commitmentHistory.deleteMany();
  await prisma.commitment.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.voiceNote.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.email.deleteMany();
  await prisma.emailThread.deleteMany();
  await prisma.person.deleteMany();

  console.log("Cleaned old database records.");

  // 2. Insert People
  for (const person of seedPeople) {
    await prisma.person.create({ data: person });
  }
  console.log(`Seeded ${seedPeople.length} people.`);

  // 3. Insert Email Threads & Messages
  for (const thread of seedEmails) {
    const { messages, ...threadData } = thread;
    await prisma.emailThread.create({
      data: {
        ...threadData,
        participants: JSON.stringify(threadData.participants),
        emails: {
          create: messages.map(m => ({
            id: m.id,
            sender: m.sender,
            recipients: JSON.stringify(m.recipients),
            body: m.body,
            sentAt: new Date(m.sentAt)
          }))
        }
      }
    });
  }
  console.log(`Seeded ${seedEmails.length} email threads.`);

  // 4. Insert Meetings
  for (const meeting of seedMeetings) {
    await prisma.meeting.create({
      data: {
        ...meeting,
        date: new Date(meeting.date)
      }
    });
  }
  console.log(`Seeded ${seedMeetings.length} meetings.`);

  // 5. Insert Calendar Events
  for (const event of seedCalendarEvents) {
    await prisma.calendarEvent.create({
      data: {
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        attendees: JSON.stringify(event.attendees)
      }
    });
  }
  console.log(`Seeded ${seedCalendarEvents.length} calendar events.`);

  // 6. Insert Voice Notes
  for (const vn of seedVoiceNotes) {
    await prisma.voiceNote.create({
      data: {
        ...vn,
        recordedAt: new Date(vn.recordedAt)
      }
    });
  }
  console.log(`Seeded ${seedVoiceNotes.length} voice notes.`);

  // 7. Run AI Extractions for all source data
  console.log("🤖 Running extraction pipeline across all sources...");

  // Emails
  for (const thread of seedEmails) {
    const combinedBody = thread.messages.map(m => `${m.sender}: ${m.body}`).join("\n\n");
    await processSourceExtraction({
      sourceType: "EMAIL",
      sourceId: thread.id,
      title: thread.subject,
      content: combinedBody
    });
  }

  // Meetings
  for (const meeting of seedMeetings) {
    await processSourceExtraction({
      sourceType: "TRANSCRIPT",
      sourceId: meeting.id,
      title: meeting.title,
      content: meeting.transcriptRaw
    });
  }

  // Voice Notes
  for (const vn of seedVoiceNotes) {
    await processSourceExtraction({
      sourceType: "VOICE_NOTE",
      sourceId: vn.id,
      title: vn.title,
      content: vn.transcriptRaw
    });
  }

  console.log("Extraction pipeline complete.");

  // 8. Run Notification Scan
  await runNotificationScan();
  console.log("Notifications generated.");

  console.log("✅ Seed completed successfully!");
}

main()
  .catch(e => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
