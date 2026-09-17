import * as briefingService from "../services/briefing.service.js";

export async function generateBriefing(req, res, next) {
  try {
    const briefing = await briefingService.generateExecutiveBriefing();
    res.json({ data: briefing });
  } catch (error) {
    next(error);
  }
}
