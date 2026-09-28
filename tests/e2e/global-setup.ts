import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const AUTH_DIR = path.resolve(process.cwd(), "tests/e2e/.auth");
const STORAGE_STATE_PATH = path.join(AUTH_DIR, "storageState.json");

function loadRootEnv(): void {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line.trim());
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2];
    }
  }
}

export default async function globalSetup(): Promise<void> {
  loadRootEnv();

  const prisma = new PrismaClient();
  const user = await prisma.user.upsert({
    where: { googleId: "e2e-test-google-id" },
    update: {},
    create: {
      googleId: "e2e-test-google-id",
      email: "e2e@devcenter.test",
      name: "E2E Test",
    },
  });
  await prisma.$disconnect();

  const token = jwt.sign({ sub: user.id }, process.env.SESSION_SECRET!, { expiresIn: "1h" });

  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(
    STORAGE_STATE_PATH,
    JSON.stringify({
      cookies: [
        {
          name: "devcenter_token",
          value: token,
          domain: "localhost",
          path: "/",
          httpOnly: false,
          secure: false,
          sameSite: "Lax",
          expires: Math.floor(Date.now() / 1000) + 3600,
        },
      ],
      origins: [],
    }),
  );
}
