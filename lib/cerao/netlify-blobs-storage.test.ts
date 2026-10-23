import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getStore: vi.fn(),
  getWithMetadata: vi.fn(),
  set: vi.fn(),
}));

vi.mock("@netlify/blobs", () => ({
  getStore: mocks.getStore,
}));

import { NetlifyBlobsStorage } from "@/lib/cerao/netlify-blobs-storage";

describe("NetlifyBlobsStorage", () => {
  it("enregistre le fichier avec ses metadonnees", async () => {
    mocks.getStore.mockReturnValue({ set: mocks.set });
    mocks.set.mockResolvedValue({ modified: true });
    const storage = new NetlifyBlobsStorage();
    const file = new File(["contenu"], "preuve.pdf", {
      type: "application/pdf",
    });

    const saved = await storage.saveFile(file, {
      folder: "cerao/submissions/2026/dossier",
      filenamePrefix: "diplome-1-preuve",
      policy: {
        allowedContentTypes: ["application/pdf"],
        maxBytes: 1024,
      },
    });

    expect(saved.relativePath).toBe(
      "cerao/submissions/2026/dossier/diplome-1-preuve.pdf",
    );
    expect(mocks.set).toHaveBeenCalledWith(
      saved.relativePath,
      expect.any(ArrayBuffer),
      {
        metadata: {
          contentType: "application/pdf",
          filename: "diplome-1-preuve.pdf",
        },
      },
    );
  });

  it("lit le binaire et ses metadonnees", async () => {
    mocks.getStore.mockReturnValue({ getWithMetadata: mocks.getWithMetadata });
    mocks.getWithMetadata.mockResolvedValue({
      data: new TextEncoder().encode("document").buffer,
      metadata: {
        contentType: "application/pdf",
        filename: "diplome.pdf",
      },
    });
    const storage = new NetlifyBlobsStorage();

    const file = await storage.read("cerao/submissions/diplome.pdf");

    expect(file?.contentType).toBe("application/pdf");
    expect(file?.filename).toBe("diplome.pdf");
    expect(file?.buffer.toString()).toBe("document");
  });
});
