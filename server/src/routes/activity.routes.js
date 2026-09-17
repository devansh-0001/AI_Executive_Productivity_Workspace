import { Router } from "express";
import * as ctrl from "../controllers/activity.controller.js";

const router = Router();

router.get("/", ctrl.getActivityTimeline);

export default router;
