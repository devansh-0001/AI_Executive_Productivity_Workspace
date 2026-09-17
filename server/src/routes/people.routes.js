import { Router } from "express";
import * as ctrl from "../controllers/people.controller.js";

const router = Router();

router.get("/", ctrl.getPeople);
router.get("/:id", ctrl.getPersonById);

export default router;
