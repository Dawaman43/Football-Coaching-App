import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "../db";
import { availabilityBlockTable, bookingTable, serviceTypeTable } from "../db/schema";

export async function listServiceTypes() {
  return db.select().from(serviceTypeTable).where(eq(serviceTypeTable.isActive, true));
}

export async function createServiceType(input: {
  name: string;
  type: "group_call" | "one_on_one" | "role_model";
  durationMinutes: number;
  capacity?: number | null;
  fixedStartTime?: string | null;
  programTier?: "PHP" | "PHP_Plus" | "PHP_Premium" | null;
  createdBy: number;
}) {
  const result = await db
    .insert(serviceTypeTable)
    .values({
      name: input.name,
      type: input.type,
      durationMinutes: input.durationMinutes,
      capacity: input.capacity ?? null,
      fixedStartTime: input.fixedStartTime ?? null,
      programTier: input.programTier ?? null,
      createdBy: input.createdBy,
    })
    .returning();

  return result[0];
}

export async function createAvailabilityBlock(input: {
  serviceTypeId: number;
  startsAt: Date;
  endsAt: Date;
  createdBy: number;
}) {
  const result = await db
    .insert(availabilityBlockTable)
    .values({
      serviceTypeId: input.serviceTypeId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      createdBy: input.createdBy,
    })
    .returning();

  return result[0];
}

export async function listAvailabilityBlocks(serviceTypeId: number, from: Date, to: Date) {
  return db
    .select()
    .from(availabilityBlockTable)
    .where(and(eq(availabilityBlockTable.serviceTypeId, serviceTypeId), gte(availabilityBlockTable.startsAt, from), lte(availabilityBlockTable.endsAt, to)));
}

export async function createBooking(input: {
  athleteId: number;
  guardianId: number;
  serviceTypeId: number;
  startsAt: Date;
  endsAt: Date;
  createdBy: number;
  location?: string | null;
  meetingLink?: string | null;
}) {
  const serviceType = await db.select().from(serviceTypeTable).where(eq(serviceTypeTable.id, input.serviceTypeId)).limit(1);
  if (!serviceType[0]) {
    throw new Error("Service type not found");
  }

  if (serviceType[0].fixedStartTime) {
    const startTime = input.startsAt.toISOString().substring(11, 16);
    if (startTime !== serviceType[0].fixedStartTime) {
      throw new Error("Invalid start time");
    }
  }

  if (serviceType[0].capacity) {
    const existing = await db
      .select()
      .from(bookingTable)
      .where(and(eq(bookingTable.serviceTypeId, input.serviceTypeId), eq(bookingTable.startsAt, input.startsAt)));

    if (existing.length >= serviceType[0].capacity) {
      throw new Error("Capacity reached");
    }
  }

  const result = await db
    .insert(bookingTable)
    .values({
      athleteId: input.athleteId,
      guardianId: input.guardianId,
      type: serviceType[0].type,
      status: "confirmed",
      startsAt: input.startsAt,
      endTime: input.endsAt,
      location: input.location ?? null,
      meetingLink: input.meetingLink ?? null,
      serviceTypeId: input.serviceTypeId,
      createdBy: input.createdBy,
    })
    .returning();

  return result[0];
}

export async function listBookingsForUser(guardianId: number) {
  return db.select().from(bookingTable).where(eq(bookingTable.guardianId, guardianId));
}
