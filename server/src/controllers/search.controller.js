import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function globalSearch(req, res, next) {
  try {
    const q = req.query.q || "";
    if (!q || q.length < 2) {
      return res.json({ data: { commitments: [], emails: [], people: [], meetings: [] } });
    }

    const commitments = await prisma.commitment.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } }
        ]
      },
      include: { owner: true, stakeholder: true },
      take: 5
    });

    const emails = await prisma.emailThread.findMany({
      where: {
        subject: { contains: q }
      },
      take: 5
    });

    const people = await prisma.person.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { role: { contains: q } }
        ]
      },
      take: 5
    });

    const meetings = await prisma.meeting.findMany({
      where: {
        title: { contains: q }
      },
      take: 5
    });

    res.json({
      data: {
        commitments,
        emails,
        people,
        meetings
      }
    });
  } catch (error) {
    next(error);
  }
}
