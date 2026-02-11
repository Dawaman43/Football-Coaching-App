import { Router } from "express";

import { requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";
import {
  createAvailability,
  createBookingForUser,
  createService,
  listAvailability,
  listBookings,
  listServices,
} from "../controllers/booking.controller";

const router = Router();

router.get("/bookings/services", requireAuth, listServices);
router.post("/bookings/services", requireAuth, requireRole(["coach", "admin", "superAdmin"]), createService);
router.get("/bookings/availability", requireAuth, listAvailability);
router.post("/bookings/availability", requireAuth, requireRole(["coach", "admin", "superAdmin"]), createAvailability);
router.post("/bookings", requireAuth, createBookingForUser);
router.get("/bookings", requireAuth, listBookings);

export default router;
