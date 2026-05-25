import { describe, expect, it } from "vitest";

import { ecariLeadSchema } from "@/lib/ecari/leads";

describe("ecariLeadSchema", () => {
  it("valide une intention de don complete", () => {
    expect(() =>
      ecariLeadSchema.parse({
        type: "donation",
        amount: "50000",
        nom: "Kouassi",
        prenom: "Aimee",
        email: "aimee@example.org",
        phone: "+2250700000000",
        operator: "WAVE",
      }),
    ).not.toThrow();
  });

  it("refuse une preinscription sans filiere", () => {
    const result = ecariLeadSchema.safeParse({
      type: "student-pre-registration",
      nom: "Kouassi",
      prenom: "Aimee",
      email: "aimee@example.org",
      phone: "+2250700000000",
      niveauSouhaite: "Licence 1",
      filiereSouhaitee: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message.toLowerCase()).toContain("filiere");
    }
  });

  it("refuse un partenariat sans description de la demande", () => {
    const result = ecariLeadSchema.safeParse({
      type: "partnership",
      organisation: "Fondation Exemple",
      contactName: "Yao Marie",
      email: "contact@example.org",
      phone: "+2250700000000",
      supportType: "Financement de projet",
      message: "trop court",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message.toLowerCase()).toContain("preciser");
    }
  });
});
