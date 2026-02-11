import { Router } from "express";

import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";
import {
  addExercise,
  assignProgram,
  createExerciseItem,
  createProgram,
  createSessionItem,
  getOnboarding,
  listBookings,
  listMessageThreads,
  listThreadMessages,
  sendAdminMessage,
  listAllUsers,
  updateProgramTier,
} from "../controllers/admin.controller";

const router = Router();

router.use(requireAuth, requireRole(["coach", "admin", "superAdmin"]));

router.get("/admin/users", listAllUsers);
router.get("/admin/bookings", listBookings);
router.get("/admin/messages/threads", listMessageThreads);
router.get("/admin/messages/:userId", listThreadMessages);
router.post("/admin/messages/:userId", sendAdminMessage);
router.get("/admin/users/:userId/onboarding", getOnboarding);
router.post("/admin/users/program-tier", updateProgramTier);
router.post("/admin/enrollments", assignProgram);
router.post("/admin/programs", createProgram);
router.post("/admin/exercises", createExerciseItem);
router.post("/admin/sessions", createSessionItem);
router.post("/admin/session-exercises", addExercise);

export default router;
