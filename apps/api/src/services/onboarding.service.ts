import { and, eq } from "drizzle-orm";

import { db } from "../db";
import {
  athleteTable,
  enrollmentTable,
  guardianTable,
  legalAcceptanceTable,
  ProgramType,
} from "../db/schema";

export async function getOnboardingByUser(userId: number) {
  const athletes = await db.select().from(athleteTable).where(eq(athleteTable.userId, userId)).limit(1);
  return athletes[0] ?? null;
}

export async function submitOnboarding(input: {
  userId: number;
  athleteName: string;
  age: number;
  team: string;
  trainingPerWeek: number;
  injuries?: unknown;
  growthNotes?: string | null;
  performanceGoals?: string | null;
  equipmentAccess?: string | null;
  parentEmail: string;
  parentPhone?: string | null;
  relationToAthlete?: string | null;
  desiredProgramType: (typeof ProgramType.enumValues)[number];
  termsVersion: string;
  privacyVersion: string;
  appVersion: string;
}) {
  const existing = await db.select().from(athleteTable).where(eq(athleteTable.userId, input.userId)).limit(1);
  const now = new Date();

  let guardianId: number;
  if (existing[0]) {
    guardianId = existing[0].guardianId;
    await db
      .update(guardianTable)
      .set({ email: input.parentEmail, phoneNumber: input.parentPhone ?? null, relationToAthlete: input.relationToAthlete ?? null })
      .where(eq(guardianTable.id, guardianId));
    await db
      .update(athleteTable)
      .set({
        name: input.athleteName,
        age: input.age,
        team: input.team,
        trainingPerWeek: input.trainingPerWeek,
        injuries: input.injuries ?? null,
        growthNotes: input.growthNotes ?? null,
        performanceGoals: input.performanceGoals ?? null,
        equipmentAccess: input.equipmentAccess ?? null,
        onboardingCompleted: true,
        onboardingCompletedAt: now,
      })
      .where(eq(athleteTable.userId, input.userId));
  } else {
    const guardianResult = await db
      .insert(guardianTable)
      .values({
        userId: input.userId,
        email: input.parentEmail,
        phoneNumber: input.parentPhone ?? null,
        relationToAthlete: input.relationToAthlete ?? null,
      })
      .returning();

    guardianId = guardianResult[0].id;

    await db.insert(athleteTable).values({
      userId: input.userId,
      guardianId,
      name: input.athleteName,
      age: input.age,
      team: input.team,
      trainingPerWeek: input.trainingPerWeek,
      injuries: input.injuries ?? null,
      growthNotes: input.growthNotes ?? null,
      performanceGoals: input.performanceGoals ?? null,
      equipmentAccess: input.equipmentAccess ?? null,
      onboardingCompleted: true,
      onboardingCompletedAt: now,
      currentProgramTier: input.desiredProgramType === "PHP" ? "PHP" : null,
    });
  }

  const athlete = await db.select().from(athleteTable).where(eq(athleteTable.userId, input.userId)).limit(1);
  const athleteId = athlete[0].id;

  await db.insert(legalAcceptanceTable).values({
    athleteId,
    termsAcceptedAt: now,
    termsVersion: input.termsVersion,
    privacyAcceptedAt: now,
    privacyVersion: input.privacyVersion,
    appVersion: input.appVersion,
  });

  const status = input.desiredProgramType === "PHP" ? "active" : "pending";

  const existingEnrollment = await db
    .select()
    .from(enrollmentTable)
    .where(and(eq(enrollmentTable.athleteId, athleteId), eq(enrollmentTable.programType, input.desiredProgramType)))
    .limit(1);

  if (!existingEnrollment[0]) {
    await db.insert(enrollmentTable).values({
      athleteId,
      programType: input.desiredProgramType,
      status,
      assignedByCoach: input.desiredProgramType === "PHP" ? input.userId : null,
    });
  }

  return { athleteId, status };
}
