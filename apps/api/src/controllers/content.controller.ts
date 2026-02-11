import type { Request, Response } from "express";
import { z } from "zod";

import { createContent, getHomeContent, getParentPlatformContent } from "../services/content.service";
import { ProgramType, contentType } from "../db/schema";

const contentCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(contentType.enumValues),
  body: z.string().optional(),
  programTier: z.enum(ProgramType.enumValues).optional(),
  surface: z.enum(["home", "parent_platform"]),
  category: z.string().optional(),
});

export async function listHomeContent(_req: Request, res: Response) {
  const items = await getHomeContent();
  return res.status(200).json({ items });
}

export async function listParentContent(req: Request, res: Response) {
  const items = await getParentPlatformContent(req.user!.id);
  return res.status(200).json({ items });
}

export async function createContentItem(req: Request, res: Response) {
  const input = contentCreateSchema.parse(req.body);
  const item = await createContent({
    title: input.title,
    content: input.content,
    type: input.type,
    body: input.body,
    programTier: input.programTier,
    surface: input.surface,
    category: input.category,
    createdBy: req.user!.id,
  });
  return res.status(201).json({ item });
}
