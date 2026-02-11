import { Router } from "express";

import { requireAuth } from "../middlewares/auth";
import { listMessages, markRead, sendMessageToCoach } from "../controllers/message.controller";

const router = Router();

router.get("/messages", requireAuth, listMessages);
router.post("/messages", requireAuth, sendMessageToCoach);
router.post("/messages/read", requireAuth, markRead);

export default router;
