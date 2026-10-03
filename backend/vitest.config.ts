import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      SESSION_SECRET: "test-session-secret",
      DATABASE_URL: "postgresql://devcenter:devcenter@localhost:5432/devcenter_test",
    },
  },
});
