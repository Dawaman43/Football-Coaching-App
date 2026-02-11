import { and, eq, or } from "drizzle-orm";

import { db } from "../db";
import { messageTable, userTable } from "../db/schema";

export async function getCoachUser() {
  const users = await db.select().from(userTable).where(or(eq(userTable.role, "coach"), eq(userTable.role, "admin"), eq(userTable.role, "superAdmin"))).limit(1);
  return users[0] ?? null;
}

export async function listThread(userId: number) {
  const coach = await getCoachUser();
  if (!coach) {
    return [];
  }

  return db
    .select()
    .from(messageTable)
    .where(
      or(
        and(eq(messageTable.senderId, userId), eq(messageTable.receiverId, coach.id)),
        and(eq(messageTable.senderId, coach.id), eq(messageTable.receiverId, userId))
      )
    )
    .orderBy(messageTable.createdAt);
}

export async function sendMessage(input: {
  senderId: number;
  receiverId: number;
  content: string;
  contentType: "text" | "image" | "video";
  mediaUrl?: string | null;
}) {
  const result = await db
    .insert(messageTable)
    .values({
      senderId: input.senderId,
      receiverId: input.receiverId,
      content: input.content,
      contentType: input.contentType,
      mediaUrl: input.mediaUrl ?? null,
    })
    .returning();

  return result[0];
}

export async function markThreadRead(userId: number) {
  const coach = await getCoachUser();
  if (!coach) {
    return 0;
  }

  const result = await db
    .update(messageTable)
    .set({ read: true })
    .where(and(eq(messageTable.receiverId, userId), eq(messageTable.senderId, coach.id)));

  return result.rowCount ?? 0;
}
