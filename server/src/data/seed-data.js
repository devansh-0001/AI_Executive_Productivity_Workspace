export const seedPeople = [
  {
    id: "person-arjun",
    name: "Arjun Malhotra",
    email: "arjun.malhotra@company.com",
    role: "VP Sales",
    avatarInitials: "AM"
  },
  {
    id: "person-raghav",
    name: "Raghav Sharma",
    email: "raghav.sharma@vendorcorp.com",
    role: "Procurement Director / Vendor Partner",
    avatarInitials: "RS"
  },
  {
    id: "person-neha",
    name: "Neha Gupta",
    email: "neha.gupta@company.com",
    role: "Sales Operations Manager",
    avatarInitials: "NG"
  },
  {
    id: "person-divya",
    name: "Divya Mehta",
    email: "divya.mehta@company.com",
    role: "Head of Marketing",
    avatarInitials: "DM"
  },
  {
    id: "person-facilities",
    name: "Facilities Admin",
    email: "facilities@company.com",
    role: "Facilities & Workplace Lead",
    avatarInitials: "FA"
  },
  {
    id: "person-vikram",
    name: "Vikram Roy",
    email: "vikram.roy@company.com",
    role: "Chief Executive Officer",
    avatarInitials: "VR"
  },
  {
    id: "person-priya",
    name: "Priya Nair",
    email: "priya.nair@company.com",
    role: "Legal Counsel",
    avatarInitials: "PN"
  }
];

export const seedEmails = [
  {
    id: "thread-vendor-list",
    subject: "Updated Vendor List & Pricing Deck",
    participants: ["arjun.malhotra@company.com", "raghav.sharma@vendorcorp.com"],
    messages: [
      {
        id: "email-vl-1",
        sender: "arjun.malhotra@company.com",
        recipients: ["raghav.sharma@vendorcorp.com"],
        body: "Hi Raghav, I will send you the updated vendor list tomorrow morning once Neha compiles the latest Q3 pricing data.",
        sentAt: "2026-09-21T09:15:00.000Z" // Monday 9:15 AM
      },
      {
        id: "email-vl-2",
        sender: "arjun.malhotra@company.com",
        recipients: ["raghav.sharma@vendorcorp.com"],
        body: "Hi Raghav, apologies for the delay. We hit a snag with the tier-2 vendor figures. I am pushing this to Wednesday morning EOD.",
        sentAt: "2026-09-22T16:30:00.000Z" // Tuesday 4:30 PM
      },
      {
        id: "email-vl-3",
        sender: "raghav.sharma@vendorcorp.com",
        recipients: ["arjun.malhotra@company.com"],
        body: "Hi Arjun, following up on this. Is delivery still expected this morning? We need this for our procurement review.",
        sentAt: "2026-09-23T08:45:00.000Z" // Wednesday 8:45 AM
      }
    ]
  },
  {
    id: "thread-mumbai-lease",
    subject: "URGENT: Mumbai Commercial Office Lease Renewal",
    participants: ["vikram.roy@company.com", "arjun.malhotra@company.com", "priya.nair@company.com"],
    messages: [
      {
        id: "email-ml-1",
        sender: "vikram.roy@company.com",
        recipients: ["arjun.malhotra@company.com", "priya.nair@company.com"],
        body: "Team, the Mumbai office lease expires next month and the landlord requires the renewal agreement executed by Friday EOD. Someone needs to sign off on the clause modifications. I assume Facilities is handling this, but someone must own the submission.",
        sentAt: "2026-09-21T11:00:00.000Z" // Monday 11:00 AM
      },
      {
        id: "email-ml-2",
        sender: "priya.nair@company.com",
        recipients: ["vikram.roy@company.com", "arjun.malhotra@company.com"],
        body: "Legal has reviewed the clause, but Facilities hasn't confirmed owner responsibility or budget signoff yet. Ownership is currently unconfirmed.",
        sentAt: "2026-09-22T14:20:00.000Z" // Tuesday 2:20 PM
      }
    ]
  },
  {
    id: "thread-q3-forecast",
    subject: "Q3 Enterprise Sales Forecast Review",
    participants: ["neha.gupta@company.com", "arjun.malhotra@company.com"],
    messages: [
      {
        id: "email-q3-1",
        sender: "neha.gupta@company.com",
        recipients: ["arjun.malhotra@company.com"],
        body: "Arjun, I have drafted the revenue pipeline breakdown. I need you to confirm the APAC deal status before Thursday 2 PM so I can finalize the slides.",
        sentAt: "2026-09-21T15:00:00.000Z" // Monday 3:00 PM
      },
      {
        id: "email-q3-2",
        sender: "arjun.malhotra@company.com",
        recipients: ["neha.gupta@company.com"],
        body: "Thanks Neha. I'll get you the APAC deal status by Wednesday EOD.",
        sentAt: "2026-09-22T10:00:00.000Z" // Tuesday 10:00 AM
      }
    ]
  }
];

