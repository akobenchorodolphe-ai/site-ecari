import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  MAX_PHOTO_SIZE_BYTES,
  MAX_SUPPORTING_FILE_SIZE_BYTES,
  MAX_THESE_SIZE_BYTES,
  PHOTO_CONTENT_TYPES,
  PREUVE_CONTENT_TYPES,
  THESE_CONTENT_TYPES,
} from "@/lib/cerao/constants";
import type { SavedUpload } from "@/lib/cerao/types";
import { getStorageDir } from "@/lib/env";

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
  absolutePath: string;
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

function getStorageRoot() {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), getStorageDir());
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

async function bufferFromFile(file: File) {
  return Buffer.from(await file.arrayBuffer());
}

class LocalDiskStorage {
  async saveFile(file: File, options: SaveOptions): Promise<SavedUpload> {
    if (!options.policy.allowedContentTypes.includes(file.type)) {
      throw new Error(
        `Type de fichier non autorisé pour ${file.name}. Formats acceptés : ${options.policy.allowedContentTypes.join(", ")}.`,
      );
    }

    if (file.size > options.policy.maxBytes) {
      throw new Error(`Le fichier ${file.name} dépasse la taille maximale autorisée.`);
    }

    const extension = getExtensionFromFile(file);
    if (!extension) {
      throw new Error(`Impossible de déterminer l'extension du fichier ${file.name}.`);
    }

    const folder = options.folder.replace(/\\/g, "/");
    const filename = `${sanitizeFileStem(options.filenamePrefix)}${extension}`;
    const relativePath = path.posix.join(folder, filename);
    const absolutePath = path.join(getStorageRoot(), ...relativePath.split("/"));

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, await bufferFromFile(file));

    return {
      relativePath,
      contentType: file.type,
      filename,
      size: file.size,
    };
  }

  async removeFolder(folder: string) {
    const absolutePath = path.join(getStorageRoot(), ...folder.split("/"));
    await rm(absolutePath, { force: true, recursive: true });
  }

  async read(relativePath: string): Promise<StoredFile | null> {
    const absolutePath = path.join(getStorageRoot(), ...relativePath.split("/"));

    try {
      const buffer = await readFile(absolutePath);
      const extension = path.extname(relativePath).toLowerCase();

      return {
        absolutePath,
        buffer,
        contentType: CONTENT_TYPE_BY_EXTENSION[extension] ?? "application/octet-stream",
        filename: path.basename(relativePath),
      };
    } catch {
      return null;
    }
  }
}

export const storage = new LocalDiskStorage();

export const PHOTO_UPLOAD_POLICY = {
  allowedContentTypes: PHOTO_CONTENT_TYPES,
  maxBytes: MAX_PHOTO_SIZE_BYTES,
} satisfies UploadPolicy;

export const PREUVE_UPLOAD_POLICY = {
  allowedContentTypes: PREUVE_CONTENT_TYPES,
  maxBytes: MAX_SUPPORTING_FILE_SIZE_BYTES,
} satisfies UploadPolicy;

export const THESE_UPLOAD_POLICY = {
  allowedContentTypes: THESE_CONTENT_TYPES,
  maxBytes: MAX_THESE_SIZE_BYTES,
} satisfies UploadPolicy;
