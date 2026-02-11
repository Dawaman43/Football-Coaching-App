import { Router } from "express";

import { requireAuth } from "../middlewares/auth";
import { signMediaUrl } from "../controllers/media.controller";

const router = Router();

router.post("/media/signed-url", requireAuth, signMediaUrl);

export default router;