export const seedMeetings = [
  {
    id: "meeting-leadership-sync",
    title: "Weekly Executive Leadership Sync",
    date: "2026-09-21T10:00:00.000Z", // Monday 10 AM
    duration: 60,
    participants: "Vikram Roy, Arjun Malhotra, Divya Mehta, Neha Gupta",
    transcriptRaw: `
Vikram Roy: Good morning everyone. Let's cover key deliverables for this week.
Arjun Malhotra: On the sales front, I am committing to sending Raghav the updated vendor list by tomorrow morning.
Divya Mehta: Great. Marketing is preparing the campaign review presentation. I will share the preliminary campaign metrics with Arjun by Wednesday morning.
Arjun Malhotra: Thanks Divya. Also, Vikram, I will prepare the Executive Board Prep slides by Wednesday before our 9:00 AM Board Prep session.
Neha Gupta: I will have the complete Q3 Regional Forecast summary ready for Arjun by Thursday morning.
Vikram Roy: Excellent. Make sure all deadlines are hit.
    `.trim()
  },
  {
    id: "meeting-board-prep",
    title: "Board Prep Session",
    date: "2026-09-23T09:00:00.000Z", // Wednesday 9:00 AM
    duration: 60,
    participants: "Vikram Roy, Arjun Malhotra, Board Members",
    transcriptRaw: `
Vikram Roy: Welcome everyone to the Board Prep session.
Arjun Malhotra: I've compiled our strategic growth outline. We'll present the final deck on Friday EOD to the Board.
    `.trim()
  }
];

export const seedCalendarEvents = [
  {
    id: "event-board-prep",
    title: "Board Prep Session",
    startTime: "2026-09-23T09:00:00.000Z", // Wednesday 9:00 AM
    endTime: "2026-09-23T10:00:00.000Z",   // Wednesday 10:00 AM
    attendees: ["Arjun Malhotra", "Vikram Roy", "Board Members"],
    location: "Executive Boardroom A"
  },
  {
    id: "event-campaign-review",
    title: "Q4 Marketing Campaign Review",
    startTime: "2026-09-23T09:30:00.000Z", // Wednesday 9:30 AM (OVERLAPS with Board Prep!)
    endTime: "2026-09-23T10:30:00.000Z",   // Wednesday 10:30 AM
    attendees: ["Arjun Malhotra", "Divya Mehta"],
    location: "Conference Room B"
  },
  {
    id: "event-client-lunch",
    title: "Enterprise Client Alignment Lunch",
    startTime: "2026-09-24T12:30:00.000Z", // Thursday 12:30 PM
    endTime: "2026-09-24T14:00:00.000Z",
    attendees: ["Arjun Malhotra", "Raghav Sharma"],
    location: "Le Bistro"
  },
  {
    id: "event-weekly-wrapup",
    title: "Friday Executive Leadership Wrap-up",
    startTime: "2026-09-25T16:00:00.000Z", // Friday 4:00 PM
    endTime: "2026-09-25T17:00:00.000Z",
    attendees: ["Arjun Malhotra", "Vikram Roy", "Neha Gupta", "Divya Mehta"],
    location: "Zoom Virtual"
  }
];

export const seedVoiceNotes = [
  {
    id: "vn-1",
    title: "Voice Memo: Follow up with Divya on Campaign Metrics",
    transcriptRaw: "Remind myself to follow up with Divya on Wednesday morning if the marketing campaign numbers aren't delivered before the campaign review session.",
    recordedAt: "2026-09-21T17:30:00.000Z" // Monday 5:30 PM
  },
  {
    id: "vn-2",
    title: "Voice Memo: Mumbai Lease escalation note",
    transcriptRaw: "The Mumbai office lease is currently floating without an assigned owner. Facilities thinks legal has it, legal thinks facilities has it. Needs escalation to Vikram if unassigned by Thursday.",
    recordedAt: "2026-09-22T18:00:00.000Z" // Tuesday 6:00 PM
  }
];
