import { Router } from "express";
import * as ctrl from "../controllers/sources.controller.js";

const router = Router();

router.get("/", ctrl.getAllSources);

export default router;
