import { afterEach, describe, expect, it } from "vitest";

import { getStorageBackend } from "@/lib/env";

const originalStorageBackend = process.env.STORAGE_BACKEND;
const originalNetlify = process.env.NETLIFY;
const originalContext = process.env.CONTEXT;

afterEach(() => {
  if (originalStorageBackend === undefined) {
    delete process.env.STORAGE_BACKEND;
  } else {
    process.env.STORAGE_BACKEND = originalStorageBackend;
  }

  if (originalNetlify === undefined) {
    delete process.env.NETLIFY;
  } else {
    process.env.NETLIFY = originalNetlify;
  }

  if (originalContext === undefined) {
    delete process.env.CONTEXT;
  } else {
    process.env.CONTEXT = originalContext;
  }
});

describe("getStorageBackend", () => {
  it("utilise le disque local hors de Netlify", () => {
    delete process.env.STORAGE_BACKEND;
    delete process.env.NETLIFY;

    expect(getStorageBackend()).toBe("local");
  });

  it("selectionne Netlify Blobs sur Netlify", () => {
    delete process.env.STORAGE_BACKEND;
    process.env.NETLIFY = "true";
    process.env.CONTEXT = "production";

    expect(getStorageBackend()).toBe("netlify-blobs");
  });

  it("conserve le stockage local dans un apercu Netlify", () => {
    delete process.env.STORAGE_BACKEND;
    process.env.NETLIFY = "true";
    process.env.CONTEXT = "deploy-preview";

    expect(getStorageBackend()).toBe("local");
  });

  it("refuse un backend inconnu", () => {
    process.env.STORAGE_BACKEND = "invalide";

    expect(() => getStorageBackend()).toThrow("STORAGE_BACKEND");
  });
});
