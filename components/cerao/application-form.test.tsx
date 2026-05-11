import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

import { ApplicationForm } from "@/components/cerao/application-form";

function fillStepOne() {
  fireEvent.change(screen.getByLabelText("Nom"), {
    target: { value: "Kouassi" },
  });
  fireEvent.change(screen.getByLabelText(/Pr.noms/i), {
    target: { value: "Jean Baptiste" },
  });
  fireEvent.change(screen.getByLabelText(/Date de naissance/i), {
    target: { value: "1985-08-14" },
  });
  fireEvent.change(screen.getByLabelText(/Nationalit/i), {
    target: { value: "Ivoirienne" },
  });
  fireEvent.change(screen.getByLabelText(/T.l.phone mobile/i), {
    target: { value: "+2250700000000" },
  });
  fireEvent.change(screen.getByLabelText("WhatsApp"), {
    target: { value: "+2250700000000" },
  });
  fireEvent.change(screen.getByLabelText(/Email personnel/i), {
    target: { value: "jean@example.org" },
  });
  fireEvent.change(screen.getByLabelText(/Dioc.se d'incardination/i), {
    target: { value: "Diocese de Yopougon" },
  });
}

describe("ApplicationForm", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("masque le champ d'affiliation pour un laic", () => {
    render(<ApplicationForm />);

    expect(screen.getByLabelText(/Dioc.se d'incardination/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/tat de vie actuel/i), {
      target: { value: "LAIC_MARIE" },
    });

    expect(
      screen.queryByLabelText(/Dioc.se d'incardination/i),
    ).not.toBeInTheDocument();
  });

  it("permet d'ajouter un second diplome apres validation de l'etape 1", async () => {
    render(<ApplicationForm />);
    fillStepOne();

    fireEvent.click(screen.getAllByRole("button", { name: "Suivant" }).at(-1)!);

    expect(
      await screen.findByRole("heading", { name: /Doctorat principal/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Ajouter un autre dipl.me/i }),
    );

    expect(screen.getByText(/Dipl.me n.2/i)).toBeInTheDocument();
  });

  it("redirige vers l'ecran de succes quand l'API repond positivement", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          matricule: "2026-DrCERAO-0012",
        }),
      }),
    );

    render(<ApplicationForm />);
    fillStepOne();
    fireEvent.click(screen.getAllByRole("button", { name: "Suivant" }).at(-1)!);

    fireEvent.change(screen.getByLabelText(/Intitul. exact/i), {
      target: { value: "Doctorat en Droit Canonique" },
    });
    fireEvent.change(screen.getByLabelText("Institution"), {
      target: { value: "UCLy" },
    });
    fireEvent.change(screen.getByLabelText("Pays"), {
      target: { value: "France" },
    });
    fireEvent.change(screen.getByLabelText(/Ann.e d'obtention/i), {
      target: { value: "2022" },
    });
    fireEvent.change(screen.getByLabelText(/Scan du dipl.me/i), {
      target: {
        files: [new File(["proof"], "proof.pdf", { type: "application/pdf" })],
      },
    });
    fireEvent.change(screen.getByLabelText(/Copie num.rique de la th.se/i), {
      target: {
        files: [new File(["thesis"], "thesis.pdf", { type: "application/pdf" })],
      },
    });

    fireEvent.click(screen.getAllByRole("button", { name: "Suivant" }).at(-1)!);
    fireEvent.click(
      screen.getByLabelText(
        /Je certifie sur l'honneur l'exactitude des informations/i,
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: /Enregistrer mon dossier/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(
        "/cerao/inscription/success?matricule=2026-DrCERAO-0012&nom=Kouassi",
      );
    });
  });
});
