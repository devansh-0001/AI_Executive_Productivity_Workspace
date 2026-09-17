import { Router } from "express";
import * as ctrl from "../controllers/search.controller.js";

const router = Router();

router.get("/", ctrl.globalSearch);

export default router;
