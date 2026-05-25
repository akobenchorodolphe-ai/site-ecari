// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  parseEcariLead: vi.fn(),
  saveEcariLead: vi.fn(),
}));

vi.mock("@/lib/ecari/leads", () => ({
  parseEcariLead: mocks.parseEcariLead,
  saveEcariLead: mocks.saveEcariLead,
}));

import { POST } from "@/app/api/ecari/leads/route";

describe("POST /api/ecari/leads", () => {
  it("retourne 201 avec la reference creee", async () => {
    mocks.parseEcariLead.mockReturnValue({
      type: "donation",
      amount: 10000,
    });
    mocks.saveEcariLead.mockResolvedValue({
      id: "lead-123",
      submittedAt: "2026-05-25T12:00:00.000Z",
      type: "donation",
    });

    const response = await POST(
      new Request("http://localhost/api/ecari/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      id: "lead-123",
      submittedAt: "2026-05-25T12:00:00.000Z",
      type: "donation",
    });
  });

  it("retourne 400 si le JSON est invalide", async () => {
    const response = await POST(
      new Request("http://localhost/api/ecari/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
  });
});
