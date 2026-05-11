import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";

import { buildCandidatesWorkbook } from "@/lib/rectorat/export";

describe("buildCandidatesWorkbook", () => {
  it("genere un classeur xlsx avec les colonnes attendues", () => {
    const workbookBuffer = buildCandidatesWorkbook([
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

    const workbook = XLSX.read(workbookBuffer, { type: "buffer" });
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    expect(workbook.SheetNames[0]).toBe("Candidats CERAO");
    expect(rows[0]?.Matricule).toBe("2026-DrCERAO-0001");
    expect(rows[0]?.["Doctorat principal"]).toBe("Doctorat en Droit Canonique");
  });
});
