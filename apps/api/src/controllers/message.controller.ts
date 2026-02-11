import type { Request, Response } from "express";
import { z } from "zod";

import { listThread, markThreadRead, sendMessage, getCoachUser } from "../services/message.service";

const sendSchema = z.object({
  content: z.string().min(1),
  contentType: z.enum(["text", "image", "video"]).default("text"),
  mediaUrl: z.string().url().optional(),
});

export async function listMessages(req: Request, res: Response) {
  const messages = await listThread(req.user!.id);
  return res.status(200).json({ messages });
}

export async function sendMessageToCoach(req: Request, res: Response) {
  const input = sendSchema.parse(req.body);
  const coach = await getCoachUser();
  if (!coach) {
    return res.status(400).json({ error: "Coach not available" });
  }
  const message = await sendMessage({
    senderId: req.user!.id,
    receiverId: coach.id,
    content: input.content,
    contentType: input.contentType,
    mediaUrl: input.mediaUrl,
  });
  return res.status(201).json({ message });
}

export async function markRead(req: Request, res: Response) {
  const count = await markThreadRead(req.user!.id);
  return res.status(200).json({ updated: count });
}
