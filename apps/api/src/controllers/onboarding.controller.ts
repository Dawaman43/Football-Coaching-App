import type { Request, Response } from "express";
import { z } from "zod";

import { getOnboardingByUser, submitOnboarding as submitOnboardingService } from "../services/onboarding.service";
import { ProgramType } from "../db/schema";

const onboardingSchema = z.object({
  athleteName: z.string().min(1),
  age: z.number().int().min(5),
  team: z.string().min(1),
  trainingPerWeek: z.number().int().min(0),
  injuries: z.unknown().optional(),
  growthNotes: z.string().optional(),
  performanceGoals: z.string().optional(),
  equipmentAccess: z.string().optional(),
  parentEmail: z.string().email(),
  parentPhone: z.string().optional(),
  relationToAthlete: z.string().optional(),
  desiredProgramType: z.enum(ProgramType.enumValues),
  termsVersion: z.string().min(1),
  privacyVersion: z.string().min(1),
  appVersion: z.string().min(1),
});

export async function submitOnboarding(req: Request, res: Response) {
  const input = onboardingSchema.parse(req.body);
  const result = await submitOnboardingService({
    userId: req.user!.id,
    athleteName: input.athleteName,
    age: input.age,
    team: input.team,
    trainingPerWeek: input.trainingPerWeek,
    injuries: input.injuries,
    growthNotes: input.growthNotes,
    performanceGoals: input.performanceGoals,
    equipmentAccess: input.equipmentAccess,
    parentEmail: input.parentEmail,
    parentPhone: input.parentPhone,
    relationToAthlete: input.relationToAthlete,
    desiredProgramType: input.desiredProgramType,
    termsVersion: input.termsVersion,
    privacyVersion: input.privacyVersion,
    appVersion: input.appVersion,
  });

  return res.status(200).json(result);
}

export async function getOnboardingStatus(req: Request, res: Response) {
  const athlete = await getOnboardingByUser(req.user!.id);
  return res.status(200).json({ athlete });
}
