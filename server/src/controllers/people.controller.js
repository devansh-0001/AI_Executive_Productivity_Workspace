import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPeople(req, res, next) {
  try {
    const people = await prisma.person.findMany({
      include: {
        commitments: true,
        stakeholderFor: true
      }
    });

    const enriched = people.map(p => {
      const owedByArjun = p.stakeholderFor.filter(c => c.ownerId !== p.id);
      const owesArjun = p.commitments.filter(c => c.stakeholderId !== p.id);
      return {
        ...p,
        owedByArjunCount: owedByArjun.length,
        owesArjunCount: owesArjun.length
      };
    });

    res.json({ data: enriched });
  } catch (error) {
    next(error);
  }
}

export async function getPersonById(req, res, next) {
  try {
    const person = await prisma.person.findUnique({
      where: { id: req.params.id },
      include: {
        commitments: { include: { stakeholder: true, evidence: true } },
        stakeholderFor: { include: { owner: true, evidence: true } },
        dependencies: { include: { commitment: true } }
      }
    });

    if (!person) return res.status(404).json({ error: "Person not found" });

    res.json({ data: person });
  } catch (error) {
    next(error);
  }
}
