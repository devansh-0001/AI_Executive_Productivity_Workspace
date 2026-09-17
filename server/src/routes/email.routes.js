import { Router } from "express";
import * as ctrl from "../controllers/email.controller.js";

const router = Router();

router.get("/", ctrl.getEmailThreads);
router.get("/:threadId", ctrl.getEmailThread);

export default router;
