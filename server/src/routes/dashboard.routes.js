import { Router } from "express";
import * as ctrl from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/", ctrl.getDashboard);
router.get("/summary", ctrl.getSummaryCards);
router.get("/attention", ctrl.getAttentionList);

export default router;
