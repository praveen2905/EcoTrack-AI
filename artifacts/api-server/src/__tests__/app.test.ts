import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("@workspace/db", () => {
  const makeChain = (finalValue: unknown) => {
    const chain: Record<string, unknown> = {};
    const methods = [
      "select", "from", "orderBy", "limit", "where",
      "insert", "values", "update", "set",
    ];
    for (const m of methods) {
      chain[m] = vi.fn(() => chain);
    }
    chain["returning"] = vi.fn(() => Promise.resolve(finalValue));
    chain["then"] = (resolve: (v: unknown) => unknown) =>
      Promise.resolve(finalValue).then(resolve);
    return chain;
  };

  return {
    db: makeChain([]),
    assessmentsTable: { id: "id", createdAt: "createdAt" },
    challengesTable: { id: "id", completed: "completed" },
    leaderboardTable: { id: "id" },
  };
});

import app from "../app";

describe("Health endpoint", () => {
  it("GET /api/healthz returns 200 with status ok", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });
});

describe("Security headers", () => {
  it("sets X-Content-Type-Options: nosniff", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("sets X-Frame-Options", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.headers["x-frame-options"]).toBeDefined();
  });

  it("sets X-XSS-Protection or CSP", async () => {
    const res = await request(app).get("/api/healthz");
    const hasCsp = !!res.headers["content-security-policy"];
    const hasXss = !!res.headers["x-xss-protection"];
    expect(hasCsp || hasXss).toBe(true);
  });

  it("does not expose X-Powered-By", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});

describe("Request body validation", () => {
  it("POST /api/assessments rejects missing required fields with 400", async () => {
    const res = await request(app)
      .post("/api/assessments")
      .send({ transportKm: "not-a-number" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
  });

  it("POST /api/assessments rejects empty body with 400", async () => {
    const res = await request(app)
      .post("/api/assessments")
      .send({})
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
  });
});

describe("404 handling", () => {
  it("returns 404 for unknown /api routes", async () => {
    const res = await request(app).get("/api/does-not-exist-ever");
    expect(res.status).toBe(404);
  });
});

describe("CORS", () => {
  it("blocks requests from disallowed origins", async () => {
    const res = await request(app)
      .get("/api/healthz")
      .set("Origin", "https://evil-attacker.com");
    expect(res.status).not.toBe(200);
  });

  it("allows requests with no origin (server-to-server)", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.status).toBe(200);
  });
});
