import { Router } from "express";
import * as chatCtrl from "../controllers/chat.controller.js";
import * as briefingCtrl from "../controllers/briefing.controller.js";

const router = Router();

router.post("/chat", chatCtrl.sendChatMessage);
router.get("/conversations", chatCtrl.getConversations);
router.post("/briefing", briefingCtrl.generateBriefing);

export default router;
