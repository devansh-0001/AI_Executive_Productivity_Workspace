import { Router } from "express";
import * as ctrl from "../controllers/commitment.controller.js";

const router = Router();

router.get("/", ctrl.getCommitments);
router.post("/", ctrl.createCommitment);
router.get("/:id", ctrl.getCommitment);
router.patch("/:id", ctrl.updateCommitment);
router.delete("/:id", ctrl.deleteCommitment);

export default router;
