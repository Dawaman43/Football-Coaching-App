import { Router } from "express";

import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";
import { createContentItem, listHomeContent, listParentContent } from "../controllers/content.controller";

const router = Router();

router.get("/content/home", requireAuth, listHomeContent);
router.get("/content/parent-platform", requireAuth, listParentContent);
router.post("/content", requireAuth, requireRole(["coach", "admin", "superAdmin"]), createContentItem);

export default router;
