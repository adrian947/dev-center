import { z } from "zod";

// .env files often set unfilled variables to an empty string rather than leaving them
// absent; treat "" the same as "unset" so `.optional()` fields behave as expected.
const optionalString = () =>
  z.preprocess((value) => (value === "" ? undefined : value), z.string().min(1).optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: optionalString(),
  GOOGLE_CLIENT_ID: optionalString(),
  GOOGLE_CLIENT_SECRET: optionalString(),
  GOOGLE_CALLBACK_URL: optionalString(),
  SESSION_SECRET: optionalString(),
  FRONTEND_URL: z.string().min(1).default("http://localhost:5173"),
  BACKEND_URL: z.string().min(1).default("http://localhost:3001"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
