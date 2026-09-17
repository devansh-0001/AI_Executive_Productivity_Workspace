import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getActivityTimeline(req, res, next) {
  try {
    const history = await prisma.commitmentHistory.findMany({
      orderBy: { changedAt: "desc" },
      include: {
        commitment: {
          include: { owner: true, stakeholder: true }
        }
      }
    });

    res.json({ data: history });
  } catch (error) {
    next(error);
  }
}
