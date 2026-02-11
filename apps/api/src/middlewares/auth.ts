import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../lib/jwt";
import { createUserFromCognito, getUserByCognitoSub } from "../services/user.service";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = await verifyAccessToken(token);
    const sub = payload.sub as string | undefined;
    const email = payload.email as string | undefined;
    const name = (payload.name as string | undefined) ?? email ?? "";

    if (!sub || !email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let user = await getUserByCognitoSub(sub);
    if (!user) {
      user = await createUserFromCognito({ sub, email, name });
    }

    req.user = { id: user.id, role: user.role, email: user.email, name: user.name, sub: user.cognitoSub };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
