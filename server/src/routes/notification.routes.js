import { Router } from "express";
import * as service from "../services/notification.service.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const list = await service.runNotificationScan();
    res.json({ data: list });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const updated = await service.markNotificationRead(req.params.id);
    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
