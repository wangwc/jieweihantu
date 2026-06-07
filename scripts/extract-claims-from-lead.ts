import fs from "node:fs";
import path from "node:path";
import { decomposeAlternativeNarrative } from "../lib/alternative-narrative";

function arg(name: string) {
  return process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=").slice(1).join("=") || "";
}

const file = arg("file");
if (!file) throw new Error("请提供 --file=争议文章/字幕/帖子文本。");
const text = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
const result = decomposeAlternativeNarrative({
  leadId: arg("lead-id") || `lead-candidate-${Date.now()}`,
  sourceUrl: arg("url") || "https://example.org/lead",
  sourceKind: (arg("kind") || "article") as any,
  platform: (arg("platform") || "其他") as any,
  text
});
console.log(JSON.stringify(result.claims, null, 2));
