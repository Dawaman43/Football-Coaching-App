import type { Request, Response } from "express";
import { z } from "zod";

import {
  addExerciseToSession,
  assignEnrollment,
  createExercise,
  createProgramTemplate,
  createSession,
  getUserOnboarding,
  listBookingsAdmin,
  listMessageThreadsAdmin,
  listThreadMessagesAdmin,
  sendMessageAdmin,
  listUsers,
  updateAthleteProgramTier,
} from "../services/admin.service";
import { ProgramType, sessionType } from "../db/schema";

const updateTierSchema = z.object({
  athleteId: z.number().int().min(1),
  programTier: z.enum(ProgramType.enumValues),
});

const assignSchema = z.object({
  athleteId: z.number().int().min(1),
  programType: z.enum(ProgramType.enumValues),
  programTemplateId: z.number().int().min(1).optional(),
});

const programSchema = z.object({
  name: z.string().min(1),
  type: z.enum(ProgramType.enumValues),
  description: z.string().optional(),
});

const exerciseSchema = z.object({
  name: z.string().min(1),
  cues: z.string().optional(),
  sets: z.number().int().optional(),
  reps: z.number().int().optional(),
  duration: z.number().int().optional(),
  restSeconds: z.number().int().optional(),
  notes: z.string().optional(),
  videoUrl: z.string().url().optional(),
});

const sessionSchema = z.object({
  programId: z.number().int().min(1),
  weekNumber: z.number().int().min(1),
  sessionNumber: z.number().int().min(1),
  type: z.enum(sessionType.enumValues),
});

const sessionExerciseSchema = z.object({
  sessionId: z.number().int().min(1),
  exerciseId: z.number().int().min(1),
  order: z.number().int().min(1),
  coachingNotes: z.string().optional(),
  progressionNotes: z.string().optional(),
  regressionNotes: z.string().optional(),
});

export async function listAllUsers(_req: Request, res: Response) {
  const users = await listUsers();
  return res.status(200).json({ users });
}

export async function getOnboarding(req: Request, res: Response) {
  const userId = z.coerce.number().int().min(1).parse(req.params.userId);
  const data = await getUserOnboarding(userId);
  return res.status(200).json(data);
}

export async function updateProgramTier(req: Request, res: Response) {
  const input = updateTierSchema.parse(req.body);
  const athlete = await updateAthleteProgramTier(input.athleteId, input.programTier);
  return res.status(200).json({ athlete });
}

export async function assignProgram(req: Request, res: Response) {
  const input = assignSchema.parse(req.body);
  const enrollment = await assignEnrollment({
    athleteId: input.athleteId,
    programType: input.programType,
    programTemplateId: input.programTemplateId,
    assignedByCoach: req.user!.id,
  });
  return res.status(201).json({ enrollment });
}

export async function createProgram(req: Request, res: Response) {
  const input = programSchema.parse(req.body);
  const program = await createProgramTemplate({
    name: input.name,
    type: input.type,
    description: input.description,
    createdBy: req.user!.id,
  });
  return res.status(201).json({ program });
}

export async function createExerciseItem(req: Request, res: Response) {
  const input = exerciseSchema.parse(req.body);
  const exercise = await createExercise({
    name: input.name,
    cues: input.cues,
    sets: input.sets,
    reps: input.reps,
    duration: input.duration,
    restSeconds: input.restSeconds,
    notes: input.notes,
    videoUrl: input.videoUrl,
  });
  return res.status(201).json({ exercise });
}

export async function createSessionItem(req: Request, res: Response) {
  const input = sessionSchema.parse(req.body);
  const session = await createSession({
    programId: input.programId,
    weekNumber: input.weekNumber,
    sessionNumber: input.sessionNumber,
    type: input.type,
  });
  return res.status(201).json({ session });
}

export async function addExercise(req: Request, res: Response) {
  const input = sessionExerciseSchema.parse(req.body);
  const item = await addExerciseToSession({
    sessionId: input.sessionId,
    exerciseId: input.exerciseId,
    order: input.order,
    coachingNotes: input.coachingNotes,
    progressionNotes: input.progressionNotes,
    regressionNotes: input.regressionNotes,
  });
  return res.status(201).json({ item });
}

export async function listBookings(req: Request, res: Response) {
  const bookings = await listBookingsAdmin();
  return res.status(200).json({ bookings });
}

export async function listMessageThreads(req: Request, res: Response) {
  const threads = await listMessageThreadsAdmin(req.user!.id);
  return res.status(200).json({ threads });
}

export async function listThreadMessages(req: Request, res: Response) {
  const userId = z.coerce.number().int().min(1).parse(req.params.userId);
  const messages = await listThreadMessagesAdmin(req.user!.id, userId);
  return res.status(200).json({ messages });
}

export async function sendAdminMessage(req: Request, res: Response) {
  const userId = z.coerce.number().int().min(1).parse(req.params.userId);
  const body = z.object({ content: z.string().min(1) }).parse(req.body);
  const message = await sendMessageAdmin({ coachId: req.user!.id, userId, content: body.content });
  return res.status(201).json({ message });
}
