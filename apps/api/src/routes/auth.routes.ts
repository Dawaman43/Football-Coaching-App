import { Router } from "express";

import {
  confirmRegistration,
  login,
  register,
  resendConfirmation,
  startPasswordReset,
  confirmPasswordReset,
  getMe,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/confirm", confirmRegistration);
router.post("/auth/resend", resendConfirmation);
router.post("/auth/login", login);
router.post("/auth/forgot", startPasswordReset);
router.post("/auth/forgot/confirm", confirmPasswordReset);
router.get("/auth/me", requireAuth, getMe);

export default router;
