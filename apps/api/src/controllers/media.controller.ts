import type { Request, Response } from "express";
import { z } from "zod";

import { getSignedMediaUrl } from "../services/cloudfront.service";

const signSchema = z.object({
  path: z.string().min(1),
  expiresInSeconds: z.number().int().min(60).max(86400).default(900),
});

export async function signMediaUrl(req: Request, res: Response) {
  const input = signSchema.parse(req.body);
  const url = getSignedMediaUrl({ path: input.path, expiresInSeconds: input.expiresInSeconds });
  return res.status(200).json({ url });
}
