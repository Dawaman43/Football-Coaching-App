import { and, eq, inArray, or } from "drizzle-orm";

import { db } from "../db";
import {
  athleteTable,
  bookingTable,
  enrollmentTable,
  exerciseTable,
  guardianTable,
  messageTable,
  programTable,
  serviceTypeTable,
  sessionExerciseTable,
  sessionTable,
  userTable,
  ProgramType,
} from "../db/schema";

export async function listUsers() {
  return db.select().from(userTable);
}

export async function getUserOnboarding(userId: number) {
  const guardians = await db.select().from(guardianTable).where(eq(guardianTable.userId, userId)).limit(1);
  const guardian = guardians[0] ?? null;
  if (!guardian) {
    return { guardian: null, athlete: null };
  }
  const athletes = await db.select().from(athleteTable).where(eq(athleteTable.guardianId, guardian.id)).limit(1);
  return { guardian, athlete: athletes[0] ?? null };
}

export async function updateAthleteProgramTier(athleteId: number, tier: (typeof ProgramType.enumValues)[number]) {
  const result = await db
    .update(athleteTable)
    .set({ currentProgramTier: tier })
    .where(eq(athleteTable.id, athleteId))
    .returning();

  return result[0] ?? null;
}

export async function assignEnrollment(input: {
  athleteId: number;
  programType: (typeof ProgramType.enumValues)[number];
  programTemplateId?: number | null;
  assignedByCoach: number;
}) {
  const result = await db
    .insert(enrollmentTable)
    .values({
      athleteId: input.athleteId,
      programType: input.programType,
      status: "active",
      programTemplateId: input.programTemplateId ?? null,
      assignedByCoach: input.assignedByCoach,
    })
    .returning();

  return result[0];
}

export async function createProgramTemplate(input: {
  name: string;
  type: (typeof ProgramType.enumValues)[number];
  description?: string | null;
  createdBy: number;
}) {
  const result = await db
    .insert(programTable)
    .values({
      name: input.name,
      type: input.type,
      description: input.description ?? null,
      isTemplate: true,
      createdBy: input.createdBy,
    })
    .returning();

  return result[0];
}

export async function createExercise(input: {
  name: string;
  cues?: string | null;
  sets?: number | null;
  reps?: number | null;
  duration?: number | null;
  restSeconds?: number | null;
  notes?: string | null;
  videoUrl?: string | null;
}) {
  const result = await db
    .insert(exerciseTable)
    .values({
      name: input.name,
      cues: input.cues ?? null,
      sets: input.sets ?? null,
      reps: input.reps ?? null,
      duration: input.duration ?? null,
      restSeconds: input.restSeconds ?? null,
      notes: input.notes ?? null,
      videoUrl: input.videoUrl ?? null,
    })
    .returning();

  return result[0];
}

export async function createSession(input: {
  programId: number;
  weekNumber: number;
  sessionNumber: number;
  type: string;
}) {
  const result = await db
    .insert(sessionTable)
    .values({
      programId: input.programId,
      weekNumber: input.weekNumber,
      sessionNumber: input.sessionNumber,
      type: input.type as any,
    })
    .returning();

  return result[0];
}

export async function addExerciseToSession(input: {
  sessionId: number;
  exerciseId: number;
  order: number;
  coachingNotes?: string | null;
  progressionNotes?: string | null;
  regressionNotes?: string | null;
}) {
  const result = await db
    .insert(sessionExerciseTable)
    .values({
      sessionId: input.sessionId,
      exerciseId: input.exerciseId,
      order: input.order,
      coachingNotes: input.coachingNotes ?? null,
      progressionNotes: input.progressionNotes ?? null,
      regressionNotes: input.regressionNotes ?? null,
    })
    .returning();

  return result[0];
}

export async function listBookingsAdmin() {
  const rows = await db
    .select({
      id: bookingTable.id,
      startsAt: bookingTable.startsAt,
      endTime: bookingTable.endTime,
      type: bookingTable.type,
      status: bookingTable.status,
      location: bookingTable.location,
      meetingLink: bookingTable.meetingLink,
      serviceName: serviceTypeTable.name,
      athleteName: athleteTable.name,
    })
    .from(bookingTable)
    .leftJoin(serviceTypeTable, eq(bookingTable.serviceTypeId, serviceTypeTable.id))
    .leftJoin(athleteTable, eq(bookingTable.athleteId, athleteTable.id));

  return rows;
}

export async function listMessageThreadsAdmin(coachId: number) {
  const messages = await db
    .select()
    .from(messageTable)
    .where(or(eq(messageTable.senderId, coachId), eq(messageTable.receiverId, coachId)));

  const threads = new Map<number, { lastMessage: typeof messages[number]; unread: number }>();
  for (const msg of messages) {
    const otherId = msg.senderId === coachId ? msg.receiverId : msg.senderId;
    const current = threads.get(otherId);
    const isUnread = msg.receiverId === coachId && !msg.read;
    if (!current || new Date(msg.createdAt) > new Date(current.lastMessage.createdAt)) {
      threads.set(otherId, { lastMessage: msg, unread: (current?.unread ?? 0) + (isUnread ? 1 : 0) });
    } else if (isUnread) {
      current.unread += 1;
    }
  }

  const userIds = Array.from(threads.keys());
  const users = userIds.length
    ? await db.select().from(userTable).where(inArray(userTable.id, userIds))
    : [];

  return userIds.map((id) => {
    const info = threads.get(id)!;
    const user = users.find((u) => u.id === id);
    return {
      userId: id,
      name: user?.name ?? user?.email ?? "Unknown",
      preview: info.lastMessage.content,
      time: info.lastMessage.createdAt,
      unread: info.unread,
    };
  });
}

export async function listThreadMessagesAdmin(coachId: number, userId: number) {
  return db
    .select()
    .from(messageTable)
    .where(
      or(
        and(eq(messageTable.senderId, coachId), eq(messageTable.receiverId, userId)),
        and(eq(messageTable.senderId, userId), eq(messageTable.receiverId, coachId))
      )
    )
    .orderBy(messageTable.createdAt);
}

export async function sendMessageAdmin(input: {
  coachId: number;
  userId: number;
  content: string;
}) {
  const result = await db
    .insert(messageTable)
    .values({
      senderId: input.coachId,
      receiverId: input.userId,
      content: input.content,
      contentType: "text",
    })
    .returning();

  return result[0];
}
