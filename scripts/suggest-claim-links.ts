import fs from "node:fs";
import path from "node:path";
import { claims } from "../lib/data";
import { suggestClaimLinks } from "../lib/import/link-suggester";

const file = process.argv.find((arg) => !arg.startsWith("--") && arg !== process.argv[1]);
if (!file) throw new Error("请提供文本文件路径。");
const text = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
console.log(JSON.stringify(suggestClaimLinks(text, claims), null, 2));
