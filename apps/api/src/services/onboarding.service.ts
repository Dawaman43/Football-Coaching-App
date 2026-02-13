import { and, eq } from "drizzle-orm";

import { db } from "../db";
import {
  athleteTable,
  enrollmentTable,
  guardianTable,
  legalAcceptanceTable,
  onboardingConfigTable,
  ProgramType,
} from "../db/schema";
import { sql } from "drizzle-orm";

const defaultPublicConfig = {
  version: 1,
  fields: [
    { id: "athleteName", label: "Athlete Name", type: "text", required: true, visible: true },
    { id: "age", label: "Age", type: "number", required: true, visible: true },
    {
      id: "team",
      label: "Team",
      type: "dropdown",
      required: true,
      visible: true,
      options: ["Team A", "Team B"],
    },
    {
      id: "level",
      label: "Level",
      type: "dropdown",
      required: true,
      visible: true,
      options: ["U12", "U14", "U16", "U18"],
      optionsByTeam: {
        "Team A": ["U12", "U14"],
        "Team B": ["U16", "U18"],
      },
    },
    { id: "trainingPerWeek", label: "Training Days / Week", type: "number", required: true, visible: true },
    { id: "injuries", label: "Injuries / History", type: "text", required: true, visible: true },
    { id: "growthNotes", label: "Growth Notes", type: "text", required: false, visible: true },
    { id: "performanceGoals", label: "Performance Goals", type: "text", required: true, visible: true },
    { id: "equipmentAccess", label: "Equipment Access", type: "text", required: true, visible: true },
    { id: "parentEmail", label: "Guardian Email", type: "text", required: true, visible: true },
    { id: "parentPhone", label: "Guardian Phone", type: "text", required: false, visible: true },
    {
      id: "relationToAthlete",
      label: "Relation to Athlete",
      type: "dropdown",
      required: true,
      visible: true,
      options: ["Parent", "Guardian", "Coach"],
    },
    {
      id: "desiredProgramType",
      label: "Program Tier Selection",
      type: "dropdown",
      required: true,
      visible: true,
      options: ["PHP", "PHP_Plus", "PHP_Premium"],
    },
  ],
  requiredDocuments: [
    { id: "consent", label: "Guardian Consent Form", required: true },
  ],
  welcomeMessage: "Welcome to PH Performance. Let's get your athlete set up.",
  coachMessage: "Need help? Your coach is ready to support you.",
  defaultProgramTier: "PHP" as (typeof ProgramType.enumValues)[number],
  approvalWorkflow: "manual",
  notes: "",
};

async function ensureOnboardingConfigTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "onboarding_configs" (
      "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "version" integer DEFAULT 1 NOT NULL,
      "fields" jsonb NOT NULL,
      "requiredDocuments" jsonb NOT NULL,
      "welcomeMessage" varchar(500),
      "coachMessage" varchar(500),
      "defaultProgramTier" program_type NOT NULL DEFAULT 'PHP',
      "approvalWorkflow" varchar(50) NOT NULL DEFAULT 'manual',
      "notes" varchar(1000),
      "createdBy" integer REFERENCES "users"("id"),
      "updatedBy" integer REFERENCES "users"("id"),
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`
    ALTER TABLE "athletes" ADD COLUMN IF NOT EXISTS "extraResponses" jsonb
  `);
}

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
  extraResponses?: Record<string, unknown>;
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
        extraResponses: input.extraResponses ?? null,
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
      extraResponses: input.extraResponses ?? null,
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

export async function getPublicOnboardingConfig() {
  try {
    const configs = await db.select().from(onboardingConfigTable).limit(1);
    if (configs[0]) return configs[0];
  } catch {
    await ensureOnboardingConfigTable();
  }

  const created = await db
    .insert(onboardingConfigTable)
    .values({
      version: defaultPublicConfig.version,
      fields: defaultPublicConfig.fields,
      requiredDocuments: defaultPublicConfig.requiredDocuments,
      welcomeMessage: defaultPublicConfig.welcomeMessage,
      coachMessage: defaultPublicConfig.coachMessage,
      defaultProgramTier: defaultPublicConfig.defaultProgramTier,
      approvalWorkflow: defaultPublicConfig.approvalWorkflow,
      notes: defaultPublicConfig.notes,
    } as any)
    .returning();

  return created[0];
}
