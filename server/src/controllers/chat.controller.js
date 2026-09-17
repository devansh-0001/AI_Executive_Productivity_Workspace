import * as chatService from "../services/chat.service.js";

export async function sendChatMessage(req, res, next) {
  try {
    const { conversationId, message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const result = await chatService.processChatMessage({ conversationId, message });
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getConversations(req, res, next) {
  try {
    const conversations = await chatService.getConversations();
    res.json({ data: conversations });
  } catch (error) {
    next(error);
  }
}
