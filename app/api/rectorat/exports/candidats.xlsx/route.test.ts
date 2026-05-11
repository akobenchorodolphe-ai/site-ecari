// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminSession: vi.fn(),
  getCandidateRowsForExport: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  getAdminSession: mocks.getAdminSession,
}));

vi.mock("@/lib/rectorat/queries", () => ({
  getCandidateRowsForExport: mocks.getCandidateRowsForExport,
}));

import { GET } from "@/app/api/rectorat/exports/candidats.xlsx/route";

describe("GET /api/rectorat/exports/candidats.xlsx", () => {
  it("retourne 401 sans session Rectorat", async () => {
    mocks.getAdminSession.mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("retourne un fichier xlsx avec session valide", async () => {
    mocks.getAdminSession.mockResolvedValue({
      userId: "1",
      email: "rectorat@example.org",
      role: "RECTORAT",
    });
    mocks.getCandidateRowsForExport.mockResolvedValue([
      {
        matricule: "2026-DrCERAO-0001",
        nom: "Kouassi",
        prenoms: "Jean Baptiste",
        email: "jean@example.org",
        telephone: "+2250700000000",
        pays: "Cote d'Ivoire",
        etatVie: "PRETRE",
        avisSuperieur: "OUI",
        disponibilite: "Oui",
        doctoratPrincipal: "Doctorat en Droit Canonique",
        dateSoumission: new Date("2026-04-27T12:00:00.000Z"),
      },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("spreadsheetml");
  });
});
