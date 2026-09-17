import * as emailService from "../services/email.service.js";

export async function getEmailThreads(req, res, next) {
  try {
    const threads = await emailService.getAllEmailThreads();
    res.json({ data: threads });
  } catch (error) {
    next(error);
  }
}

export async function getEmailThread(req, res, next) {
  try {
    const thread = await emailService.getEmailThreadById(req.params.threadId);
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json({ data: thread });
  } catch (error) {
    next(error);
  }
}
