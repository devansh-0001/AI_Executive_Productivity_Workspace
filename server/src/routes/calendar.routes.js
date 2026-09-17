import { Router } from "express";
import * as ctrl from "../controllers/calendar.controller.js";

const router = Router();

router.get("/", ctrl.getCalendar);
router.get("/conflicts", ctrl.getCalendarConflicts);

export default router;
