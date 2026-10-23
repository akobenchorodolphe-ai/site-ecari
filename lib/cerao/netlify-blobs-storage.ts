import { getStore } from "@netlify/blobs";
import path from "node:path";

import type { SavedUpload } from "@/lib/cerao/types";

type UploadPolicy = {
  allowedContentTypes: readonly string[];
  maxBytes: number;
};

type SaveOptions = {
  folder: string;
  filenamePrefix: string;
  policy: UploadPolicy;
};

type StoredFile = {
  buffer: Buffer;
  contentType: string;
  filename: string;
};

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
};

function sanitizeFileStem(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getExtensionFromFile(file: File) {
  const fromName = path.extname(file.name).toLowerCase();
  if (fromName) {
    return fromName;
  }

  return Object.entries(CONTENT_TYPE_BY_EXTENSION).find(
    ([, value]) => value === file.type,
  )?.[0];
}

function buildUploadPath(file: File, options: SaveOptions) {
  const extension = getExtensionFromFile(file);
  if (!extension) {
    throw new Error(`Impossible de déterminer l'extension du fichier ${file.name}.`);
  }

  const filename = `${sanitizeFileStem(options.filenamePrefix)}${extension}`;
  const folder = options.folder.replace(/\\/g, "/");

  return {
    filename,
    relativePath: path.posix.join(folder, filename),
  };
}

function validateFile(file: File, policy: UploadPolicy) {
  if (!policy.allowedContentTypes.includes(file.type)) {
    throw new Error(
      `Type de fichier non autorisé pour ${file.name}. Formats acceptés : ${policy.allowedContentTypes.join(", ")}.`,
    );
  }

  if (file.size > policy.maxBytes) {
    throw new Error(`Le fichier ${file.name} dépasse la taille maximale autorisée.`);
  }
}

export class NetlifyBlobsStorage {
  private store() {
    return getStore({ name: "cerao-uploads", consistency: "strong" });
  }

  async saveFile(file: File, options: SaveOptions): Promise<SavedUpload> {
    validateFile(file, options.policy);
    const { filename, relativePath } = buildUploadPath(file, options);

    await this.store().set(relativePath, await file.arrayBuffer(), {
      metadata: { contentType: file.type, filename },
    });

    return { relativePath, contentType: file.type, filename, size: file.size };
  }

  async removeFolder(folder: string) {
    const prefix = `${folder.replace(/\\/g, "/").replace(/\/+$/, "")}/`;
    const { blobs } = await this.store().list({ prefix });

    await Promise.all(blobs.map(({ key }) => this.store().delete(key)));
  }

  async read(relativePath: string): Promise<StoredFile | null> {
    const storedFile = await this.store().getWithMetadata(relativePath, {
      type: "arrayBuffer",
      consistency: "strong",
    });

    if (!storedFile) {
      return null;
    }

    const contentType =
      typeof storedFile.metadata.contentType === "string"
        ? storedFile.metadata.contentType
        : CONTENT_TYPE_BY_EXTENSION[path.extname(relativePath).toLowerCase()] ??
          "application/octet-stream";

    return {
      buffer: Buffer.from(storedFile.data),
      contentType,
      filename:
        typeof storedFile.metadata.filename === "string"
          ? storedFile.metadata.filename
          : path.basename(relativePath),
    };
  }
}
