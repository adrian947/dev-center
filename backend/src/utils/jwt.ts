import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const TOKEN_TTL = "30d";

export interface AccessTokenPayload {
  sub: string;
}

export function signAccessToken(userId: string): string {
  if (!env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured");
  }
  return jwt.sign({ sub: userId }, env.SESSION_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  if (!env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured");
  }
  return jwt.verify(token, env.SESSION_SECRET) as AccessTokenPayload;
}
