import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import { prisma } from "../../db/prisma.js";
import { signAccessToken } from "../../utils/jwt.js";
import { AUTH_COOKIE_NAME } from "../../utils/authCookie.js";
import { TOOL_IDS } from "@devcenter/shared";

const app = createApp();

let userA: string;
let userB: string;

const cookieFor = (userId: string) => `${AUTH_COOKIE_NAME}=${signAccessToken(userId)}`;

async function createUser(tag: string): Promise<string> {
  const user = await prisma.user.create({
    data: {
      googleId: `tools-test-${tag}`,
      email: `tools-test-${tag}@example.com`,
      name: `Tools Test ${tag}`,
    },
  });
  return user.id;
}

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { googleId: { startsWith: "tools-test-" } } });
  userA = await createUser("a");
  userB = await createUser("b");
});

beforeEach(async () => {
  await prisma.favoriteTool.deleteMany({ where: { userId: { in: [userA, userB] } } });
  await prisma.recentTool.deleteMany({ where: { userId: { in: [userA, userB] } } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { googleId: { startsWith: "tools-test-" } } });
  await prisma.$disconnect();
});

describe("auth", () => {
  it("rejects unauthenticated requests", async () => {
    const response = await request(app).get("/api/tools/favorites");
    expect(response.status).toBe(401);
  });
});

describe("favorites", () => {
  it("adds a favorite idempotently", async () => {
    const put = () =>
      request(app).put("/api/tools/favorites/json").set("Cookie", cookieFor(userA));

    expect((await put()).status).toBe(204);
    expect((await put()).status).toBe(204);

    expect(await prisma.favoriteTool.count({ where: { userId: userA } })).toBe(1);
  });

  it("rejects an unknown toolId with 400", async () => {
    const response = await request(app)
      .put("/api/tools/favorites/no-existe")
      .set("Cookie", cookieFor(userA));
    expect(response.status).toBe(400);
  });

  it("lists favorites newest first", async () => {
    await request(app).put("/api/tools/favorites/json").set("Cookie", cookieFor(userA));
    await request(app).put("/api/tools/favorites/jwt").set("Cookie", cookieFor(userA));

    const response = await request(app).get("/api/tools/favorites").set("Cookie", cookieFor(userA));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(["jwt", "json"]);
  });

  it("removes a favorite idempotently", async () => {
    await request(app).put("/api/tools/favorites/json").set("Cookie", cookieFor(userA));

    const del = () =>
      request(app).delete("/api/tools/favorites/json").set("Cookie", cookieFor(userA));

    expect((await del()).status).toBe(204);
    expect((await del()).status).toBe(204);
    expect(await prisma.favoriteTool.count({ where: { userId: userA } })).toBe(0);
  });

  it("isolates favorites between users", async () => {
    await request(app).put("/api/tools/favorites/json").set("Cookie", cookieFor(userA));

    const response = await request(app).get("/api/tools/favorites").set("Cookie", cookieFor(userB));

    expect(response.body).toEqual([]);
  });
});

describe("recent", () => {
  const track = (userId: string, toolId: string) =>
    request(app).post("/api/tools/recent").set("Cookie", cookieFor(userId)).send({ toolId });

  it("upserts the same tool and increments useCount", async () => {
    expect((await track(userA, "uuid")).status).toBe(204);
    expect((await track(userA, "uuid")).status).toBe(204);

    const rows = await prisma.recentTool.findMany({ where: { userId: userA } });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.useCount).toBe(2);
  });

  it("rejects an unknown toolId with 400", async () => {
    expect((await track(userA, "no-existe")).status).toBe(400);
  });

  it("returns at most 8 items ordered by lastUsedAt desc", async () => {
    for (const toolId of TOOL_IDS.slice(0, 10)) {
      await track(userA, toolId);
    }

    const response = await request(app).get("/api/tools/recent").set("Cookie", cookieFor(userA));

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(8);
    expect(response.body[0].toolId).toBe(TOOL_IDS[9]);
  });

  it("prunes to 20 rows after 21 distinct tools", async () => {
    for (const toolId of TOOL_IDS.slice(0, 21)) {
      await track(userA, toolId);
    }

    expect(await prisma.recentTool.count({ where: { userId: userA } })).toBe(20);
  });

  it("isolates recents between users", async () => {
    await track(userA, "json");

    const response = await request(app).get("/api/tools/recent").set("Cookie", cookieFor(userB));

    expect(response.body).toEqual([]);
  });
});
