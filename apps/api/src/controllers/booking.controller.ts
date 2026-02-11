import type { Request, Response } from "express";
import { z } from "zod";

import {
  createAvailabilityBlock,
  createBooking,
  createServiceType,
  listAvailabilityBlocks,
  listBookingsForUser,
  listServiceTypes,
} from "../services/booking.service";
import { getGuardianAndAthlete } from "../services/user.service";
import { ProgramType } from "../db/schema";

const serviceTypeSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["group_call", "one_on_one", "role_model"]),
  durationMinutes: z.number().int().min(1),
  capacity: z.number().int().min(1).optional(),
  fixedStartTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  programTier: z.enum(ProgramType.enumValues).optional(),
});

const availabilitySchema = z.object({
  serviceTypeId: z.number().int().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

const bookingSchema = z.object({
  serviceTypeId: z.number().int().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
});

const availabilityQuerySchema = z.object({
  serviceTypeId: z.coerce.number().int().min(1),
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export async function listServices(_req: Request, res: Response) {
  const items = await listServiceTypes();
  return res.status(200).json({ items });
}

export async function createService(req: Request, res: Response) {
  const input = serviceTypeSchema.parse(req.body);
  const item = await createServiceType({
    name: input.name,
    type: input.type,
    durationMinutes: input.durationMinutes,
    capacity: input.capacity,
    fixedStartTime: input.fixedStartTime,
    programTier: input.programTier,
    createdBy: req.user!.id,
  });
  return res.status(201).json({ item });
}

export async function createAvailability(req: Request, res: Response) {
  const input = availabilitySchema.parse(req.body);
  const item = await createAvailabilityBlock({
    serviceTypeId: input.serviceTypeId,
    startsAt: new Date(input.startsAt),
    endsAt: new Date(input.endsAt),
    createdBy: req.user!.id,
  });
  return res.status(201).json({ item });
}

export async function listAvailability(req: Request, res: Response) {
  const query = availabilityQuerySchema.parse(req.query);
  const items = await listAvailabilityBlocks(query.serviceTypeId, new Date(query.from), new Date(query.to));
  return res.status(200).json({ items });
}

export async function createBookingForUser(req: Request, res: Response) {
  const input = bookingSchema.parse(req.body);
  const { guardian, athlete } = await getGuardianAndAthlete(req.user!.id);
  if (!guardian || !athlete) {
    return res.status(400).json({ error: "Onboarding incomplete" });
  }

  const booking = await createBooking({
    athleteId: athlete.id,
    guardianId: guardian.id,
    serviceTypeId: input.serviceTypeId,
    startsAt: new Date(input.startsAt),
    endsAt: new Date(input.endsAt),
    createdBy: req.user!.id,
    location: input.location,
    meetingLink: input.meetingLink,
  });

  return res.status(201).json({ booking });
}

export async function listBookings(req: Request, res: Response) {
  const { guardian } = await getGuardianAndAthlete(req.user!.id);
  if (!guardian) {
    return res.status(200).json({ items: [] });
  }
  const items = await listBookingsForUser(guardian.id);
  return res.status(200).json({ items });
}
