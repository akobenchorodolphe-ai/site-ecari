import { describe, expect, it } from "vitest";

import { generateCeraoMatricule } from "@/lib/cerao/matricule";

describe("generateCeraoMatricule", () => {
  it("genere un matricule sur 4 chiffres a partir d'un entier", () => {
    expect(generateCeraoMatricule(12, 2026)).toBe("2026-DrCERAO-0012");
  });

  it("accepte un bigint issu de la base Prisma", () => {
    expect(generateCeraoMatricule(BigInt(507), 2026)).toBe("2026-DrCERAO-0507");
  });
});
