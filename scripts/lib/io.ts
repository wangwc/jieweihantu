import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "./csv";

export const rootDir = process.cwd();

export function dataPath(fileName: string) {
  return path.join(rootDir, "data", fileName);
}

export function readJson<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(dataPath(fileName), "utf8")) as T;
}

export function writeJson(fileName: string, data: unknown) {
  fs.writeFileSync(dataPath(fileName), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readInput(filePath: string): unknown[] {
  const absolute = path.resolve(rootDir, filePath);
  const text = fs.readFileSync(absolute, "utf8");
  if (filePath.endsWith(".json")) return JSON.parse(text) as unknown[];
  if (filePath.endsWith(".csv")) {
    return parseCsv(text);
  }
  throw new Error("仅支持 CSV 或 JSON 输入文件");
}
