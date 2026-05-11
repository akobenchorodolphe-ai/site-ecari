// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  parseApplicationFormData: vi.fn(),
  submitCandidateApplication: vi.fn(),
  DuplicateEmailError: class DuplicateEmailError extends Error {},
}));

vi.mock("@/lib/cerao/service", () => ({
  parseApplicationFormData: mocks.parseApplicationFormData,
  submitCandidateApplication: mocks.submitCandidateApplication,
  DuplicateEmailError: mocks.DuplicateEmailError,
}));

import { POST } from "@/app/api/cerao/applications/route";

describe("POST /api/cerao/applications", () => {
  it("retourne 201 avec le matricule cree", async () => {
    mocks.parseApplicationFormData.mockResolvedValue({ payload: {}, files: {} });
    mocks.submitCandidateApplication.mockResolvedValue({
      id: BigInt(12),
      matricule: "2026-DrCERAO-0012",
    });

    const response = await POST(
      new Request("http://localhost/api/cerao/applications", {
        method: "POST",
        body: new FormData(),
      }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      id: "12",
      matricule: "2026-DrCERAO-0012",
    });
  });

  it("retourne 409 si l'email est deja utilise", async () => {
    mocks.parseApplicationFormData.mockResolvedValue({ payload: {}, files: {} });
    mocks.submitCandidateApplication.mockRejectedValue(
      new mocks.DuplicateEmailError("duplicate"),
    );

    const response = await POST(
      new Request("http://localhost/api/cerao/applications", {
        method: "POST",
        body: new FormData(),
      }),
    );

    expect(response.status).toBe(409);
  });
});
