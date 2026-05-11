const DEFAULT_STORAGE_DIR = "storage";

export function readEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`La variable d'environnement ${name} est requise.`);
  }

  return value;
}

export function getDatabaseUrl() {
  return readEnv("DATABASE_URL");
}

export function getSessionSecret() {
  return readEnv("SESSION_SECRET");
}

export function getAppUrl() {
  return readEnv("APP_URL", "http://localhost:3000");
}

export function getStorageDir() {
  return process.env.STORAGE_DIR ?? DEFAULT_STORAGE_DIR;
}
