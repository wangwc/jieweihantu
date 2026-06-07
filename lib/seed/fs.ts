import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "@/scripts/lib/csv";
import type { SeedPolicy, SeedSourceConfig } from "@/lib/seed/types";

export const rootDir = process.cwd();
export const seedDir = path.join(rootDir, "data-seed");

export function seedPath(...parts: string[]) {
  return path.join(seedDir, ...parts);
}

export function dataPath(...parts: string[]) {
  return path.join(rootDir, "data", ...parts);
}

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readTextIfExists(filePath: string) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

export function readSeedCsv(relativePath: string) {
  const absolute = seedPath(...relativePath.split("/"));
  if (!fs.existsSync(absolute)) return [];
  return parseCsv(fs.readFileSync(absolute, "utf8"));
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function writeJsonFile(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function upsertById<T extends { id: string }>(existing: T[], incoming: T[]) {
  const map = new Map(existing.map((item) => [item.id, item]));
  for (const item of incoming) map.set(item.id, item);
  return Array.from(map.values());
}

function parseScalar(value: string): string | boolean {
  const cleaned = value.trim().replace(/^"|"$/g, "");
  if (cleaned === "true") return true;
  if (cleaned === "false") return false;
  return cleaned;
}

export function parseSeedSourcesYaml(text: string): SeedSourceConfig[] {
  const rows: Record<string, string | boolean>[] = [];
  let current: Record<string, string | boolean> | null = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line === "sources:") continue;
    if (line.startsWith("- ")) {
      if (current) rows.push(current);
      current = {};
      const rest = line.slice(2);
      const index = rest.indexOf(":");
      if (index >= 0) current[rest.slice(0, index).trim()] = parseScalar(rest.slice(index + 1));
      continue;
    }
    if (!current) continue;
    const index = line.indexOf(":");
    if (index >= 0) current[line.slice(0, index).trim()] = parseScalar(line.slice(index + 1));
  }
  if (current) rows.push(current);
  return rows as unknown as SeedSourceConfig[];
}

export function readSeedSources() {
  return parseSeedSourcesYaml(readTextIfExists(seedPath("config", "seed-sources.yaml")));
}

export function readSeedPolicy(): SeedPolicy {
  const text = readTextIfExists(seedPath("config", "seed-policy.yaml"));
  const policy: Record<string, string | boolean> = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index >= 0) policy[line.slice(0, index).trim()] = parseScalar(line.slice(index + 1));
  }
  return {
    defaultReviewStatus: "pending_review",
    defaultControversialLayer: "D/X",
    allowNetworkByDefault: false,
    requireImportBatchId: true,
    requireLicenseNote: true,
    requireCitationOrUrl: true,
    textChunkIsEvidence: false,
    ...policy
  } as SeedPolicy;
}
