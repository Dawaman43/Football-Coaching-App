import { eq } from "drizzle-orm";

import { db } from "../db";
import { athleteTable, contentTable, ProgramType } from "../db/schema";

const tierOrder: Record<(typeof ProgramType.enumValues)[number], number> = {
  PHP: 1,
  PHP_Plus: 2,
  PHP_Premium: 3,
};

export async function getHomeContent() {
  return db.select().from(contentTable).where(eq(contentTable.surface, "home"));
}

export async function getParentPlatformContent(userId: number) {
  const athlete = await db.select().from(athleteTable).where(eq(athleteTable.userId, userId)).limit(1);
  const tier = athlete[0]?.currentProgramTier ?? "PHP";
  const allowed = tierOrder[tier];

  const items = await db.select().from(contentTable).where(eq(contentTable.surface, "parent_platform"));
  return items.filter((item) => {
    if (!item.programTier) {
      return true;
    }
    return tierOrder[item.programTier] <= allowed;
  });
}

export async function createContent(input: {
  title: string;
  content: string;
  type: string;
  body?: string | null;
  programTier?: (typeof ProgramType.enumValues)[number] | null;
  surface: "home" | "parent_platform";
  category?: string | null;
  createdBy: number;
}) {
  const result = await db
    .insert(contentTable)
    .values({
      title: input.title,
      content: input.content,
      type: input.type as any,
      body: input.body ?? null,
      programTier: input.programTier ?? null,
      surface: input.surface,
      category: input.category ?? null,
      createdBy: input.createdBy,
    })
    .returning();

  return result[0];
}
